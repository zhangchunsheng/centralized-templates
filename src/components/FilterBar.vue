<script setup>
import { useTemplateStore } from '@/stores/templates.js'
import { getAllTypes, getAllClassifications, getAllLabels } from '@/constants/labels.js'

const store = useTemplateStore()
const types = getAllTypes()
const classifications = getAllClassifications()
const labels = getAllLabels()
</script>

<template>
  <div class="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center">
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium text-gray-500">类型</label>
      <select
        v-model="store.filterType"
        class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
      >
        <option value="">全部</option>
        <option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option>
      </select>
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium text-gray-500">分类</label>
      <select
        v-model="store.filterClassification"
        class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
      >
        <option value="">全部</option>
        <option v-for="c in classifications" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
    </div>

    <div class="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
      <label class="text-sm font-medium text-gray-500">行业</label>
      <select
        v-model="store.filterLabel"
        class="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
      >
        <option value="">全部行业</option>
        <option v-for="l in labels" :key="l.value" :value="l.value">{{ l.label }}</option>
      </select>
    </div>

    <button
      v-if="store.filterType || store.filterClassification || store.filterLabel"
      class="rounded-lg px-3 py-2 text-sm text-primary-600 hover:bg-primary-50"
      @click="store.clearFilters"
    >
      清除筛选
    </button>
  </div>
</template>
