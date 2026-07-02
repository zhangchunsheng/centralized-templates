<script setup>
import { getLabelName, getTypeName } from '@/constants/labels.js'

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
})

const firstScreenshot = props.template.screenshots[0] || ''
const labelName = getLabelName(props.template.label)
const typeName = getTypeName(props.template.type)
</script>

<template>
  <div class="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
    <RouterLink :to="`/template/${template.id}`" class="block">
      <div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          v-if="firstScreenshot"
          :src="firstScreenshot"
          :alt="template.name"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
          <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div class="absolute right-2 top-2 rounded-full bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">
          {{ typeName }}
        </div>
      </div>
    </RouterLink>

    <div class="flex flex-1 flex-col p-4">
      <div class="mb-2 flex items-center gap-2">
        <span class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{{ labelName }}</span>
      </div>

      <RouterLink :to="`/template/${template.id}`">
        <h3 class="mb-2 line-clamp-2 text-base font-semibold text-gray-900 hover:text-primary-600">
          {{ template.name }}
        </h3>
      </RouterLink>

      <p class="mb-4 line-clamp-2 flex-1 text-sm text-gray-500">
        {{ template.description || '暂无描述' }}
      </p>

      <div class="flex items-center justify-between gap-2">
        <span class="text-xs text-gray-400">{{ template.downloads.length }} 个文件</span>
        <a
          v-if="template.downloads.length === 1"
          :href="template.downloads[0].url"
          download
          class="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          @click.stop
        >
          下载
        </a>
        <RouterLink
          v-else
          :to="`/template/${template.id}`"
          class="rounded-lg border border-primary-600 px-3 py-1.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
        >
          查看详情
        </RouterLink>
      </div>
    </div>
  </div>
</template>
