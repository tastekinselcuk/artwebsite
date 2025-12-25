<template>
  <div class="min-h-screen bg-muted/20 pb-20">
    <header class="bg-card shadow-sm border-b border-border sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-primary/10 rounded-lg">
            <LayoutDashboard class="w-6 h-6 text-primary" />
          </div>
          <h1 class="text-2xl font-display font-bold text-foreground">Yönetim Paneli</h1>
        </div>
        <div class="flex items-center gap-4">
          <router-link
            to="/"
            target="_blank"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <ExternalLink class="w-4 h-4" />
            Siteyi Görüntüle
          </router-link>
          <div class="h-6 w-px bg-border"></div>
          <button
            @click="handleLogout"
            class="text-sm font-medium text-destructive hover:bg-destructive/10 px-4 py-2 rounded-md transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Toplam Etkileşim</p>
              <h3 class="text-3xl font-bold text-foreground mt-2">{{ galleryStore.totalViews }}</h3>
            </div>
            <div class="p-2 bg-blue-500/10 rounded-lg">
              <Eye class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs text-muted-foreground">
            <TrendingUp class="w-4 h-4 mr-1 text-green-600" />
            <span>Portfolyo görüntülenmesi</span>
          </div>
        </div>

        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Portfolyo Eserleri</p>
              <h3 class="text-3xl font-bold text-foreground mt-2">
                {{ galleryStore.totalEbruCount + galleryStore.totalPhotoCount }}
              </h3>
            </div>
            <div class="p-2 bg-primary/10 rounded-lg">
              <Image class="w-5 h-5 text-primary" />
            </div>
          </div>
          <div class="mt-4 text-xs text-muted-foreground">
            {{ galleryStore.totalEbruCount }} Ebru, {{ galleryStore.totalPhotoCount }} Fotoğraf
          </div>
        </div>

        <div class="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Toplam Satış</p>
              <h3 class="text-3xl font-bold text-foreground mt-2">₺0,00</h3>
            </div>
            <div class="p-2 bg-emerald-500/10 rounded-lg">
              <ShoppingBag class="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div class="mt-4 text-xs text-muted-foreground">
            Mağaza modülü yakında aktif olacak.
          </div>
        </div>

        <div class="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col justify-center gap-3">
          <div class="flex gap-2">
             <router-link to="/admin/ebru" class="flex-1 flex items-center justify-center py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition text-xs font-medium">
              <Plus class="w-3 h-3 mr-1" /> Ebru
            </router-link>
             <router-link to="/admin/photography" class="flex-1 flex items-center justify-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-xs font-medium">
              <Plus class="w-3 h-3 mr-1" /> Foto
            </router-link>
          </div>
          <router-link to="/admin/settings" class="flex items-center justify-center w-full py-2 bg-muted text-foreground hover:bg-muted/80 rounded-lg transition text-sm font-medium">
            <Settings class="w-4 h-4 mr-2" />
            Site Ayarları
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div class="p-6 border-b border-border flex justify-between items-center">
            <h3 class="font-bold text-lg text-foreground flex items-center gap-2">
              <BarChart3 class="w-5 h-5 text-muted-foreground" />
              Popülarite Analizi
            </h3>
            <span class="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">Top 5</span>
          </div>

          <div class="p-6 space-y-6">
            <div v-for="item in top5Artworks" :key="item.id + item.type" class="space-y-2">
              <div class="flex justify-between text-sm">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full" :class="item.type === 'ebru' ? 'bg-teal-500' : 'bg-indigo-500'"></span>
                  <span class="font-medium text-foreground truncate max-w-[200px]">{{ item.title.tr }}</span>
                </div>
                <span class="text-muted-foreground">{{ item.views }} görüntülenme</span>
              </div>
              <div class="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  :class="item.type === 'ebru' ? 'bg-teal-500' : 'bg-indigo-500'"
                  :style="{ width: calculatePercentage(item.views) + '%' }"
                ></div>
              </div>
            </div>
             <div v-if="top5Artworks.length === 0" class="text-center text-muted-foreground py-4">
              Henüz veri yok.
            </div>
          </div>
        </div>

        <div class="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col justify-center items-center text-center">
            <div class="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center relative mb-4">
               <div class="absolute inset-0 rounded-full border-8 border-primary border-t-transparent rotate-45"></div>
               <span class="text-2xl font-bold">{{ galleryStore.totalEbruCount + galleryStore.totalPhotoCount }}</span>
            </div>

            <h3 class="font-bold text-foreground">Portfolyo Dağılımı</h3>

            <div class="mt-6 w-full space-y-2">
                <div class="flex justify-between items-center p-2 rounded bg-muted/50">
                    <span class="text-sm font-medium">Ebru Sanatı</span>
                    <span class="text-sm font-bold text-primary">{{ galleryStore.totalEbruCount }}</span>
                </div>

                <div class="flex justify-between items-center p-2 rounded bg-muted/50">
                    <span class="text-sm font-medium">Fotoğrafçılık</span>
                    <span class="text-sm font-bold text-indigo-500">{{ galleryStore.totalPhotoCount }}</span>
                </div>
            </div>
        </div>
      </div>

      <div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden min-h-[400px]">
        <div class="p-4 border-b border-border flex flex-col md:flex-row justify-between md:items-center gap-4 bg-muted/10">
          <h3 class="font-bold text-lg text-foreground flex items-center gap-2">
            <List class="w-5 h-5 text-muted-foreground" />
            Eser Listesi
          </h3>

          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Başlık ara..."
                class="pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
              >
            </div>
            <div class="relative">
              <Filter class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select
                v-model="filterType"
                class="pl-9 pr-8 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="ebru">Sadece Ebru</option>
                <option value="photo">Sadece Fotoğraf</option>
              </select>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th class="px-6 py-3">Eser</th>
                <th class="px-6 py-3">Kategori</th>
                <th class="px-6 py-3">Tarih</th>
                <th class="px-6 py-3 text-right">Görüntülenme</th>
                <th class="px-6 py-3 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="item in paginatedArtworks"
                :key="item.id + item.type"
                class="hover:bg-muted/30 transition-colors group relative"
              >
                <td class="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                  <div class="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                    <img :src="item.image || 'https://placehold.co/100'" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div class="font-semibold">{{ item.title.tr }}</div>
                    <div class="text-xs text-muted-foreground">{{ item.title.en }}</div>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium border"
                    :class="item.type === 'ebru' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'"
                  >
                    {{ item.type === 'ebru' ? 'Ebru' : 'Fotoğraf' }}
                  </span>
                </td>

                <td class="px-6 py-4 text-muted-foreground">
                  {{ item.year }}
                </td>

                <td class="px-6 py-4 text-right font-mono">
                  {{ item.views }}
                </td>

                <td class="px-6 py-4 text-center relative">
                  <button
                    @click.stop="toggleMenu(item.id + item.type)"
                    class="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <MoreVertical class="w-4 h-4" />
                  </button>

                  <div
                    v-if="activeMenu === (item.id + item.type)"
                    class="absolute right-10 top-2 z-50 w-40 bg-card rounded-lg shadow-lg border border-border py-1 text-left animate-in fade-in zoom-in-95 duration-200"
                    @click.stop
                  >
                    <button
                      @click="goToEdit(item)"
                      class="w-full px-4 py-2 text-sm text-foreground hover:bg-muted text-left flex items-center gap-2"
                    >
                      <Edit2 class="w-3 h-3" /> Düzenle
                    </button>
                    <button
                      @click="deleteItem(item)"
                      class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2"
                    >
                      <Trash2 class="w-3 h-3" /> Sil
                    </button>
                  </div>
                  <div v-if="activeMenu === (item.id + item.type)" class="fixed inset-0 z-40" @click="activeMenu = null"></div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredArtworks.length === 0" class="p-8 text-center text-muted-foreground">
             Aradığınız kriterlere uygun eser bulunamadı.
          </div>
        </div>

        <div class="p-4 border-t border-border flex justify-center bg-muted/5">
            <button
              v-if="!showAll && filteredArtworks.length > 5"
              @click="showAll = true"
              class="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              Tümünü Göster ({{ filteredArtworks.length }}) <ChevronDown class="w-4 h-4" />
            </button>
             <button
              v-if="showAll"
              @click="showAll = false"
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Daralt <ChevronUp class="w-4 h-4" />
            </button>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGalleryStore } from '@/stores/gallery'
import {
  LayoutDashboard, ExternalLink, Eye, TrendingUp,
  Image, ShoppingBag, Plus, Settings, BarChart3,
  List, MoreVertical, Search, Filter, Edit2, Trash2,
  ChevronDown, ChevronUp
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const galleryStore = useGalleryStore()

// State
const searchQuery = ref('')
const filterType = ref('all') // 'all', 'ebru', 'photo'
const showAll = ref(false)
const activeMenu = ref(null)

// Çıkış
const handleLogout = () => {
  authStore.logout()
  router.push('/admin/login')
}

// Tüm Verileri Çek
onMounted(async () => {
  await galleryStore.fetchEbruFromSupabase()
  await galleryStore.fetchPhotosFromSupabase()
})

// 1. Birleştirilmiş ve Filtrelenmiş Liste
const filteredArtworks = computed(() => {
  // Ebru ve Fotoğrafları birleştir, tip etiketi ekle
  const ebrus = galleryStore.ebruArtworks.map(i => ({ ...i, type: 'ebru' }))
  const photos = galleryStore.photographs.map(i => ({ ...i, type: 'photo' }))
  let combined = [...ebrus, ...photos]

  // A) Kategori Filtresi
  if (filterType.value !== 'all') {
    combined = combined.filter(item => item.type === filterType.value)
  }

  // B) Arama Filtresi (Başlık TR veya EN)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    combined = combined.filter(item =>
      item.title.tr.toLowerCase().includes(query) ||
      item.title.en.toLowerCase().includes(query)
    )
  }

  // C) Sıralama (Popülerlik - Views)
  return combined.sort((a, b) => (b.views || 0) - (a.views || 0))
})

// 2. Sayfalama
const paginatedArtworks = computed(() => {
  if (showAll.value) return filteredArtworks.value
  return filteredArtworks.value.slice(0, 5) // İlk 5 tanesi
})

// 3. Grafik İçin Top 5
const top5Artworks = computed(() => {
  return filteredArtworks.value.slice(0, 5)
})

// Grafik Yüzdesi
const calculatePercentage = (views) => {
  if (filteredArtworks.value.length === 0) return 0
  const maxViews = filteredArtworks.value[0].views || 1
  return Math.round((views / maxViews) * 100)
}

// --- AKSİYONLAR ---

const toggleMenu = (id) => {
  activeMenu.value = activeMenu.value === id ? null : id
}

const goToEdit = (item) => {
  // İlgili yönetim sayfasına yönlendir
  if (item.type === 'ebru') {
    router.push('/admin/ebru')
  } else {
    router.push('/admin/photography')
  }
}

const deleteItem = async (item) => {
  await galleryStore.deleteArtwork(item.id, item.type, item.image)
  activeMenu.value = null
}
</script>
