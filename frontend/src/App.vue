<template>
  <div>
    <nav>
      <router-link to="/products">Products</router-link> |
      <router-link to="/sales">Sales</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style>
nav {
  padding: 1rem;
  background: #f4f4f4;
}
nav a {
  margin: 0 10px;
}
</style>

