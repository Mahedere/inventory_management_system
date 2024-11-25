<template>
  <div class="bg-white rounded-lg shadow-sm p-4 lg:p-6">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
        <p class="text-sm text-gray-500 capitalize">{{ item.category }}</p>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="$emit('edit', item)"
          class="text-gray-400 hover:text-indigo-600"
        >
          <PencilIcon class="w-5 h-5" />
        </button>
        <button 
          @click="$emit('delete', item._id)"
          class="text-gray-400 hover:text-red-600"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <p class="text-sm text-gray-600 mb-4">{{ item.description }}</p>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p class="text-sm text-gray-500">Stock Level</p>
        <p class="font-medium">{{ item.stock }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-500">Price</p>
        <p class="font-medium">{{ formatPrice(item.price) }}</p>
      </div>
    </div>

    <div class="relative pt-1">
      <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
        <div
          class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
          :class="stockLevelClass"
          :style="{ width: `${stockPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { PencilIcon, TrashIcon } from '@heroicons/vue/outline';

const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (item) => {
      return ['_id', 'name', 'description', 'category', 'stock', 'maxLimit', 'price'].every(
        key => key in item
      );
    }
  }
});

defineEmits(['edit', 'delete']);

const stockPercentage = computed(() => {
  return Math.min((props.item.stock / props.item.maxLimit) * 100, 100);
});

const stockLevelClass = computed(() => {
  const percentage = stockPercentage.value;
  if (percentage < 20) return 'bg-red-500';
  if (percentage < 50) return 'bg-yellow-500';
  return 'bg-green-500';
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};
</script>