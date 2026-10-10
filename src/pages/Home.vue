<template>
  <div class="bg-background">
    <!-- Hero Section -->
    <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden">
      <img
        :src="heroImage"
        alt="Sarpé Atelier ebru sanatı"
        class="absolute inset-0 w-full h-full object-cover z-0"
        fetchpriority="high"
        decoding="async"
      />
      <canvas
        ref="canvasRef"
        aria-hidden="true"
        class="absolute inset-0 w-full h-full object-cover z-[1] transition-opacity duration-700"
        :style="{ opacity: liquidReady ? 1 : 0 }"
      ></canvas>

      <div class="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background z-[2] pointer-events-none" />

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
    <section id="philosophy" class="relative z-30 bg-background py-10 md:py-14 overflow-clip">
      <div class="mx-auto max-w-7xl px-6">
        
        <div class="philosophy-sequence">
          <div class="philosophy-sequence__content">
            <EbruTopicsIntro :topics="ebruTopics" />

            <!-- Scroll-driven Ebru collection -->
            <div
              ref="showcaseRef"
              class="ebru-scroll"
              :class="{ 'is-empty': !ebruVarieties.length }"
              :style="{ '--steps': Math.max(0, ebruVarieties.length - 1) }"
            >
              <div class="ebru-scroll__stage">
                <div class="ebru-scroll__ambient" aria-hidden="true" />
                <div class="ebru-scroll__layout">
                  <div class="ebru-scroll__editorial">
                    <p class="ebru-scroll__eyebrow">{{ t("home.philosophy.varietiesTitle") }}</p>
                    <div class="ebru-scroll__copy">
                      <Transition name="variety-copy">
                        <div v-if="selectedVariety" :key="selectedVariety.id" class="ebru-scroll__copy-inner">
                          <span class="ebru-scroll__edition" aria-hidden="true">{{ String(activeVarietyIndex + 1).padStart(2, '0') }}</span>
                          <h3 class="ebru-scroll__title font-display">{{ getVarietyTitle(selectedVariety) }}</h3>
                          <p class="ebru-scroll__description">{{ getVarietyDescription(selectedVariety) }}</p>
                        </div>
                      </Transition>
                    </div>
                    <nav class="ebru-scroll__nav" :aria-label="t('home.philosophy.varietiesTitle')">
                      <div class="ebru-scroll__nav-track">
                        <button
                          v-for="(variety, index) in ebruVarieties"
                          :key="variety.id"
                          type="button"
                          :aria-pressed="activeVariety === variety.id"
                          :aria-label="getVarietyTitle(variety)"
                          :class="{ 'is-active': activeVariety === variety.id }"
                          @click="selectVariety(index)"
                          @focus="handleVarietyFocus($event, index)"
                        >
                          <span class="ebru-scroll__nav-number">{{ String(index + 1).padStart(2, '0') }}</span>
                          <span class="ebru-scroll__nav-title">{{ getVarietyTitle(variety) }}</span>
                          <span class="ebru-scroll__nav-line" aria-hidden="true" />
                        </button>
                      </div>
                    </nav>
                  </div>
                  <div class="ebru-scroll__gallery">
                    <div class="ebru-scroll__deck">
                      <article
                        v-for="(variety, index) in ebruVarieties"
                        :key="variety.id"
                        class="ebru-scroll__card"
                        :style="{ zIndex: index + 1 }"
                        :aria-hidden="activeVariety !== variety.id"
                      >
                        <div class="ebru-scroll__artwork">
                          <img
                            :src="variety.image || ebruSample"
                            :alt="getVarietyTitle(variety)"
                            :loading="index < 2 ? 'eager' : 'lazy'"
                            decoding="async"
                            @error="handleVarietyImageError"
                          />
                          <div class="ebru-scroll__shade" />
                          <span class="ebru-scroll__art-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
                        </div>
                        <div class="ebru-scroll__caption">
                          <span>{{ getVarietyTitle(variety) }}</span>
                          <span>{{ String(index + 1).padStart(2, '0') }} / {{ String(ebruVarieties.length).padStart(2, '0') }}</span>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
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
import { onMounted, onBeforeUnmount, nextTick, ref, computed, watch } from "vue";
import { ArrowDown, ArrowRight, ShoppingBag } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import EbruTopicsIntro from "@/components/EbruTopicsIntro.vue";
import { useProductStore } from "@/stores/products";
import { useEbruVarietiesStore } from "@/stores/ebruVarieties";
import heroImage from "@/assets/hero-split.jpg";
import ebruSample from "@/assets/ebru-sample.jpg";

const { t, locale, te } = useI18n();
const productStore = useProductStore();
const varietiesStore = useEbruVarietiesStore();
const canvasRef = ref(null);
const liquidReady = ref(false);
const isMarqueePaused = ref(false);
const currentLocale = computed(() => locale.value);

const activeVariety = ref(null);
const showcaseRef = ref(null);
let stopShowcaseMotion;
let stopHeroLiquid;
let refreshShowcaseMotion;
let navigateShowcase;

const ebruTopics = [
  {
    id: "what",
    titleKey: "home.philosophy.topics.what.title",
    bodyKey: "home.philosophy.topics.what.body",
    to: "/rehber/ebru-nedir",
  },
  {
    id: "how",
    titleKey: "home.philosophy.topics.how.title",
    bodyKey: "home.philosophy.topics.how.body",
    to: "/rehber/ebru-nasil-yapilir",
  },
  {
    id: "unique",
    titleKey: "home.philosophy.topics.unique.title",
    bodyKey: "home.philosophy.topics.unique.body",
    to: "/rehber/ebru-cesitleri",
  },
];

const ebruVarieties = computed(() => varietiesStore.activeVarieties);
const selectedVariety = computed(() =>
  ebruVarieties.value.find((variety) => variety.id === activeVariety.value),
);

const activeVarietyIndex = computed(() =>
  Math.max(0, ebruVarieties.value.findIndex((variety) => variety.id === activeVariety.value)),
);

const selectVariety = (index) => {
  if (navigateShowcase) navigateShowcase(index);
  else activeVariety.value = ebruVarieties.value[index]?.id;
};

const handleVarietyFocus = (event, index) => {
  if (event.target.matches(":focus-visible")) selectVariety(index);
};

const handleVarietyImageError = (event) => {
  if (event.target.getAttribute("src") !== ebruSample) event.target.src = ebruSample;
};

// Native sticky positioning and scroll-scrubbed cards. No wheel interception.
const setupShowcaseMotion = () => {
  const root = showcaseRef.value;
  if (!root) return;
  const sequence = root.closest(".philosophy-sequence");
  const sequenceContent = sequence?.querySelector(".philosophy-sequence__content");
  const stage = root.querySelector(".ebru-scroll__stage");
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cards = [];
  let navOffsets = [];
  let start = 0;
  let distance = 1;
  let visible = false;
  let frame = 0;
  let current = null;
  let lastTime = 0;
  let lastIndex = -1;
  let listening = false;
  let disposed = false;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const paint = (position) => {
    const base = Math.floor(position);
    const phase = clamp((position - base - 0.05) / 0.9);
    const eased = (1 - Math.cos(phase * Math.PI)) / 2;
    const timeline = base + eased;
    const index = Math.min(cards.length - 1, Math.round(timeline));
    if (index >= 0 && index !== lastIndex) {
      lastIndex = index;
      activeVariety.value = ebruVarieties.value[index]?.id;
      root.style.setProperty("--nav-offset", `${navOffsets[index] || 0}px`);
      // Warm upcoming images only when the active card changes.
      for (let i = index; i <= Math.min(cards.length - 1, index + 2); i++) {
        const image = cards[i]?.querySelector("img");
        if (image) image.loading = "eager";
      }
    }
    root.style.setProperty("--scroll-progress", String(position / Math.max(1, cards.length - 1)));
    cards.forEach((card, cardIndex) => {
      const relative = cardIndex - timeline;
      const incoming = clamp(relative);
      const outgoing = clamp(-relative);
      const shown = relative > -1.01 && relative < 1.01;
      card.style.visibility = shown ? "visible" : "hidden";
      card.style.willChange = visible && shown ? "transform, opacity" : "auto";
      if (!shown) return;
      if (preference.matches) {
        card.style.transform = "none";
        card.style.opacity = cardIndex === index ? "1" : "0";
        return;
      }
      card.style.opacity = String(relative < 0 ? 1 - outgoing * 0.3 : 1);
      card.style.transform = `translate3d(${incoming * 4}%, ${incoming * 104 - outgoing * 7}%, ${-outgoing * 80}px) rotate(${incoming * 6 - outgoing * 3}deg) scale(${1 - outgoing * 0.1})`;
      card.style.setProperty("--image-scale", String(1.04 + incoming * 0.12 + outgoing * 0.04));
      card.style.setProperty("--image-y", `${incoming * -5}%`);
      card.style.setProperty("--card-dim", String(outgoing * 0.22));
    });
  };

  const tick = (time) => {
    frame = 0;
    if (disposed) return;
    const target = clamp((window.scrollY - start) / distance, 0, Math.max(0, cards.length - 1));
    const delta = lastTime ? Math.min(64, time - lastTime) : 16.67;
    lastTime = time;
    current = current === null || preference.matches ? target : current + (target - current) * (1 - Math.exp(-delta / 120));
    if (Math.abs(target - current) < 0.001) current = target;
    paint(current);
    if (visible && current !== target) frame = window.requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (!frame && !disposed) frame = window.requestAnimationFrame(tick);
  };

  const measure = () => {
    cards = [...root.querySelectorAll(".ebru-scroll__card")];
    const buttons = [...root.querySelectorAll(".ebru-scroll__nav button")];
    navOffsets = buttons.map((button) => button.offsetTop - (buttons[0]?.offsetTop || 0));
    start = root.getBoundingClientRect().top + window.scrollY;
    if (sequence && sequenceContent) {
      // The compact introduction and gallery share a brief sticky hold. The
      // gallery's own timeline starts after that hold has finished.
      const introTravel = sequence.offsetHeight - sequenceContent.offsetHeight;
      start = sequence.getBoundingClientRect().top + window.scrollY + introTravel + root.offsetTop;
    }
    distance = Math.max(1, (root.offsetHeight - stage.offsetHeight) / Math.max(1, cards.length - 1));
    lastIndex = -1;
    current = null;
    schedule();
  };

  const setListening = (enabled) => {
    if (enabled === listening) return;
    listening = enabled;
    if (enabled) window.addEventListener("scroll", schedule, { passive: true });
    else window.removeEventListener("scroll", schedule);
  };

  const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    root.classList.toggle("is-in-view", visible);
    setListening(visible);
    lastTime = 0;
    if (visible) measure();
    else schedule();
  }) : null;
  if (observer) observer.observe(root);
  else {
    visible = true;
    setListening(true);
  }

  const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
  resizeObserver?.observe(root);
  resizeObserver?.observe(stage);
  if (sequence) resizeObserver?.observe(sequence);
  const navTrack = root.querySelector(".ebru-scroll__nav-track");
  if (navTrack) resizeObserver?.observe(navTrack);
  window.addEventListener("resize", measure, { passive: true });
  preference.addEventListener("change", schedule);
  refreshShowcaseMotion = measure;
  navigateShowcase = (index) => {
    measure();
    window.scrollTo({ top: start + index * distance, behavior: preference.matches ? "instant" : "smooth" });
    schedule();
  };
  measure();
  return () => {
    disposed = true;
    observer?.disconnect();
    resizeObserver?.disconnect();
    setListening(false);
    window.removeEventListener("resize", measure);
    preference.removeEventListener("change", schedule);
    window.cancelAnimationFrame(frame);
    refreshShowcaseMotion = undefined;
    navigateShowcase = undefined;
  };
};

onBeforeUnmount(() => {
  stopShowcaseMotion?.();
  stopHeroLiquid?.();
});

const getVarietyTitle = (variety) =>
  variety?.title?.[currentLocale.value] || variety?.title?.tr || "";

const getVarietyDescription = (variety) =>
  variety?.description?.[currentLocale.value] || variety?.description?.tr || "";

watch(
  ebruVarieties,
  async (list) => {
    await nextTick();
    refreshShowcaseMotion?.();
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

const setupHeroLiquid = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  let app;
  let context;
  let cancelled = false;
  let imageLoaded = false;
  let idleId;
  let timerId;

  const release = () => {
    app?.dispose();
    app = undefined;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    context = undefined;
  };

  const onContextLost = () => {
    liquidReady.value = false;
    console.warn("Liquid hero: WebGL context lost; showing the static hero image.");
  };
  const onContextRestored = () => {
    if (!cancelled && imageLoaded) liquidReady.value = true;
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  const startLiquid = async () => {
    if (cancelled) return;
    try {
      // This bundle uses Three r181, which requires WebGL 2. Reuse the real
      // canvas context so the capability check doesn't allocate a second one.
      context = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      });
      if (!context || context.isContextLost()) {
        console.warn("Liquid hero: WebGL 2 is unavailable in this browser; showing the static hero image.");
        return;
      }
      const module = await import(
        "https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js"
      );
      if (cancelled) return;
      const LiquidBackground = module.default;
      app = LiquidBackground(canvas);
      // The library defaults to touch-action:none. Keep native page scrolling.
      canvas.style.touchAction = "pan-y";
      app.liquidPlane.material.metalness = 0.75;
      app.liquidPlane.material.roughness = 0.25;
      app.liquidPlane.uniforms.displacementScale.value = 5;
      app.setRain(false);
      const loadingApp = app;
      await loadingApp.loadImage(heroImage);
      if (cancelled) {
        // A texture can finish loading after the instance has been disposed.
        loadingApp.liquidPlane.material.map?.dispose();
        return;
      }
      imageLoaded = true;
      liquidReady.value = !context.isContextLost();
    } catch (error) {
      liquidReady.value = false;
      release();
      if (!cancelled) console.error("Liquid background initialization failed:", error);
    }
  };

  // Defer heavy Three.js hero so first paint / SEO crawl isn't blocked
  if ("requestIdleCallback" in window) {
    idleId = window.requestIdleCallback(startLiquid, { timeout: 2000 });
  } else {
    timerId = window.setTimeout(startLiquid, 400);
  }
  return () => {
    cancelled = true;
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    window.clearTimeout(timerId);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    release();
  };
};

onMounted(() => {
  stopShowcaseMotion = setupShowcaseMotion();
  stopHeroLiquid = setupHeroLiquid();
  if (!productStore.products.length) {
    productStore.fetchProductsFromSupabase();
  }
  if (!varietiesStore.varieties.length) {
    varietiesStore.fetchVarieties();
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

/* Keep the compact introduction and the actual next artwork visible together. */
.philosophy-sequence::after {
  content: "";
  display: block;
  height: var(--intro-travel, 0px);
}
.philosophy-sequence__content {
  position: sticky;
  top: var(--intro-top, 80px);
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
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.shop-piece {
  display: block;
  width: 10rem;
  flex-shrink: 0;
  text-decoration: none;
}

@media (min-width: 640px) {
  .shop-piece {
    width: 11.5rem;
  }
}

@media (min-width: 1024px) {
  .shop-piece {
    width: 13rem;
  }
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

/* Physical cards, scrubbed by native scroll inside a sticky stage. */
.ebru-scroll {
  --scroll-progress: 0;
  --nav-offset: 0px;
  height: calc(100svh + var(--steps, 0) * 85svh);
  position: relative;
}
.ebru-scroll.is-empty {
  height: 0;
}
.ebru-scroll.is-empty .ebru-scroll__stage {
  display: none;
}
.ebru-scroll__stage {
  position: sticky;
  top: 0;
  height: 100svh;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  min-height: 560px;
  display: flex;
  align-items: center;
  padding: 100px 0 48px;
  isolation: isolate;
  overflow: clip;
}
.ebru-scroll__ambient {
  position: absolute;
  inset: 10% -10%;
  z-index: -1;
  background: radial-gradient(ellipse at 75% 45%, hsl(var(--primary) / 0.11), transparent 65%);
  pointer-events: none;
}
.ebru-scroll__layout {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(32px, 6vw, 90px);
  align-items: center;
  padding-inline: 34px 52px;
}
.ebru-scroll__eyebrow {
  color: hsl(var(--primary));
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  margin-bottom: 28px;
}
.ebru-scroll__copy {
  position: relative;
  height: clamp(210px, 30vh, 300px);
}
.ebru-scroll__copy-inner {
  position: absolute;
  inset: 0;
}
.ebru-scroll__edition {
  display: block;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: hsl(var(--muted-foreground));
  margin-bottom: 12px;
  font-variant-numeric: tabular-nums;
}
.ebru-scroll__title {
  font-size: clamp(30px, 4vw, 58px);
  line-height: 1.08;
  letter-spacing: -0.04em;
  margin-bottom: 20px;
}
.ebru-scroll__description {
  font-size: 13px;
  line-height: 1.8;
  color: hsl(var(--muted-foreground));
  max-width: 340px;
}
.ebru-scroll__nav {
  height: min(25svh, 240px);
  overflow: clip;
  mask-image: linear-gradient(to bottom, black 75%, transparent);
}
.ebru-scroll__nav-track {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform: translate3d(0, calc(-1 * var(--nav-offset)), 0);
  transition: transform 750ms cubic-bezier(0.22, 1, 0.36, 1);
}
.is-in-view .ebru-scroll__nav-track {
  will-change: transform;
}
.ebru-scroll__nav button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 9px 0;
  text-align: left;
  color: hsl(var(--muted-foreground));
  transition: color 250ms;
}
.ebru-scroll__nav button.is-active {
  color: hsl(var(--primary));
}
.ebru-scroll__nav button:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: -2px;
  border-radius: 4px;
}
.ebru-scroll__nav-number {
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
}
.ebru-scroll__nav-title {
  font-size: 12px;
}
.ebru-scroll__nav-line {
  height: 1px;
  width: 28px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
}
.is-active .ebru-scroll__nav-line {
  transform: scaleX(1);
}
.ebru-scroll__gallery {
  min-width: 0;
}
.ebru-scroll__deck {
  position: relative;
  height: min(62svh, 620px);
  perspective: 1400px;
}
.ebru-scroll__card {
  position: absolute;
  inset: 0;
  padding: 9px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border) / 0.7);
  border-radius: 16px;
  box-shadow: 0 18px 45px -20px hsl(var(--foreground) / 0.25);
  transform-origin: 50% 85%;
  backface-visibility: hidden;
  visibility: hidden;
}
.ebru-scroll__card:first-child {
  visibility: visible;
}
.ebru-scroll__artwork {
  position: relative;
  height: calc(100% - 42px);
  overflow: hidden;
  border-radius: 9px;
  background: hsl(var(--muted));
}
.ebru-scroll__artwork img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translateY(var(--image-y, 0%)) scale(var(--image-scale, 1.04));
}
.ebru-scroll__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgb(0 0 0 / 0.25));
}
.ebru-scroll__shade::after {
  content: "";
  position: absolute;
  inset: 0;
  background: #000;
  opacity: var(--card-dim, 0);
}
.ebru-scroll__art-number {
  position: absolute;
  bottom: 16px;
  right: 22px;
  color: rgb(255 255 255 / 0.9);
  font-family: serif;
  font-size: clamp(50px, 7vw, 100px);
  line-height: 1;
  letter-spacing: -0.07em;
}
.ebru-scroll__caption {
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
  font-size: 10px;
  letter-spacing: 0.06em;
}
.ebru-scroll__caption span:last-child {
  color: hsl(var(--muted-foreground));
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ebru-scroll__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 24px;
}
.ebru-scroll__cue {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: hsl(var(--muted-foreground));
}
.ebru-scroll__track {
  width: 80px;
  height: 2px;
  background: hsl(var(--border));
  flex-shrink: 0;
  overflow: hidden;
}
.ebru-scroll__track span {
  display: block;
  height: 100%;
  background: hsl(var(--primary));
  transform: scaleX(var(--scroll-progress));
  transform-origin: left;
}
.variety-copy-enter-active {
  transition: opacity 500ms ease 80ms, transform 750ms cubic-bezier(0.22, 1, 0.36, 1) 80ms;
}
.variety-copy-leave-active {
  transition: opacity 350ms ease, transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
}
.variety-copy-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.variety-copy-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
@media (max-width: 767px) {
  .ebru-scroll {
    height: calc(100svh + var(--steps, 0) * 75svh);
  }
  .ebru-scroll__stage {
    min-height: 540px;
    padding: 96px 0 28px;
  }
  .ebru-scroll__layout {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-inline: 24px 36px;
  }
  .ebru-scroll__eyebrow {
    font-size: 9px;
    margin-bottom: 12px;
  }
  .ebru-scroll__copy {
    height: 150px;
  }
  .ebru-scroll__edition {
    display: none;
  }
  .ebru-scroll__title {
    font-size: clamp(28px, 7vw, 40px);
    margin-bottom: 8px;
  }
  .ebru-scroll__description {
    font-size: 11px;
    line-height: 1.6;
    max-width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
  }
  .ebru-scroll__nav {
    height: 60px;
  }
  .ebru-scroll__nav-track {
    gap: 4px;
  }
  .ebru-scroll__nav button {
    padding: 5px 2px;
    gap: 12px;
  }
  .ebru-scroll__nav button.is-active {
    color: hsl(var(--primary));
  }
  .ebru-scroll__nav-title {
    font-size: 11px;
  }
  .ebru-scroll__deck {
    height: clamp(190px, 36svh, 420px);
  }
  .ebru-scroll__footer {
    margin-top: 15px;
    gap: 12px;
  }
  .ebru-scroll__cue {
    font-size: 9px;
  }
}
@media (max-height: 700px) and (min-width: 768px) {
  .ebru-scroll__stage {
    padding-top: 88px;
    padding-bottom: 24px;
    min-height: 480px;
  }
  .ebru-scroll__copy {
    height: 190px;
  }
  .ebru-scroll__title {
    font-size: 36px;
    margin-bottom: 12px;
  }
  .ebru-scroll__eyebrow {
    margin-bottom: 14px;
  }
  .ebru-scroll__deck {
    height: 62svh;
  }
}
@media (max-width: 767px) and (max-height: 650px) {
  .ebru-scroll__stage { padding-top: 88px; padding-bottom: 20px; }
  .ebru-scroll__copy { height: 120px; }
  .ebru-scroll__description { -webkit-line-clamp: 4; }
  .ebru-scroll__nav { height: 32px; }
  .ebru-scroll__deck { height: max(180px, 35svh); }
}

@media (max-height: 550px) {
  .ebru-scroll__stage {
    min-height: 0;
    padding: 84px 0 16px;
  }
  .ebru-scroll__layout {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: 24px;
  }
  .ebru-scroll__eyebrow { margin-bottom: 8px; }
  .ebru-scroll__copy { height: 132px; }
  .ebru-scroll__title { font-size: 28px; margin-bottom: 8px; }
  .ebru-scroll__description { font-size: 11px; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; overflow: hidden; }
  .ebru-scroll__edition { display: none; }
  .ebru-scroll__nav { height: 64px; }
  .ebru-scroll__deck { height: 60svh; }
  .ebru-scroll__footer { margin-top: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .ebru-scroll__nav-track { transition: none; }
  .variety-copy-enter-active, .variety-copy-leave-active {
    transition: opacity 150ms ease;
  }
  .variety-copy-enter-from, .variety-copy-leave-to {
    transform: none;
  }
  .ebru-scroll__artwork img {
    transform: none;
  }
}
</style>
