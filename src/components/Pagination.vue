<script setup>
import { computed } from 'vue'
import { useTemplateStore } from '@/stores/templates.js'

const store = useTemplateStore()
const pageSizeOptions = [12, 24, 48]

const pages = computed(() => {
  const total = store.totalPages
  const current = store.currentPage
  const delta = 2
  const range = []

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }

  if (range[0] > 1) {
    if (range[0] > 2) range.unshift('...')
    range.unshift(1)
  }

  if (range[range.length - 1] < total) {
    if (range[range.length - 1] < total - 1) range.push('...')
    range.push(total)
  }

  return range
})

function goToPage(page) {
  if (typeof page === 'number') {
    store.setPage(page)
  }
}
</script>

<template>
  <div v-if="store.totalPages > 1" class="flex flex-col items-center justify-between gap-4 rounded-xl bg-white px-4 py-4 shadow-sm sm:flex-row">
    <div class="flex items-center gap-2">
      <button
        :disabled="store.currentPage <= 1"
        class="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        @click="store.setPage(store.currentPage - 1)"
      >
        上一页
      </button>

      <div class="flex items-center gap-1">
        <button
          v-for="page in pages"
          :key="page"
          :disabled="page === '...'"
          :class="[
            'min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            page === store.currentPage
              ? 'bg-primary-600 text-white'
              : 'border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-default disabled:border-transparent disabled:hover:bg-transparent',
          ]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        :disabled="store.currentPage >= store.totalPages"
        class="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        @click="store.setPage(store.currentPage + 1)"
      >
        下一页
      </button>
    </div>

    <div class="flex items-center gap-3 text-sm text-gray-500">
      <span>每页</span>
      <select
        v-model="store.pageSize"
        class="rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm text-gray-700 outline-none focus:border-primary-300"
        @change="store.setPageSize(store.pageSize)"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
      </select>
      <span>共 {{ store.totalPages }} 页，{{ store.filteredTotal }} 条</span>
    </div>
  </div>
</template>
