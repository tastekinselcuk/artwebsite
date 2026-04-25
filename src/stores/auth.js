// src/stores/auth.js
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

  // 1. Giriş Yap
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
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

  // 2. Çıkış Yap
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      user.value = null
      session.value = null
      router.push('/admin/login')
    } catch (e) {
      console.error('Logout Error:', e)
    }
  }

  // 3. Oturum Kontrolü
  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      session.value = data.session
      user.value = data.session.user
      return true
    }
    return false
  }

  // YENİ: 4. Şifre Sıfırlama E-postası Gönder
  const sendPasswordResetEmail = async (email) => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        // Kullanıcı linke tıklayınca bu sayfaya dönecek
        // window.location.origin dinamik olarak 'http://localhost:3000' veya canlı site URL'ni alır
        redirectTo: `${window.location.origin}/admin/update-password`,
      })
      if (err) throw err
      return true
    } catch (e) {
      console.error('Reset Password Error:', e.message)
      error.value = 'Şifre sıfırlama linki gönderilemedi. Lütfen adresi kontrol edin.'
      return false
    } finally {
      loading.value = false
    }
  }

  // YENİ: 5. Yeni Şifreyi Belirle (Kullanıcı linke tıklayıp geldikten sonra çalışır)
  const updatePassword = async (newPassword) => {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (err) throw err
      return true
    } catch (e) {
      console.error('Update Password Error:', e.message)
      error.value = 'Şifre güncellenemedi. Lütfen daha sonra tekrar deneyin.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    session,
    loading,
    error,
    login,
    logout,
    checkAuth,
    sendPasswordResetEmail,
    updatePassword
  }
})