import { createRouter, createWebHistory } from 'vue-router'
import PageSectors from '@/pages/PageSectors.vue'
import PageListProducts from '@/pages/PageListProducts.vue'

const routes = [
  {
    path: '/',
    component: PageSectors
  },
  {
    path: '/sectors/:id',
    component: PageListProducts
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router