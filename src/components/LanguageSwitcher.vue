<template>
  <div class="flex gap-2">
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
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { locale } = useI18n()
const currentLocale = computed(() => locale.value)

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}
</script>
