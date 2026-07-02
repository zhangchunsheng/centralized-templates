import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import rawData from '@/data/templates.json'
import { getLabelName } from '@/constants/labels.js'

export const useTemplateStore = defineStore('templates', () => {
  const items = ref(rawData.items || [])

  const searchQuery = ref('')
  const filterType = ref('')
  const filterClassification = ref('')
  const filterLabel = ref('')

  const filteredItems = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    return items.value.filter((item) => {
      if (filterType.value && item.type !== filterType.value) return false
      if (filterClassification.value && item.classification !== filterClassification.value) return false
      if (filterLabel.value && item.label !== filterLabel.value) return false

      if (!query) return true

      const labelName = getLabelName(item.label).toLowerCase()
      const searchText = `${item.name} ${item.description} ${labelName} ${item.type} ${item.classification}`.toLowerCase()
      return searchText.includes(query)
    })
  })

  const total = computed(() => items.value.length)
  const filteredTotal = computed(() => filteredItems.value.length)

  function getTemplateById(id) {
    return items.value.find((item) => item.id === id)
  }

  function clearFilters() {
    searchQuery.value = ''
    filterType.value = ''
    filterClassification.value = ''
    filterLabel.value = ''
  }

  return {
    items,
    searchQuery,
    filterType,
    filterClassification,
    filterLabel,
    filteredItems,
    total,
    filteredTotal,
    getTemplateById,
    clearFilters,
  }
})
