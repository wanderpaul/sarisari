<template>
  <div class="flex items-center justify-center min-h-screen bg-pink-50">
    <div class="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 border border-pink-100">
      <h2 class="text-2xl font-bold text-pink-600 text-center mb-6">
        Add New Products
      </h2>

      <form @submit.prevent="addProducts" class="space-y-6">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-pink-100 pb-4 mb-4"
        >
          <div>
            <label class="block text-sm font-medium text-pink-700 mb-1">
              Name (Item {{ index + 1 }})
            </label>
            <input
              v-model="product.name"
              type="text"
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
              class="w-full border border-pink-200 rounded-lg p-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
            />
          </div>
        </div>

        <!-- Add Row Button -->
        <div class="flex justify-between">
          <button
            type="button"
            @click="addRow"
            class="px-4 py-2 bg-blue-400 text-white rounded-lg shadow hover:bg-blue-500 transition"
          >
            ➕ Add Row
          </button>

          <button
            type="submit"
            class="px-6 py-2 bg-pink-400 text-white font-semibold rounded-lg hover:bg-pink-500 transition"
          >
            💾 Save All Products
          </button>
        </div>
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
import { ref } from "vue";
import axios from "axios";

// multiple products instead of one
const products = ref<{ name: string; price: number; quantity: number }[]>([
  { name: "", price: 0, quantity: 0 },
]);

const message = ref("");
const error = ref("");

// add a new empty row
const addRow = () => {
  products.value.push({ name: "", price: 0, quantity: 0 });
};

// save all products
const addProducts = async () => {
  try {
    message.value = "";
    error.value = "";

    // filter only filled products
    const validProducts = products.value.filter(
      (p) => p.name.trim() !== "" && p.price > 0
    );

    if (validProducts.length === 0) {
      error.value = "⚠ Please enter at least one product.";
      return;
    }

    // call bulk insert API
    await axios.post("http://localhost:5000/products/bulk", {
      products: validProducts,
    });

    message.value = `✅ Added ${validProducts.length} products successfully!`;

    // reset form
    products.value = [{ name: "", price: 0, quantity: 0 }];
  } catch (err: any) {
    error.value = err.response?.data?.error || "Something went wrong";
  }
};
</script>
