<template>
  <div class="min-h-screen py-20 px-6 bg-background">
    <div class="max-w-7xl mx-auto mb-20 text-center space-y-4 animate-fade-in">
      <h1 class="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight">
        {{ t('ebru.title') }}
      </h1>
      <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
        {{ t('ebru.subtitle') }}
      </p>
      <div class="w-24 h-1 bg-primary/20 mx-auto rounded-full mt-6"></div>
    </div>

    <div class="max-w-7xl mx-auto">

      <div v-if="galleryStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="aspect-square rounded-2xl bg-muted/20 animate-pulse border border-border"></div>
      </div>

      <div v-else-if="galleryStore.error" class="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/10">
        <p class="text-xl text-destructive font-medium mb-2">Veriler yüklenirken bir sorun oluştu.</p>
        <p class="text-sm text-muted-foreground">{{ galleryStore.error }}</p>
      </div>

      <div
        v-else-if="galleryStore.ebruArtworks.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <button
          v-for="artwork in galleryStore.ebruArtworks"
          :key="artwork.id"
          @click="openArtwork(artwork)"
          class="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm hover:shadow-2xl transition-all duration-500 cursor-zoom-in border border-border/50 animate-fade-in-up"
        >
          <img
            :src="artwork.image || 'https://placehold.co/600x400?text=No+Image'"
            :alt="currentLocale === 'en' ? artwork.title.en : artwork.title.tr"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div
            class="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
          >
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
              <Maximize2 class="w-5 h-5" />
            </div>

            <div class="text-left text-white drop-shadow-md">
              <p class="text-xs font-mono mb-2 text-white/80 uppercase tracking-widest">{{ artwork.year }}</p>
              <h3 class="text-2xl font-display font-semibold leading-tight">
                {{ currentLocale === 'en' ? artwork.title.en : artwork.title.tr }}
              </h3>
            </div>
          </div>
        </button>
      </div>

      <div v-else class="text-center py-32 opacity-60">
        <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette class="w-8 h-8 text-muted-foreground" />
        </div>
        <p class="text-xl font-display">Henüz sergilenecek eser bulunmuyor.</p>
        <p class="text-sm text-muted-foreground mt-2">Admin panelinden yeni eser ekleyebilirsiniz.</p>
      </div>
    </div>

<Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selectedArt"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
        >
          <div
            class="absolute inset-0 bg-background/90 backdrop-blur-xl transition-opacity"
            @click="selectedArt = null"
          ></div>

          <Transition
            appear
            enter-active-class="transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)"
            enter-from-class="opacity-0 scale-90 translate-y-8"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              class="relative w-full max-w-6xl bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/50 grid md:grid-cols-2 max-h-[90vh] transform origin-center"
              @click.stop
            >

              <button
                @click="selectedArt = null"
                class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              >
                <X class="w-5 h-5" />
              </button>

              <div class="relative bg-muted/30 flex items-center justify-center p-4 md:p-8 h-[50vh] md:h-auto">
                <img
                  :src="selectedArt.image || 'https://placehold.co/600x400?text=No+Image'"
                  :alt="currentLocale === 'en' ? selectedArt.title.en : selectedArt.title.tr"
                  class="max-w-full max-h-full object-contain shadow-lg rounded-lg animate-fade-in"
                />
              </div>

              <div class="p-8 md:p-12 flex flex-col justify-center overflow-y-auto bg-card">
                <div class="space-y-6">
                  <div>
                    <span class="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                      Ebru Collection
                    </span>
                    <h2 class="text-3xl md:text-5xl font-display font-bold text-foreground leading-tight">
                      {{ currentLocale === 'en' ? selectedArt.title.en : selectedArt.title.tr }}
                    </h2>
                  </div>

                  <div class="flex items-center gap-6 text-sm text-muted-foreground border-y border-border py-4">
                    <div class="flex items-center gap-2">
                      <Calendar class="w-4 h-4" />
                      <span>{{ selectedArt.year }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Eye class="w-4 h-4" />
                      <span>{{ selectedArt.views }} Görüntülenme</span>
                    </div>
                  </div>

                  <div class="prose prose-lg text-muted-foreground">
                    <p class="leading-relaxed">
                      {{
                        currentLocale === 'en'
                          ? selectedArt.description.en
                          : selectedArt.description.tr
                      }}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, Eye, Maximize2, Palette, Calendar } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useGalleryStore } from '@/stores/gallery'

const { t, locale } = useI18n()
const galleryStore = useGalleryStore()

const selectedArt = ref(null)
const currentLocale = computed(() => locale.value)

// Sayfa açılınca Supabase'den ebru verilerini çek
onMounted(() => {
  galleryStore.fetchEbruFromSupabase()
})

// Lightbox aç ve views artır
const openArtwork = async (artwork) => {
  selectedArt.value = artwork
  await galleryStore.incrementEbruViews(artwork.id)
}
</script>

<style scoped>
/* Basit ve Garantili Animasyon */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
