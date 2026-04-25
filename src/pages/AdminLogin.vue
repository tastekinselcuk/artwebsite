<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">

      <div class="bg-blue-50 p-8 text-center border-b border-blue-100 relative">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isResetMode ? 'Şifre Sıfırlama' : 'Yönetici Girişi' }}
        </h2>
        <p class="text-sm text-gray-500 mt-2">
          {{ isResetMode ? 'Hesabınıza ait e-posta adresini girin, size bir sıfırlama bağlantısı gönderelim.' : 'Devam etmek için lütfen kimliğinizi doğrulayın.' }}
        </p>
      </div>

      <div class="p-8">
        <form v-if="isResetMode" @submit.prevent="handleResetRequest" class="space-y-5 animate-fade-in">
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

          <div v-if="authStore.error" class="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {{ authStore.error }}
          </div>

          <div v-if="successMessage" class="p-3 rounded-lg bg-green-50 text-green-700 text-sm">
            {{ successMessage }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="authStore.loading" class="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full"></span>
            <span>{{ authStore.loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder' }}</span>
          </button>
          
          <div class="text-center mt-4">
            <button type="button" @click="toggleMode" class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Giriş ekranına dön
            </button>
          </div>
        </form>

        <form v-else @submit.prevent="handleLogin" class="space-y-5 animate-fade-in">
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
            <div class="flex justify-between items-center">
              <label class="text-sm font-medium text-gray-700">Şifre</label>
              <button type="button" @click="toggleMode" tabindex="-1" class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Şifremi Unuttum
              </button>
            </div>
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
            <span v-if="authStore.loading" class="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full"></span>
            <span>{{ authStore.loading ? 'Giriş Yapılıyor...' : 'Panele Giriş Yap' }}</span>
          </button>
        </form>
      </div>

      <div class="p-4 bg-gray-50 border-t border-gray-100 text-center">
        <router-link to="/" class="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          &larr; Siteye Geri Dön
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
const isResetMode = ref(false)
const successMessage = ref('')

const router = useRouter()
const authStore = useAuthStore()

const toggleMode = () => {
  isResetMode.value = !isResetMode.value
  authStore.error = null
  successMessage.value = ''
  password.value = ''
}

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/admin/dashboard')
  }
}

const handleResetRequest = async () => {
  successMessage.value = ''
  const success = await authStore.sendPasswordResetEmail(email.value)
  if (success) {
    successMessage.value = 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.'
    email.value = '' // Güvenlik için alanı temizle
  }
}
</script>