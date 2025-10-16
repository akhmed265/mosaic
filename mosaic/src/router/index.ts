import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/learning-map', 
    name: 'LearningMap',
    component: () => import('@/views/LearningMapView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router