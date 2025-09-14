<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold text-gray-700 text-center mb-6">
        Add New Product
      </h1>
      <form @submit.prevent="addProduct" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-gray-600 mb-1">Product Name</label>
          <input
            v-model="product.name"
            type="text"
            placeholder="e.g. Coke"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
        </div>

        <!-- Price -->
        <div>
          <label class="block text-gray-600 mb-1">Price (₱)</label>
          <input
            v-model.number="product.price"
            type="number"
            min="0"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 focus:outline-none"
          />
        </div>

        <!-- Quantity -->
        <div>
          <label class="block text-gray-600 mb-1">Quantity</label>
          <input
            v-model.number="product.quantity"
            type="number"
            min="0"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full py-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";

const product = ref({
  name: "",
  price: 0,
  quantity: 0,
});

const addProduct = async () => {
  try {
    await axios.post("http://localhost:5000/products", product.value);
    alert("✅ Product added successfully!");
    product.value = { name: "", price: 0, quantity: 0 }; // reset form
  } catch (error) {
    console.error(error);
    alert("❌ Failed to add product.");
  }
};
</script>

