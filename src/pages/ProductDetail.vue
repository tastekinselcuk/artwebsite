<template>
  <div class="min-h-screen bg-background pt-24 pb-16 px-6">
    <div class="max-w-[1200px] mx-auto">
      
      <router-link to="/shop" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-medium uppercase tracking-wide">
        <ArrowLeft class="w-4 h-4" />
        {{ t('checkout.backToShop') || 'Mağazaya Dön' }}
      </router-link>

      <div v-if="loading" class="grid md:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
        <div class="h-[400px] md:h-[500px] lg:h-[500px] bg-muted rounded-3xl w-full"></div>
        <div class="space-y-6 pt-4">
          <div class="h-6 bg-muted w-1/4 rounded"></div>
          <div class="h-10 bg-muted w-3/4 rounded"></div>
          <div class="h-8 bg-muted w-1/3 rounded"></div>
        </div>
      </div>

      <div v-else-if="product" class="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
        
        <div class="relative bg-muted/10 rounded-3xl p-6 lg:p-10 border border-border flex items-center justify-center group h-[400px] md:h-[500px] lg:h-[500px] w-full">
          <img 
            :src="product.image || 'https://placehold.co/800x1000'" 
            :alt="getProductTitle(product)" 
            class="max-w-full max-h-full object-contain rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-105" 
          />
          <div v-if="product.tag && getProductTag(product)" class="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
            {{ getProductTag(product) }}
          </div>
        </div>

        <div class="flex flex-col h-full py-4">
          <p class="text-xs font-bold text-primary uppercase tracking-widest mb-3">
            {{ getCategoryLabel(product.category) }}
          </p>
          
          <h1 class="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
            {{ getProductTitle(product) }}
          </h1>

          <div class="flex items-center gap-4 mb-6 border-b border-border pb-6">
            <p class="text-2xl font-bold text-foreground">{{ formatPrice(product.price) }}</p>
            <div class="h-6 w-px bg-border"></div>
          </div>

          <div class="prose prose-sm md:prose-base text-muted-foreground leading-relaxed mb-10">
            <p>{{ getProductDescription(product) }}</p>
          </div>

          <div class="mt-auto">
            <button 
              @click="handleAddToCart"
              :disabled="product.stock === 0"
              class="w-full py-3.5 px-6 rounded-xl font-bold text-base flex justify-center items-center gap-2 transition-all duration-300 shadow-md"
              :class="[
                product.stock > 0 
                  ? added ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              ]"
            >
              <component :is="added ? Check : ShoppingBag" class="w-5 h-5" />
              {{ added ? t("shop.addedToCart") : product.stock > 0 ? t("shop.addToCart") : t("shop.outOfStock") }}
            </button>
            
            <p class="text-xs mt-3 text-center" :class="product.stock > 0 && product.stock <= 5 ? 'text-orange-500 font-medium' : 'text-muted-foreground'">
              <span v-if="product.stock > 0">Sınırlı stok: {{ product.stock }} adet mevcut</span>
              <span v-else>Bu ürün geçici olarak temin edilemiyor.</span>
            </p>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-24 bg-card rounded-3xl border border-border">
        <h2 class="text-2xl font-bold text-foreground mb-3">Ürün bulunamadı</h2>
        <p class="text-muted-foreground mb-6">Aradığınız ürün yayından kaldırılmış veya bağlantı hatalı olabilir.</p>
        <router-link to="/shop" class="text-primary font-medium hover:underline inline-flex items-center gap-2">
          <ArrowLeft class="w-4 h-4" /> Mağazaya geri dön
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { ArrowLeft, Star, ShoppingBag, Check } from 'lucide-vue-next'

const route = useRoute()
const { t, locale, te } = useI18n()
const currentLocale = computed(() => locale.value)
const productStore = useProductStore()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const added = ref(false)

const formatPrice = (price) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);

// Dil Fonksiyonları
const getProductTitle = (p) => {
  if (typeof p.title === 'string') return te(p.title) ? t(p.title) : p.title;
  return p.title[currentLocale.value] || p.title.tr || 'İsimsiz';
};
const getProductDescription = (p) => {
  if (typeof p.description === 'string') return p.description;
  return p.description?.[currentLocale.value] || p.description?.tr || '';
};
const getProductTag = (p) => {
  if (!p.tag) return null;
  if (typeof p.tag === 'string') return te(p.tag) ? t(p.tag) : p.tag;
  return p.tag[currentLocale.value] || p.tag.tr || null;
};
const getCategoryLabel = (cat) => te(`shop.filters.${cat}`) ? t(`shop.filters.${cat}`) : cat;

// Veriyi Çek
onMounted(async () => {
  loading.value = true;
  if (productStore.products.length === 0) {
    await productStore.fetchProductsFromSupabase();
  }
  product.value = productStore.getProductById(Number(route.params.id));
  loading.value = false;
});

// Sepete Ekle ve Çekmeceyi Aç
const handleAddToCart = async () => {
  await cartStore.addItem(product.value);
  added.value = true;
  setTimeout(() => added.value = false, 1500);
  
  // (Eğer navbarında sepet yoksa alttaki openCart iptal edilebilir, 
  // ama navbar'ındaki toggleCart'a benzer şekilde sepeti açmak istiyorsan durabilir)
  cartStore.isOpen = true; 
};
</script>