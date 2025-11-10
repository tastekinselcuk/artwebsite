import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  // Basit login - gerçek uygulamada backend ile yapılır
  const login = (username, password) => {
    // Demo: admin/admin123
    if (username === 'admin' && password === 'admin123') {
      isAuthenticated.value = true
      user.value = { username: 'admin', role: 'admin' }
      localStorage.setItem('admin_token', 'demo_token')
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('admin_token')
  }

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      isAuthenticated.value = true
      user.value = { username: 'admin', role: 'admin' }
    }
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth
  }
})
