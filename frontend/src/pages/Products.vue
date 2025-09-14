<template>
  <div class="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-extrabold text-gray-800">Products</h1>
      <button
        @click="showModal = true"
        class="px-4 py-2 bg-gradient-to-r from-pink-300 to-purple-300 text-white rounded-lg shadow hover:opacity-90 transition"
      >
        + Add Item
      </button>
    </div>

    <!-- Product Table -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <table class="min-w-full border border-gray-200 rounded-lg">
        <thead class="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200">
          <tr>
            <th class="py-3 px-4 text-left text-gray-700">Product</th>
            <th class="py-3 px-4 text-left text-gray-700">Price (₱)</th>
            <th class="py-3 px-4 text-left text-gray-700">Quantity</th>
            <th class="py-3 px-4 text-center text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-t hover:bg-pink-50 transition"
          >
            <td class="py-2 px-4">{{ product.name }}</td>
            <td class="py-2 px-4">₱{{ product.price }}</td>
            <td class="py-2 px-4">{{ product.quantity }}</td>
            <td class="py-2 px-4 text-center space-x-2">
              <button
                @click="openUpdateModal(product)"
                class="px-3 py-1 bg-yellow-300 hover:bg-yellow-400 text-gray-800 rounded shadow"
              >
                ✏ Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Item Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-96 p-6 animate-fadeIn">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Add New Product</h2>
        <form @submit.prevent="addProduct">
          <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input
              v-model="newProduct.name"
              type="text"
              class="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Price (₱)</label>
            <input
              v-model.number="newProduct.price"
              type="number"
              step="0.01"
              class="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Quantity</label>
            <input
              v-model.number="newProduct.quantity"
              type="number"
              class="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Original Price</label>
            <input
              v-model="newProduct.original_price"
              type="number"
              step="0.01"
              class="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-gradient-to-r from-pink-300 to-purple-300 text-white rounded-lg shadow hover:opacity-90 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Update Product Modal -->
    <div
      v-if="showUpdateModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96 animate-fadeIn">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Update Product</h2>

        <div class="mb-4">
          <label class="block text-gray-700">Name</label>
          <input v-model="updateForm.name" type="text" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-300" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Price</label>
          <input v-model="updateForm.price" type="number" step="0.01" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-300" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Quantity</label>
          <input v-model="updateForm.quantity" type="number" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-300" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Original Price</label>
          <input v-model="updateForm.original_price" type="number" step="0.01" class="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-300" />
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="showUpdateModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button @click="updateProduct" class="px-4 py-2 bg-gradient-to-r from-purple-300 to-blue-300 text-white rounded shadow hover:opacity-90 transition">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref<any[]>([]);
const showModal = ref(false);

const newProduct = ref({
  name: "",
  price: 0,
  quantity: 0,
  original_price: 0,
});

const fetchProducts = async () => {
  const res = await axios.get("http://localhost:5000/products");
  products.value = res.data;
};

const addProduct = async () => {
  try {
    await axios.post("http://localhost:5000/products", newProduct.value);
    showModal.value = false;
    newProduct.value = { name: "", price: 0, quantity: 0, original_price: 0 };
    fetchProducts();
  } catch (error) {
    console.error(error);
    alert("❌ Failed to add product.");
  }
};

const showUpdateModal = ref(false);
const updateForm = ref({ id: null, name: "", price: 0, quantity: 0, original_price: 0 });

const openUpdateModal = (product) => {
  updateForm.value = { ...product };
  showUpdateModal.value = true;
};

const updateProduct = async () => {
  try {
    await axios.put(`http://localhost:5000/products/${updateForm.value.id}`, updateForm.value);
    await fetchProducts();
    showUpdateModal.value = false;
  } catch (err) {
    console.error("Failed to update product", err);
  }
};

onMounted(fetchProducts);
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
