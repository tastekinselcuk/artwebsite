<template>
  <div class="min-h-screen bg-background pt-12 pb-20">
    <div class="max-w-[1400px] mx-auto px-6">
      
      <div class="flex items-end justify-between mb-8 border-b border-border pb-4">
        <div>
          <p class="text-sm text-muted-foreground mt-2">
            {{ productStore.filteredProducts.length }}
            {{
              productStore.filteredProducts.length === 1
                ? t("shop.resultSingular")
                : t("shop.resultPlural")
            }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        
        <aside class="lg:col-span-1">
          <div class="sticky top-28 space-y-6 filter-sidebar pr-2 pb-6">
            
            <div class="relative">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                v-model="productStore.searchQuery"
                @input="updateSearch"
                type="text"
                :placeholder="t('shop.searchPlaceholder')"
                class="w-full pl-11 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>

            <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 class="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                {{ t("shop.filters.title") }}
              </h3>
              <div class="space-y-1">
                <button
                  v-for="category in productStore.categories"
                  :key="category.id"
                  @click="productStore.setCategory(category.id)"
                  :class="[
                    'block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    productStore.selectedCategory === category.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  ]"
                >
                  {{ t(`shop.filters.${category.id}`) }}
                </button>
              </div>
            </div>

            <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 class="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                {{ t("shop.filterPrice") }}
              </h3>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>{{ t("shop.from") }}</span>
                    <span class="font-medium text-foreground">₺{{ productStore.priceRange[0] }}</span>
                  </div>
                  <input
                    v-model.number="priceMin"
                    @input="updatePriceRange"
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    class="w-full"
                  />
                </div>
                <div>
                  <div class="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>{{ t("shop.to") }}</span>
                    <span class="font-medium text-foreground">₺{{ productStore.priceRange[1] }}</span>
                  </div>
                  <input
                    v-model.number="priceMax"
                    @input="updatePriceRange"
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <div class="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 class="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                {{ t("shop.sort.title") }}
              </h3>
              <div class="space-y-1">
                <button
                  v-for="sort in productStore.sortOptions"
                  :key="sort.id"
                  @click="productStore.setSort(sort.id)"
                  :class="[
                    'block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    productStore.selectedSort === sort.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  ]"
                >
                  {{ t(`shop.sort.${sort.id}`) }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main class="lg:col-span-3 xl:col-span-4">
          <div v-if="productStore.filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <div
              v-for="product in productStore.filteredProducts"
              :key="product.id"
              class="group relative bg-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 border border-border flex flex-col"
            >
              <div class="relative aspect-[4/5] overflow-hidden bg-muted/30">
                <img
                  :src="product.image || 'https://placehold.co/600x800?text=No+Image '"
                  :alt="getProductTitle(product)"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div
                  v-if="product.stock === 0"
                  class="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm"
                >
                  {{ t("shop.outOfStock") }}
                </div>
                <div
                  v-else-if="product.tag && getProductTag(product)"
                  class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm"
                >
                  {{ getProductTag(product) }}
                </div>

                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <router-link
                    :to="`/shop/product/${product.id}`"
                    class="w-10 h-10 bg-white text-foreground rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white shadow-lg hover:scale-110"
                    :title="t('shop.viewDetails')"
                  >
                    <Eye class="w-4 h-4" />
                  </router-link>
                  <button
                    @click="addToCart(product)"
                    :disabled="product.stock === 0"
                    class="w-10 h-10 rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:scale-110"
                    :class="[
                      product.stock > 0
                        ? addedProductId === product.id
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-foreground hover:bg-primary hover:text-white'
                        : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    ]"
                    :title="t('shop.addToCart')"
                  >
                    <component :is="addedProductId === product.id ? Check : ShoppingBag" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="p-4 flex-grow flex flex-col">
                <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 truncate">
                  {{ getCategoryLabel(product.category) }}
                </p>
                <h3 class="text-base font-display font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {{ getProductTitle(product) }}
                </h3>

                <div class="mt-auto flex items-center justify-between pt-2">
                  <p class="text-lg font-bold text-foreground">
                    {{ formatPrice(product.price) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-20 bg-card rounded-2xl border border-border">
            <div class="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag class="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 class="text-xl font-display font-bold text-foreground mb-2">
              {{ t("shop.noResults") }}
            </h3>
            <p class="text-sm text-muted-foreground mb-6">
              {{ t("shop.tryAdjustingFilters") }}
            </p>
            <button
              @click="resetFilters"
              class="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              {{ t("shop.resetFilters") }}
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useProductStore } from "@/stores/products";
import { useCartStore } from "@/stores/cart";
import { Eye, ShoppingBag, Search, Check } from "lucide-vue-next";

const { t, locale, te } = useI18n();
const currentLocale = computed(() => locale.value);

const productStore = useProductStore();
const cartStore = useCartStore();

const priceMin = ref(productStore.priceRange[0] || 0);
const priceMax = ref(productStore.priceRange[1] || 10000);
const addedProductId = ref(null);

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
};

const getProductTitle = (product) => {
  if (!product || !product.title) return 'İsimsiz Ürün';
  if (typeof product.title === 'string') {
    return te(product.title) ? t(product.title) : product.title;
  }
  return product.title[currentLocale.value] || product.title.tr || 'İsimsiz Ürün';
};

const getProductTag = (product) => {
  if (!product || !product.tag) return null;
  if (typeof product.tag === 'string') {
    return te(product.tag) ? t(product.tag) : product.tag;
  }
  return product.tag[currentLocale.value] || product.tag.tr || null;
};

const getCategoryLabel = (category) => {
  const key = `shop.filters.${category || 'all'}`;
  return te(key) ? t(key) : category;
};

const updateSearch = (event) => {
  productStore.setSearchQuery(event.target.value);
};

const updatePriceRange = () => {
  if (priceMin.value <= priceMax.value) {
    productStore.setPriceRange([priceMin.value, priceMax.value]);
  }
};

const addToCart = async (product) => {
  await cartStore.addItem(product);
  addedProductId.value = product.id;
  setTimeout(() => { addedProductId.value = null; }, 1500);
};

const resetFilters = () => {
  productStore.setCategory("all");
  productStore.setSort("newest");
  productStore.setSearchQuery("");
  priceMin.value = 0;
  priceMax.value = 10000;
  productStore.setPriceRange([0, 10000]);
};

productStore.fetchProductsFromSupabase();
cartStore.loadCart();
</script>

<style scoped>
.filter-sidebar {
  max-height: calc(100vh - 7rem);
  overflow-y: auto;
}
.filter-sidebar::-webkit-scrollbar {
  width: 4px;
}
.filter-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.filter-sidebar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground) / 0.2);
  border-radius: 10px;
}
.filter-sidebar:hover::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground) / 0.4);
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: hsl(var(--border));
  outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 2px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}
input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}
input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: 2px solid hsl(var(--background));
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}
input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.1);
}
</style>