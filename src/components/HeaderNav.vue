<script setup>
import { ref } from 'vue'
import { useTemplateStore } from '@/stores/templates.js'

const store = useTemplateStore()
const searchInput = ref(null)

function focusSearch() {
  searchInput.value?.focus()
}

defineExpose({ focusSearch })
</script>

<template>
  <header class="sticky top-0 z-50 h-14 bg-white shadow-sm">
    <div class="container mx-auto flex h-full items-center justify-between px-4">
      <div class="flex h-full items-center gap-6">
        <RouterLink to="/" class="inline-flex h-full items-center">
          <img
            src="/uploads/烙馍智擎-模板市场.png"
            alt="烙馍智擎模板市场"
            class="h-10 w-auto"
          />
        </RouterLink>
      </div>

      <div class="flex items-center gap-4">
        <div class="hidden items-center gap-4 sm:flex">
          <a
            href="https://dataease.cn/"
            target="_blank"
            rel="noopener"
            class="text-sm text-gray-600 transition-colors hover:text-primary-600"
          >
            官网
          </a>
          <a
            href="https://dataease.cn/docs/v2/user_manual/template_market/"
            target="_blank"
            rel="noopener"
            class="text-sm text-gray-600 transition-colors hover:text-primary-600"
          >
            帮助文档
          </a>
        </div>

        <div class="relative hidden sm:block">
          <input
            ref="searchInput"
            v-model="store.searchQuery"
            type="text"
            placeholder="搜索模板..."
            class="h-9 w-48 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-primary-300 focus:bg-white focus:ring-2 focus:ring-primary-100 lg:w-64"
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

        <button
          class="text-gray-600 transition-colors hover:text-primary-600 sm:hidden"
          @click="focusSearch"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
