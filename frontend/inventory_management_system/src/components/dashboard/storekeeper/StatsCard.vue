<template>
  <div class="bg-white p-4 rounded-lg shadow-sm lg:p-6">
    <div class="flex items-start justify-between mb-4">
      <span class="text-gray-900">{{ title }}</span>
      <span 
        :class="[
          'text-sm',
          trend > 0 ? 'text-green-500' : 'text-red-500'
        ]"
      >
        {{ trend > 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}%
      </span>
    </div>
    <div class="text-2xl font-semibold">
      {{ formatValue(value) }}
    </div>
    <div class="text-sm" :class="subtitleClass">{{ subtitle }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  trend: {
    type: Number,
    default: 0
  },
  subtitle: {
    type: String,
    required: true
  },
  format: {
    type: String,
    default: 'number' // 'number', 'currency', 'percent'
  },
  subtitleClass: {
    type: String,
    default: 'text-gray-500'
  }
});

const formatValue = (value) => {
  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    case 'percent':
      return `${value}%`;
    default:
      return 
  }
};
</script>