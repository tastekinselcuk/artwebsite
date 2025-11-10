<template>
  <div class="min-h-screen py-20 px-6 bg-secondary/5">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-16 animate-fade-in">
      <div class="text-center mb-4">
        <h1 class="text-5xl md:text-7xl font-display font-bold mb-6 text-foreground">
          {{ t('photography.title') }}
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          {{ t('photography.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style="animation-delay: 0.2s">
        <button
          v-for="photo in galleryStore.photographs"
          :key="photo.id"
          @click="selectedPhoto = photo"
          class="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift cursor-pointer bg-secondary/10"
        >
          <img
            :src="photo.image"
            :alt="currentLocale === 'en' ? photo.title.en : photo.title.tr"
            class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="absolute bottom-0 left-0 right-0 p-6 text-left">
              <h3 class="text-2xl font-display font-semibold text-secondary-foreground mb-2">
                {{ currentLocale === 'en' ? photo.title.en : photo.title.tr }}
              </h3>
              <p class="text-sm text-secondary-foreground/80">{{ photo.year }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="selectedPhoto"
        class="fixed inset-0 bg-secondary/98 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-fade-in"
        @click="selectedPhoto = null"
      >
        <button
          @click="selectedPhoto = null"
          class="absolute top-8 right-8 w-12 h-12 rounded-full bg-card text-foreground hover:bg-muted transition-all duration-300 flex items-center justify-center shadow-lg"
          aria-label="Close"
        >
          <X class="w-6 h-6" />
        </button>

        <div class="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center" @click.stop>
          <div class="rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <img
              :src="selectedPhoto.image"
              :alt="currentLocale === 'en' ? selectedPhoto.title.en : selectedPhoto.title.tr"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="text-left animate-fade-in" style="animation-delay: 0.2s">
            <h2 class="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground">
              {{ currentLocale === 'en' ? selectedPhoto.title.en : selectedPhoto.title.tr }}
            </h2>
            <p class="text-lg text-muted-foreground mb-6">{{ selectedPhoto.year }}</p>
            <p class="text-xl text-foreground leading-relaxed">
              {{ currentLocale === 'en' ? selectedPhoto.description.en : selectedPhoto.description.tr }}
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
const selectedPhoto = ref(null)
const currentLocale = computed(() => locale.value)
</script>
