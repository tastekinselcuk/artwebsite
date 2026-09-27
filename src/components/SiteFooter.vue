<template>
  <footer
    v-if="!isAdminPage"
    class="border-t border-border/50 bg-background"
  >
    <div class="mx-auto max-w-6xl px-6 pt-8 pb-4 md:pt-10 md:pb-5">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p class="font-display text-lg font-semibold text-foreground mb-2">Sarpé Atelier</p>
          <p class="text-sm text-muted-foreground leading-relaxed max-w-xs">
            {{ t("footer.tagline") }}
          </p>
        </div>

        <div>
          <p class="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            {{ t("footer.explore") }}
          </p>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/ebru" class="text-foreground/80 hover:text-primary transition-colors">
                {{ t("nav.ebruGallery") }}
              </router-link>
            </li>
            <li>
              <router-link to="/shop" class="text-foreground/80 hover:text-primary transition-colors">
                {{ t("nav.ebruShop") }}
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="text-foreground/80 hover:text-primary transition-colors">
                {{ t("nav.about") }}
              </router-link>
            </li>
            <li>
              <router-link to="/rehber" class="text-foreground/80 hover:text-primary transition-colors">
                {{ t("nav.guides") }}
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            {{ t("footer.guides") }}
          </p>
          <ul class="space-y-2 text-sm">
            <li v-for="g in featuredGuides" :key="g.slug">
              <router-link
                :to="`/rehber/${g.slug}`"
                class="text-foreground/80 hover:text-primary transition-colors"
              >
                {{ shortGuideTitle(g.title) }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/rehber"
                class="text-primary/80 hover:text-primary transition-colors text-xs font-medium"
              >
                {{ t("footer.allGuides") }} →
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
            {{ t("footer.legal") }}
          </p>
          <ul class="space-y-2 text-sm">
            <li v-for="item in legalLinks" :key="item.slug">
              <router-link
                :to="`/${item.slug}`"
                class="text-foreground/80 hover:text-primary transition-colors"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-border/40">
        <p class="text-xs text-muted-foreground/70">
          © {{ year }} Sarpé Atelier
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useGuidesStore } from "@/stores/guides";
import { listLegal } from "@/content/legal";

const route = useRoute();
const { t, locale } = useI18n();
const guidesStore = useGuidesStore();

const isAdminPage = computed(() => route.path.startsWith("/admin"));
const year = new Date().getFullYear();
const featuredGuides = computed(() =>
  guidesStore.listLocalized(locale.value, { featured: true, limit: 3 }),
);
const legalLinks = computed(() => listLegal(locale.value));

const shortGuideTitle = (title) => {
  if (!title) return "";
  const cut = title.split("|")[0].split("?")[0].trim();
  return cut.length > 36 ? `${cut.slice(0, 34)}…` : cut;
};

onMounted(() => {
  if (!isAdminPage.value) guidesStore.fetchGuides();
});
</script>
