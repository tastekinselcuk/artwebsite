import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabaseClient'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const router = useRouter()

  // 1. Giriş Yap (Login)
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (err) throw err

      user.value = data.user
      session.value = data.session
      return true
    } catch (e) {
      console.error('Login Error:', e.message)
      error.value = 'Giriş başarısız. E-posta veya şifre hatalı.'
      return false
    } finally {
      loading.value = false
    }
  }

  // 2. Çıkış Yap (Logout)
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      user.value = null
      session.value = null
      router.push('/admin/login') // Çıkış yapınca login'e at
    } catch (e) {
      console.error('Logout Error:', e)
    }
  }

  // 3. Oturum Kontrolü (İSMİ DÜZELTİLDİ: checkAuth)
  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      session.value = data.session
      user.value = data.session.user
      return true
    }
    return false
  }

  return {
    user,
    session,
    loading,
    error,
    login,
    logout,
    checkAuth
  }
})
