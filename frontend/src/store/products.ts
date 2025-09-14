import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as { id: number, name: string, price: number, quantity: number }[]
  }),
  actions: {
    async fetchProducts() {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`)
      this.products = res.data
    },
    async addProduct(product: { name: string, price: number, quantity: number }) {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/products`, product)
      this.products.push(res.data)
    }
  }
})

