<script setup>
import { useTemplateStore } from '@/stores/templates.js'

const store = useTemplateStore()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-xl bg-white py-16 text-center shadow-sm">
    <svg class="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h3 class="mb-2 text-lg font-medium text-gray-900">未找到相关模板</h3>
    <p class="mb-6 text-sm text-gray-500">尝试调整筛选条件或搜索关键词</p>
    <button
      class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      @click="store.clearFilters"
    >
      清除筛选
    </button>
  </div>
</template>
