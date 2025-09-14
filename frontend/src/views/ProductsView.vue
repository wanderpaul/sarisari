<template>
  <div class="p-4">
    <h1>📦 Products</h1>

    <form @submit.prevent="addProduct" class="mb-4">
      <input v-model="form.name" placeholder="Name" required />
      <input v-model="form.category" placeholder="Category" />
      <input v-model.number="form.price" type="number" placeholder="Price" required />
      <input v-model.number="form.quantity" type="number" placeholder="Quantity" required />
      <button type="submit">Add Product</button>
    </form>

    <ul>
      <li v-for="p in products" :key="p.id">
        {{ p.name }} - {{ p.quantity }} pcs @ ₱{{ p.price }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";

interface Product {
  id?: number;
  name: string;
  category?: string;
  price: number;
  quantity: number;
}

const products = ref<Product[]>([]);
const form = ref<Product>({
  name: "",
  category: "",
  price: 0,
  quantity: 0,
});

const loadProducts = async () => {
  const res = await api.get("/products");
  products.value = res.data;
};

const addProduct = async () => {
  await api.post("/products", form.value);
  form.value = { name: "", category: "", price: 0, quantity: 0 };
  loadProducts();
};

onMounted(loadProducts);
</script>

