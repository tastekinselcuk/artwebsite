<template>
  <div class="min-h-screen bg-background">

    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref="canvasRef"
        class="absolute inset-0 w-full h-full object-cover z-0"
      ></canvas>

      <div class="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background z-1 pointer-events-none" />

      <div class="relative z-10 text-center px-6 animate-fade-in-slow pointer-events-none">
        <h1 class="text-6xl md:text-8xl font-display font-bold mb-6 text-foreground drop-shadow-lg">
          {{ t('home.hero.title') }}
          <br />
          <span class="text-primary">{{ t('home.hero.titleHighlight') }}</span>
        </h1>
        <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light drop-shadow-md">
          {{ t('home.hero.subtitle') }}
        </p>

        <div class="flex flex-col sm:flex-row gap-6 justify-center pointer-events-auto">
          <button
            @click="scrollToPhilosophy"
            class="group relative px-8 py-4 rounded-full bg-foreground text-background shadow-lg hover:shadow-xl transition-all duration-500 ease-out flex items-center gap-3 justify-center hover-lift"
          >
            <span class="font-medium">Koleksiyonu Keşfet</span>
            <ArrowDown class="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none"></div>
    </section>

    <section id="philosophy" class="py-24 px-6 bg-background relative z-30">
      <div class="max-w-4xl mx-auto text-center animate-fade-in mb-16">
        <h2 class="text-4xl md:text-5xl font-display font-semibold mb-6 text-foreground">
          {{ t('home.philosophy.title') }}
        </h2>
        <p class="text-lg text-muted-foreground leading-relaxed">
          {{ t('home.philosophy.description') }}
        </p>
      </div>

      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        <div class="group relative h-[450px] rounded-3xl bg-card border border-border/50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">

          <div class="absolute inset-0 overflow-hidden bg-muted">
             <img
               src="@/assets/ebru-sample.jpg"
               class="w-full h-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.25,0.4,0.25,1)] opacity-20 grayscale blur-[2px] scale-100 group-hover:opacity-100 group-hover:grayscale-0 group-hover:blur-0 group-hover:scale-110"
             />
             <div class="absolute inset-0 bg-teal-950/60 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-[1.2s] ease-in-out"></div>
          </div>

          <div class="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center transition-colors duration-700">
            <div class="w-20 h-20 rounded-full bg-primary/10 group-hover:bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 transition-all duration-700 group-hover:scale-110 border border-transparent group-hover:border-white/20">
              <Droplet class="w-10 h-10 text-primary group-hover:text-white transition-colors duration-700" />
            </div>

            <h3 class="text-3xl font-display font-bold mb-4 text-foreground group-hover:text-white transition-colors duration-700">
              {{ t('home.philosophy.ebruTitle') }}
            </h3>

            <p class="text-muted-foreground group-hover:text-white/90 transition-colors duration-700 max-w-sm">
              {{ t('home.philosophy.ebruDesc') }}
            </p>

            <router-link
              to="/ebru"
              class="mt-8 px-8 py-3 rounded-full bg-white text-teal-900 font-bold opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out delay-100 shadow-xl"
            >
              Keşfet
            </router-link>
          </div>
        </div>

        <div class="group relative h-[450px] rounded-3xl bg-card border border-border/50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">

          <div class="absolute inset-0 overflow-hidden bg-muted">
             <img
               src="@/assets/photo-sample.jpg"
               class="w-full h-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.25,0.4,0.25,1)] opacity-20 grayscale blur-[2px] scale-100 group-hover:opacity-100 group-hover:grayscale-0 group-hover:blur-0 group-hover:scale-110"
             />
             <div class="absolute inset-0 bg-indigo-950/60 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-[1.2s] ease-in-out"></div>
          </div>

          <div class="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center transition-colors duration-700">
            <div class="w-20 h-20 rounded-full bg-secondary/10 group-hover:bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 transition-all duration-700 group-hover:scale-110 border border-transparent group-hover:border-white/20">
              <Camera class="w-10 h-10 text-secondary group-hover:text-white transition-colors duration-700" />
            </div>

            <h3 class="text-3xl font-display font-bold mb-4 text-foreground group-hover:text-white transition-colors duration-700">
              {{ t('home.philosophy.photoTitle') }}
            </h3>

            <p class="text-muted-foreground group-hover:text-white/90 transition-colors duration-700 max-w-sm">
              {{ t('home.philosophy.photoDesc') }}
            </p>

            <router-link
              to="/photography"
              class="mt-8 px-8 py-3 rounded-full bg-white text-indigo-900 font-bold opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out delay-100 shadow-xl"
            >
              İncele
            </router-link>
          </div>
        </div>

      </div>
    </section>

    <section class="py-32 px-6 bg-muted/20">
      <div class="max-w-6xl mx-auto">

        <div class="flex flex-col items-center text-center mb-16">
          <span class="text-primary font-medium tracking-widest uppercase text-xs mb-3 bg-primary/10 px-3 py-1 rounded-full">
            {{ t('home.shop.tag') }}
          </span>
          <h2 class="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            {{ t('home.shop.title') }}
          </h2>
          <p class="text-muted-foreground max-w-2xl leading-relaxed">
            {{ t('home.shop.description') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">

          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-border"
          >
            <div class="relative aspect-[3/4] overflow-hidden bg-muted">
              <img
                :src="product.image"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div v-if="product.tag" class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-foreground text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
                {{ product.tag }}
              </div>

              <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <button class="bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white flex items-center gap-2 shadow-xl">
                   <ShoppingBag class="w-4 h-4" />
                   {{ t('home.shop.viewProduct') }}
                 </button>
              </div>
            </div>

            <div class="p-5 text-center">
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{{ product.category }}</p>
              <h3 class="text-lg font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {{ product.title }}
              </h3>
              <p class="text-sm font-medium text-foreground/80">
                {{ formatPrice(product.price) }}
              </p>
            </div>
          </div>

        </div>

        <div class="mt-16 text-center">
          <button class="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors border-b border-foreground/20 hover:border-primary pb-1 text-sm">
            {{ t('home.shop.viewAll') }}
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { ArrowDown, Droplet, Camera, ArrowRight, ShoppingBag } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useGalleryStore } from '@/stores/gallery'
import heroImage from '@/assets/hero-split.jpg'

const { t } = useI18n()
const galleryStore = useGalleryStore()
const canvasRef = ref(null)

// Ürün Verilerini Dil Değişimine Duyarlı Yap (Computed)
const featuredProducts = computed(() => [
  {
    id: 1,
    title: t('home.shop.products.silkScarf.title'),
    category: t('home.shop.products.silkScarf.category'),
    price: 2450,
    image: 'https://images.unsplash.com/photo-1606166325683-e6deb697d301?q=80&w=800&auto=format&fit=crop',
    tag: t('home.shop.products.silkScarf.tag')
  },
  {
    id: 2,
    title: t('home.shop.products.ebruPainting.title'),
    category: t('home.shop.products.ebruPainting.category'),
    price: 8500,
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?q=80&w=800&auto=format&fit=crop',
    tag: t('home.shop.products.ebruPainting.tag')
  },
  {
    id: 3,
    title: t('home.shop.products.printSet.title'),
    category: t('home.shop.products.printSet.category'),
    price: 1200,
    image: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=800&auto=format&fit=crop',
    tag: ''
  }
])

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price)
}

// Liquid Effect
onMounted(async () => {
  if (canvasRef.value) {
    try {
      const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js')
      const LiquidBackground = module.default
      const app = LiquidBackground(canvasRef.value)
      app.loadImage(heroImage)
      app.liquidPlane.material.metalness = 0.75
      app.liquidPlane.material.roughness = 0.25
      app.liquidPlane.uniforms.displacementScale.value = 5
      app.setRain(false)
    } catch (error) {
      console.error("Liquid background error:", error)
    }
  }
})

const scrollToPhilosophy = () => {
  document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
