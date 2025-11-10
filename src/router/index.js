import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Ebru from '../pages/Ebru.vue'
import Photography from '../pages/Photography.vue'
import AdminLogin from '../pages/AdminLogin.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'
import AdminEbru from '../pages/AdminEbru.vue'
import AdminPhotography from '../pages/AdminPhotography.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/ebru',
      name: 'ebru',
      component: Ebru
    },
    {
      path: '/photography',
      name: 'photography',
      component: Photography
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/ebru',
      name: 'admin-ebru',
      component: AdminEbru,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/photography',
      name: 'admin-photography',
      component: AdminPhotography,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.checkAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/admin/login')
  } else if (to.path === '/admin/login' && authStore.isAuthenticated) {
    next('/admin/dashboard')
  } else {
    next()
  }
})

export default router
