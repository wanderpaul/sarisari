<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        Daily Transactions
      </h1>
      <button
        @click="startTransaction"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        + Start New Transaction
      </button>
    </div>

    <!-- Show active transaction -->
    <div v-if="transactionStarted">
      <h2 class="text-lg font-semibold mb-4">
        Transaction Date: {{ currentDate }}
      </h2>

      <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden mb-6">
        <thead class="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200">
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
            <td class="py-2 px-4 font-bold text-gray-900">
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

      <button
        @click="saveTransaction"
        class="px-6 py-2 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-lg shadow hover:opacity-90"
      >
        💾 Save Transaction
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { onBeforeRouteLeave } from "vue-router";

const products = ref<any[]>([]);
const transactionStarted = ref(false);
const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

const transaction = ref<any>(null);

const fetchTodayTransaction = async () => {
  try {
    const { data } = await axios.get(`${process.env.BASE_URL}/transactions/today`);
    if (data) {
      transaction.value = data;
      transactionStarted.value = true;

      // rebuild product list from saved items
      products.value = data.items.map((item: any) => ({
        id: item.product_id,
        name: item.name,
        price: item.price,
        original_price: item.original_price,
        quantity: item.quantity,
        sold: item.sold,
      }));
    } else {
      transactionStarted.value = false;
      products.value = [];
    }
  } catch (err) {
    console.error("❌ Failed to fetch today’s transaction:", err);
  }
};


onMounted(() => {
  fetchTodayTransaction();
});

onBeforeRouteLeave((to, from, next) => {
  if (transactionStarted.value) {
    saveTransaction().finally(() => next());
  } else {
    next();
  }
});


// Start a new transaction
const startTransaction = async () => {
  const res = await axios.get(`${process.env.BASE_URL}/products`);
  products.value = res.data.map((p: any) => ({
    ...p,
    sold: 0, // reset sold count for transaction
  }));
  transactionStarted.value = true;
};

// Sell product
const sellProduct = (id: number) => {
  const product = products.value.find((p) => p.id === id);
  if (product) {
    product.sold++;
    product.quantity--;
  }
};

// Revert sale
const revertProduct = (id: number) => {
  const product = products.value.find((p) => p.id === id);
  if (product && product.sold > 0) {
    product.sold--;
    product.quantity++;
  }
};

// Totals
const grandTotal = computed(() =>
  products.value.reduce((sum, p) => sum + p.price * p.sold, 0)
);

const totalProfit = computed(() =>
  products.value.reduce(
    (sum, p) => sum + (p.price - p.original_price) * p.sold,
    0
  )
);

const saveTransaction = async () => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    await axios.post(`${process.env.BASE_URL}/transactions`, {
      date: today,
      grand_total: grandTotal.value,
      total_profit: totalProfit.value,
      products: products.value,
    });
    await fetchTodayTransaction(); // refresh with persisted data
  } catch (err) {
    console.error("❌ Failed to save transaction:", err);
  }
};
</script>
