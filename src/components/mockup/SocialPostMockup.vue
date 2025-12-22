<template>
  <PostWrapper :size="size">
    <div class="social-post" :class="`size--${size}`">
      <div class="post-bg" :class="backgroundClass">
        <!-- plain color layer -->
        <div class="post-bg__color"></div>

        <!-- pattern layer -->
        <div class="post-bg__pattern" :class="[patternClass, patternToneClass]"></div>

        <!-- logo layer -->
        <div v-if="brandLogo" class="post-bg__logo" v-html="coloredLogo"></div>

        <!-- image layer -->
        <div v-if="usePhoto" class="post-bg__image" :style="{ backgroundImage: `url(${photoSrc})` }"></div>

        <!-- overlay (only active in image mode via CSS) -->
        <div class="post-bg__overlay"></div>
      </div>

      <!-- <div v-if="showCornerShapes" class="corner-shape square corner-shape--bl"></div>
      <div v-if="showCornerShapes" class="corner-shape rect corner-shape--br"></div> -->

      <SafeZoneOverlay v-if="showSafeZone" />

      <div class="post-content" :class="`post-content--${backgroundTone}`" :style="mockupTextVars">
        <div
          class="post-canvas"
          :post-type="$attrs.postType || null"
          :class="{
            'info-autolayout-wrapper': $attrs.postType === 'info',
          }">
          <slot />
        </div>
      </div>

      <div class="post-watermark" v-if="showBrand">
        <BrandWatermark />
      </div>
    </div>
  </PostWrapper>
</template>

<script setup>
import BrandWatermark from "@/components/brand/BrandWatermark.vue";
import PostWrapper from "@/components/mockup/PostWrapper.vue";
import { ref, watch, computed } from "vue";
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
  showBrand: Boolean,
  showSafeZone: {
    type: Boolean,
    default: false,
  },
});

/* ----------------------------------------------
   LOGO COLOR
---------------------------------------------- */
const rawSvg = ref(null);

watch(
  () => props.brandLogo,
  async (url) => {
    if (!url) {
      rawSvg.value = null;
      return;
    }
    rawSvg.value = await fetch(url).then((r) => r.text());
  },
  { immediate: true }
);

const toneColor = computed(() =>
  props.backgroundTone === "primary" ? "var(--ui-secondary-bg)" : "var(--ui-primary-bg)"
);

const coloredLogo = computed(() => {
  if (!rawSvg.value) return null;
  const color = toneColor.value;

  return rawSvg.value
    .replace(/stroke:\s*#[0-9A-Fa-f]{3,6}/g, `stroke: ${color}`)
    .replace(/fill:\s*#[0-9A-Fa-f]{3,6}/g, `fill: ${color}`)
    .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
    .replace(/fill="[^"]*"/g, `fill="${color}"`);
});

/* ----------------------------------------------
   PATTERN CLASSES
---------------------------------------------- */

const patternClass = computed(() => {
  if (!props.backgroundClass) return "";
  return props.backgroundClass
    .split(" ")
    .filter((cls) => cls.startsWith("pattern-"))
    .join(" ");
});

const patternToneClass = computed(() => {
  if (!props.backgroundClass?.includes("pattern-")) return "";
  return props.backgroundTone === "secondary" ? "pattern--secondary" : "pattern--primary";
});

/* ----------------------------------------------
   TEXT COLORS (LOCAL)
---------------------------------------------- */
function readVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const mockupTextVars = ref({
  "--dynamic-text": "",
  "--dynamic-title": "",
  "--dynamic-text-accent": "",
});

const resolvedText = computed(() => ({
  title: mockupTextVars.value["--dynamic-title"] || null,
  body: mockupTextVars.value["--dynamic-text"] || null,
  accent: mockupTextVars.value["--dynamic-text-accent"] || null,
}));

function recomputeMockupTextVars() {
  if (!props.bgColors || props.bgColors.length === 0) return;

  const cs = getComputedStyle(document.documentElement);

  const bodyDark = cs.getPropertyValue("--color-text").trim();
  const titleDark = cs.getPropertyValue("--color-title").trim();
  const light = cs.getPropertyValue("--color-text-inverse").trim();

  let needsLight = false;

  for (const v of props.bgColors) {
    const bg = readVar(v);
    if (!bg) continue;
    if (getTextModeForBackground(bg, bodyDark, light) === "light") {
      needsLight = true;
      break;
    }
  }

  const mainText = needsLight ? light : bodyDark;
  const mainTitle = needsLight ? light : titleDark;

  let accentText = bodyDark;
  const accentBg = readVar("--dynamic-accent");
  if (accentBg) {
    accentText = getTextModeForBackground(accentBg, bodyDark, light) === "light" ? light : bodyDark;
  }

  mockupTextVars.value = {
    "--dynamic-text": mainText,
    "--dynamic-title": mainTitle,
    "--dynamic-text-accent": accentText,
  };
}

/* ----------------------------------------------
   RECOMPUTE ON PROP CHANGE
---------------------------------------------- */
watch(
  () => [props.backgroundClass, props.backgroundTone, props.bgColors, props.useColoredBackground],
  recomputeMockupTextVars,
  { immediate: true, deep: true }
);

/* ----------------------------------------------
   EXPORT TO STYLE INSPECTOR
---------------------------------------------- */
function resolveHex(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const resolvedVisualContext = computed(() => ({
  background: {
    hex: props.backgroundTone === "secondary" ? resolveHex("--ui-secondary-bg") : resolveHex("--ui-primary-bg"),
  },

  surfaces: {
    section: resolveHex("--ui-section-bg"),
    panel: resolveHex("--ui-panel-bg"),
  },

  accents: {
    accent: resolveHex("--dynamic-accent"),
  },

  textStatic: {
    titleOnSection: resolveHex("--title-on-section"),
    titleOnPanel: resolveHex("--title-on-panel"),
    bodyOnSection: resolveHex("--text-on-section"),
    bodyOnPanel: resolveHex("--text-on-panel"),
    caption: resolveHex("--ui-caption"),
  },

  overlay: {
    active: props.backgroundClass?.includes("bg--image"),
    hex: props.backgroundTone === "secondary" ? resolveHex("--ui-secondary-bg") : resolveHex("--ui-primary-bg"),
  },
}));

const emit = defineEmits(["resolved-visuals"]);

watch(
  () => [resolvedVisualContext.value, resolvedText.value],
  () => {
    emit("resolved-visuals", {
      ...resolvedVisualContext.value,
      text: resolvedText.value,
    });
  },
  { immediate: true, deep: true }
);
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
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  max-width: none;
  color: inherit;
}

.post-title {
  font-family: var(--font-title);
  font-size: var(--fs-h2);
  line-height: var(--lh-heading);
  margin-bottom: var(--space-20);
}

.post-subtitle {
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body);
}

.post-watermark {
  position: absolute;
  right: var(--safe-right);
  bottom: var(--safe-bottom);
  width: 4rem;
  height: 4rem;
  opacity: 0.6;
}

.post-canvas {
  height: 100%;
  padding: var(--space-20);
}

/* InfoPost auto-layout only activates when needed */
.info-autolayout-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

/* =========================================
   LABELS
   ========================================= */

.post-label {
  display: flex;
  gap: var(--space-10);
  align-items: center;
  margin-bottom: var(--space-30);
}

.post-label__icon {
  width: 4rem;
  height: 4rem;
}

.post-label__icon i {
  font-size: 40px;
}

.post-label-icon__img {
  object-fit: contain;
}

.label--large {
  font-size: var(--fs-body-lg);
}
.label--small {
  font-size: var(--fs-body-sm);
}

/* =========================================
   =========================================
   BACKGROUND STACK
   =========================================
   ========================================= */

.post-bg {
  position: absolute;
  inset: 0;
}

.post-bg__color,
.post-bg__pattern,
.post-bg__image,
.post-bg__overlay,
.post-bg__logo {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* plain backgrounds - DYNAMIC */
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
   LOGO
   ========================================= */

.post-bg__logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.post-bg__logo :deep(svg) {
  position: absolute;
  top: 0;
  left: 0;
  scale: 100%;
  opacity: 0.2;
  transform: translate(-35%, 0);
  overflow: hidden;
}

/* =========================================
   IMAGE
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

/* overlay is off by default; image mode turns it on */
.post-bg__overlay {
  opacity: 0;
}

/* image mode: show image and tone-dependent overlay */
.bg--image .post-bg__image {
  opacity: 1;
}

.bg--image.bg--plain-primary .post-bg__overlay {
  background: var(--ui-primary-bg);
  opacity: 0.6;
}

.bg--image.bg--plain-secondary .post-bg__overlay {
  background: var(--ui-secondary-bg);
  opacity: 0.6;
}

/* ============================================
   BASE AUTO-LAYOUT (applies to all ratios)
=============================================== */

.info-autolayout {
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
  padding: var(--space-40);
  width: 100%;
  height: 100%;
  overflow: hidden; /* never scroll, like a Figma frame */
}

/* TITLE + BODY should handle shrinkage */
.info-autolayout .post-text-block__headline {
  flex-shrink: 0;
}
.info-autolayout .post-text-block__body {
  flex-shrink: 1;
}
</style>
