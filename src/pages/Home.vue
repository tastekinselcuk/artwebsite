<template>
  <div class="min-h-screen">

    <!-- Language Switcher - Sağ Üst Köşe -->
    <!-- <div class="fixed top-6 right-6 z-50">
      <LanguageSwitcher />
    </div> -->

    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${heroImage})` }"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />
      </div>

      <div class="relative z-10 text-center px-6 animate-fade-in-slow">
        <h1 class="text-6xl md:text-8xl font-display font-bold mb-6 text-foreground">
          {{ t('home.hero.title') }}
          <br />
          <span class="text-primary">{{ t('home.hero.titleHighlight') }}</span>
        </h1>
        <p class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light">
          {{ t('home.hero.subtitle') }}
        </p>

        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <router-link
            to="/ebru"
            class="group relative px-8 py-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 justify-center hover-lift"
          >
            <Droplet class="w-5 h-5" />
            <span class="font-medium">{{ t('home.hero.exploreEbru') }}</span>
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </router-link>

          <router-link
            to="/photography"
            class="group relative px-8 py-4 rounded-full bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 justify-center hover-lift"
          >
            <Camera class="w-5 h-5" />
            <span class="font-medium">{{ t('home.hero.viewPhoto') }}</span>
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>
      </div>

      <!-- Floating ambient shapes -->
      <div class="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div class="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-float" style="animation-delay: 2s" />
    </section>

    <!-- Philosophy Section -->
    <section class="py-32 px-6 bg-muted/30">
      <div class="max-w-4xl mx-auto text-center animate-fade-in">
        <h2 class="text-4xl md:text-5xl font-display font-semibold mb-8 text-foreground">
          {{ t('home.philosophy.title') }}
        </h2>
        <p class="text-lg md:text-xl text-muted-foreground leading-relaxed mb-16">
          {{ t('home.philosophy.description') }}
        </p>

        <div class="grid md:grid-cols-2 gap-12 mt-20">
          <div class="p-8 rounded-2xl bg-card hover:shadow-xl transition-all duration-500 hover-lift">
            <Droplet class="w-12 h-12 text-primary mb-4 mx-auto" />
            <h3 class="text-2xl font-display font-semibold mb-4">{{ t('home.philosophy.ebruTitle') }}</h3>
            <p class="text-muted-foreground">
              {{ t('home.philosophy.ebruDesc') }}
            </p>
          </div>

          <div class="p-8 rounded-2xl bg-card hover:shadow-xl transition-all duration-500 hover-lift">
            <Camera class="w-12 h-12 text-secondary mb-4 mx-auto" />
            <h3 class="text-2xl font-display font-semibold mb-4">{{ t('home.philosophy.photoTitle') }}</h3>
            <p class="text-muted-foreground">
              {{ t('home.philosophy.photoDesc') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ArrowRight, Droplet, Camera } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
// import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import heroImage from '@/assets/hero-split.jpg'

const { t } = useI18n()
</script>

