<template>
  <div
    class="custom-cursor-wrapper"
    :class="{ 'hovering': isHovering, 'hidden': isHidden }"
  >
    <div
      class="cursor-dot"
      :style="{ transform: `translate(${dotX}px, ${dotY}px)` }"
    ></div>

    <div
      class="cursor-ring"
      :style="{ transform: `translate(${ringX}px, ${ringY}px)` }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const dotX = ref(0)
const dotY = ref(0)
const ringX = ref(0)
const ringY = ref(0)

const isHovering = ref(false)
const isHidden = ref(false)

// Hedef koordinatlar (Yumuşak takip için)
let targetX = 0
let targetY = 0

const onMouseMove = (e) => {
  // Nokta anında gider
  dotX.value = e.clientX
  dotY.value = e.clientY

  // Halka için hedef belirlenir
  targetX = e.clientX
  targetY = e.clientY
}

const onMouseEnter = () => isHidden.value = false
const onMouseLeave = () => isHidden.value = true

// İnteraktif elementleri dinle (Linkler, butonlar)
const addHoverListeners = () => {
  const hoverables = document.querySelectorAll('a, button, .cursor-zoom-in, input, textarea, select')
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => isHovering.value = true)
    el.addEventListener('mouseleave', () => isHovering.value = false)
  })
}

// Animasyon Döngüsü (Halkanın yumuşak takibi için)
const animateRing = () => {
  // Halka hedefe doğru %15 hızla yaklaşır (Lerp mantığı)
  ringX.value += (targetX - ringX.value) * 0.15
  ringY.value += (targetY - ringY.value) * 0.15

  requestAnimationFrame(animateRing)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseenter', onMouseEnter)
  document.addEventListener('mouseleave', onMouseLeave)

  // Sayfa değişimlerinde yeni elementleri yakalamak için observer
  const observer = new MutationObserver(addHoverListeners)
  observer.observe(document.body, { childList: true, subtree: true })

  addHoverListeners()
  animateRing()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseenter', onMouseEnter)
  document.removeEventListener('mouseleave', onMouseLeave)
})
</script>

<style scoped>
.custom-cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: difference; /* Arka plan rengine göre zıt renk alır */
}

/* Mobilde imleci gizle */
@media (hover: none) and (pointer: coarse) {
  .custom-cursor-wrapper {
    display: none;
  }
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  margin-top: -4px;
  margin-left: -4px;
}

.cursor-ring {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: -20px; /* Merkezleme */
  margin-left: -20px;
  transition: width 0.3s, height 0.3s, background-color 0.3s, margin 0.3s;
}

/* Hover Durumu: Halka büyür ve içi dolar */
.hovering .cursor-ring {
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: transparent;
  margin-top: -30px;
  margin-left: -30px;
}

.hidden {
  opacity: 0;
}
</style>
