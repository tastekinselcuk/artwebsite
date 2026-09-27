<template>
  <article v-if="article" class="bg-background pt-24 pb-10 px-6">
    <div class="mx-auto max-w-3xl">
      <router-link
        to="/rehber"
        class="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        {{ t("guide.backToIndex") }}
      </router-link>

      <header class="mb-10 md:mb-12">
        <p class="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-primary/80">
          {{ article.eyebrow }}
        </p>
        <h1 class="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-5">
          {{ article.title }}
        </h1>
        <div class="h-px w-10 bg-primary/35 mb-5" />
        <p class="text-base md:text-lg leading-relaxed text-muted-foreground">
          {{ article.lead }}
        </p>
        <p v-if="article.publishedAt" class="mt-4 text-xs text-muted-foreground/70">
          {{ formatDate(article.publishedAt) }}
        </p>
      </header>

      <div class="space-y-8 md:space-y-10">
        <section v-for="(section, i) in article.sections" :key="i">
          <h2 class="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
            {{ section.heading }}
          </h2>
          <p class="text-sm md:text-base leading-[1.85] text-muted-foreground">
            {{ section.body }}
          </p>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row gap-4 sm:gap-8">
        <router-link
          to="/ebru"
          class="group inline-flex items-center gap-2 text-sm font-medium text-foreground/80 border-b border-foreground/15 pb-1 hover:text-primary hover:border-primary transition-colors w-fit"
        >
          {{ article.ctaGallery }}
          <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </router-link>
        <router-link
          to="/shop"
          class="group inline-flex items-center gap-2 text-sm font-medium text-foreground/80 border-b border-foreground/15 pb-1 hover:text-primary hover:border-primary transition-colors w-fit"
        >
          {{ article.ctaShop }}
          <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </router-link>
      </div>

      <aside class="mt-14 rounded-2xl border border-border/60 bg-muted/20 p-5 md:p-6">
        <p class="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          {{ t("guide.moreGuides") }}
        </p>
        <ul class="space-y-2">
          <li v-for="g in otherGuides" :key="g.slug">
            <router-link
              :to="`/rehber/${g.slug}`"
              class="font-display text-base text-foreground hover:text-primary transition-colors"
            >
              {{ g.title }}
            </router-link>
          </li>
        </ul>
      </aside>
    </div>
  </article>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ArrowLeft, ArrowRight } from "lucide-vue-next";
import { useGuidesStore } from "@/stores/guides";
import { applySeo, getSiteUrl, buildOrganizationJsonLd } from "@/composables/useSeo";

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const guidesStore = useGuidesStore();

const rawGuide = computed(() => guidesStore.getBySlug(route.params.slug));
const article = computed(() => guidesStore.localize(rawGuide.value, locale.value));

const otherGuides = computed(() =>
  guidesStore
    .listLocalized(locale.value)
    .filter((g) => g.slug !== route.params.slug)
    .slice(0, 4),
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
  if (!rawGuide.value || !article.value) {
    if (!guidesStore.loading) router.replace({ name: "not-found" });
    return;
  }

  const a = article.value;
  const siteUrl = getSiteUrl();
  const path = `/rehber/${a.slug}`;

  applySeo({
    title: a.title,
    description: a.description,
    path,
    image: a.image,
    locale: locale.value,
    jsonLd: [
      buildOrganizationJsonLd(),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.description,
        datePublished: a.publishedAt,
        inLanguage: locale.value === "en" ? "en" : "tr",
        author: { "@type": "Person", name: "Zehra Sarp" },
        publisher: { "@type": "Organization", name: "Sarpé Atelier", url: siteUrl },
        mainEntityOfPage: `${siteUrl}${path}`,
        image: a.image?.startsWith("http") ? a.image : `${siteUrl}${a.image || "/og-default.jpg"}`,
      },
    ],
  });
};

onMounted(() => guidesStore.fetchGuides());
watch([() => route.params.slug, locale, () => guidesStore.guides], syncSeo, { immediate: true });
</script>
