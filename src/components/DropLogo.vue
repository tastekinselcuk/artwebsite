<template>
  <router-link
    v-if="isShown"
    to="/"
    @click="scrollToTop"
    class="fixed top-8 left-8 z-50 font-display text-xl md:text-2xl font-semibold tracking-tight text-foreground/90 hover:text-primary transition-colors duration-300"
    aria-label="Sarpé Ana Sayfa"
  >
    Sarpé
  </router-link>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isShown = ref(false);

const isHome = computed(() => route.path === "/");
const isAdminPage = computed(() => route.path.startsWith("/admin"));

const shouldShow = () => {
  if (isAdminPage.value) return false;
  if (!isHome.value) return true;

  const hero = document.getElementById("hero");
  if (!hero) return window.scrollY > window.innerHeight * 0.78;

  const rect = hero.getBoundingClientRect();
  return rect.bottom < window.innerHeight * 0.22;
};

const syncVisibility = () => {
  isShown.value = shouldShow();
};

// YENİ: Hem sayfa değiştirdiğinde hem de aynı sayfadayken yukarı kaydırır
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

onMounted(() => {
  syncVisibility();
  window.addEventListener("scroll", syncVisibility, { passive: true });
  window.addEventListener("resize", syncVisibility);
});

onUnmounted(() => {
  window.removeEventListener("scroll", syncVisibility);
  window.removeEventListener("resize", syncVisibility);
});

watch(
  () => route.path,
  () => {
    requestAnimationFrame(syncVisibility);
  },
);
</script>