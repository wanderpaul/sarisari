<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">📊 Dashboard</h1>

    <!-- Other dashboard widgets/charts can go here -->

    <!-- Daily Sales Report Component -->
    <DailyReport />
  </div>
</template>

<script setup lang="ts">
import DailyReport from "@/components/DailyReport.vue";
</script>
