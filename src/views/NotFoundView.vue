<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
    <h1 class="mb-2 text-6xl font-bold text-gray-200">404</h1>
    <h2 class="mb-4 text-2xl font-semibold text-gray-900">页面未找到</h2>
    <p class="mb-8 text-sm text-gray-500">抱歉，您访问的页面不存在或已被移除。</p>
    <button
      class="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      @click="goHome"
    >
      返回首页
    </button>
  </div>
</template>
