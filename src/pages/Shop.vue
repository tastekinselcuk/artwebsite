<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section
      class="relative py-20 px-6 bg-gradient-to-b from-primary/10 to-background border-b border-border"
    >
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
            {{ t("shop.products.title") || "Art Shop" }}
          </h1>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            {{ t("home.shop.description") }}
          </p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <Search
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            />
            <input
              v-model="productStore.searchQuery"
              @input="updateSearch"
              type="text"
              :placeholder="t('shop.searchPlaceholder') || 'Search products...'"
              class="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Sidebar - Filters -->
        <aside class="md:col-span-1">
          <div class="sticky top-24 space-y-6">
            <!-- Category Filter -->
            <div class="bg-card border border-border rounded-lg p-6">
              <h3 class="text-lg font-display font-bold text-foreground mb-4">
                {{ t("shop.filters.title") || "Categories" }}
              </h3>
              <div class="space-y-2">
                <button
                  v-for="category in productStore.categories"
                  :key="category.id"
                  @click="productStore.setCategory(category.id)"
                  :class="[
                    'block w-full text-left px-4 py-2 rounded-lg transition-all duration-300',
                    productStore.selectedCategory === category.id
                      ? 'bg-primary text-white font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  ]"
                >
                  {{ t(`shop.filters.${category.id}`) }}
                </button>
              </div>
            </div>

            <!-- Price Filter -->
            <div class="bg-card border border-border rounded-lg p-6">
              <h3 class="text-lg font-display font-bold text-foreground mb-4">
                {{ t("shop.filterPrice") }}
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="text-sm text-muted-foreground mb-2 block">
                    {{ t("shop.from") }}: ₺{{ productStore.priceRange[0] }}
                  </label>
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
                  <label class="text-sm text-muted-foreground mb-2 block">
                    {{ t("shop.to") }}: ₺{{ productStore.priceRange[1] }}
                  </label>
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

            <!-- Sort Filter -->
            <div class="bg-card border border-border rounded-lg p-6">
              <h3 class="text-lg font-display font-bold text-foreground mb-4">
                {{ t("shop.sort.title") || "Sort By" }}
              </h3>
              <div class="space-y-2">
                <button
                  v-for="sort in productStore.sortOptions"
                  :key="sort.id"
                  @click="productStore.setSort(sort.id)"
                  :class="[
                    'block w-full text-left px-4 py-2 rounded-lg transition-all duration-300',
                    productStore.selectedSort === sort.id
                      ? 'bg-primary text-white font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  ]"
                >
                  {{ t(`shop.sort.${sort.id}`) }}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content - Products Grid -->
        <main class="md:col-span-3">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <p class="text-muted-foreground">
              {{ productStore.filteredProducts.length }}
              {{
                productStore.filteredProducts.length === 1
                  ? t("shop.resultSingular")
                  : t("shop.resultPlural")
              }}
            </p>
          </div>

          <!-- Products Grid -->
          <div
            v-if="productStore.filteredProducts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div
              v-for="product in productStore.filteredProducts"
              :key="product.id"
              class="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
            >
              <!-- Product Image -->
              <div class="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  :src="product.image"
                  :alt="t(product.titleKey)"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <!-- Product Tag -->
                <div
                  v-if="product.tagKey"
                  class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-foreground text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide"
                >
                  {{ t(product.tagKey) }}
                </div>

                <!-- Overlay -->
                <div
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                >
                  <router-link
                    :to="`/shop/product/${product.id}`"
                    class="bg-white text-foreground px-6 py-3 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white flex items-center gap-2 shadow-xl"
                  >
                    <Eye class="w-4 h-4" />
                    {{ t("shop.viewDetails") }}
                  </router-link>
                </div>

                <!-- Stock Badge -->
                <div
                  v-if="product.stock > 0"
                  class="absolute bottom-4 right-4 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded"
                >
                  {{ product.stock }} {{ t("shop.inStock") }}
                </div>
                <div
                  v-else
                  class="absolute bottom-4 right-4 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded"
                >
                  {{ t("shop.outOfStock") }}
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-5 flex-grow flex flex-col">
                <p
                  class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2"
                >
                  {{ t(product.categoryKey) }}
                </p>
                <h3
                  class="text-lg font-display font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors"
                >
                  {{ t(product.titleKey) }}
                </h3>

                <!-- Rating -->
                <div class="flex items-center gap-2 mb-3">
                  <div class="flex items-center gap-1">
                    <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span class="text-sm font-medium text-foreground">{{ product.rating }}</span>
                  </div>
                  <span class="text-xs text-muted-foreground">({{ product.reviews }})</span>
                </div>

                <!-- Price -->
                <p class="text-xl font-bold text-foreground mb-4 mt-auto">
                  {{ formatPrice(product.price) }}
                </p>

                <!-- Add to Cart Button -->
                <button
                  @click="addToCart(product)"
                  :disabled="product.stock === 0"
                  class="w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
                  :class="[
                    product.stock > 0
                      ? addedProductId === product.id
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                      : 'bg-muted text-muted-foreground cursor-not-allowed',
                  ]"
                >
                  <component
                    :is="addedProductId === product.id ? 'Check' : ShoppingBag"
                    class="w-4 h-4"
                  />
                  {{
                    addedProductId === product.id
                      ? t("shop.addedToCart")
                      : product.stock > 0
                        ? t("shop.addToCart")
                        : t("shop.outOfStock")
                  }}
                </button>
              </div>
            </div>
          </div>

          <!-- No Products Found -->
          <div v-else class="text-center py-16">
            <div class="mb-4">
              <ShoppingBag class="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
            </div>
            <h3 class="text-2xl font-display font-bold text-foreground mb-2">
              {{ t("shop.noResults") }}
            </h3>
            <p class="text-muted-foreground mb-6">
              {{ t("shop.tryAdjustingFilters") }}
            </p>
            <button
              @click="resetFilters"
              class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useProductStore } from "@/stores/products";
import { useCartStore } from "@/stores/cart";
import { Eye, ShoppingBag, Search, Star, Check } from "lucide-vue-next";

const { t } = useI18n();
const productStore = useProductStore();
const cartStore = useCartStore();

const priceMin = ref(productStore.priceRange[0]);
const priceMax = ref(productStore.priceRange[1]);
const addedProductId = ref(null);

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
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

  // Feedback animasyonu
  setTimeout(() => {
    addedProductId.value = null;
  }, 1500);
};

const resetFilters = () => {
  productStore.setCategory("all");
  productStore.setSort("newest");
  productStore.setSearchQuery("");
  priceMin.value = 0;
  priceMax.value = 10000;
  productStore.setPriceRange([0, 10000]);
};

// Ürünleri ve sepeti yükle
productStore.fetchProductsFromSupabase();
cartStore.loadCart();
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: hsl(var(--muted));
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 10px hsl(var(--primary) / 0.5);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 10px hsl(var(--primary) / 0.5);
}
</style>
