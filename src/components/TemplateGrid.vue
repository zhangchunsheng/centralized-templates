<script setup>
import { useTemplateStore } from '@/stores/templates.js'
import TemplateCard from './TemplateCard.vue'
import EmptyState from './EmptyState.vue'

const store = useTemplateStore()
</script>

<template>
  <div v-if="store.paginatedItems.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <TemplateCard
      v-for="template in store.paginatedItems"
      :key="template.id"
      :template="template"
    />
  </div>
  <EmptyState v-else />
</template>
