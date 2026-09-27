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
      <!-- KPI cards — gerçek envanter -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div class="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Ebru Galerisi</p>
              <h3 class="text-3xl font-bold text-foreground mt-1">{{ galleryStore.totalEbruCount }}</h3>
            </div>
            <div class="p-2 bg-teal-500/10 rounded-lg">
              <Image class="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <router-link to="/admin/ebru" class="mt-3 inline-block text-xs text-primary hover:underline">
            Galeriyi yönet →
          </router-link>
        </div>

        <div class="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Mağaza Ürünleri</p>
              <h3 class="text-3xl font-bold text-foreground mt-1">
                {{ activeProductCount }}
                <span class="text-base font-medium text-muted-foreground">/ {{ productStore.products.length }}</span>
              </h3>
            </div>
            <div class="p-2 bg-amber-500/10 rounded-lg">
              <ShoppingBag class="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p class="mt-3 text-xs text-muted-foreground">
            Aktif / toplam · Stok kritik: {{ lowStockCount }}
          </p>
        </div>

        <div class="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Ebru Çeşitleri</p>
              <h3 class="text-3xl font-bold text-foreground mt-1">{{ varietiesStore.varieties.length }}</h3>
            </div>
            <div class="p-2 bg-primary/10 rounded-lg">
              <Layers class="w-5 h-5 text-primary" />
            </div>
          </div>
          <router-link
            to="/admin/ebru-varieties"
            class="mt-3 inline-block text-xs text-primary hover:underline"
          >
            Çeşitleri yönet →
          </router-link>
        </div>

        <div class="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Rehber Yazıları</p>
              <h3 class="text-3xl font-bold text-foreground mt-1">{{ guidesStore.guides.length }}</h3>
            </div>
            <div class="p-2 bg-blue-500/10 rounded-lg">
              <BookOpen class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p class="mt-3 text-xs text-muted-foreground">
            Kaynak: {{ guidesStore.source === "supabase" ? "Veritabanı" : "Yerel seed" }}
          </p>
        </div>
      </div>

      <!-- Hızlı işlemler -->
      <div class="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 class="font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap class="w-4 h-4 text-muted-foreground" />
          Hızlı İşlemler
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <router-link
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="flex flex-col items-center gap-2 rounded-xl border border-border/70 bg-muted/20 px-3 py-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <component :is="action.icon" class="w-5 h-5 text-primary" />
            <span class="text-xs font-medium text-foreground">{{ action.label }}</span>
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Düşük stok / ürün özeti -->
        <div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div class="p-4 border-b border-border flex justify-between items-center">
            <h3 class="font-bold text-foreground flex items-center gap-2">
              <AlertTriangle class="w-4 h-4 text-amber-600" />
              Stok Uyarısı
            </h3>
            <router-link to="/admin/shop" class="text-xs text-primary hover:underline">Mağaza</router-link>
          </div>
          <ul v-if="lowStockProducts.length" class="divide-y divide-border">
            <li
              v-for="p in lowStockProducts"
              :key="p.id"
              class="px-4 py-3 flex items-center justify-between gap-3 text-sm"
            >
              <span class="font-medium text-foreground truncate">{{ p.title?.tr || p.title?.en }}</span>
              <span class="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Stok: {{ p.stock }}
              </span>
            </li>
          </ul>
          <p v-else class="p-6 text-sm text-muted-foreground text-center">
            Kritik stokta ürün yok (≤ 3).
          </p>
        </div>

        <!-- Son rehberler -->
        <div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div class="p-4 border-b border-border flex justify-between items-center">
            <h3 class="font-bold text-foreground flex items-center gap-2">
              <BookOpen class="w-4 h-4 text-muted-foreground" />
              Rehberler
            </h3>
            <router-link to="/admin/guides" class="text-xs text-primary hover:underline">
              Yönet / yaz →
            </router-link>
          </div>
          <ul v-if="guidesStore.guides.length" class="divide-y divide-border">
            <li
              v-for="g in guidesStore.guides.slice(0, 6)"
              :key="g.slug"
              class="px-4 py-3 flex items-center justify-between gap-3 text-sm"
            >
              <div class="min-w-0">
                <p class="font-medium text-foreground truncate">{{ g.tr?.title || g.slug }}</p>
                <p class="text-xs text-muted-foreground">/rehber/{{ g.slug }}</p>
              </div>
              <span
                class="shrink-0 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border"
                :class="g.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-muted text-muted-foreground'"
              >
                {{ g.isActive ? "Yayında" : "Taslak" }}
              </span>
            </li>
          </ul>
          <p v-else class="p-6 text-sm text-muted-foreground text-center">Henüz rehber yok.</p>
        </div>
      </div>

      <!-- Galeri listesi (özet) -->
      <div class="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div class="p-4 border-b border-border flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 class="font-bold text-foreground flex items-center gap-2">
            <List class="w-4 h-4 text-muted-foreground" />
            Galeri Eserleri
          </h3>
          <div class="relative">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Başlık ara..."
              class="pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th class="px-6 py-3">Eser</th>
                <th class="px-6 py-3">Yıl</th>
                <th class="px-6 py-3 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="item in paginatedArtworks"
                :key="item.id"
                class="hover:bg-muted/30 transition-colors"
              >
                <td class="px-6 py-3 font-medium text-foreground">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                      <img :src="item.image || 'https://placehold.co/100'" class="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <div class="font-semibold">{{ item.title?.tr }}</div>
                      <div class="text-xs text-muted-foreground">{{ item.title?.en }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-3 text-muted-foreground">{{ item.year }}</td>
                <td class="px-6 py-3 text-center">
                  <router-link
                    to="/admin/ebru"
                    class="text-xs font-medium text-primary hover:underline"
                  >
                    Düzenle
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredArtworks.length === 0" class="p-8 text-center text-muted-foreground">
            Eser bulunamadı.
          </div>
        </div>

        <div class="p-3 border-t border-border flex justify-center">
          <button
            v-if="!showAll && filteredArtworks.length > 5"
            @click="showAll = true"
            class="text-sm text-primary hover:underline"
          >
            Tümünü göster ({{ filteredArtworks.length }})
          </button>
          <button
            v-else-if="showAll"
            @click="showAll = false"
            class="text-sm text-muted-foreground hover:underline"
          >
            Daralt
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useGalleryStore } from "@/stores/gallery";
import { useProductStore } from "@/stores/products";
import { useEbruVarietiesStore } from "@/stores/ebruVarieties";
import { useGuidesStore } from "@/stores/guides";
import {
  LayoutDashboard,
  ExternalLink,
  Image,
  ShoppingBag,
  Layers,
  BookOpen,
  Zap,
  AlertTriangle,
  List,
  Search,
  Plus,
  Settings,
  Palette,
} from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const galleryStore = useGalleryStore();
const productStore = useProductStore();
const varietiesStore = useEbruVarietiesStore();
const guidesStore = useGuidesStore();

const searchQuery = ref("");
const showAll = ref(false);

const quickActions = [
  { to: "/admin/ebru", label: "Ebru Ekle", icon: Palette },
  { to: "/admin/ebru-varieties", label: "Çeşitler", icon: Layers },
  { to: "/admin/shop", label: "Ürün Ekle", icon: ShoppingBag },
  { to: "/admin/guides", label: "Rehber Yaz", icon: BookOpen },
  { to: "/admin/settings", label: "Ayarlar", icon: Settings },
  { to: "/rehber", label: "Rehberi Aç", icon: ExternalLink },
];

const activeProductCount = computed(
  () => productStore.products.filter((p) => p.isActive).length,
);

const lowStockProducts = computed(() =>
  productStore.products
    .filter((p) => p.isActive && Number(p.stock) <= 3)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6),
);

const lowStockCount = computed(() => lowStockProducts.value.length);

const filteredArtworks = computed(() => {
  let list = [...galleryStore.ebruArtworks];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (item) =>
        item.title?.tr?.toLowerCase().includes(q) || item.title?.en?.toLowerCase().includes(q),
    );
  }
  return list;
});

const paginatedArtworks = computed(() =>
  showAll.value ? filteredArtworks.value : filteredArtworks.value.slice(0, 5),
);

const handleLogout = () => {
  authStore.logout();
  router.push("/admin/login");
};

onMounted(async () => {
  await Promise.all([
    galleryStore.fetchEbruFromSupabase(),
    productStore.fetchProductsFromSupabase(),
    varietiesStore.fetchVarieties({ includeInactive: true }),
    guidesStore.fetchGuides({ includeInactive: true }),
  ]);
});
</script>
