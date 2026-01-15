<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Sales Overview</h1>

    <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      <thead class="bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200">
        <tr>
          <th class="py-3 px-4 text-left">Product</th>
          <th class="py-3 px-4 text-left">Price (₱)</th>
          <th class="py-3 px-4 text-left">Quantity</th>
          <th class="py-3 px-4 text-left">Sold</th>
          <th class="py-3 px-4 text-left">Total (₱)</th>
          <th class="py-3 px-4 text-left">Profit (₱)</th>
          <th class="py-3 px-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
          class="border-t hover:bg-gray-50"
        >
          <!-- 🔥 Bold + larger font for Product Name -->
          <td class="py-2 px-4 font-bold text-lg text-gray-900">
            {{ product.name }}
          </td>

          <td class="py-2 px-4">₱{{ product.price }}</td>
          <td class="py-2 px-4">{{ product.quantity }}</td>
          <td class="py-2 px-4">{{ product.sold }}</td>
          <td class="py-2 px-4 font-semibold">
            ₱{{ (product.price * product.sold).toFixed(2) }}
          </td>
          <td class="py-2 px-4 font-semibold text-green-700">
            ₱{{
              ((product.price - product.original_price) * product.sold).toFixed(
                2
              )
            }}
          </td>
          <td class="py-2 px-4 text-center space-x-2">
            <button
              @click="sellProduct(product.id)"
              class="px-3 py-1 bg-green-400 hover:bg-green-500 text-white rounded shadow"
            >
              + Sell
            </button>
            <button
              @click="revertProduct(product.id)"
              class="px-3 py-1 bg-red-400 hover:bg-red-500 text-white rounded shadow"
            >
              ↩ Revert
            </button>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr class="bg-gray-100 font-bold">
          <td colspan="4" class="py-3 px-4 text-right">Grand Total:</td>
          <td class="py-3 px-4">₱{{ grandTotal.toFixed(2) }}</td>
          <td class="py-3 px-4 text-green-700">₱{{ totalProfit.toFixed(2) }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const products = ref<any[]>([]);

const fetchProducts = async () => {
  const res = await axios.get(`${process.env.BASE_URL}/products`);
  products.value = res.data;
};

const sellProduct = async (id: number) => {
  try {
    await axios.put(`${process.env.BASE_URL}/products/${id}/sell`, {
      quantity: 1,
    });

    // Find the product details for logging
    const product = products.value.find((p) => p.id === id);
    if (product) {
      await axios.post(`${process.env.BASE_URL}/sales/log`, {
        product_id: product.id,
        quantity: 1,
        price: product.price,
        original_price: product.original_price,
      });
    }

    await fetchProducts();
  } catch (err: any) {
    alert(err.response?.data?.error || "Error selling product");
  }
};

const revertProduct = async (id: number) => {
  try {
    await axios.put(`${process.env.BASE_URL}/products/${id}/revert`, {
      quantity: 1,
    });

    await axios.post(`${process.env.BASE_URL}/sales/revert`, {
      product_id: id,
      quantity: 1, // or however much was sold and reverted
    });
    await fetchProducts();
  } catch (err: any) {
    alert(err.response?.data?.error || "Error reverting sale");
  }
};

const grandTotal = computed(() =>
  products.value.reduce((sum, product) => sum + product.price * product.sold, 0)
);

const totalProfit = computed(() =>
  products.value.reduce(
    (sum, product) =>
      sum + (product.price - product.original_price) * product.sold,
    0
  )
);

onMounted(fetchProducts);
</script>


