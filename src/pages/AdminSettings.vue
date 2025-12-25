<template>
  <div class="min-h-screen bg-muted/20 pb-20">
    <header class="bg-card shadow-sm border-b border-border">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-foreground flex items-center gap-3">
          <Settings class="w-6 h-6 text-gray-600" />
          Site Ayarları
        </h1>
        <router-link to="/admin/dashboard" class="text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Panele Dön
        </router-link>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8">
      <div class="bg-card rounded-xl p-12 text-center border border-border shadow-sm">
        <div class="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings class="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 class="text-2xl font-bold mb-2">Ayarlar Modülü Hazırlanıyor</h2>
        <p class="text-muted-foreground max-w-md mx-auto">
          Buradan site logosu, iletişim bilgileri, SEO ayarları ve sosyal medya linklerini yönetebileceksiniz.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Settings } from 'lucide-vue-next'
</script>
