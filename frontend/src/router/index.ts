import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Products from '../pages/Products.vue'
import Sales from '../pages/Sales.vue'
import Transactions from '@/pages/Transactions.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/products', name: 'Products', component: Products },
  { path: '/sales', component: Sales },
  { path: '/transactions', component: Transactions },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: () => import('../pages/AddProduct.vue'),
  },
  {
  path: "/dashboard",
  name: "Dashboard",
  component: Dashboard,
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

