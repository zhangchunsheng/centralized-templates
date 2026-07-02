#!/usr/bin/env node
/**
 * 抓取 DataEase 模板市场数据
 * 1. 从 Halo 应用商店 API 获取全部模板元数据
 * 2. 下载截图、Logo、模板文件到 public/uploads/ 与 public/templates/
 * 3. 生成本地化索引 src/data/templates.json
 */
import { writeFile, mkdir, access } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { dirname, extname, basename, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT = resolve(__dirname, '..')
const API_URL = 'https://templates.dataease.cn/apis/api.store.halo.run/v1alpha1/applications?page=0&size=500'
const BASE_URL = 'https://templates.dataease.cn'

const PUBLIC_UPLOADS = join(ROOT, 'public', 'uploads')
const PUBLIC_TEMPLATES = join(ROOT, 'public', 'templates')
const DATA_DIR = join(ROOT, 'src', 'data')
const FAILED_LOG = join(__dirname, 'failed.log')

const CONCURRENCY = 10
const RETRIES = 3

function log(...args) {
  console.log(`[${new Date().toISOString()}]`, ...args)
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true })
}

async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.{2,}/g, '.')
    .slice(0, 200)
}

function getFilenameFromUrl(url) {
  try {
    const decoded = decodeURIComponent(url)
    const base = basename(decoded)
    return base || 'unnamed'
  } catch {
    return basename(url) || 'unnamed'
  }
}

function normalizeUrl(url) {
  // 处理 API 中文件名末尾带空格再跟扩展名的情况，例如 "...-APP .DET2APP"
  try {
    const decoded = decodeURIComponent(url)
    const dir = dirname(decoded)
    let file = basename(decoded)
    // 去掉扩展名前后的空白字符
    const ext = extname(file)
    const name = basename(file, ext)
    file = `${name.trim()}${ext.trim()}`
    const normalized = dir === '/' || dir === '.' ? `/${file}` : `${dir}/${file}`
    return encodeURI(normalized)
  } catch {
    return url
  }
}

async function downloadFile(url, destPath, retry = 0) {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`
  try {
    const res = await fetch(fullUrl)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    await ensureDir(dirname(destPath))
    const fileStream = createWriteStream(destPath)
    await pipeline(res.body, fileStream)
    return { ok: true }
  } catch (err) {
    if (retry < RETRIES) {
      await new Promise(r => setTimeout(r, 500 * (retry + 1)))
      return downloadFile(url, destPath, retry + 1)
    }
    return { ok: false, error: err.message, url }
  }
}

async function runWithConcurrency(items, fn, limit) {
  const results = []
  let index = 0

  async function worker() {
    while (index < items.length) {
      const i = index++
      results[i] = await fn(items[i], i)
    }
  }

  const workers = Array(Math.min(limit, items.length)).fill(null).map(worker)
  await Promise.all(workers)
  return results
}

async function main() {
  log('Fetching template metadata...')
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch API: ${res.status}`)
  }
  const { items } = await res.json()
  log(`Fetched ${items.length} templates`)

  await ensureDir(PUBLIC_UPLOADS)
  await ensureDir(PUBLIC_TEMPLATES)
  await ensureDir(DATA_DIR)

  const usedPaths = new Set()
  const downloads = []
  const seenNames = new Map()

  function allocateLocalPath(url, folder) {
    const rawName = getFilenameFromUrl(url)
    const ext = extname(rawName)
    const nameWithoutExt = basename(rawName, ext) || 'file'
    const sanitizedBase = sanitizeFilename(nameWithoutExt)
    const sanitizedExt = sanitizeFilename(ext) || ''

    // 生成唯一文件名：同名时追加递增序号
    let finalName = `${sanitizedBase}${sanitizedExt}`
    let counter = 1
    while (seenNames.has(finalName)) {
      finalName = `${sanitizedBase}_${counter}${sanitizedExt}`
      counter++
    }
    seenNames.set(finalName, true)

    const localPath = join(folder === 'templates' ? PUBLIC_TEMPLATES : PUBLIC_UPLOADS, finalName)
    const publicPath = `/${folder}/${finalName}`
    return { localPath, publicPath }
  }

  // 收集所有需要下载的资源
  const brandAssets = [
    { url: normalizeUrl('/upload/DataEase-模板市场.png'), type: 'uploads' },
    { url: normalizeUrl('/upload/dataease.svg'), type: 'uploads' },
  ]

  for (const asset of brandAssets) {
    const { localPath, publicPath } = allocateLocalPath(asset.url, asset.type)
    downloads.push({
      remoteUrl: asset.url,
      localPath,
      publicPath,
      type: 'brand',
    })
  }

  const localizedItems = []

  for (const item of items) {
    const app = item.application
    const spec = app.spec
    const meta = app.metadata

    const id = meta.name
    const name = spec.displayName || '未命名模板'
    const type = spec.templateType || ''
    const classification = spec.templateClassification || ''
    const label = spec.label || ''
    const description = spec.description || ''
    const owner = item.owner?.displayName || spec.ownerName || ''
    const releaseName = item.latestRelease?.metadata?.name || spec.latestRelease || ''

    // Logo
    let logo = ''
    if (spec.logo) {
      const logoUrl = normalizeUrl(spec.logo)
      const { localPath, publicPath } = allocateLocalPath(logoUrl, 'uploads')
      downloads.push({ remoteUrl: logoUrl, localPath, publicPath, type: 'logo', templateId: id })
      logo = publicPath
    }

    // Screenshots
    const screenshots = []
    if (Array.isArray(spec.screenshots)) {
      for (const shot of spec.screenshots) {
        if (!shot.url) continue
        const shotUrl = normalizeUrl(shot.url)
        const { localPath, publicPath } = allocateLocalPath(shotUrl, 'uploads')
        downloads.push({ remoteUrl: shotUrl, localPath, publicPath, type: 'screenshot', templateId: id })
        screenshots.push(publicPath)
      }
    }

    // Downloads
    const downloadLinks = []
    if (Array.isArray(spec.links)) {
      for (const link of spec.links) {
        if (!link.url) continue
        const linkUrl = normalizeUrl(link.url)
        const { localPath, publicPath } = allocateLocalPath(linkUrl, 'templates')
        downloads.push({ remoteUrl: linkUrl, localPath, publicPath, type: 'template', templateId: id, linkName: link.name })
        downloadLinks.push({
          name: link.name || '下载模板',
          url: publicPath,
          originalUrl: linkUrl,
        })
      }
    }

    localizedItems.push({
      id,
      name,
      type,
      classification,
      label,
      description,
      owner,
      releaseName,
      logo,
      screenshots,
      downloads: downloadLinks,
      original: {
        priceConfig: spec.priceConfig,
        publishTimestamp: app.status?.publishTimestamp,
        downloadCount: app.status?.downloadCount || 0,
      },
    })
  }

  log(`Prepared ${downloads.length} assets to download`)

  // 去重下载任务（同一个 remoteUrl 可能出现在多个模板中）
  const uniqueDownloads = []
  const urlToTask = new Map()
  for (const task of downloads) {
    if (!urlToTask.has(task.remoteUrl)) {
      urlToTask.set(task.remoteUrl, task)
      uniqueDownloads.push(task)
    }
  }
  log(`Unique assets: ${uniqueDownloads.length}`)

  let completed = 0
  let failed = []

  await runWithConcurrency(uniqueDownloads, async (task, i) => {
    if (await fileExists(task.localPath)) {
      completed++
      if (i % 50 === 0) log(`Progress: ${completed}/${uniqueDownloads.length}`)
      return { ok: true, skipped: true, task }
    }
    const result = await downloadFile(task.remoteUrl, task.localPath)
    if (result.ok) {
      completed++
    } else {
      failed.push(result)
    }
    if (i % 50 === 0 || !result.ok) {
      log(`Progress: ${completed}/${uniqueDownloads.length}${result.ok ? '' : ` (failed: ${result.url})`}`)
    }
    return result
  }, CONCURRENCY)

  // 重试失败项一次
  if (failed.length > 0) {
    log(`Retrying ${failed.length} failed downloads...`)
    const retryTasks = failed.map(f => urlToTask.get(f.url)).filter(Boolean)
    const retryResults = await runWithConcurrency(retryTasks, async (task) => {
      const result = await downloadFile(task.remoteUrl, task.localPath)
      return { ...result, task }
    }, CONCURRENCY)
    const stillFailed = retryResults.filter(r => !r.ok)
    const recovered = failed.length - stillFailed.length
    failed = stillFailed.map(r => ({ url: r.task.remoteUrl, error: r.error }))
    log(`Recovered ${recovered} downloads, ${failed.length} still failed`)
  }

  // 写失败日志
  if (failed.length > 0) {
    await writeFile(FAILED_LOG, failed.map(f => `${f.url}\t${f.error}`).join('\n') + '\n')
    log(`Wrote failed downloads to ${FAILED_LOG}`)
  }

  // 写本地化索引
  const indexData = {
    total: localizedItems.length,
    updatedAt: new Date().toISOString(),
    items: localizedItems,
  }
  await writeFile(join(DATA_DIR, 'templates.json'), JSON.stringify(indexData, null, 2))
  log(`Wrote index to src/data/templates.json`)

  log('Done!')
  if (failed.length > 0) {
    log(`Warning: ${failed.length} assets failed to download. Check ${FAILED_LOG}`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
