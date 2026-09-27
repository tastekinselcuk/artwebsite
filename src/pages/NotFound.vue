<template>
  <div class="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
    <p class="text-[11px] uppercase tracking-[0.28em] text-primary/80 mb-3">404</p>
    <h1 class="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
      {{ t("seo.notFound.title") }}
    </h1>
    <p class="text-muted-foreground max-w-md mb-8">
      {{ t("seo.notFound.description") }}
    </p>
    <router-link
      to="/"
      class="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground/20 pb-1 hover:text-primary hover:border-primary transition-colors"
    >
      {{ t("seo.notFound.backHome") }}
    </router-link>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
