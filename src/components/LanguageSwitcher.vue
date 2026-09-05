<template>
  <div
    v-if="!isAdminPage"
    class="fixed bottom-5 right-5 z-40 flex items-center gap-0.5 rounded-full border border-border/50 bg-background/70 p-0.5 shadow-sm backdrop-blur-md"
    role="group"
    aria-label="Language"
  >
    <button
      v-for="lang in languages"
      :key="lang.code"
      @click="changeLanguage(lang.code)"
      type="button"
      :aria-pressed="currentLocale === lang.code"
      :class="[
        'min-w-[2rem] rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide transition-colors duration-200',
        currentLocale === lang.code
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:text-foreground',
      ]"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { locale } = useI18n();
const route = useRoute();

const currentLocale = computed(() => locale.value);
const isAdminPage = computed(() => route.path.startsWith("/admin"));

const languages = [
  { code: "tr", label: "TR" },
  { code: "en", label: "EN" },
];

const changeLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem("language", lang);
};
</script>
