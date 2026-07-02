# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

使用 Vue 3 + Vite 3 构建的烙馍智擎模板市场。数据来源于上游 [DataEase 模板市场](https://templates.dataease.cn/) 的 Halo 应用商店 API，抓取全部免费模板（元数据、截图、模板文件）后构建一个可搜索、可筛选、支持本地下载的静态站点。

## 常用命令

```bash
# 安装依赖
npm install

# 抓取/刷新模板数据
# 将截图下载到 public/uploads/，模板文件下载到 public/templates/
# 并生成 src/data/templates.json
npm run fetch:data

# 启动 Vite 开发服务器
npm run dev

# 生产构建（输出到 dist/）
npm run build

# 本地预览生产构建
npm run preview
```

## 架构说明

### 数据流

1. `scripts/fetch-templates.mjs` 调用 `https://templates.dataease.cn/apis/api.store.halo.run/v1alpha1/applications?page=0&size=500`。
2. 下载每个模板的截图和模板文件，对文件名做清洗和去重。
3. 写入 `src/data/templates.json`，其中模板索引使用本地路径，如 `/uploads/...` 和 `/templates/...`。
4. Vue 应用通过 Pinia store（`src/stores/templates.js`）直接导入该 JSON 进行渲染，运行时不依赖上游 API。

### 前端结构

- **入口**：`src/main.js` 挂载应用，并注册 Pinia 和 Vue Router。
- **路由**：`src/router/index.js` 定义了 `/`、`/template/:id` 和通配 404 路由。
- **状态**：`src/stores/templates.js` 维护模板列表以及搜索、筛选状态，所有筛选均在浏览器端完成。
- **标签映射**：`src/constants/labels.js` 将上游枚举（`templateType`、`templateClassification`、`label`）映射为中文显示名。
- **样式**：使用 Tailwind CSS，主色通过 `primary-*` 映射到 `blue-600`，全局样式在 `src/assets/styles/main.css`。
- **静态资源**：`public/uploads/`（图片）和 `public/templates/`（`.DET`、`.DET2`、`.DET2APP` 等文件）由抓取脚本生成，已加入 `.gitignore`。

### 构建与部署

- Vite 配置 `base: './'`，因此构建后的 SPA 可以部署在子目录下。
- `dist/` 包含打包后的应用以及 `public/` 目录的内容。
- 由于是单页应用（SPA），托管服务器必须将未知路径回退到 `index.html`（Nginx 示例见 README.md）。

## 注意事项

- 不要将 `public/uploads/` 和 `public/templates/` 提交到 Git，二者已被忽略。新克隆的环境必须先运行 `npm run fetch:data` 才能生成可用资源。
- `src/data/templates.json` 虽然由脚本生成，但应保留在 Git 中，以便无需重新抓取即可构建应用。
- `scripts/failed.log` 会记录上游 404 或不可达的资源（如内网 IP 链接），这是正常现象，通常可忽略。
- 上游模板文件扩展名不统一（`.DET`、`.DET2`、`.DET2APP` 等），抓取脚本会原样保留。
