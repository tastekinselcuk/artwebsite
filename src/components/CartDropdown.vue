<template>
  <div class="relative">
    <button
      @click="cartStore.toggleCart()"
      class="relative p-2 text-foreground hover:text-primary transition-colors"
      :aria-label="t('shop.cart.title') || 'Shopping Cart'"
    >
      <ShoppingCart class="w-6 h-6" />
      <span
        v-if="cartStore.totalItems > 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm"
      >
        {{ cartStore.totalItems }}
      </span>
    </button>

    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="cartStore.isOpen"
        class="absolute right-0 top-12 w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        <div class="bg-primary/5 border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 class="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <ShoppingBag class="w-5 h-5 text-primary" />
            {{ t("shop.cart.title") || "Shopping Cart" }}
          </h3>
          <button
            @click="cartStore.closeCart()"
            class="text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-full transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div v-if="cartStore.totalItems === 0" class="px-6 py-12 text-center">
          <ShoppingBag class="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
          <p class="text-muted-foreground font-medium">{{ t("shop.cart.empty") || "Your cart is empty" }}</p>
          <router-link
            to="/shop"
            @click="cartStore.closeCart()"
            class="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            {{ t("shop.cart.continueShopping") || "Continue Shopping" }}
          </router-link>
        </div>

        <div v-else class="max-h-96 overflow-y-auto">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="border-b border-border px-6 py-4 hover:bg-muted/30 transition-colors"
          >
            <div class="flex gap-4">
              <div class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted border border-border/50">
                <img :src="item.image || 'https://placehold.co/100'" :alt="getProductTitle(item)" class="w-full h-full object-cover" />
              </div>

              <div class="flex-1 flex flex-col">
                <h4 class="font-medium text-foreground line-clamp-1 text-sm">{{ getProductTitle(item) }}</h4>
                <p class="text-primary font-bold mt-1">{{ formatPrice(item.price) }}</p>

                <div class="flex items-center gap-1 mt-auto">
                  <button
                    @click="decreaseQuantity(item.id)"
                    class="w-6 h-6 rounded bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-sm font-medium transition-colors"
                  >
                    -
                  </button>
                  <input
                    :value="item.quantity"
                    @change="updateItemQuantity(item.id, $event)"
                    type="number"
                    min="1"
                    :max="item.maxQuantity"
                    class="w-10 h-6 text-center bg-transparent border-none text-sm font-medium focus:ring-0"
                  />
                  <button
                    @click="increaseQuantity(item.id)"
                    :disabled="item.quantity >= item.maxQuantity"
                    class="w-6 h-6 rounded bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                @click="removeItem(item.id)"
                class="text-muted-foreground hover:text-red-500 transition-colors shrink-0 p-1 self-start"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="cartStore.totalItems > 0" class="border-t border-border bg-muted/10 px-6 py-5">
          <div class="space-y-2 mb-5 text-sm">
            <div class="flex justify-between text-muted-foreground">
              <span>{{ t("shop.cart.subtotal") }}</span>
              <span>{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-muted-foreground">
              <span>{{ t("shop.cart.tax") }} (%18)</span>
              <span>{{ formatPrice(cartStore.taxAmount) }}</span>
            </div>
            <div class="flex justify-between text-muted-foreground">
              <span>{{ t("shop.cart.shipping") }}</span>
              <span v-if="cartStore.shippingCost === 0" class="text-green-500 font-medium">
                {{ t("shop.cart.free") }}
              </span>
              <span v-else>{{ formatPrice(cartStore.shippingCost) }}</span>
            </div>
            <div class="border-t border-border pt-3 mt-3 flex justify-between font-bold text-lg text-foreground">
              <span>{{ t("shop.cart.total") }}</span>
              <span>{{ formatPrice(cartStore.finalTotal) }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <router-link
              to="/checkout"
              @click="cartStore.closeCart()"
              class="block w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-center font-bold shadow-md hover:shadow-lg"
            >
              {{ t("shop.cart.checkout") || "Checkout" }}
            </router-link>
            <button
              @click="cartStore.closeCart()"
              class="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {{ t("shop.cart.continueShopping") || "Continue Shopping" }}
            </button>
          </div>

          <p v-if="cartStore.totalPrice < 250" class="text-xs text-muted-foreground mt-4 text-center">
            {{ t("shop.cart.freeShippingThreshold") || "Free shipping for orders over 250 TL" }}
          </p>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="cartStore.isOpen"
        @click="cartStore.closeCart()"
        class="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
      />
    </Transition>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useCartStore } from "@/stores/cart";
import { ShoppingCart, ShoppingBag, X, Trash2 } from "lucide-vue-next";

// "te" (translation exists) fonksiyonunu da ekledik
const { t, locale, te } = useI18n();
const currentLocale = computed(() => locale.value);
const cartStore = useCartStore();

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
};

// GÜVENLİ BAŞLIK ÇEVİRİCİSİ (Hata veren titleKey yerine bunu kullanıyoruz)
const getProductTitle = (item) => {
  if (!item || !item.title) return 'İsimsiz Ürün';
  // Eğer string formatındaysa (eski veriler veya dummy datalar)
  if (typeof item.title === 'string') {
    return te(item.title) ? t(item.title) : item.title;
  }
  // Eğer yeni JSONB formatındaysa aktif dile göre seç
  return item.title[currentLocale.value] || item.title.tr || 'İsimsiz Ürün';
};

const increaseQuantity = async (productId) => {
  const item = cartStore.items.find((i) => i.id === productId);
  if (item && item.quantity < item.maxQuantity) {
    await cartStore.updateQuantity(productId, item.quantity + 1);
  }
};

const decreaseQuantity = async (productId) => {
  const item = cartStore.items.find((i) => i.id === productId);
  if (item && item.quantity > 1) {
    await cartStore.updateQuantity(productId, item.quantity - 1);
  }
};

const updateItemQuantity = async (productId, event) => {
  const quantity = parseInt(event.target.value) || 1;
  await cartStore.updateQuantity(productId, quantity);
};

const removeItem = async (productId) => {
  await cartStore.removeItem(productId);
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>