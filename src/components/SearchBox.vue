<script setup>
import { useTemplateStore } from '@/stores/templates.js'

const store = useTemplateStore()
</script>

<template>
  <div class="relative">
    <input
      v-model="store.searchQuery"
      type="text"
      placeholder="搜索模板名称、标签、描述..."
      class="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
    />
    <svg
      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
</template>
