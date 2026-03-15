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
      error.value = "Siparişi oluşturmak için giriş yapmanız gerekir";
      return false;
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
        shipping_postal_code: orderData.shipping_postal_code,

        // Fatura Adresi
        billing_same_as_shipping: orderData.billing_same_as_shipping,
        billing_full_name: orderData.billing_full_name || orderData.shipping_full_name,
        billing_phone: orderData.billing_phone || orderData.shipping_phone,
        billing_address: orderData.billing_address || orderData.shipping_address,
        billing_city: orderData.billing_city || orderData.shipping_city,
        billing_district: orderData.billing_district || orderData.shipping_district,
        billing_postal_code: orderData.billing_postal_code || orderData.shipping_postal_code,

        // Ödeme
        payment_method: orderData.payment_method,
        payment_status: "pending",
        order_status: "pending",

        // Not
        notes: orderData.notes || "",

        created_at: new Date(),
      };

      const { data, error: err } = await supabase.from("orders").insert([newOrder]).select();

      if (err) throw err;

      // Siparişi state'e ekle
      if (data && data[0]) {
        orders.value.push(data[0]);

        // Sepeti boşalt
        await cartStore.clearCart();

        return { success: true, order: data[0] };
      }

      throw new Error("Siparış oluşturulamadı");
    } catch (e) {
      console.error("Create Order Error:", e);
      error.value = "Siparış oluşturulurken hata oluştu";
      return { success: false };
    } finally {
      loading.value = false;
    }
  };

  // Kullanıcının siparişlerini getir
  const fetchUserOrders = async () => {
    const authStore = useAuthStore();

    if (!authStore.user) return;

    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", authStore.user.id)
        .order("created_at", { ascending: false });

      if (err) throw err;
      orders.value = data || [];
    } catch (e) {
      console.error("Fetch Orders Error:", e);
      error.value = "Siparışlar yüklenirken hata oluştu";
    } finally {
      loading.value = false;
    }
  };

  // Sipariş detayını getir
  const getOrderById = (id) => {
    return orders.value.find((order) => order.id === id);
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    fetchUserOrders,
    getOrderById,
  };
});
