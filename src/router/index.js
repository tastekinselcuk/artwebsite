import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Sayfa importların (Senin kodundaki gibi)
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Ebru from '../pages/Ebru.vue'
import Photography from '../pages/Photography.vue'
import AdminLogin from '../pages/AdminLogin.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'
import AdminEbru from '../pages/AdminEbru.vue'
import AdminPhotography from '../pages/AdminPhotography.vue'
import AdminSettings from '../pages/AdminSettings.vue'

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
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: AdminSettings,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation Guard (GÜNCELLENDİ)
// "async" kelimesi eklendi çünkü Supabase cevabını bekleyeceğiz
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 1. Eğer store'da kullanıcı bilgisi yoksa (sayfa yenilendiyse),
  // Supabase'den oturum durumunu kontrol et ve bekle (await)
  if (!authStore.user) {
    await authStore.checkAuth()
  }

  // 2. Korumalı sayfaya girmeye çalışıyor ama kullanıcı yoksa -> Login'e at
  if (to.meta.requiresAuth && !authStore.user) {
    next('/admin/login')
  }
  // 3. Zaten giriş yapmışsa ve Login sayfasına gitmeye çalışıyorsa -> Dashboard'a at
  else if (to.path === '/admin/login' && authStore.user) {
    next('/admin/dashboard')
  }
  // 4. Diğer durumlar (Serbest dolaşım)
  else {
    next()
  }
})

export default router
