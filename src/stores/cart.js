import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabaseClient";
import { useAuthStore } from "@/stores/auth";

export const useCartStore = defineStore("cart", () => {
  const items = ref([]);
  const isOpen = ref(false);
  const loading = ref(false);
  const error = ref(null);

  // Sepette toplam ürün sayısı
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  // Sepette toplam fiyat
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  // KDV hesaplaması (%18)
  const taxAmount = computed(() => {
    return Math.round(totalPrice.value * 0.18 * 100) / 100;
  });

  // Kargo ücreti (100 TL, 250 TL üzeri ücretsiz)
  const shippingCost = computed(() => {
    return totalPrice.value >= 250 ? 0 : 100;
  });

  // Son ödenecek tutar
  const finalTotal = computed(() => {
    return totalPrice.value + taxAmount.value + shippingCost.value;
  });

  // Sepete ürün ekle
  const addItem = async (product) => {
    const authStore = useAuthStore();
    const existingItem = items.value.find((item) => item.id === product.id);

    try {
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity++;
        }
      } else {
        items.value.push({
          id: product.id,
          titleKey: product.titleKey,
          price: product.price,
          image: product.image,
          quantity: 1,
          maxQuantity: product.stock,
        });
      }

      // Oturum açmışsa Supabase'e kaydet
      if (authStore.user) {
        await saveCartToSupabase();
      } else {
        // Değilse LocalStorage'a kaydet
        saveCartLocally();
      }
    } catch (e) {
      console.error("Error adding item to cart:", e);
      error.value = "Ürün sepete eklenirken hata oluştu";
    }
  };

  // Sepetten ürün çıkar
  const removeItem = async (productId) => {
    const authStore = useAuthStore();

    items.value = items.value.filter((item) => item.id !== productId);

    try {
      if (authStore.user) {
        await saveCartToSupabase();
      } else {
        saveCartLocally();
      }
    } catch (e) {
      console.error("Error removing item from cart:", e);
    }
  };

  // Ürün miktarını güncelle
  const updateQuantity = async (productId, quantity) => {
    const authStore = useAuthStore();
    const item = items.value.find((item) => item.id === productId);

    try {
      if (item) {
        if (quantity <= 0) {
          await removeItem(productId);
        } else if (quantity <= item.maxQuantity) {
          item.quantity = quantity;

          if (authStore.user) {
            await saveCartToSupabase();
          } else {
            saveCartLocally();
          }
        }
      }
    } catch (e) {
      console.error("Error updating quantity:", e);
    }
  };

  // Sepeti boşalt
  const clearCart = async () => {
    const authStore = useAuthStore();

    items.value = [];

    try {
      if (authStore.user) {
        await saveCartToSupabase();
      } else {
        localStorage.removeItem("cart");
      }
    } catch (e) {
      console.error("Error clearing cart:", e);
    }
  };

  // LocalStorage'a sepeti kaydet (Ziyaretçiler için)
  const saveCartLocally = () => {
    localStorage.setItem("cart", JSON.stringify(items.value));
  };

  // Supabase'e sepeti kaydet (Oturum açmış kullanıcılar için)
  const saveCartToSupabase = async () => {
    const authStore = useAuthStore();

    if (!authStore.user) return;

    loading.value = true;
    error.value = null;

    try {
      // Mevcut sepeti kontrol et
      const { data: existingCart, error: fetchError } = await supabase
        .from("shopping_carts")
        .select("id")
        .eq("user_id", authStore.user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      const cartData = {
        user_id: authStore.user.id,
        items: items.value,
        total_price: totalPrice.value,
        total_items: totalItems.value,
        updated_at: new Date(),
      };

      if (existingCart) {
        // Güncelle
        const { error: updateError } = await supabase
          .from("shopping_carts")
          .update(cartData)
          .eq("user_id", authStore.user.id);

        if (updateError) throw updateError;
      } else {
        // Yeni sepet oluştur
        const { error: insertError } = await supabase.from("shopping_carts").insert([cartData]);

        if (insertError) throw insertError;
      }
    } catch (e) {
      console.error("Error saving cart to Supabase:", e);
      error.value = "Sepet kaydedilirken hata oluştu";
    } finally {
      loading.value = false;
    }
  };

  // Supabase'den sepeti yükle (Oturum açmış kullanıcılar için)
  const loadCartFromSupabase = async () => {
    const authStore = useAuthStore();

    if (!authStore.user) return;

    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await supabase
        .from("shopping_carts")
        .select("items")
        .eq("user_id", authStore.user.id)
        .single();

      if (err && err.code !== "PGRST116") {
        throw err;
      }

      if (data && data.items) {
        items.value = data.items;
      } else {
        // Eğer Supabase'de sepet yoksa LocalStorage'dan yükle
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            items.value = JSON.parse(savedCart);
            // LocalStorage'daki sepeti Supabase'e aktar
            await saveCartToSupabase();
          } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
          }
        }
      }
    } catch (e) {
      console.error("Error loading cart from Supabase:", e);
      error.value = "Sepet yüklenirken hata oluştu";
    } finally {
      loading.value = false;
    }
  };

  // Sepeti yükle (Ziyaretçi veya Kullanıcı)
  const loadCart = async () => {
    const authStore = useAuthStore();

    if (authStore.user) {
      // Oturum açmışsa Supabase'den yükle
      await loadCartFromSupabase();
    } else {
      // Ziyaretçiyse LocalStorage'dan yükle
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          items.value = JSON.parse(savedCart);
        } catch (e) {
          console.error("Error loading cart from localStorage:", e);
        }
      }
    }
  };

  // Sepeti aç/kapat
  const toggleCart = () => {
    isOpen.value = !isOpen.value;
  };

  const openCart = () => {
    isOpen.value = true;
  };

  const closeCart = () => {
    isOpen.value = false;
  };

  return {
    items,
    isOpen,
    loading,
    error,
    totalItems,
    totalPrice,
    taxAmount,
    shippingCost,
    finalTotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    loadCart,
    saveCartToSupabase,
    loadCartFromSupabase,
  };
});
