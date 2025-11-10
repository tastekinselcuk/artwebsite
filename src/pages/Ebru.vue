<template>
  <div class="min-h-screen py-20 px-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-16 animate-fade-in">
      <div class="text-center mb-4">
        <h1 class="text-5xl md:text-7xl font-display font-bold mb-6 text-foreground">
          {{ t('ebru.title') }}
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          {{ t('ebru.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style="animation-delay: 0.2s">
        <button
          v-for="artwork in galleryStore.ebruArtworks"
          :key="artwork.id"
          @click="selectedArt = artwork"
          class="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift cursor-pointer"
        >
          <img
            :src="artwork.image"
            :alt="currentLocale === 'en' ? artwork.title.en : artwork.title.tr"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="absolute bottom-0 left-0 right-0 p-6 text-left">
              <h3 class="text-2xl font-display font-semibold text-foreground mb-2">
                {{ currentLocale === 'en' ? artwork.title.en : artwork.title.tr }}
              </h3>
              <p class="text-sm text-muted-foreground">{{ artwork.year }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="selectedArt"
        class="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-fade-in"
        @click="selectedArt = null"
      >
        <button
          @click="selectedArt = null"
          class="absolute top-8 right-8 w-12 h-12 rounded-full bg-card text-foreground hover:bg-muted transition-all duration-300 flex items-center justify-center shadow-lg"
          aria-label="Close"
        >
          <X class="w-6 h-6" />
        </button>

        <div class="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center" @click.stop>
          <div class="rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <img
              :src="selectedArt.image"
              :alt="currentLocale === 'en' ? selectedArt.title.en : selectedArt.title.tr"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="text-left animate-fade-in" style="animation-delay: 0.2s">
            <h2 class="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
              {{ currentLocale === 'en' ? selectedArt.title.en : selectedArt.title.tr }}
            </h2>
            <p class="text-lg text-muted-foreground mb-6">{{ selectedArt.year }}</p>
            <p class="text-xl text-foreground leading-relaxed">
              {{ currentLocale === 'en' ? selectedArt.description.en : selectedArt.description.tr }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useGalleryStore } from '@/stores/gallery'

const { t, locale } = useI18n()
const galleryStore = useGalleryStore()
const selectedArt = ref(null)
const currentLocale = computed(() => locale.value)
</script>
