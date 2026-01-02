<template>
  <PostWrapper :size="size">
    <div class="social-post" :class="[`size--${size}`, backgroundClass]">
      <div class="post-bg" :class="backgroundClass">
        <!-- plain color layer -->
        <div class="post-bg__color"></div>

        <!-- logo pattern layer -->
        <div v-if="backgroundClass?.includes('bg--pattern')" class="post-bg__pattern" :style="logoPatternStyle"></div>

        <!-- large logo layer -->
        <div v-if="brandLogo && backgroundClass?.includes('bg--logo')" class="post-bg__logo" v-html="rawSvg"></div>

        <!-- image layer -->
        <div v-if="usePhoto" class="post-bg__image" :style="{ backgroundImage: `url(${photoSrc})` }"></div>
      </div>

      <SafeZoneOverlay v-if="showSafeZone" />

      <div
        class="post-content"
        :class="`post-content--${backgroundTone}`"
        :style="mockupVars"
        :post-type="postType || null">
        <div class="post-free">
          <slot name="free" />
        </div>
        <div class="post-safe">
          <slot name="safe" />
        </div>
        <div class="post-watermark" v-if="brandLogoSmall" :style="watermarkStyle"></div>
      </div>
    </div>
  </PostWrapper>
</template>

<script setup>
import PostWrapper from "@/components/mockup/PostWrapper.vue";
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { getTextModeForBackground } from "@/utils/colorLogic.js";
import SafeZoneOverlay from "@/components/mockup/SafeZoneOverlay.vue";

/* ----------------------------------------------
   PROPS
---------------------------------------------- */
const props = defineProps({
  size: String,
  backgroundClass: String,
  backgroundTone: String,
  useColoredBackground: {
    type: Boolean,
    default: true,
  },
  bgColors: {
    type: Array,
    default: () => [],
  },
  brandLogo: String,
  usePhoto: Boolean,
  photoSrc: String,
  brandLogoSmall: String,
  showSafeZone: {
    type: Boolean,
    default: false,
  },
  postType: String,
});

/* ----------------------------------------------
   HELPERS
---------------------------------------------- */
function getRootStyle() {
  return getComputedStyle(document.documentElement);
}

function resolveFirstBg(vars) {
  const root = getRootStyle();
  for (const v of vars || []) {
    const val = root.getPropertyValue(v).trim();
    if (val) return val;
  }
  return null;
}

let rafId = 0;
function scheduleRecompute() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    recomputeMockupVars();
  });
}

function resolveAccentBg(root) {
  const explicit = root.getPropertyValue("--ui-accent-bg").trim();
  if (explicit) return explicit;

  const primary = root.getPropertyValue("--ui-primary-bg").trim();
  const secondary = root.getPropertyValue("--ui-secondary-bg").trim();
  if (!primary || !secondary) return null;

  return props.backgroundTone === "secondary" ? primary : secondary;
}

function readCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || null;
}

/* ----------------------------------------------
   LOGO COLOR + LOGO PATTERN (SVG -> CSS mask)
---------------------------------------------- */
const rawSvg = ref(null);

watch(
  () => props.brandLogo,
  async (url) => {
    if (!url) {
      rawSvg.value = null;
      return;
    }

    const resolved = new URL(url, window.location.origin).href;
    const res = await fetch(resolved);

    if (!res.ok) {
      rawSvg.value = null;
      return;
    }

    rawSvg.value = await res.text();
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

/* ----------------------------------------------
   WATERMARK
---------------------------------------------- */

const watermarkStyle = computed(() => {
  if (!props.brandLogoSmall) return null;

  const url = new URL(props.brandLogoSmall, import.meta.url).href;

  return {
    WebkitMaskImage: `url(${url})`,
    maskImage: `url(${url})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    backgroundColor: "var(--white)",
  };
});

/* ----------------------------------------------
   MOCKUP-SCOPED ROLES
   - dynamic-* (text on overall mockup background)
   - surface captions (panel / alt-panel / accent)
---------------------------------------------- */

// function readVar(name) {
//   return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
// }

const mockupVars = ref({
  "--dynamic-text": "",
  "--dynamic-title": "",
  "--dynamic-soft": "",

  "--caption-on-panel": "",
  "--caption-on-alt-panel": "",
  "--caption-on-accent": "",
});

function recomputeMockupVars() {
  const root = getRootStyle();

  /* base text tokens from App.vue */
  const textDark = root.getPropertyValue("--color-text").trim();
  const titleDark = root.getPropertyValue("--color-title").trim();
  const textLight = root.getPropertyValue("--color-text-inverse").trim();

  const softDark = root.getPropertyValue("--color-text-soft").trim();
  const softLight = root.getPropertyValue("--color-text-soft-inverse").trim();

  /* caption tones */
  const primaryDark = root.getPropertyValue("--color-primary-dark").trim();
  const secondaryDark = root.getPropertyValue("--color-secondary-dark").trim();

  if (!textDark || !textLight) return;

  /* resolve actual mockup background */

  const mockupBg = resolveFirstBg(props.bgColors);
  if (!mockupBg) return;

  const mockupMode = getTextModeForBackground(mockupBg, textDark, textLight);
  if (!mockupMode) return;

  /* getTextModeForBackground: "light" => background is dark => needs light text */
  const mockupNeedsLightText = mockupMode === "light";

  /* overall mockup background text */
  const dynamicText = mockupNeedsLightText ? textLight : textDark;
  const dynamicTitle = mockupNeedsLightText ? textLight || textDark : titleDark || textDark;
  const dynamicSoft = mockupNeedsLightText ? softLight || textLight : softDark || textDark;

  /* surface captions */
  const panelCaption =
    props.backgroundTone === "secondary"
      ? secondaryDark || primaryDark || dynamicSoft
      : primaryDark || secondaryDark || dynamicSoft;

  const altPanelCaption =
    props.backgroundTone === "secondary"
      ? primaryDark || secondaryDark || dynamicSoft
      : secondaryDark || primaryDark || dynamicSoft;

  /* accent caption: based on resolved accent surface background */
  const accentBg = resolveAccentBg(root);

  let accentCaption = softLight || textLight;

  if (accentBg) {
    const accentMode = getTextModeForBackground(accentBg, textDark, textLight);
    if (accentMode === "light") {
      accentCaption = softLight || textLight;
    } else {
      accentCaption = softDark || textDark;
    }
  }

  /* ----------------------------------------------
     APPLY LOCAL OVERRIDES (mockup only)
  ---------------------------------------------- */

  mockupVars.value = {
    "--dynamic-text": dynamicText,
    "--dynamic-title": dynamicTitle,
    "--dynamic-soft": dynamicSoft,

    "--caption-on-panel": panelCaption,
    "--caption-on-alt-panel": altPanelCaption,
    "--caption-on-accent": accentCaption,
  };
}

/* ----------------------------------------------
   RECOMPUTE TRIGGERS
---------------------------------------------- */
watch(
  () => [props.backgroundClass, props.backgroundTone, props.useColoredBackground, props.bgColors],
  () => scheduleRecompute(),
  { immediate: true, deep: true }
);

function onPaletteUpdated() {
  scheduleRecompute();
}

function onBrandUpdated() {
  scheduleRecompute();
}

function onDynamicTextUpdated() {
  scheduleRecompute();
}

onMounted(() => {
  window.addEventListener("palette-updated", onPaletteUpdated);
  window.addEventListener("brand-updated", onBrandUpdated);
  window.addEventListener("dynamic-text-updated", onDynamicTextUpdated);

  scheduleRecompute();
});

onBeforeUnmount(() => {
  window.removeEventListener("palette-updated", onPaletteUpdated);
  window.removeEventListener("brand-updated", onBrandUpdated);
  window.removeEventListener("dynamic-text-updated", onDynamicTextUpdated);

  if (rafId) cancelAnimationFrame(rafId);
});

/* ----------------------------------------------
   EXPORT TO STYLE INSPECTOR (CONSOLIDATED)
---------------------------------------------- */

const resolvedVisualContext = computed(() => ({
  background: {
    mockup: readCssVar("--ui-primary-bg") || readCssVar("--ui-secondary-bg") || readCssVar("--ui-alt-section-bg"),
    panel: readCssVar("--ui-panel-bg"),
    altPanel: readCssVar("--ui-alt-panel-bg"),
    accent: readCssVar("--ui-accent-bg"),
  },

  text: {
    mockup: {
      title: readCssVar("--dynamic-title"),
      body: readCssVar("--dynamic-text"),
      soft: readCssVar("--dynamic-soft"),
    },

    panel: {
      title: readCssVar("--title-on-panel"),
      body: readCssVar("--text-on-panel"),
      caption: readCssVar("--caption-on-panel"),
    },

    altPanel: {
      title: readCssVar("--title-on-alt-panel"),
      body: readCssVar("--text-on-alt-panel"),
      caption: readCssVar("--caption-on-alt-panel"),
    },

    accent: {
      title: readCssVar("--title-on-accent"),
      body: readCssVar("--text-on-accent"),
      caption: readCssVar("--caption-on-accent"),
    },
  },

  decoration: {
    decor: readCssVar("--mockup-decor"),
  },
}));

const emit = defineEmits(["resolved-visuals"]);

watch(resolvedVisualContext, (val) => emit("resolved-visuals", val), { immediate: true, deep: true });
</script>

<style scoped>
/* =========================================
   SIZING
   ========================================= */

.social-post.size--square {
  --safe-left: var(--safe-square-left);
  --safe-right: var(--safe-square-right);
  --safe-top: var(--safe-square-top);
  --safe-bottom: var(--safe-square-bottom);

  --safe-top-enabled: var(--safe-square-top-enabled);
  --safe-bottom-enabled: var(--safe-square-bottom-enabled);
  --safe-left-enabled: var(--safe-square-left-enabled);
  --safe-right-enabled: var(--safe-square-right-enabled);
}

.social-post.size--portrait {
  --safe-left: var(--safe-portrait-left);
  --safe-right: var(--safe-portrait-right);
  --safe-top: var(--safe-portrait-top);
  --safe-bottom: var(--safe-portrait-bottom);

  --safe-top-enabled: var(--safe-portrait-top-enabled);
  --safe-bottom-enabled: var(--safe-portrait-bottom-enabled);
  --safe-left-enabled: var(--safe-portrait-left-enabled);
  --safe-right-enabled: var(--safe-portrait-right-enabled);
}

.social-post.size--landscape {
  --safe-left: var(--safe-landscape-left);
  --safe-right: var(--safe-landscape-right);
  --safe-top: var(--safe-landscape-top);
  --safe-bottom: var(--safe-landscape-bottom);

  --safe-top-enabled: var(--safe-landscape-top-enabled);
  --safe-bottom-enabled: var(--safe-landscape-bottom-enabled);
  --safe-left-enabled: var(--safe-landscape-left-enabled);
  --safe-right-enabled: var(--safe-landscape-right-enabled);
}

.social-post.size--story {
  --safe-left: var(--safe-story-left);
  --safe-right: var(--safe-story-right);
  --safe-top: var(--safe-story-top);
  --safe-bottom: var(--safe-story-bottom);

  --safe-top-enabled: var(--safe-story-top-enabled);
  --safe-bottom-enabled: var(--safe-story-bottom-enabled);
  --safe-left-enabled: var(--safe-story-left-enabled);
  --safe-right-enabled: var(--safe-story-right-enabled);
}

/* fallback */
.social-post {
  position: absolute;
  height: 100%;
  width: 100%;

  /* fallback */
  --safe-left: 2.5rem;
  --safe-right: 2.5rem;
  --safe-top: 2.5rem;
  --safe-bottom: 2.5rem;
}

/* =========================================
   =========================================
   CONTENT STACK
   =========================================
   ========================================= */

.post-content {
  color: inherit;
  position: absolute;
  inset: 0;
  transform: scale(var(--scale));
}

/* baseline */
.size--landscape .post-content {
  --scale: 1;
}

/* perceptual corrections */
.size--square .post-content {
  --scale: 1.08;
}

.size--portrait .post-content,
.size--story .post-content {
  --scale: 1.16;
}

/* apply */
.post-content {
  width: calc(100% / var(--scale));
  height: calc(100% / var(--scale));
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(var(--scale));
}

/* %%%%%%%%%%%%%%%%%%%%% */

.post-safe {
  position: absolute;
  top: var(--safe-top);
  right: var(--safe-right);
  bottom: var(--safe-bottom);
  left: var(--safe-left);
  padding: var(--card-padding);
}

.size--landscape .post-safe {
  padding: 1cqw;
}

.size--square .post-safe {
  padding: 1.5cqw;
}

.post-free {
  position: absolute;
  width: 100%;
  height: 100%;
  max-width: none;
  inset: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--mockup-decor);
}

.post-watermark {
  position: absolute;
  right: 4cqw;
  bottom: 4cqw;

  width: 10cqw;
  height: 10cqw;

  opacity: 0.6;

  mix-blend-mode: difference;

  pointer-events: none;
}

/* =========================================
   =========================================
   BACKGROUND STACK
   =========================================
   ========================================= */

.post-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.post-bg__color,
.post-bg__pattern,
.post-bg__image,
.post-bg__logo {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.post-bg__logo {
  color: var(--mockup-decor);
}

.post-bg__logo :deep(svg),
.post-bg__logo :deep(svg *) {
  fill: currentColor !important;
  stroke: currentColor !important;
}

/* ===============================================
   DERIVED COLOR FOR LARGE LOGO & DECORATION
   primary-dark | secondary-light | neutral
   =============================================== */

.bg--plain-primary {
  --mockup-decor: var(--color-primary-dark);
}

.bg--plain-secondary {
  --mockup-decor: var(--color-secondary-light);
}

.bg--plain-neutral {
  --mockup-decor: var(--color-background);
}

/* ===============================================
   PLAIN BACKGROUND: primary | secondary | neutral
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

/* =========================================
   LARGE LOGO BACKGROUND
   ========================================= */

.post-bg__logo {
  display: flex;
  justify-content: center;
  align-items: center;
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

/* =========================================
   TILED SMALL LOGO BACKGROUND
   ========================================= */

/* tile size  >  logo visual bounds */
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
  --pattern-opacity: 0.65;
  --tile-x: 70px;
  --tile-y: 150px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--runkstervolksfeesten .post-bg__pattern {
  --pattern-opacity: 0.55;
  --tile-x: 70px;
  --tile-y: 170px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--ocrunkst .post-bg__pattern {
  --pattern-opacity: 0.35;
  --tile-x: 155px;
  --tile-y: 125px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--wijkraadrunkst .post-bg__pattern {
  --pattern-opacity: 0.35;
  --tile-x: 230px;
  --tile-y: 130px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--steviala .post-bg__pattern {
  --pattern-opacity: 0.25;
  --tile-x: 190px;
  --tile-y: 90px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--kenis .post-bg__pattern {
  --pattern-opacity: 0.25;
  --tile-x: 170px;
  --tile-y: 95px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--tropical .post-bg__pattern {
  --pattern-opacity: 1;
  --tile-x: 150px;
  --tile-y: 65px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--cardgameshop .post-bg__pattern {
  --pattern-opacity: 0.2;
  --tile-x: 190px;
  --tile-y: 75px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--blooloc .post-bg__pattern {
  --pattern-opacity: 0.05;
  --tile-x: 80px;
  --tile-y: 85px;
}

.brand--glaede .post-bg__pattern {
  --pattern-opacity: 0.3;
  --tile-x: 40px;
  --tile-y: 85px;
  --pattern-offset-x: calc(var(--tile-x) / 2);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

.brand--ellevation .post-bg__pattern {
  --pattern-opacity: 0.5;
  --tile-x: 40px;
  --tile-y: 85px;
  --pattern-offset-x: calc(var(--tile-x) * 0.25);
  --pattern-offset-y: calc(var(--tile-y) / 2);
}

/* =========================================
   IMAGE BACKGROUND
   ========================================= */

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
