<template>
  <div>
    <!-- Navbar -->
    <nav class="flex items-center justify-between bg-purple-600 px-4 py-3 text-white">
      <div class="text-lg font-bold">🍭 Sari-Sari Store</div>

      <!-- Hamburger button (mobile) -->
      <button
        class="md:hidden focus:outline-none"
        @click="menuOpen = !menuOpen"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!menuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-4">
        <router-link to="/dashboard" class="nav-link">📊 Dashboard</router-link>
        <router-link to="/products" class="nav-link">📦 Products</router-link>
        <router-link to="/sales" class="nav-link">💰 Sales</router-link>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div
      v-if="menuOpen"
      class="md:hidden bg-purple-500 text-white px-4 py-3 space-y-2"
    >
      <router-link to="/dashboard" class="block nav-link">📊 Dashboard</router-link>
      <router-link to="/products" class="block nav-link">📦 Products</router-link>
      <router-link to="/sales" class="block nav-link">💰 Sales</router-link>
    </div>

    <!-- Page Content -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const menuOpen = ref(false);
</script>

<style>
.nav-link {
  @apply px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition;
}
</style>
