<template>
  <nav v-if="!isAdminPage" class="fixed top-8 right-8 z-50 flex items-center gap-3">
    <CartDropdown />

    <div class="relative">
      <button
        @click="isOpen = !isOpen"
        class="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
        :aria-expanded="isOpen"
        aria-label="Toggle navigation"
      >
        <div class="relative w-5 h-3.5">
          <span
            :class="[
              'absolute left-0 top-0 block h-0.5 w-5 bg-current transition-all duration-300 origin-center',
              isOpen ? 'top-1.5 rotate-45' : '',
            ]"
          />
          <span
            :class="[
              'absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300',
              isOpen ? 'opacity-0 scale-x-0' : '',
            ]"
          />
          <span
            :class="[
              'absolute left-0 top-3 block h-0.5 w-5 bg-current transition-all duration-300 origin-center',
              isOpen ? 'top-1.5 -rotate-45' : '',
            ]"
          />
        </div>
      </button>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
      >
        <div
          v-if="isOpen"
          class="absolute top-[calc(100%+0.75rem)] right-0 min-w-[11.5rem] overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-xl backdrop-blur-md"
        >
          <div class="flex flex-col p-1.5">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              @click="handleNavClick"
              class="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-foreground/90 transition-colors hover:bg-muted hover:text-foreground whitespace-nowrap"
              :class="{ 'bg-muted/70 text-foreground': route.path === item.to }"
            >
              <component :is="item.icon" class="w-4 h-4 text-primary shrink-0" />
              <span class="font-medium tracking-wide">{{ t(item.label) }}</span>
            </router-link>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Home, Droplet, User, ShoppingBag } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import CartDropdown from "@/components/CartDropdown.vue";

const { t } = useI18n();
const isOpen = ref(false);
const route = useRoute();

const isAdminPage = computed(() => route.path.startsWith("/admin"));

const navItems = [
  { to: "/", icon: Home, label: "nav.home" },
  { to: "/ebru", icon: Droplet, label: "nav.ebruGallery" },
  { to: "/shop", icon: ShoppingBag, label: "nav.ebruShop" },
  { to: "/about", icon: User, label: "nav.about" },
];

// YENİ: Hem menüyü kapatan hem de yumuşak bir şekilde yukarı kaydıran fonksiyon
const handleNavClick = () => {
  isOpen.value = false;
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

watch(
  () => route.path,
  () => {
    isOpen.value = false;
  },
);
</script>