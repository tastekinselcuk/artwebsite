<template>
  <div class="bg-background pt-24 pb-10 px-6">
    <div class="mx-auto max-w-3xl">
      <header class="text-center mb-12 md:mb-14">
        <p class="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-primary/80">
          {{ t("guide.indexEyebrow") }}
        </p>
        <h1 class="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
          {{ t("guide.indexTitle") }}
        </h1>
        <div class="mx-auto h-px w-10 bg-primary/35 mb-4" />
        <p class="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {{ t("guide.indexDescription") }}
        </p>
      </header>

      <ul class="space-y-4">
        <li v-for="g in items" :key="g.slug">
          <router-link
            :to="`/rehber/${g.slug}`"
            class="group block rounded-2xl border border-border/60 bg-card/40 p-5 md:p-6 transition-all hover:border-primary/25 hover:shadow-md"
          >
            <p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              {{ g.eyebrow }}
            </p>
            <h2
              class="font-display text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2"
            >
              {{ g.title }}
            </h2>
            <p class="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {{ g.description }}
            </p>
            <span
              class="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary/80"
            >
              {{ t("guide.readMore") }}
              <ArrowRight class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { ArrowRight } from "lucide-vue-next";
import { useGuidesStore } from "@/stores/guides";

const { t, locale } = useI18n();
const guidesStore = useGuidesStore();

const items = computed(() => guidesStore.listLocalized(locale.value));

onMounted(() => {
  guidesStore.fetchGuides();
});
</script>
