<template>
  <nav class="fixed top-8 right-8 z-50">
    <div class="relative">
      <!-- Hamburger Button -->
      <button
        @click="isOpen = !isOpen"
        class="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Toggle navigation"
      >
        <div class="space-y-1.5">
          <span
            :class="[
              'block w-5 h-0.5 bg-current transition-transform',
              isOpen ? 'rotate-45 translate-y-2' : ''
            ]"
          />
          <span
            :class="[
              'block w-5 h-0.5 bg-current transition-opacity',
              isOpen ? 'opacity-0' : ''
            ]"
          />
          <span
            :class="[
              'block w-5 h-0.5 bg-current transition-transform',
              isOpen ? '-rotate-45 -translate-y-2' : ''
            ]"
          />
        </div>
      </button>

      <!-- Menu Items -->
      <div
        :class="[
          'absolute top-20 right-0 flex flex-col gap-3 transition-all duration-500',
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        ]"
      >
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          @click="isOpen = false"
          class="flex items-center gap-3 px-5 py-3 rounded-full bg-card text-card-foreground shadow-md hover:shadow-lg transition-all duration-300 hover-lift group"
        >
          <component :is="item.icon" class="w-5 h-5 text-primary" />
          <span class="font-medium">{{ t(item.label) }}</span>
        </router-link>

        <!-- Language Switcher -->
        <div class="flex gap-2 px-5 py-3">
          <button
            @click="changeLanguage('tr')"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-medium transition-all',
              currentLocale === 'tr'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            ]"
          >
            TR
          </button>
          <button
            @click="changeLanguage('en')"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-medium transition-all',
              currentLocale === 'en'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            ]"
          >
            EN
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Home, Droplet, Camera, User } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const isOpen = ref(false)
const currentLocale = computed(() => locale.value)

const navItems = [
  { to: '/', icon: Home, label: 'nav.home' },
  { to: '/ebru', icon: Droplet, label: 'nav.ebru' },
  { to: '/photography', icon: Camera, label: 'nav.photography' },
  { to: '/about', icon: User, label: 'nav.about' },
]

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}
</script>
