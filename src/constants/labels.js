export const LABEL_MAP = {
  AGRICULTURAL_PLANTING: '农业种植',
  CONSUMER_INDUSTRY: '消费行业',
  EDUCATION_INDUSTRY: '教育行业',
  ELECTRONIC_COMMERCE: '电子商务',
  ENERGY_INDUSTRY: '能源行业',
  FINANCIAL_FINANCE: '金融财务',
  HUMAN_RESOURCES_MANAGEMENT: '人力资源',
  MANUFACTURING_INDUSTRY: '制造业',
  MEDIA_INDUSTRY: '传媒行业',
  MEDICAL_INDUSTRY: '医疗行业',
  OPEN_SOURCE_INSIGHTS: '开源洞察',
  PHYSICAL_FITNESS: '体育健身',
  PLATFORM_DOCKING: '平台对接',
  POLITICAL_PARTY_AFFAIRS: '党政事务',
  PROMOTION_INTRODUCTION: '推广介绍',
  REAL_ESTATE_INDUSTRY: '房地产行业',
  TOURISM_INDUSTRY: '旅游行业',
  TRANSPORTATION: '交通运输',
  WHOLESALE_AND_RETAIL: '批发零售',
}

export const TYPE_MAP = {
  APPS: '应用',
  PANEL: '仪表板',
  SCREEN: '数据大屏',
}

export const CLASSIFICATION_MAP = {
  DATA: '数据类',
  STYLE: '样式类',
  '': '其他',
}

export function getLabelName(label) {
  return LABEL_MAP[label] || label || '未分类'
}

export function getTypeName(type) {
  return TYPE_MAP[type] || type || '其他'
}

export function getClassificationName(classification) {
  return CLASSIFICATION_MAP[classification] || classification || '其他'
}

export function getAllLabels() {
  return Object.entries(LABEL_MAP).map(([value, label]) => ({ value, label }))
}

export function getAllTypes() {
  return Object.entries(TYPE_MAP).map(([value, label]) => ({ value, label }))
}

export function getAllClassifications() {
  return Object.entries(CLASSIFICATION_MAP)
    .filter(([value]) => value !== '')
    .map(([value, label]) => ({ value, label }))
}
