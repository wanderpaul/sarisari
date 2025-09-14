<template>
  <div class="flex items-center justify-center min-h-screen bg-pink-50">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-pink-100">
      <h2 class="text-2xl font-bold text-pink-600 text-center mb-6">
        Add New Product
      </h2>

      <form @submit.prevent="addProduct" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-pink-700 mb-1">
            Name
          </label>
          <input
            v-model="product.name"
            type="text"
            required
            class="w-full border border-pink-200 rounded-lg p-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-pink-700 mb-1">
            Price
          </label>
          <input
            v-model.number="product.price"
            type="number"
            step="0.01"
            required
            class="w-full border border-pink-200 rounded-lg p-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-pink-700 mb-1">
            Quantity
          </label>
          <input
            v-model.number="product.quantity"
            type="number"
            required
            class="w-full border border-pink-200 rounded-lg p-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-pink-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-pink-500 transition"
        >
          ➕ Add Product
        </button>
      </form>

      <p v-if="message" class="mt-4 text-green-600 text-center font-medium">
        {{ message }}
      </p>
      <p v-if="error" class="mt-4 text-red-600 text-center font-medium">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const product = ref({
  name: '',
  price: 0,
  quantity: 0,
})

const message = ref('')
const error = ref('')

const addProduct = async () => {
  try {
    message.value = ''
    error.value = ''

    const res = await axios.post('http://localhost:5000/products', product.value)

    message.value = `✅ Added product: ${res.data.name}`
    product.value = { name: '', price: 0, quantity: 0 }
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Something went wrong'
  }
}
</script>

