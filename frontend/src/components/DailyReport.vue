<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Daily Sales Report</h2>

    <div class="mb-4">
      <label class="mr-2 font-medium">Pick a date:</label>
      <input
        type="date"
        v-model="date"
        @change="fetchDailyReport"
        class="border rounded px-2 py-1"
      />
    </div>

    <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">
  <thead class="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200">
    <tr>
      <th class="py-2 px-4 text-left">Date</th>
      <th class="py-2 px-4 text-left">Product</th>
      <th class="py-2 px-4 text-left">Sold</th>
      <th class="py-2 px-4 text-left">Total (₱)</th>
      <th class="py-2 px-4 text-left">Profit (₱)</th>
    </tr>
  </thead>
  <tbody v-if="report.length > 0">
  <tr
    v-for="item in report"
    :key="item.product_id"
    class="border-t hover:bg-gray-50"
  >
    <td class="py-2 px-4">{{ new Date(item.date).toLocaleDateString() }}</td>
    <td class="py-2 px-4">{{ item.product_name }}</td>
    <td class="py-2 px-4">{{ item.total_sold }}</td>
    <td class="py-2 px-4">₱{{ parseFloat(item.total_revenue).toFixed(2) }}</td>
    <td class="py-2 px-4 text-green-700">₱{{ parseFloat(item.total_profit).toFixed(2) }}</td>
  </tr>

   <!-- Totals row -->
  <tr v-if="totals" class="font-bold bg-gray-100 border-t">
    <td colspan="3" class="py-2 px-4 text-right">Grand Total:</td>
    <td class="py-2 px-4">₱{{ parseFloat(totals.grand_revenue).toFixed(2) }}</td>
    <td class="py-2 px-4 text-green-700">₱{{ parseFloat(totals.grand_profit).toFixed(2) }}</td>
  </tr>
</tbody>
<tbody v-else>
  <tr>
    <td colspan="5" class="py-4 text-center text-gray-500">
      No sales data for this date 📅
    </td>
  </tr>
</tbody>
</table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const date = ref("");
const report = ref<any[]>([]);
const totals = ref<any | null>(null);

const fetchDailyReport = async () => {
  try {
    const { data } = await axios.get(`${process.env.BASE_URL}/sales/daily-report`, {
      params: { date: date.value },
    });
    report.value = data.rows;
    totals.value = data.totals;
  } catch (err) {
    console.error("❌ Failed to fetch daily report:", err);
    report.value = [];
    totals.value = null;
  }
};

onMounted(() => {
  // default to today’s date
  const today = new Date().toISOString().split("T")[0];
  date.value = today;
  fetchDailyReport();
});
</script>
