<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <!-- Success Icon -->
      <div class="mb-8">
        <div
          class="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center animate-bounce"
        >
          <CheckCircle class="w-10 h-10 text-green-500" />
        </div>
      </div>

      <!-- Title and Message -->
      <h1 class="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
        {{ t("orderSuccess.title") || "Order Confirmed!" }}
      </h1>

      <p class="text-lg text-muted-foreground mb-8">
        {{
          t("orderSuccess.message") ||
          "Thank you for your purchase. Your order has been placed successfully."
        }}
      </p>

      <!-- Order Details -->
      <div class="bg-card border border-border rounded-lg p-6 mb-8 text-left space-y-4">
        <div class="flex justify-between items-center pb-4 border-b border-border">
          <span class="text-muted-foreground"
            >{{ t("orderSuccess.orderNumber") || "Order Number" }}:</span
          >
          <span class="font-mono font-bold text-foreground">#{{ orderId }}</span>
        </div>

        <div class="flex justify-between items-center pb-4 border-b border-border">
          <span class="text-muted-foreground"
            >{{ t("orderSuccess.totalAmount") || "Total Amount" }}:</span
          >
          <span class="text-lg font-bold text-primary">{{ formatPrice(order?.total || 0) }}</span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-muted-foreground"
            >{{ t("orderSuccess.estimatedDelivery") || "Estimated Delivery" }}:</span
          >
          <span class="font-medium text-foreground">{{ estimatedDeliveryDate }}</span>
        </div>
      </div>

      <!-- Status Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
        <div class="flex gap-3">
          <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="font-medium text-blue-900 mb-1">
              {{ t("orderSuccess.confirmationEmail") || "Confirmation Email" }}
            </p>
            <p class="text-sm text-blue-700">
              {{
                t("orderSuccess.emailMessage") ||
                `A confirmation email has been sent to ${userEmail}`
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- What's Next -->
      <div class="mb-8 text-left">
        <h2 class="font-display font-bold text-foreground mb-4">
          {{ t("orderSuccess.whatNext") || "What's Next?" }}
        </h2>
        <ol class="space-y-3 text-sm text-muted-foreground">
          <li class="flex gap-3">
            <span class="font-bold text-primary flex-shrink-0">1</span>
            <span>{{
              t("orderSuccess.step1") || "We will process your order and prepare your items"
            }}</span>
          </li>
          <li class="flex gap-3">
            <span class="font-bold text-primary flex-shrink-0">2</span>
            <span>{{
              t("orderSuccess.step2") ||
              "You will receive a shipping notification with tracking details"
            }}</span>
          </li>
          <li class="flex gap-3">
            <span class="font-bold text-primary flex-shrink-0">3</span>
            <span>{{
              t("orderSuccess.step3") || "Your package will be delivered within 5-7 business days"
            }}</span>
          </li>
        </ol>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <router-link
          to="/shop"
          class="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
        >
          {{ t("orderSuccess.continueShopping") || "Continue Shopping" }}
        </router-link>
        <router-link
          to="/"
          class="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-center font-medium"
        >
          {{ t("orderSuccess.backHome") || "Back to Home" }}
        </router-link>
      </div>

      <!-- Help -->
      <p class="text-xs text-muted-foreground mt-8">
        {{ t("orderSuccess.needHelp") || "Need help?" }}
        <a href="mailto:support@example.com" class="text-primary hover:underline">
          {{ t("orderSuccess.contactSupport") || "Contact our support team" }}
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useOrderStore } from "@/stores/orders";
import { useAuthStore } from "@/stores/auth";
import { CheckCircle, Info } from "lucide-vue-next";

const { t } = useI18n();
const route = useRoute();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const orderId = route.params.orderId;

const order = computed(() => {
  return orderStore.getOrderById(parseInt(orderId));
});

const userEmail = computed(() => {
  return authStore.user?.email || "";
});

const estimatedDeliveryDate = computed(() => {
  const today = new Date();
  const delivery = new Date(today.setDate(today.getDate() + 5));
  return delivery.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
};
</script>
