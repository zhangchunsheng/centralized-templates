<script setup>
import { useTemplateStore } from '@/stores/templates.js'
import SearchBox from '@/components/SearchBox.vue'
import FilterBar from '@/components/FilterBar.vue'
import TemplateGrid from '@/components/TemplateGrid.vue'

const store = useTemplateStore()
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="bg-white py-12">
      <div class="container mx-auto px-4 text-center">
        <h1 class="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
          DataEase 模板市场
        </h1>
        <p class="mx-auto max-w-2xl text-base text-gray-500">
          汇集 {{ store.total }} 个免费数据大屏、仪表板与应用模板，一键下载，快速构建数据可视化。
        </p>
      </div>
    </section>

    <section class="container mx-auto px-4 py-8">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex-1">
          <SearchBox />
        </div>
        <div class="text-sm text-gray-500">
          共 {{ store.filteredTotal }} 个模板
        </div>
      </div>

      <FilterBar class="mb-6" />

      <TemplateGrid />
    </section>
  </div>
</template>
