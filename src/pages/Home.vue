<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden">
      <canvas ref="canvasRef" class="absolute inset-0 w-full h-full object-cover z-0"></canvas>

      <div class="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background z-1 pointer-events-none" />

      <div class="relative z-10 text-center px-6 animate-fade-in-slow pointer-events-none">
        <h1 class="text-5xl md:text-7xl font-display font-bold mb-4 text-foreground drop-shadow-lg">
          {{ t("home.hero.title") }}
          <br />
          <span class="text-primary">{{ t("home.hero.titleHighlight") }}</span>
        </h1>
        <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light drop-shadow-md">
          {{ t("home.hero.subtitle") }}
        </p>

        <div class="flex flex-col sm:flex-row gap-6 justify-center pointer-events-auto">
          <button
            @click="scrollToPhilosophy"
            class="group relative px-7 py-3.5 rounded-full bg-foreground text-background shadow-lg hover:shadow-xl transition-all duration-500 ease-out flex items-center gap-2.5 justify-center hover-lift"
          >
            <span class="font-medium text-sm">{{ t("home.hero.exploreEbru") }}</span>
            <ArrowDown class="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none"></div>
    </section>

    <!-- Philosophy Section (Maksimum Kompakt ve Ekrana Sığan Yapı) -->
    <section id="philosophy" class="relative z-30 bg-background py-10 md:py-14 overflow-hidden">
      <div class="mx-auto max-w-7xl px-6">
        
        <!-- Üst Başlık Alanı -->
        <div class="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <span class="mb-2.5 inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-primary">
            {{ t("home.philosophy.eyebrow") }}
          </span>
          <h2 class="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl mb-3">
            {{ t("home.philosophy.title") }}
          </h2>
          <div class="mx-auto mt-2 h-px w-8 bg-primary/35 mb-4" />
        </div>

        <!-- Bölüm 1: Temel Bilgiler (Grid Kartları - Daraltıldı) -->
        <div class="grid md:grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-12">
          <div 
            v-for="(topic, index) in ebruTopics" 
            :key="topic.id"
            class="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 md:p-6 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div class="relative z-10">
              <span class="text-2xl font-display font-light text-primary/30 mb-3 block">0{{ index + 1 }}</span>
              <h3 class="font-display text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {{ t(topic.titleKey) }}
              </h3>
              <p class="text-xs leading-relaxed text-muted-foreground">
                {{ t(topic.bodyKey) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bölüm 2: Ebru Çeşitleri (İnteraktif Vitrin - Oransal Küçültüldü) -->
        <div class="relative rounded-[2rem] bg-muted/20 border border-border/50 p-5 md:p-6 lg:p-8 overflow-hidden">
          <div class="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            <!-- Sol Menü: Seçenekler -->
            <div class="lg:col-span-5 flex flex-col gap-1.5 relative z-10">
              <div class="mb-3">
                <h3 class="font-display text-lg font-bold text-foreground mb-1">
                  {{ t("home.philosophy.varietiesTitle") }}
                </h3>
                <p class="text-[11px] text-muted-foreground">
                  {{ t("home.philosophy.varietiesHint") }}
                </p>
              </div>

              <button
                v-for="variety in ebruVarieties"
                :key="variety.id"
                @click="activeVariety = variety.id"
                class="group text-left px-4 py-3 rounded-xl transition-all duration-500 border relative overflow-hidden"
                :class="activeVariety === variety.id ? 'bg-background border-primary/20 shadow-sm' : 'border-transparent hover:bg-muted/40'"
              >
                <div 
                  class="absolute left-0 top-0 bottom-0 w-1 bg-primary transition-transform duration-500 origin-left"
                  :class="activeVariety === variety.id ? 'scale-x-100' : 'scale-x-0'"
                />
                
                <h4 class="font-display text-sm font-medium transition-colors duration-300" 
                    :class="activeVariety === variety.id ? 'text-primary' : 'text-foreground group-hover:text-foreground/80'">
                  {{ getVarietyTitle(variety) }}
                </h4>
                
                <div class="grid transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" 
                     :class="activeVariety === variety.id ? 'grid-rows-[1fr] opacity-100 mt-1.5' : 'grid-rows-[0fr] opacity-0'">
                  <p class="overflow-hidden text-[11px] text-muted-foreground leading-relaxed">
                    {{ getVarietyDescription(variety) }}
                  </p>
                </div>
              </button>
            </div>

            <!-- Sağ Görsel: Dinamik Sergi (Dikey alanı azaltmak için aspect-[16/10] kullanıldı) -->
            <div class="lg:col-span-7 relative aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-muted/40 shadow-xl border border-border/50">
              <TransitionGroup name="fade-scale">
                <div 
                  v-for="variety in ebruVarieties"
                  v-show="activeVariety === variety.id"
                  :key="variety.id"
                  class="absolute inset-0 w-full h-full"
                >
                  <img
                    :src="variety.image || ebruSample"
                    :alt="getVarietyTitle(variety)"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60"></div>
                  
                  <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span class="backdrop-blur-md bg-background/60 text-foreground px-3 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase shadow-lg border border-border/30">
                      {{ getVarietyTitle(variety) }}
                    </span>
                  </div>
                </div>
              </TransitionGroup>
            </div>
            
          </div>
        </div>

        <!-- Galeriyi Keşfet Butonu -->
        <div class="m-10 flex justify-center">
          <router-link
            to="/ebru"
            class="group inline-flex items-center gap-2 border-b border-foreground/15 pb-1 text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:border-primary hover:text-primary"
          >
            {{ t("home.philosophy.exploreGallery") }}
            <ArrowRight class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </router-link>
        </div>

      </div>
    </section>

    <!-- Shop Preview Section -->
    <section id="shop-preview" class="relative z-30 overflow-hidden bg-background py-10 md:py-14 border-t border-border/30">
      <div class="mx-auto max-w-2xl px-6 text-center">
        <p class="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-primary/80">
          {{ t("home.shop.tag") }}
        </p>
        <h2 class="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {{ t("home.shop.title") }}
        </h2>
        <div class="mx-auto mt-3 h-px w-8 bg-primary/35" />
        <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {{ t("home.shop.description") }}
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="productStore.loading && !featuredProducts.length"
        class="mt-8 flex gap-4 overflow-hidden px-6"
      >
        <div v-for="n in 5" :key="n" class="w-40 shrink-0 animate-pulse sm:w-48">
          <div class="aspect-[4/5] rounded-xl bg-muted/60" />
          <div class="mt-3 space-y-2">
            <div class="mx-auto h-2 w-10 rounded-full bg-muted" />
            <div class="mx-auto h-3 w-24 rounded-full bg-muted" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!featuredProducts.length"
        class="mt-8 flex flex-col items-center px-6 text-center"
      >
        <p class="text-sm text-muted-foreground">{{ t("home.shop.empty") }}</p>
        <router-link
          to="/shop"
          class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary border-b border-foreground/15 pb-0.5"
        >
          {{ t("home.shop.viewAll") }}
          <ArrowRight class="h-3.5 w-3.5" />
        </router-link>
      </div>

      <!-- Marquee State -->
      <div
        v-else
        class="shop-marquee mt-8"
        @mouseenter="isMarqueePaused = true"
        @mouseleave="isMarqueePaused = false"
      >
        <div
          class="shop-marquee__track"
          :class="{ 'is-paused': isMarqueePaused }"
          :style="{ '--marquee-duration': marqueeDuration }"
        >
          <router-link
            v-for="(product, index) in marqueeProducts"
            :key="`${product.id}-${index}`"
            :to="`/shop/product/${product.id}`"
            class="shop-piece group"
          >
            <div class="shop-piece__frame">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="getProductTitle(product)"
                class="shop-piece__image"
                loading="lazy"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-muted-foreground/35"
              >
                <ShoppingBag class="h-6 w-6" />
              </div>
              <div class="shop-piece__veil" />
              <span class="shop-piece__cta">
                {{ t("home.shop.viewProduct") }}
                <ArrowRight class="h-3 w-3 transition-transform duration-500 group-hover:translate-x-0.5" />
              </span>
            </div>

            <div class="mt-2 text-center">
              <p class="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
                {{ getCategoryLabel(product.category) }}
              </p>
              <h3
                class="mt-0.5 font-display text-[0.9rem] font-medium text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-1"
              >
                {{ getProductTitle(product) }}
              </h3>
            </div>
          </router-link>
        </div>
      </div>

      <div v-if="featuredProducts.length" class="mt-8 mb-3 flex justify-center px-6">
        <router-link
          to="/shop"
          class="group inline-flex items-center gap-2 border-b border-foreground/15 pb-1 text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:border-primary hover:text-primary"
        >
          {{ t("home.shop.viewAll") }}
          <ArrowRight class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { ArrowDown, ArrowRight, ShoppingBag } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { useProductStore } from "@/stores/products";
import { useEbruVarietiesStore } from "@/stores/ebruVarieties";
import heroImage from "@/assets/hero-split.jpg";
import ebruSample from "@/assets/ebru-sample.jpg";

const { t, locale, te } = useI18n();
const productStore = useProductStore();
const varietiesStore = useEbruVarietiesStore();
const canvasRef = ref(null);
const isMarqueePaused = ref(false);
const currentLocale = computed(() => locale.value);

const activeVariety = ref(null);

const ebruTopics = [
  {
    id: "what",
    titleKey: "home.philosophy.topics.what.title",
    bodyKey: "home.philosophy.topics.what.body",
  },
  {
    id: "how",
    titleKey: "home.philosophy.topics.how.title",
    bodyKey: "home.philosophy.topics.how.body",
  },
  {
    id: "unique",
    titleKey: "home.philosophy.topics.unique.title",
    bodyKey: "home.philosophy.topics.unique.body",
  },
];

const ebruVarieties = computed(() => varietiesStore.activeVarieties);

const getVarietyTitle = (variety) =>
  variety?.title?.[currentLocale.value] || variety?.title?.tr || "";

const getVarietyDescription = (variety) =>
  variety?.description?.[currentLocale.value] || variety?.description?.tr || "";

watch(
  ebruVarieties,
  (list) => {
    if (!list.length) {
      activeVariety.value = null;
      return;
    }
    const stillExists = list.some((v) => v.id === activeVariety.value);
    if (!stillExists) activeVariety.value = list[0].id;
  },
  { immediate: true },
);

const featuredProducts = computed(() => {
  return productStore.products.filter((p) => p.isActive && p.image);
});

const marqueeProducts = computed(() => {
  const source = featuredProducts.value;
  if (!source.length) return [];

  let half = [...source];
  while (half.length < 8) {
    half = half.concat(source);
  }

  return [...half, ...half];
});

const marqueeDuration = computed(() => {
  const halfCount = Math.max(1, marqueeProducts.value.length / 2);
  return `${Math.max(32, halfCount * 5)}s`;
});

const getProductTitle = (product) => {
  if (!product?.title) return "";
  if (typeof product.title === "string") {
    return te(product.title) ? t(product.title) : product.title;
  }
  return product.title[currentLocale.value] || product.title.tr || "";
};

const getCategoryLabel = (category) => {
  const key = `shop.filters.${category || "all"}`;
  return te(key) ? t(key) : category;
};

onMounted(async () => {
  if (!productStore.products.length) {
    productStore.fetchProductsFromSupabase();
  }
  if (!varietiesStore.varieties.length) {
    varietiesStore.fetchVarieties();
  }

  if (canvasRef.value) {
    try {
      const module = await import("https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js");
      const LiquidBackground = module.default;
      const app = LiquidBackground(canvasRef.value);
      app.loadImage(heroImage);
      app.liquidPlane.material.metalness = 0.75;
      app.liquidPlane.material.roughness = 0.25;
      app.liquidPlane.uniforms.displacementScale.value = 5;
      app.setRain(false);
    } catch (error) {
      console.error("Liquid background error:", error);
    }
  }
});

const scrollToPhilosophy = () => {
  document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" });
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Shop Marquee Styles - Oransal Olarak Küçültüldü */
.shop-marquee {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
}

.shop-marquee__track {
  display: flex;
  width: max-content;
  gap: 1rem;
  padding-inline: 1rem;
  animation: shop-marquee-scroll var(--marquee-duration, 40s) linear infinite;
  will-change: transform;
}

.shop-marquee__track.is-paused {
  animation-play-state: paused;
}

@keyframes shop-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.shop-piece {
  display: block;
  width: 10rem;
  flex-shrink: 0;
  text-decoration: none;
}

@media (min-width: 640px) {
  .shop-piece { width: 11.5rem; }
}

@media (min-width: 1024px) {
  .shop-piece { width: 13rem; }
}

.shop-piece__frame {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 1rem;
  background: hsl(var(--muted) / 0.55);
  box-shadow: 0 4px 16px hsl(var(--foreground) / 0.05);
}

.shop-piece__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.shop-piece:hover .shop-piece__image {
  transform: scale(1.04);
}

.shop-piece__veil {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(to top, hsl(180 15% 10% / 0.38) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.45s ease;
}

.shop-piece:hover .shop-piece__veil {
  opacity: 1;
}

.shop-piece__cta {
  position: absolute;
  left: 50%;
  bottom: 0.8rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transform: translate(-50%, 6px);
  padding-bottom: 0.1rem;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: white;
  border-bottom: 1px solid rgb(255 255 255 / 0.4);
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease;
}

.shop-piece:hover .shop-piece__cta {
  opacity: 1;
  transform: translate(-50%, 0);
  border-color: rgb(255 255 255 / 0.85);
}

/* Fade & Scale Vitrin Animasyonu */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.25, 1, 0.33, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(1.03); 
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.97); 
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .shop-marquee__track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 64rem;
    margin-inline: auto;
  }

  .shop-piece__image,
  .shop-piece__veil,
  .shop-piece__cta {
    transition: none;
  }

  .shop-piece:hover .shop-piece__image {
    transform: none;
  }
}
</style>