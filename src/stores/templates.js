import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import rawData from '@/data/templates.json'
import { getLabelName } from '@/constants/labels.js'

export const useTemplateStore = defineStore('templates', () => {
  const items = ref(rawData.items || [])

  const searchQuery = ref('')
  const filterType = ref('')
  const filterClassification = ref('')
  const filterLabel = ref('')

  const currentPage = ref(1)
  const pageSize = ref(24)

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

  const filteredTotal = computed(() => filteredItems.value.length)
  const total = computed(() => items.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(filteredTotal.value / pageSize.value)))

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredItems.value.slice(start, end)
  })

  function getTemplateById(id) {
    return items.value.find((item) => item.id === id)
  }

  function setPage(page) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  }

  function setPageSize(size) {
    pageSize.value = Math.max(1, size)
    currentPage.value = 1
  }

  function clearFilters() {
    searchQuery.value = ''
    filterType.value = ''
    filterClassification.value = ''
    filterLabel.value = ''
    currentPage.value = 1
  }

  // 搜索或筛选条件变化时重置到第一页
  watch([searchQuery, filterType, filterClassification, filterLabel], () => {
    currentPage.value = 1
  })

  return {
    items,
    searchQuery,
    filterType,
    filterClassification,
    filterLabel,
    currentPage,
    pageSize,
    filteredItems,
    paginatedItems,
    total,
    filteredTotal,
    totalPages,
    getTemplateById,
    setPage,
    setPageSize,
    clearFilters,
  }
})
