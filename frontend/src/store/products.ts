import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as { id: number, name: string, price: number, quantity: number }[]
  }),
  actions: {
    async fetchProducts() {
      const res = await axios.get(`${process.env.BASE_URL}/products`)
      this.products = res.data
    },
    async addProduct(product: { name: string, price: number, quantity: number }) {
      const res = await axios.post(`${process.env.BASE_URL}/products`, product)
      this.products.push(res.data)
    }
  }
})

