import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/supabaseClient";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";

export const useOrderStore = defineStore("orders", () => {
  const orders = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Siparişi Supabase'e kaydet
  const createOrder = async (orderData) => {
    const authStore = useAuthStore();
    const cartStore = useCartStore();

    if (!authStore.user) {
      error.value = "Siparişi oluşturmak için giriş yapmanız gerekir.";
      return { success: false };
    }

    loading.value = true;
    error.value = null;

    try {
      const newOrder = {
        user_id: authStore.user.id,
        user_email: authStore.user.email,
        items: cartStore.items,
        subtotal: cartStore.totalPrice,
        tax: cartStore.taxAmount,
        shipping_cost: cartStore.shippingCost,
        total: cartStore.finalTotal,

        // Sevkiyat Bilgileri
        shipping_full_name: orderData.shipping_full_name,
        shipping_phone: orderData.shipping_phone,
        shipping_address: orderData.shipping_address,
        shipping_city: orderData.shipping_city,
        shipping_district: orderData.shipping_district,

        // Ödeme
        payment_method: orderData.payment_method,
        payment_status: "pending",
        order_status: "pending"
      };

      const { data, error: err } = await supabase
        .from("orders")
        .insert([newOrder])
        .select();

      if (err) throw err;

      if (data && data[0]) {
        orders.value.push(data[0]);
        // Başarılı olursa sepeti tamamen temizle (veritabanından ve localden)
        await cartStore.clearCart();
        return { success: true, order: data[0] };
      }

      throw new Error("Sipariş nesnesi alınamadı.");
    } catch (e) {
      console.error("Create Order Error:", e);
      error.value = "Siparişiniz işlenirken bir sorun oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.";
      return { success: false };
    } finally {
      loading.value = false;
    }
  };

  const getOrderById = (id) => {
    return orders.value.find((order) => order.id === id);
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    getOrderById,
  };
});