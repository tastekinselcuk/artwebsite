<template>
  <CustomCursor />
  <FloatingNav />

  <router-view />
</template>

<script setup>
import FloatingNav from '@/components/FloatingNav.vue'
import CustomCursor from '@/components/CustomCursor.vue'
</script>

<style>
/* Orijinal imleci gizle */
body {
  cursor: none;
}

/* Linklerde de el işaretini gizle */
a,
button,
input,
select,
textarea {
  cursor: none !important;
}
</style>
