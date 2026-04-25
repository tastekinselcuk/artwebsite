import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Sayfa importların
import Home from "../pages/Home.vue";
import About from "../pages/About.vue";
import Ebru from "../pages/Ebru.vue";
import Photography from "../pages/Photography.vue";
import Shop from "../pages/Shop.vue";
import AdminLogin from "../pages/AdminLogin.vue";
// YENİ: Şifre güncelleme sayfasını import ediyoruz
import AdminUpdatePassword from "../pages/AdminUpdatePassword.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";
import AdminEbru from "../pages/AdminEbru.vue";
import AdminPhotography from "../pages/AdminPhotography.vue";
import AdminSettings from "../pages/AdminSettings.vue";
import AdminShop from "../pages/AdminShop.vue";
import ContentSettings from "../pages/ContentSettings.vue";
import Checkout from "../pages/Checkout.vue";
import OrderSuccess from "../pages/OrderSuccess.vue";
import ProductDetail from "../pages/ProductDetail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
    {
      path: "/ebru",
      name: "ebru",
      component: Ebru,
    },
    {
      path: "/photography",
      name: "photography",
      component: Photography,
    },
    {
      path: "/shop",
      name: "shop",
      component: Shop,
    },
    {
      path: "/checkout",
      name: "checkout",
      component: Checkout,
      meta: { requiresAuth: true },
    },
    {
      path: "/order-success/:orderId",
      name: "order-success",
      component: OrderSuccess,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/login",
      name: "admin-login",
      component: AdminLogin,
    },
    // YENİ: Şifre Güncelleme Rotası (requiresAuth koymuyoruz!)
    {
      path: "/admin/update-password",
      name: "admin-update-password",
      component: AdminUpdatePassword,
    },
    {
      path: "/admin/dashboard",
      name: "admin-dashboard",
      component: AdminDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/ebru",
      name: "admin-ebru",
      component: AdminEbru,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/photography",
      name: "admin-photography",
      component: AdminPhotography,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/shop",
      name: "admin-shop",
      component: AdminShop,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/settings",
      name: "admin-settings",
      component: AdminSettings,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/content",
      name: "AdminContent",
      component: ContentSettings,
      meta: { requiresAuth: true },
    },
    {
      path: "/shop/product/:id",
      name: "product-detail",
      component: ProductDetail,
    },
  ],
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 1. Eğer store'da kullanıcı bilgisi yoksa (sayfa yenilendiyse),
  // Supabase'den oturum durumunu kontrol et ve bekle (await)
  if (!authStore.user) {
    await authStore.checkAuth();
  }

  // 2. Korumalı sayfaya girmeye çalışıyor ama kullanıcı yoksa -> Login'e at
  if (to.meta.requiresAuth && !authStore.user) {
    next("/admin/login");
  }
  // 3. Zaten giriş yapmışsa ve Login sayfasına gitmeye çalışıyorsa -> Dashboard'a at
  else if (to.path === "/admin/login" && authStore.user) {
    next("/admin/dashboard");
  }
  // 4. Diğer durumlar (Serbest dolaşım)
  else {
    next();
  }
});

export default router;