<template>
  <DropLogo />
  <FloatingNav />
  <LanguageSwitcher />

  <router-view />
</template>

<script setup>
import DropLogo from "@/components/DropLogo.vue";
import FloatingNav from "@/components/FloatingNav.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
</script>
