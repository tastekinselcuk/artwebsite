<template>
  <div class="min-h-screen py-20 px-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-20 animate-fade-in">
        <h1 class="text-5xl md:text-7xl font-display font-bold mb-6 text-foreground">
          {{ t('about.title') }}
        </h1>
      </div>

      <!-- Content -->
      <div class="grid md:grid-cols-2 gap-12 items-center animate-fade-in" style="animation-delay: 0.2s">
        <!-- Portrait Placeholder -->
        <div class="relative">
          <div class="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-xl relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-32 h-32 rounded-full bg-primary/30 animate-float" />
            </div>
          </div>
        </div>

        <!-- Bio -->
        <div class="space-y-6">
          <p class="text-xl leading-relaxed text-foreground">
            {{ t('about.intro') }}
          </p>

          <p class="text-lg leading-relaxed text-muted-foreground">
            {{ t('about.para1') }}
          </p>

          <p class="text-lg leading-relaxed text-muted-foreground">
            {{ t('about.para2') }}
          </p>

          <p class="text-lg leading-relaxed text-muted-foreground">
            {{ t('about.para3') }}
          </p>

          <!-- Contact -->
          <div class="pt-8 border-t border-border">
            <h3 class="text-2xl font-display font-semibold mb-6">{{ t('about.contact') }}</h3>
            <div class="flex flex-col gap-4">
              <a
                href="mailto:artist@example.com"
                class="flex items-center gap-3 text-foreground hover:text-primary transition-colors duration-300"
              >
                <Mail class="w-5 h-5" />
                <span>artist@example.com</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-foreground hover:text-primary transition-colors duration-300"
              >
                <Instagram class="w-5 h-5" />
                <span>@artistportfolio</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Philosophy Statement -->
      <div class="mt-32 p-12 rounded-2xl bg-muted/30 animate-fade-in" style="animation-delay: 0.4s">
        <blockquote class="text-2xl md:text-3xl font-display italic text-center text-foreground leading-relaxed">
          "{{ t('about.quote') }}"
        </blockquote>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Mail, Instagram } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
