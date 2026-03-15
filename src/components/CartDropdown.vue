<template>
  <div class="relative">
    <!-- Cart Button (Header'da gösterilecek) -->
    <button
      @click="cartStore.toggleCart()"
      class="relative p-2 text-foreground hover:text-primary transition-colors"
      :aria-label="t('nav.cart') || 'Shopping Cart'"
    >
      <ShoppingCart class="w-6 h-6" />
      <!-- Badge: Sepet İçinde Ürün Sayısı -->
      <span
        v-if="cartStore.totalItems > 0"
        class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold"
      >
        {{ cartStore.totalItems }}
      </span>
    </button>

    <!-- Cart Dropdown -->
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
        <!-- Header -->
        <div
          class="bg-primary/10 border-b border-border px-6 py-4 flex items-center justify-between"
        >
          <h3 class="font-display font-bold text-lg text-foreground">
            {{ t("shop.cart.title") || "Shopping Cart" }}
          </h3>
          <button
            @click="cartStore.closeCart()"
            class="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="cartStore.totalItems === 0" class="px-6 py-12 text-center">
          <ShoppingBag class="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p class="text-muted-foreground">{{ t("shop.cart.empty") || "Your cart is empty" }}</p>
          <router-link
            to="/shop"
            @click="cartStore.closeCart()"
            class="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {{ t("shop.cart.continueShopping") || "Continue Shopping" }}
          </router-link>
        </div>

        <!-- Cart Items -->
        <div v-else class="max-h-96 overflow-y-auto">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="border-b border-border px-6 py-4 hover:bg-muted/30 transition-colors"
          >
            <div class="flex gap-4">
              <!-- Product Image -->
              <div class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <img :src="item.image" :alt="t(item.titleKey)" class="w-full h-full object-cover" />
              </div>

              <!-- Product Info -->
              <div class="flex-1 flex flex-col">
                <h4 class="font-medium text-foreground line-clamp-1">{{ t(item.titleKey) }}</h4>
                <p class="text-sm text-muted-foreground">{{ formatPrice(item.price) }}</p>

                <!-- Quantity Controls -->
                <div class="flex items-center gap-2 mt-2">
                  <button
                    @click="decreaseQuantity(item.id)"
                    class="w-6 h-6 rounded bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <input
                    :value="item.quantity"
                    @change="updateItemQuantity(item.id, $event)"
                    type="number"
                    min="1"
                    :max="item.maxQuantity"
                    class="w-10 h-6 text-center border border-border rounded text-sm"
                  />
                  <button
                    @click="increaseQuantity(item.id)"
                    class="w-6 h-6 rounded bg-muted hover:bg-muted-foreground/20 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Remove Button -->
              <button
                @click="removeItem(item.id)"
                class="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Footer: Summary & Checkout -->
        <div v-if="cartStore.totalItems > 0" class="border-t border-border bg-muted/20 px-6 py-4">
          <!-- Totals -->
          <div class="space-y-2 mb-4 text-sm">
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
            <div class="border-t border-border pt-2 flex justify-between font-bold text-foreground">
              <span>{{ t("shop.cart.total") }}</span>
              <span>{{ formatPrice(cartStore.finalTotal) }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="space-y-2">
            <router-link
              to="/checkout"
              @click="cartStore.closeCart()"
              class="block w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
            >
              {{ t("shop.cart.checkout") || "Checkout" }}
            </router-link>
            <button
              @click="cartStore.closeCart()"
              class="w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              {{ t("shop.cart.continueShopping") || "Continue Shopping" }}
            </button>
          </div>

          <!-- Shipping Info -->
          <p
            v-if="cartStore.totalPrice < 250"
            class="text-xs text-muted-foreground mt-3 text-center"
          >
            {{ t("shop.cart.freeShippingThreshold") || "Free shipping for orders over 250 TL" }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- Backdrop (Close cart when clicking outside) -->
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
        class="fixed inset-0 bg-black/20 z-40"
      />
    </Transition>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useCartStore } from "@/stores/cart";
import { ShoppingCart, ShoppingBag, X, Trash2 } from "lucide-vue-next";

const { t } = useI18n();
const cartStore = useCartStore();

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
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
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
