<script setup>
import { getLabelName, getTypeName, getClassificationName } from '@/constants/labels.js'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  kind: {
    type: String,
    default: 'label',
  },
})

const displayText = props.kind === 'label'
  ? getLabelName(props.value)
  : props.kind === 'type'
    ? getTypeName(props.value)
    : getClassificationName(props.value)
</script>

<template>
  <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
    {{ displayText }}
  </span>
</template>
