import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Products from '../pages/Products.vue'
import Sales from '../pages/Sales.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/products', name: 'Products', component: Products },
  { path: '/sales', component: Sales },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: () => import('../pages/AddProduct.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

