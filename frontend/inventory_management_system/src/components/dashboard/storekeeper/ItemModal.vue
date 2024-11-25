<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <Dialog.Panel class="relative top-20 mx-auto p-4 lg:p-5 border w-full max-w-sm lg:max-w-md bg-white rounded-md">
              <Dialog.Title class="text-lg font-medium text-gray-900 mb-4">
                {{ item ? 'Edit Item' : 'Add New Item' }}
              </Dialog.Title>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Hidden ID field -->
                <input type="hidden" v-model="form._id">

                <!-- Name Field -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2"
                    :class="{ 'border-red-500': errors.name }"
                  >
                  <span v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</span>
                </div>

                <!-- Description Field -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="mt-1 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Category Field -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      v-model="form.category"
                      required
                      class="mt-1 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2"
                    >
                      <option v-for="category in categories" :key="category" :value="category">
                        {{ formatCategory(category) }}
                      </option>
                    </select>
                  </div>

                  <!-- Stock Field -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      v-model.number="form.stock"
                      type="number"
                      required
                      min="0"
                      class="mt-1 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2"
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Price Field -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      v-model.number="form.price"
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      class="mt-1 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2"
                    >
                  </div>

                  <!-- Max Limit Field -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Max Limit</label>
                    <input
                      v-model.number="form.maxLimit"
                      type="number"
                      required
                      min="0"
                      class="mt-1 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2"
                    >
                  </div>
                </div>

                <!-- Batch Field -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Batch</label>
                  <input
                    v-model.number="form.batch"
                    type="number"
                    required
                    min="0"
                    class="mt-1 block w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2"
                  >
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 mt-3">
                  <button
                    type="button"
                    @click="handleClose"
                    class="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {{ loading ? 'Saving...' : 'Save Item' }}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:isOpen', 'save']);

const categories = ['electronics', 'clothing', 'furniture', 'books', 'other'];
const errors = reactive({});

const form = reactive({
  _id: '',
  name: '',
  description: '',
  category: 'electronics',
  stock: 0,
  price: 0,
  maxLimit: 0,
  batch: 0
});

const formatCategory = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const resetForm = () => {
  Object.assign(form, {
    _id: '',
    name: '',
    description: '',
    category: 'electronics',
    stock: 0,
    price: 0,
    maxLimit: 0,
    batch: 0
  });
  Object.keys(errors).forEach(key => delete errors[key]);
};

const handleClose = () => {
  resetForm();
  emit('update:isOpen', false);
};

const handleSubmit = () => {
  // Basic validation
  if (!form.name.trim()) {
    errors.name = 'Name is required';
    return;
  }

  emit('save', { ...form });
};

// Watch for item changes to populate form
watch(() => props.item, (newItem) => {
  if (newItem) {
    Object.assign(form, newItem);
  } else {
    resetForm();
  }
}, { immediate: true });
</script>