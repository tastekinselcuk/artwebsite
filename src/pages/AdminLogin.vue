<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-20">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8 animate-fade-in">
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-3 text-foreground">
          {{ t('admin.login.title') }}
        </h1>
        <p class="text-muted-foreground">{{ t('admin.login.subtitle') }}</p>
      </div>

      <!-- Login Form -->
      <div class="bg-card rounded-2xl shadow-xl p-8 animate-fade-in" style="animation-delay: 0.2s">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-foreground mb-2">
              {{ t('admin.login.username') }}
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              :placeholder="t('admin.login.username')"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-foreground mb-2">
              {{ t('admin.login.password') }}
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              :placeholder="t('admin.login.password')"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {{ t('admin.login.invalidCredentials') }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg transition-all duration-300"
          >
            {{ t('admin.login.signIn') }}
          </button>
        </form>

        <!-- Demo Info -->
        <div class="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
          <p class="font-medium mb-1">{{ t('admin.login.demoCredentials') }}</p>
          <p>Username: <span class="font-mono">admin</span></p>
          <p>Password: <span class="font-mono">admin123</span></p>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <router-link
          to="/"
          class="text-primary hover:underline transition-all"
        >
          ← {{ t('admin.login.backToHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''

  const success = authStore.login(username.value, password.value)

  if (success) {
    router.push('/admin/dashboard')
  } else {
    error.value = 'error'
  }
}
</script>
