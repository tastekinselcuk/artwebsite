<template>
  <div>
    <DropLogo />
    <FloatingNav />
    <LanguageSwitcher />

    <router-view />
    <SiteFooter />
  </div>
</template>

<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import DropLogo from "@/components/DropLogo.vue";
import FloatingNav from "@/components/FloatingNav.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import {
  applySeo,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/composables/useSeo";

const route = useRoute();
const { t, locale } = useI18n();

const syncSeo = () => {
  if (route.meta.seoSkip) return;

  const key = route.meta.seoKey || "home";
  const noindex = Boolean(route.meta.noindex);
  const path = route.path;

  const title = t(`seo.${key}.title`);
  const description = t(`seo.${key}.description`);

  const jsonLd =
    key === "home"
      ? [buildOrganizationJsonLd(), buildWebSiteJsonLd()]
      : key === "ebru" || key === "shop" || key === "about" || key === "guides"
        ? [buildOrganizationJsonLd()]
        : null;

  applySeo({
    title,
    description,
    path,
    locale: locale.value,
    noindex,
    jsonLd,
  });
};

watch([() => route.fullPath, locale], syncSeo, { immediate: true });
</script>
