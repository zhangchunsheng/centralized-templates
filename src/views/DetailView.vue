<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplateStore } from '@/stores/templates.js'
import { getLabelName, getTypeName, getClassificationName } from '@/constants/labels.js'
import NotFoundView from './NotFoundView.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const store = useTemplateStore()
const template = computed(() => store.getTemplateById(props.id))

const labelName = computed(() => getLabelName(template.value?.label))
const typeName = computed(() => getTypeName(template.value?.type))
const classificationName = computed(() => getClassificationName(template.value?.classification))

function goBack() {
  router.push('/')
}
</script>

<template>
  <div v-if="template" class="container mx-auto px-4 py-8">
    <button
      class="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-primary-600"
      @click="goBack"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      返回首页
    </button>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Screenshots -->
      <div class="space-y-4">
        <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <img
            v-if="template.screenshots.length > 0"
            :src="template.screenshots[0]"
            :alt="template.name"
            class="w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="flex aspect-[16/10] w-full items-center justify-center bg-gray-100 text-gray-400">
            <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div v-if="template.screenshots.length > 1" class="grid grid-cols-4 gap-3">
          <div
            v-for="(shot, idx) in template.screenshots.slice(1)"
            :key="idx"
            class="overflow-hidden rounded-lg border border-gray-100"
          >
            <img
              :src="shot"
              :alt="`${template.name} 截图 ${idx + 2}`"
              class="aspect-video w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <span class="rounded bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700">{{ typeName }}</span>
          <span class="rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{{ classificationName }}</span>
          <span class="rounded bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{{ labelName }}</span>
        </div>

        <h1 class="mb-4 text-2xl font-bold text-gray-900">{{ template.name }}</h1>

        <p class="mb-6 whitespace-pre-line text-sm leading-relaxed text-gray-600">
          {{ template.description || '暂无描述' }}
        </p>

        <div class="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div class="rounded-lg bg-gray-50 p-3">
            <span class="mb-1 block text-gray-400">作者</span>
            <span class="font-medium text-gray-700">{{ template.owner || '管理员' }}</span>
          </div>
          <div class="rounded-lg bg-gray-50 p-3">
            <span class="mb-1 block text-gray-400">发布时间</span>
            <span class="font-medium text-gray-700">{{ new Date(template.original.publishTimestamp).toLocaleDateString('zh-CN') }}</span>
          </div>
          <div class="rounded-lg bg-gray-50 p-3">
            <span class="mb-1 block text-gray-400">价格</span>
            <span class="font-medium text-green-600">免费</span>
          </div>
          <div class="rounded-lg bg-gray-50 p-3">
            <span class="mb-1 block text-gray-400">下载次数</span>
            <span class="font-medium text-gray-700">{{ template.original.downloadCount || 0 }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-900">模板文件</h3>
          <div v-if="template.downloads.length > 0" class="space-y-2">
            <div
              v-for="(file, idx) in template.downloads"
              :key="idx"
              class="flex items-center justify-between rounded-lg border border-gray-100 p-3"
            >
              <span class="mr-4 flex-1 truncate text-sm text-gray-700">{{ file.name }}</span>
              <a
                :href="file.url"
                download
                class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                下载
              </a>
            </div>
          </div>
          <div v-else class="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            暂无下载文件
          </div>
        </div>
      </div>
    </div>
  </div>

  <NotFoundView v-else />
</template>
