<template>
  <div class="post-bg" :class="backgroundClass" :key="`${backgroundClass}-${rawSvg ? 'svg' : 'none'}`">
    <!-- plain color layer -->
    <div class="post-bg__color"></div>

    <!-- logo pattern layer -->
    <div
      v-if="rawSvg && backgroundClass?.includes('bg--pattern')"
      class="post-bg__pattern"
      :style="logoPatternStyle"></div>

    <!-- large logo layer -->
    <div v-if="rawSvg && backgroundClass?.includes('bg--logo')" class="post-bg__logo" v-html="rawSvg"></div>

    <!-- image layer -->
    <div v-if="usePhoto" class="post-bg__image" :style="{ backgroundImage: `url(${photoSrc})` }"></div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  backgroundClass: String,
  brandLogo: String,
  usePhoto: Boolean,
  photoSrc: String,
});

/* ----------------------------------------------
   SVG LOGO (INLINE + PATTERN MASK)
---------------------------------------------- */

const rawSvg = ref(null);
let fetchToken = 0;

watch(
  () => props.brandLogo,
  async (url) => {
    const token = ++fetchToken;
    rawSvg.value = null;

    if (!url) return;

    const resolved = new URL(url, window.location.origin).href;
    const res = await fetch(resolved);
    if (!res.ok) return;

    const svg = await res.text();
    if (token !== fetchToken) return;

    rawSvg.value = svg;
  },
  { immediate: true }
);

const logoPatternStyle = computed(() => {
  if (!rawSvg.value) return null;

  const encoded = encodeURIComponent(rawSvg.value).replace(/'/g, "%27").replace(/"/g, "%22");

  return {
    "--logo-pattern-svg": `url("data:image/svg+xml,${encoded}")`,
  };
});
</script>

<style scoped>
.post-bg,
.post-bg * {
  transition: none !important;
}

.post-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;

  opacity: 1;
  transition: opacity 120ms linear;
}

.post-bg__color,
.post-bg__pattern,
.post-bg__image,
.post-bg__logo {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* =========================================
   LARGE LOGO BACKGROUND
   ========================================= */

.post-bg__logo {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--mockup-decor);
}

.post-bg__logo :deep(svg),
.post-bg__logo :deep(svg *) {
  fill: currentColor !important;
}

.post-bg__logo :deep(svg) {
  position: absolute;
  opacity: var(--pattern-opacity);
  transform: translate(0, 0) scale(1);
  overflow: hidden;
}

/* logo positioning per format */

.size--square .post-bg__logo :deep(svg) {
  transform: translate(0, 0) scale(0.85);
}

.size--landscape .post-bg__logo :deep(svg) {
  transform: translate(-5%, 8%) scale(0.65);
}

.size--portrait .post-bg__logo :deep(svg) {
  transform: translate(-25%, 5%) scale(1.2);
}

.size--story .post-bg__logo :deep(svg) {
  transform: translate(-20%, 0) scale(1.1);
}

/* ===============================================
   PLAIN BACKGROUNDS
=============================================== */

.bg--plain-primary .post-bg__color {
  background: var(--ui-primary-bg);
}

.bg--plain-secondary .post-bg__color {
  background: var(--ui-secondary-bg);
}

.bg--plain-neutral .post-bg__color {
  background: var(--ui-alt-section-bg);
}

/* ===============================================
   PATTERN BACKGROUND
   tiled logo - brand adjustments
=============================================== */

.post-bg__pattern {
  position: absolute;
  inset: 0;
  overflow: visible;
  opacity: var(--pattern-opacity);
}

.post-bg__pattern::before,
.post-bg__pattern::after {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;

  background-color: var(--mockup-decor);
  color: var(--mockup-decor);

  mask-image: var(--logo-pattern-svg);
  -webkit-mask-image: var(--logo-pattern-svg);

  mask-repeat: repeat;
  -webkit-mask-repeat: repeat;

  mask-size: var(--tile-x) var(--tile-y);
  -webkit-mask-size: var(--tile-x) var(--tile-y);

  /* transform: rotate(var(--pattern-rotate));
  transform-origin: center; */
}

/* default: no offset */
.post-bg__pattern::after {
  mask-position: var(--pattern-offset-x) var(--pattern-offset-y);
  -webkit-mask-position: var(--pattern-offset-x) var(--pattern-offset-y);
}

/* brand spacing adjustments::after
*/

.brand--groomer .post-bg__pattern {
  --tile-x: 70px;
  --tile-y: 150px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--runkstervolksfeesten .post-bg__pattern {
  --tile-x: 70px;
  --tile-y: 170px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--ocrunkst .post-bg__pattern {
  --tile-x: 155px;
  --tile-y: 125px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--wijkraadrunkst .post-bg__pattern {
  --tile-x: 230px;
  --tile-y: 130px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--steviala .post-bg__pattern {
  --tile-x: 190px;
  --tile-y: 90px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--kenis .post-bg__pattern {
  --tile-x: 170px;
  --tile-y: 95px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--tropical .post-bg__pattern {
  --tile-x: 150px;
  --tile-y: 65px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--cardgameshop .post-bg__pattern {
  --tile-x: 190px;
  --tile-y: 75px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--blooloc .post-bg__pattern {
  --tile-x: 80px;
  --tile-y: 85px;
}

.brand--glaede .post-bg__pattern {
  --tile-x: 40px;
  --tile-y: 85px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--ellevation .post-bg__pattern {
  --tile-x: 40px;
  --tile-y: 85px;
  --pattern-offset-x: calc(var(--tile-x) * 0.25);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--astamoris .post-bg__pattern {
  --tile-x: 220px;
  --tile-y: 60px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

/* ===============================================
   IMAGE BACKGROUND
=============================================== */

.post-bg__image {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  margin: -10px;
}

/* image mode: show image */
.bg--image .post-bg__image {
  opacity: var(--image-opacity);
}
</style>
