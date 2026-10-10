<template>
  <div ref="rootRef" class="topics-scroll">
    <div class="topics-scroll__stage">
      <div class="topics-scroll__content">
        <div class="topics-scroll__heading text-center max-w-2xl mx-auto">
          <span class="mb-2.5 inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-primary">
            {{ t("home.philosophy.eyebrow") }}
          </span>
          <h2 class="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl mb-3">
            {{ t("home.philosophy.title") }}
          </h2>
          <div class="mx-auto mt-2 h-px w-8 bg-primary/35" />
        </div>

        <div class="topics-scroll__cards">
          <router-link
            v-for="(topic, index) in topics"
            :key="topic.id"
            :to="topic.to"
            class="topic-card"
          >
            <div class="topic-card__gold" aria-hidden="true" />
            <div class="topic-card__sheen" aria-hidden="true" />
            <div class="topic-card__content">
              <span class="topic-card__number font-display" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 class="topic-card__title font-display">{{ t(topic.titleKey) }}</h3>
              <p class="topic-card__body">{{ t(topic.bodyKey) }}</p>
              <span class="topic-card__link">
                {{ t("guide.readMore") }}
                <ArrowRight class="h-3 w-3" />
              </span>
            </div>
          </router-link>
        </div>

        <div class="topics-scroll__steps" aria-hidden="true">
          <span v-for="topic in topics" :key="topic.id"><i /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ArrowRight } from "lucide-vue-next";

defineProps({ topics: { type: Array, required: true } });
const { t } = useI18n();
const rootRef = ref(null);
let stopMotion;

const setupTopicsMotion = (root) => {
  if (!root) return;
  const stage = root.querySelector(".topics-scroll__stage");
  const content = root.querySelector(".topics-scroll__content");
  const sequence = root.closest(".philosophy-sequence");
  const cards = [...root.querySelectorAll(".topic-card")];
  const steps = [...root.querySelectorAll(".topics-scroll__steps i")];
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value) => Math.min(1, Math.max(0, value));
  const ease = (value) => {
    const progress = clamp(value);
    return progress * progress * (3 - 2 * progress);
  };
  let start = 0;
  let stepDistance = 1;
  let current = null;
  let visible = false;
  let frame = 0;
  let lastTime = 0;
  let listening = false;
  let disposed = false;

  const paint = (position) => {
    cards.forEach((card, index) => {
      const local = position - index;
      const enter = ease((local + 0.06) / 0.2);
      const leave = index === cards.length - 1 ? 1 : 1 - ease((local - 0.88) / 0.24);
      const focus = enter * leave;
      card.style.setProperty("--topic-focus", String(focus));
      card.style.setProperty("--topic-sheen", `${-150 + clamp(local) * 300}%`);
      card.style.zIndex = focus > 0.5 ? "2" : "1";
      card.style.willChange = visible && focus > 0 && !preference.matches ? "transform" : "auto";
      steps[index]?.style.setProperty("--step-fill", String(clamp(local)));
    });
  };

  const tick = (time) => {
    frame = 0;
    if (disposed) return;
    const target = Math.max(-0.3, Math.min(cards.length, (window.scrollY - start) / stepDistance));
    const delta = lastTime ? Math.min(64, time - lastTime) : 16.67;
    lastTime = time;
    current = current === null || preference.matches ? target : current + (target - current) * (1 - Math.exp(-delta / 140));
    if (Math.abs(target - current) < 0.001) current = target;
    paint(current);
    if (visible && current !== target) frame = window.requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (!frame && !disposed) frame = window.requestAnimationFrame(tick);
  };

  const measure = () => {
    // Keep the original compact layout; reserve reading time after the shared
    // content so the real gallery remains visible below the three topic cards.
    stepDistance = Math.max(380, Math.min(620, window.innerHeight * 0.66));
    const desiredTop = window.innerWidth < 768 ? 88 : 80;
    const stickyTop = Math.min(desiredTop, window.innerHeight - root.offsetHeight - 100);
    if (sequence) {
      sequence.style.setProperty("--intro-top", `${stickyTop}px`);
      sequence.style.setProperty("--intro-travel", `${stepDistance * cards.length}px`);
    }
    start = (sequence || root).getBoundingClientRect().top + window.scrollY - stickyTop;
    lastTime = 0;
    schedule();
  };

  const setListening = (enabled) => {
    if (enabled === listening) return;
    listening = enabled;
    if (enabled) window.addEventListener("scroll", schedule, { passive: true });
    else window.removeEventListener("scroll", schedule);
  };

  const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    setListening(visible);
    if (visible) measure();
    else schedule();
  }) : null;
  if (observer) observer.observe(root);
  else { visible = true; setListening(true); }

  const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
  resizeObserver?.observe(stage);
  resizeObserver?.observe(content);
  window.addEventListener("resize", measure, { passive: true });
  preference.addEventListener("change", schedule);
  measure();

  return () => {
    disposed = true;
    observer?.disconnect();
    resizeObserver?.disconnect();
    setListening(false);
    window.removeEventListener("resize", measure);
    preference.removeEventListener("change", schedule);
    window.cancelAnimationFrame(frame);
  };
};

onMounted(() => { stopMotion = setupTopicsMotion(rootRef.value); });
onBeforeUnmount(() => stopMotion?.());
</script>

<style scoped>
.topics-scroll {
  margin-bottom: 48px;
}
.topics-scroll__stage {
  position: relative;
}
.topics-scroll__content {
  width: 100%;
}
.topics-scroll__heading {
  margin-bottom: 40px;
}
.topics-scroll__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.topic-card {
  --topic-focus: 0;
  --topic-sheen: -150%;
  position: relative;
  display: block;
  padding: 24px;
  border-radius: 10px;
  border: 1px solid hsl(var(--border) / 0.7);
  box-shadow: 0 1px 2px hsl(var(--foreground) / 0.04), 0 6px 16px -10px hsl(var(--foreground) / 0.08);
  background: hsl(var(--card));
  isolation: isolate;
  transform: translate3d(0, calc(-10px * var(--topic-focus)), 0) scale(calc(1 + 0.055 * var(--topic-focus)));
  transform-origin: center 80%;
}
.topic-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 28px 48px -20px hsl(var(--foreground) / 0.2), 0 8px 18px -8px hsl(var(--foreground) / 0.14);
  opacity: var(--topic-focus);
  z-index: -1;
  pointer-events: none;
}
.topic-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px hsl(var(--foreground) / 0.08);
  opacity: var(--topic-focus);
  pointer-events: none;
}
.topic-card__gold {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #F4D03F;
  opacity: var(--topic-focus);
  pointer-events: none;
}
.topic-card__sheen {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}
.topic-card__sheen::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 20%, rgb(255 255 255 / 0.3) 50%, transparent 80%);
  opacity: calc(var(--topic-focus) * 0.45);
  transform: translateX(var(--topic-sheen));
}
.topic-card__content {
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgb(93 70 9 / calc(var(--topic-focus) * 0.28));
}
.topic-card__number {
  display: block;
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: 400;
  line-height: 1;
  color: color-mix(in srgb, hsl(var(--primary)), #fffdf5 calc(var(--topic-focus) * 100%));
  opacity: calc(0.3 + var(--topic-focus) * 0.7);
  transform: scale(calc(1 + 0.18 * var(--topic-focus)));
  transform-origin: left center;
}
.topic-card__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: color-mix(in srgb, hsl(var(--foreground)), #4A8C8C calc(var(--topic-focus) * 100%));
  transform: scale(calc(1 + 0.025 * var(--topic-focus)));
  transform-origin: left center;
}
.topic-card__body {
  font-size: 12px;
  line-height: 1.625;
  margin-bottom: 12px;
  color: color-mix(in srgb, hsl(var(--muted-foreground)), #4A8C8C calc(var(--topic-focus) * 100%));
}
.topic-card__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, hsl(var(--primary)), #fffdf5 calc(var(--topic-focus) * 100%));
  opacity: calc(0.8 + var(--topic-focus) * 0.2);
}
.topic-card__link svg {
  transform: translateX(calc(4px * var(--topic-focus)));
}
.topic-card:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 5px;
}
.topic-card:hover .topic-card__link {
  text-decoration: underline;
  text-underline-offset: 4px;
}
.topics-scroll__steps {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
.topics-scroll__steps span {
  width: 32px;
  height: 2px;
  background: hsl(var(--border));
  overflow: hidden;
}
.topics-scroll__steps i {
  display: block;
  height: 100%;
  background: hsl(var(--primary) / 0.7);
  transform: scaleX(var(--step-fill, 0));
  transform-origin: left;
}

@media (max-width: 767px) {
  .topics-scroll { margin-bottom: 40px; }
  .topics-scroll__heading {
    margin-bottom: 32px;
  }
  .topics-scroll__cards {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .topic-card {
    padding: 16px 20px;
    transform: translate3d(calc(5px * var(--topic-focus)), 0, 0) scale(calc(1 + 0.015 * var(--topic-focus)));
  }
  .topic-card__content {
    padding-left: 42px;
  }
  .topic-card__number {
    position: absolute;
    top: 2px;
    left: 0;
    font-size: 26px;
  }
  .topic-card__title {
    font-size: 15px;
    margin-bottom: 6px;
  }
  .topic-card__body {
    font-size: 11px;
    line-height: 1.65;
    margin-bottom: 8px;
  }
  .topic-card__link {
    font-size: 9px;
  }
  .topics-scroll__steps {
    margin-top: 20px;
  }
}
@media (max-height: 600px) and (min-width: 600px) {
  .topics-scroll__heading {
    margin-bottom: 24px;
  }
  .topics-scroll__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
  .topic-card {
    padding: 16px;
  }
  .topic-card__content {
    padding-left: 0;
  }
  .topic-card__number {
    position: static;
    font-size: 24px;
    margin-bottom: 12px;
  }
  .topic-card__title {
    font-size: 14px;
  }
  .topic-card__body {
    font-size: 11px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .topic-card, .topic-card__number, .topic-card__title, .topic-card__link svg {
    transform: none;
  }
  .topic-card__sheen {
    display: none;
  }
}
</style>
