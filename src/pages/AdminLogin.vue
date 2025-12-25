<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

      <div class="bg-blue-50 p-8 text-center border-b border-blue-100">
        <h2 class="text-2xl font-bold text-gray-900">Yönetici Girişi</h2>
        <p class="text-sm text-gray-500 mt-2">Devam etmek için lütfen kimliğinizi doğrulayın.</p>
      </div>

      <div class="p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">E-posta Adresi</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Şifre</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div v-if="authStore.error" class="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {{ authStore.error }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="authStore.loading">Giriş Yapılıyor...</span>
            <span v-else>Panele Giriş Yap</span>
          </button>
        </form>
      </div>

      <div class="p-4 bg-gray-50 border-t border-gray-100 text-center">
        <router-link to="/" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← Siteye Geri Dön
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  // Store'daki login fonksiyonunu çağır
  const success = await authStore.login(email.value, password.value)

  if (success) {
    // Giriş başarılıysa Dashboard'a yönlendir
    router.push('/admin/dashboard')
  }
}
</script>
