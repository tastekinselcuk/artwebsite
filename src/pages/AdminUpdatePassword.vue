<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      
      <div class="bg-blue-50 p-8 text-center border-b border-blue-100">
        <h2 class="text-2xl font-bold text-gray-900">Yeni Şifre Belirle</h2>
        <p class="text-sm text-gray-500 mt-2">Lütfen hesabınız için yeni bir şifre oluşturun.</p>
      </div>

      <div class="p-8">
        <form @submit.prevent="handlePasswordUpdate" class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Yeni Şifre</label>
            <input
              v-model="newPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Yeni şifreniz"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Şifrenizi doğrulayın"
            />
          </div>

          <div v-if="errorMessage" class="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading || !passwordsMatch"
            class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <span v-if="authStore.loading" class="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full"></span>
            <span>Şifreyi Güncelle</span>
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabaseClient'

const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const router = useRouter()
const authStore = useAuthStore()

// Şifrelerin eşleşip eşleşmediğini kontrol et
const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true
  return newPassword.value === confirmPassword.value
})

const handlePasswordUpdate = async () => {
  if (!passwordsMatch.value) {
    errorMessage.value = 'Şifreler birbiriyle eşleşmiyor!'
    return
  }

  const success = await authStore.updatePassword(newPassword.value)
  if (success) {
    // Şifre güncellendiğinde başarılı oturum açılmış olur, Dashboard'a atalım
    router.push('/admin/dashboard')
  } else {
    errorMessage.value = authStore.error
  }
}
</script>