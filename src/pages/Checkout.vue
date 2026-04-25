<template>
  <div class="min-h-screen bg-muted/20 pb-24">
    <div class="bg-card border-b border-border px-6 py-6 sticky top-0 z-20 shadow-sm">
      <div class="max-w-[1200px] mx-auto flex items-center justify-between">
        <div class="flex flex-col">
          <router-link to="/shop" class="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mb-1 font-medium uppercase tracking-wider">
            <ArrowLeft class="w-3 h-3" />
            {{ t("checkout.backToShop") || "Mağazaya Dön" }}
          </router-link>
          <h1 class="text-2xl font-display font-bold text-foreground">
            {{ t("checkout.title") || "Güvenli Ödeme" }}
          </h1>
        </div>
        <div class="hidden sm:flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
          <Lock class="w-4 h-4" />
          256-bit SSL Güvencesi
        </div>
      </div>
    </div>

    <div class="max-w-[1200px] mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        <div class="lg:col-span-7 space-y-8">
          
          <div class="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-foreground mb-5 flex items-center gap-2 border-b border-border pb-3">
              <Truck class="w-5 h-5 text-primary" />
              {{ t("checkout.shippingAddress") || "Teslimat Adresi" }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1">
                <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider">{{ t("checkout.fullName") || "Ad Soyad" }}</label>
                <input v-model="formData.shipping_full_name" type="text" required class="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider">{{ t("checkout.phone") || "Telefon" }}</label>
                <input v-model="formData.shipping_phone" type="tel" required class="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div class="md:col-span-2 space-y-1">
                <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider">{{ t("checkout.address") || "Açık Adres" }}</label>
                <textarea v-model="formData.shipping_address" rows="3" required class="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"></textarea>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider">{{ t("checkout.city") || "İl" }}</label>
                <input v-model="formData.shipping_city" type="text" required class="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-bold text-muted-foreground uppercase tracking-wider">{{ t("checkout.district") || "İlçe" }}</label>
                <input v-model="formData.shipping_district" type="text" required class="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-foreground mb-5 flex items-center gap-2 border-b border-border pb-3">
              <CreditCard class="w-5 h-5 text-primary" />
              {{ t("checkout.paymentMethod") || "Ödeme Yöntemi" }}
            </h2>

            <div class="grid gap-4">
              <label class="flex items-center p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-all" :class="{'border-primary bg-primary/5 ring-1 ring-primary/20': formData.payment_method === 'credit_card'}">
                <input v-model="formData.payment_method" type="radio" value="credit_card" class="hidden" />
                <div class="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center mr-4" :class="{'border-primary': formData.payment_method === 'credit_card'}">
                  <div v-if="formData.payment_method === 'credit_card'" class="w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>
                <div>
                  <p class="font-bold text-foreground">{{ t("checkout.creditCard") || "Kredi Kartı / Banka Kartı" }}</p>
                  <p class="text-xs text-muted-foreground">İyzico güvencesiyle taksit imkanı</p>
                </div>
              </label>

              <label class="flex items-center p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-all" :class="{'border-primary bg-primary/5 ring-1 ring-primary/20': formData.payment_method === 'bank_transfer'}">
                <input v-model="formData.payment_method" type="radio" value="bank_transfer" class="hidden" />
                <div class="w-5 h-5 rounded-full border border-muted-foreground flex items-center justify-center mr-4" :class="{'border-primary': formData.payment_method === 'bank_transfer'}">
                  <div v-if="formData.payment_method === 'bank_transfer'" class="w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>
                <div>
                  <p class="font-bold text-foreground">{{ t("checkout.bankTransfer") || "EFT / Havale" }}</p>
                  <p class="text-xs text-muted-foreground">%5 İndirim fırsatı</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="sticky top-28 bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col">
            
            <div class="p-6 border-b border-border bg-muted/20">
              <h2 class="font-bold text-foreground">{{ t("checkout.orderSummary") || "Sipariş Özeti" }}</h2>
            </div>

            <div class="p-6 max-h-[40vh] overflow-y-auto space-y-4">
              <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4">
                <div class="w-16 h-20 bg-muted rounded-lg overflow-hidden border border-border shrink-0">
                  <img :src="item.image" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 flex flex-col justify-center">
                  <p class="font-medium text-sm text-foreground line-clamp-2">{{ getProductTitle(item) }}</p>
                  <p class="text-xs text-muted-foreground mt-1">{{ item.quantity }} Adet</p>
                  <p class="font-bold text-primary mt-1">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>
            </div>

            <div class="p-6 bg-muted/10 border-t border-border space-y-3">
              <div class="flex justify-between text-sm text-muted-foreground">
                <span>{{ t("shop.cart.subtotal") || "Ara Toplam" }}</span>
                <span>{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              <div class="flex justify-between text-sm text-muted-foreground">
                <span>{{ t("shop.cart.tax") || "KDV (%18)" }}</span>
                <span>{{ formatPrice(cartStore.taxAmount) }}</span>
              </div>
              <div class="flex justify-between text-sm text-muted-foreground">
                <span>{{ t("shop.cart.shipping") || "Kargo" }}</span>
                <span v-if="cartStore.shippingCost === 0" class="text-green-500 font-bold">Ücretsiz</span>
                <span v-else>{{ formatPrice(cartStore.shippingCost) }}</span>
              </div>
              
              <div class="border-t border-border pt-4 mt-2 flex justify-between items-center">
                <span class="font-bold text-foreground uppercase tracking-wider">Toplam</span>
                <span class="text-2xl font-bold text-primary">{{ formatPrice(cartStore.finalTotal) }}</span>
              </div>
            </div>

            <div v-if="orderStore.error" class="mx-6 mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
              {{ orderStore.error }}
            </div>

            <div class="p-6 bg-card border-t border-border mt-auto">
              <button
                @click="placeOrder"
                :disabled="orderStore.loading || !isFormValid"
                class="w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2"
                :class="isFormValid && !orderStore.loading ? 'bg-primary hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5' : 'bg-muted text-muted-foreground cursor-not-allowed'"
              >
                <span v-if="orderStore.loading" class="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                {{ orderStore.loading ? t("common.processing") || "İşleniyor..." : t("checkout.placeOrder") || "Siparişi Tamamla" }}
              </button>
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
const { t, locale, te } = useI18n();
const currentLocale = computed(() => locale.value);

const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const formData = ref({
  shipping_full_name: "",
  shipping_phone: "",
  shipping_address: "",
  shipping_city: "",
  shipping_district: "",
  payment_method: "credit_card"
});

const isFormValid = computed(() => {
  return (
    formData.value.shipping_full_name.trim() !== "" &&
    formData.value.shipping_phone.trim() !== "" &&
    formData.value.shipping_address.trim() !== "" &&
    formData.value.shipping_city.trim() !== "" &&
    formData.value.shipping_district.trim() !== "" &&
    cartStore.totalItems > 0
  );
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
};

// GÜVENLİ BAŞLIK ÇEVİRİCİSİ (Hata veren titleKey yerine)
const getProductTitle = (item) => {
  if (!item || !item.title) return 'İsimsiz Ürün';
  if (typeof item.title === 'string') {
    return te(item.title) ? t(item.title) : item.title;
  }
  return item.title[currentLocale.value] || item.title.tr || 'İsimsiz Ürün';
};

const placeOrder = async () => {
  if (!isFormValid.value) return;

  // Güvenlik: Eğer kullanıcı giriş yapmadıysa sepete veya logine at
  if (!authStore.user) {
    alert("Sipariş vermek için lütfen yönetici veya test hesabıyla giriş yapın.");
    router.push("/admin/login");
    return;
  }

  const result = await orderStore.createOrder(formData.value);

  if (result.success) {
    cartStore.closeCart();
    router.push({
      name: "order-success",
      params: { orderId: result.order.id },
    });
  }
};

// Sepet boşsa zorla mağazaya gönder
if (cartStore.totalItems === 0) {
  router.push("/shop");
}
</script>