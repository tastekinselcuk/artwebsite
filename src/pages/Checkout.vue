<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-card border-b border-border px-6 py-4">
      <div class="max-w-6xl mx-auto">
        <router-link
          to="/shop"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1"
        >
          <ArrowLeft class="w-4 h-4" />
          {{ t("checkout.backToShop") || "Back to Shop" }}
        </router-link>
        <h1 class="text-3xl font-display font-bold text-foreground">
          {{ t("checkout.title") || "Checkout" }}
        </h1>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Step 1: Shipping Address -->
          <div class="bg-card border border-border rounded-lg p-6">
            <h2 class="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Truck class="w-5 h-5 text-primary" />
              {{ t("checkout.shippingAddress") || "Shipping Address" }}
            </h2>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    {{ t("checkout.fullName") || "Full Name" }} *
                  </label>
                  <input
                    v-model="formData.shipping_full_name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    {{ t("checkout.phone") || "Phone" }} *
                  </label>
                  <input
                    v-model="formData.shipping_phone"
                    type="tel"
                    required
                    class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">
                  {{ t("checkout.address") || "Address" }} *
                </label>
                <textarea
                  v-model="formData.shipping_address"
                  rows="3"
                  required
                  class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    {{ t("checkout.city") || "City" }} *
                  </label>
                  <input
                    v-model="formData.shipping_city"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    {{ t("checkout.district") || "District" }} *
                  </label>
                  <input
                    v-model="formData.shipping_district"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    {{ t("checkout.postalCode") || "Postal Code" }} *
                  </label>
                  <input
                    v-model="formData.shipping_postal_code"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Billing Address -->
          <div class="bg-card border border-border rounded-lg p-6">
            <h2 class="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard class="w-5 h-5 text-primary" />
              {{ t("checkout.billingAddress") || "Billing Address" }}
            </h2>

            <div class="space-y-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.billing_same_as_shipping"
                  type="checkbox"
                  class="w-4 h-4 rounded border-border"
                />
                <span class="text-sm font-medium text-foreground">
                  {{ t("checkout.sameAsShipping") || "Same as shipping address" }}
                </span>
              </label>

              <div v-if="!formData.billing_same_as_shipping" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">
                      {{ t("checkout.fullName") || "Full Name" }} *
                    </label>
                    <input
                      v-model="formData.billing_full_name"
                      type="text"
                      class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">
                      {{ t("checkout.phone") || "Phone" }} *
                    </label>
                    <input
                      v-model="formData.billing_phone"
                      type="tel"
                      class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    {{ t("checkout.address") || "Address" }} *
                  </label>
                  <textarea
                    v-model="formData.billing_address"
                    rows="3"
                    class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">
                      {{ t("checkout.city") || "City" }} *
                    </label>
                    <input
                      v-model="formData.billing_city"
                      type="text"
                      class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">
                      {{ t("checkout.district") || "District" }} *
                    </label>
                    <input
                      v-model="formData.billing_district"
                      type="text"
                      class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">
                      {{ t("checkout.postalCode") || "Postal Code" }} *
                    </label>
                    <input
                      v-model="formData.billing_postal_code"
                      type="text"
                      class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Payment Method -->
          <div class="bg-card border border-border rounded-lg p-6">
            <h2 class="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard class="w-5 h-5 text-primary" />
              {{ t("checkout.paymentMethod") || "Payment Method" }}
            </h2>

            <div class="space-y-3">
              <label
                class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                :class="{
                  'border-primary bg-primary/5': formData.payment_method === 'credit_card',
                }"
              >
                <input
                  v-model="formData.payment_method"
                  type="radio"
                  value="credit_card"
                  class="w-4 h-4"
                />
                <div>
                  <p class="font-medium text-foreground">
                    {{ t("checkout.creditCard") || "Credit Card" }}
                  </p>
                  <p class="text-sm text-muted-foreground">
                    {{ t("checkout.creditCardDesc") || "Pay with Visa, Mastercard, etc." }}
                  </p>
                </div>
              </label>

              <label
                class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                :class="{
                  'border-primary bg-primary/5': formData.payment_method === 'bank_transfer',
                }"
              >
                <input
                  v-model="formData.payment_method"
                  type="radio"
                  value="bank_transfer"
                  class="w-4 h-4"
                />
                <div>
                  <p class="font-medium text-foreground">
                    {{ t("checkout.bankTransfer") || "Bank Transfer" }}
                  </p>
                  <p class="text-sm text-muted-foreground">
                    {{ t("checkout.bankTransferDesc") || "Direct bank transfer" }}
                  </p>
                </div>
              </label>

              <label
                class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                :class="{
                  'border-primary bg-primary/5': formData.payment_method === 'cash_on_delivery',
                }"
              >
                <input
                  v-model="formData.payment_method"
                  type="radio"
                  value="cash_on_delivery"
                  class="w-4 h-4"
                />
                <div>
                  <p class="font-medium text-foreground">
                    {{ t("checkout.cashOnDelivery") || "Cash on Delivery" }}
                  </p>
                  <p class="text-sm text-muted-foreground">
                    {{ t("checkout.cashOnDeliveryDesc") || "Pay when you receive the order" }}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Step 4: Order Notes -->
          <div class="bg-card border border-border rounded-lg p-6">
            <h2 class="text-xl font-display font-bold text-foreground mb-4">
              {{ t("checkout.orderNotes") || "Order Notes" }}
            </h2>
            <textarea
              v-model="formData.notes"
              rows="3"
              :placeholder="
                t('checkout.notesPlaceholder') || 'Add any special requests or notes...'
              "
              class="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <!-- Order Summary Section -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 class="text-xl font-display font-bold text-foreground">
              {{ t("checkout.orderSummary") || "Order Summary" }}
            </h2>

            <!-- Items -->
            <div class="space-y-3 max-h-48 overflow-y-auto">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex justify-between text-sm"
              >
                <span class="text-muted-foreground">
                  {{ t(item.titleKey) }} x {{ item.quantity }}
                </span>
                <span class="font-medium text-foreground">{{
                  formatPrice(item.price * item.quantity)
                }}</span>
              </div>
            </div>

            <div class="border-t border-border pt-4 space-y-2 text-sm">
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
                <span v-if="cartStore.shippingCost === 0" class="text-green-600 font-medium">
                  {{ t("shop.cart.free") }}
                </span>
                <span v-else>{{ formatPrice(cartStore.shippingCost) }}</span>
              </div>

              <div
                class="border-t border-border pt-2 flex justify-between font-bold text-foreground"
              >
                <span>{{ t("shop.cart.total") }}</span>
                <span class="text-primary text-lg">{{ formatPrice(cartStore.finalTotal) }}</span>
              </div>
            </div>

            <!-- Error -->
            <div
              v-if="orderStore.error"
              class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700"
            >
              {{ orderStore.error }}
            </div>

            <!-- Place Order Button -->
            <button
              @click="placeOrder"
              :disabled="orderStore.loading || !isFormValid"
              class="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="!orderStore.loading">{{
                t("checkout.placeOrder") || "Place Order"
              }}</span>
              <span v-else class="flex items-center gap-2">
                <div
                  class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></div>
                {{ t("common.processing") || "Processing..." }}
              </span>
            </button>

            <!-- Back to Cart -->
            <router-link
              to="/shop"
              class="block w-full px-4 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-center font-medium"
            >
              {{ t("checkout.continueShopping") || "Continue Shopping" }}
            </router-link>

            <!-- Security Info -->
            <div
              class="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground flex items-start gap-2"
            >
              <Lock class="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                {{
                  t("checkout.securityInfo") || "Your payment information is secure and encrypted."
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCartStore } from "@/stores/cart";
import { useOrderStore } from "@/stores/orders";
import { useAuthStore } from "@/stores/auth";
import { Truck, CreditCard, ArrowLeft, Lock } from "lucide-vue-next";

const router = useRouter();
const { t } = useI18n();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const formData = ref({
  shipping_full_name: "",
  shipping_phone: "",
  shipping_address: "",
  shipping_city: "",
  shipping_district: "",
  shipping_postal_code: "",
  billing_same_as_shipping: true,
  billing_full_name: "",
  billing_address: "",
  billing_city: "",
  billing_district: "",
  billing_postal_code: "",
  payment_method: "credit_card",
  notes: "",
});

const isFormValid = computed(() => {
  return (
    formData.value.shipping_full_name &&
    formData.value.shipping_phone &&
    formData.value.shipping_address &&
    formData.value.shipping_city &&
    formData.value.shipping_district &&
    formData.value.shipping_postal_code &&
    formData.value.payment_method &&
    cartStore.totalItems > 0
  );
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
};

const placeOrder = async () => {
  if (!isFormValid.value) {
    orderStore.error = t("checkout.fillAllFields") || "Please fill all required fields";
    return;
  }

  if (!authStore.user) {
    router.push("/admin/login");
    return;
  }

  const result = await orderStore.createOrder(formData.value);

  if (result.success) {
    // Sepeti kapat
    cartStore.closeCart();

    // Başarı sayfasına yönlendir
    router.push({
      name: "order-success",
      params: { orderId: result.order.id },
    });
  }
};

// Sepeti kontrol et
if (cartStore.totalItems === 0) {
  router.push("/shop");
}
</script>
