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
  },
  {
    path: '/skill/:id',
    name: 'Skill',
    component: () => import('@/views/SkillView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    path: '/languages',
    name: 'Languages',
    component: () => import('@/views/LanguagesView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/mosaic/'),
  routes
})

export default routerimport { createRouter, createWebHistory } from 'vue-router'

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
  },
  {
    path: '/skill/:id',
    name: 'Skill',
    component: () => import('@/views/SkillView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    path: '/languages',
    name: 'Languages',
    component: () => import('@/views/LanguagesView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/mosaic/'),
  routes
})

export default router