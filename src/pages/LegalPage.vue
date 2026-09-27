<template>
  <article v-if="page" class="bg-background pt-24 pb-10 px-6">
    <div class="mx-auto max-w-3xl">
      <header class="mb-10 md:mb-12">
        <p class="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-primary/80">
          {{ t("legal.eyebrow") }}
        </p>
        <h1 class="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-5">
          {{ page.title }}
        </h1>
        <div class="h-px w-10 bg-primary/35 mb-5" />
        <p class="text-base md:text-lg leading-relaxed text-muted-foreground">
          {{ page.lead }}
        </p>
        <p v-if="page.updatedAt" class="mt-4 text-xs text-muted-foreground/70">
          {{ t("legal.updated") }}: {{ formatDate(page.updatedAt) }}
        </p>
      </header>

      <div class="space-y-8 md:space-y-10">
        <section v-for="(section, i) in page.sections" :key="i">
          <h2 class="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
            {{ section.heading }}
          </h2>
          <p class="text-sm md:text-base leading-[1.85] text-muted-foreground">
            {{ section.body }}
          </p>
        </section>
      </div>

      <ul class="mt-12 pt-8 border-t border-border/60 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <li v-for="item in otherPages" :key="item.slug">
          <router-link
            :to="`/${item.slug}`"
            class="text-foreground/80 hover:text-primary transition-colors"
          >
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </article>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { getLegalBySlug, getLegalLocalized, listLegal } from "@/content/legal";
import { applySeo, buildOrganizationJsonLd } from "@/composables/useSeo";

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

const raw = computed(() => getLegalBySlug(route.params.slug));
const page = computed(() => getLegalLocalized(raw.value, locale.value));
const otherPages = computed(() =>
  listLegal(locale.value).filter((p) => p.slug !== route.params.slug),
);

const formatDate = (iso) => {
  try {
    return new Intl.DateTimeFormat(locale.value === "en" ? "en-GB" : "tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const syncSeo = () => {
  if (!raw.value || !page.value) {
    router.replace({ name: "not-found" });
    return;
  }
  const p = page.value;
  applySeo({
    title: p.title,
    description: p.description,
    path: `/${p.slug}`,
    locale: locale.value,
    jsonLd: [buildOrganizationJsonLd()],
  });
};

watch([() => route.params.slug, locale], syncSeo, { immediate: true });
</script>
