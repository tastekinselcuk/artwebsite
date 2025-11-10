<template>
  <div class="min-h-screen bg-muted/20">
    <!-- Admin Header -->
    <header class="bg-card shadow-sm border-b border-border">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-display font-bold text-foreground">{{ t('admin.dashboard.title') }}</h1>
        </div>
        <div class="flex items-center gap-4">
          <router-link
            to="/"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {{ t('admin.dashboard.viewSite') }}
          </router-link>
          <button
            @click="handleLogout"
            class="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:shadow-lg transition-all"
          >
            {{ t('admin.dashboard.logout') }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">{{ t('admin.dashboard.totalEbru') }}</p>
              <p class="text-3xl font-bold text-foreground">{{ galleryStore.ebruArtworks.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Droplet class="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">{{ t('admin.dashboard.totalPhotography') }}</p>
              <p class="text-3xl font-bold text-foreground">{{ galleryStore.photographs.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera class="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground mb-1">{{ t('admin.dashboard.totalArtworks') }}</p>
              <p class="text-3xl font-bold text-foreground">
                {{ galleryStore.ebruArtworks.length + galleryStore.photographs.length }}
              </p>
            </div>
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LayoutGrid class="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Management Sections -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Ebru Management -->
        <router-link
          to="/admin/ebru"
          class="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-lg hover-lift transition-all group"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Droplet class="w-7 h-7 text-primary" />
            </div>
            <ArrowRight class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h2 class="text-2xl font-display font-bold text-foreground mb-2">{{ t('admin.dashboard.ebruGallery') }}</h2>
          <p class="text-muted-foreground">{{ t('admin.dashboard.ebruDesc') }}</p>
        </router-link>

        <!-- Photography Management -->
        <router-link
          to="/admin/photography"
          class="bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-lg hover-lift transition-all group"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera class="w-7 h-7 text-primary" />
            </div>
            <ArrowRight class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h2 class="text-2xl font-display font-bold text-foreground mb-2">{{ t('admin.dashboard.photographyGallery') }}</h2>
          <p class="text-muted-foreground">{{ t('admin.dashboard.photographyDesc') }}</p>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGalleryStore } from '@/stores/gallery'
import { useI18n } from 'vue-i18n'
import { Droplet, Camera, LayoutGrid, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const galleryStore = useGalleryStore()
const { t } = useI18n()

const handleLogout = () => {
  authStore.logout()
  router.push('/admin/login')
}
</script>
