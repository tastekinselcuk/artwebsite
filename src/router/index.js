import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const Home = () => import("../pages/Home.vue");
const About = () => import("../pages/About.vue");
const Ebru = () => import("../pages/Ebru.vue");
const Shop = () => import("../pages/Shop.vue");
const Checkout = () => import("../pages/Checkout.vue");
const OrderSuccess = () => import("../pages/OrderSuccess.vue");
const ProductDetail = () => import("../pages/ProductDetail.vue");
const AdminLogin = () => import("../pages/AdminLogin.vue");
const AdminUpdatePassword = () => import("../pages/AdminUpdatePassword.vue");
const AdminDashboard = () => import("../pages/AdminDashboard.vue");
const AdminEbru = () => import("../pages/AdminEbru.vue");
const AdminEbruVarieties = () => import("../pages/AdminEbruVarieties.vue");
const AdminSettings = () => import("../pages/AdminSettings.vue");
const AdminShop = () => import("../pages/AdminShop.vue");
const ContentSettings = () => import("../pages/ContentSettings.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        seoKey: "home",
      },
    },
    {
      path: "/about",
      name: "about",
      component: About,
      meta: { seoKey: "about" },
    },
    {
      path: "/ebru",
      name: "ebru",
      component: Ebru,
      meta: { seoKey: "ebru" },
    },
    {
      path: "/shop",
      name: "shop",
      component: Shop,
      meta: { seoKey: "shop" },
    },
    {
      path: "/shop/product/:id",
      name: "product-detail",
      component: ProductDetail,
      meta: { seoKey: "product" },
    },
    {
      path: "/checkout",
      name: "checkout",
      component: Checkout,
      meta: { requiresAuth: true, noindex: true, seoKey: "checkout" },
    },
    {
      path: "/order-success/:orderId",
      name: "order-success",
      component: OrderSuccess,
      meta: { requiresAuth: true, noindex: true, seoKey: "orderSuccess" },
    },
    {
      path: "/admin/login",
      name: "admin-login",
      component: AdminLogin,
      meta: { noindex: true, seoKey: "admin" },
    },
    {
      path: "/admin/update-password",
      name: "admin-update-password",
      component: AdminUpdatePassword,
      meta: { noindex: true, seoKey: "admin" },
    },
    {
      path: "/admin/dashboard",
      name: "admin-dashboard",
      component: AdminDashboard,
      meta: { requiresAuth: true, noindex: true, seoKey: "admin" },
    },
    {
      path: "/admin/ebru",
      name: "admin-ebru",
      component: AdminEbru,
      meta: { requiresAuth: true, noindex: true, seoKey: "admin" },
    },
    {
      path: "/admin/ebru-varieties",
      name: "admin-ebru-varieties",
      component: AdminEbruVarieties,
      meta: { requiresAuth: true, noindex: true, seoKey: "admin" },
    },
    {
      path: "/admin/shop",
      name: "admin-shop",
      component: AdminShop,
      meta: { requiresAuth: true, noindex: true, seoKey: "admin" },
    },
    {
      path: "/admin/settings",
      name: "admin-settings",
      component: AdminSettings,
      meta: { requiresAuth: true, noindex: true, seoKey: "admin" },
    },
    {
      path: "/admin/content",
      name: "AdminContent",
      component: ContentSettings,
      meta: { requiresAuth: true, noindex: true, seoKey: "admin" },
    },
    {
      path: "/admin/guides",
      name: "admin-guides",
      component: () => import("../pages/AdminGuides.vue"),
      meta: { requiresAuth: true, noindex: true, seoKey: "admin" },
    },
    {
      path: "/rehber",
      name: "guide-index",
      component: () => import("../pages/GuideIndex.vue"),
      meta: { seoKey: "guides" },
    },
    {
      path: "/rehber/:slug",
      name: "guide-article",
      component: () => import("../pages/GuideArticle.vue"),
      meta: { seoSkip: true },
    },
    {
      path: "/:slug(gizlilik|iade-iptal|kargo)",
      name: "legal",
      component: () => import("../pages/LegalPage.vue"),
      meta: { seoSkip: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../pages/NotFound.vue"),
      meta: { seoKey: "notFound", noindex: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  // Public pages skip session check for faster navigation
  const skipAuth = !to.meta.requiresAuth && !to.path.startsWith("/admin");
  if (skipAuth) {
    next();
    return;
  }

  const authStore = useAuthStore();

  if (!authStore.user) {
    await authStore.checkAuth();
  }

  if (to.meta.requiresAuth && !authStore.user) {
    next("/admin/login");
  } else if (to.path === "/admin/login" && authStore.user) {
    next("/admin/dashboard");
  } else {
    next();
  }
});

export default router;
