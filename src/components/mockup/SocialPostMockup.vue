<template>
  <PostWrapper :aspectRatio="aspectRatio" :class="[`size--${size}`, `layout--${aspectRatio}`]">
    <div class="social-post">
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

      <div class="post-content" :class="`post-content--${backgroundTone}`" :style="{ color: mockupTextColor }">
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
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { getTextModeForBackground } from "@/utils/colorLogic.js";

/* ----------------------------------------------
   PROPS
---------------------------------------------- */
const props = defineProps({
  size: String,
  backgroundType: String,
  backgroundClass: String,
  backgroundTone: String,

  // MUST be fed from MockupRenderer — FIXED THERE TOO
  bgColors: {
    type: Array,
    default: () => [],
  },

  brandLogo: String,
  usePhoto: Boolean,
  photoSrc: String,
  showBrand: Boolean,
  showCornerShapes: Boolean,
  showLabel: Boolean,
  labelSize: String,
  labelColor: String,
  labelIcon: Boolean,
  labelText: String,
  title: String,
  subtitle: String,
  showQuote: Boolean,
  quote: String,
  shapesSrc: String,
});

/* ----------------------------------------------
   LOGO COLOR
---------------------------------------------- */
const rawSvg = ref(null);

watch(
  () => props.brandLogo,
  async (url) => {
    if (!url) return (rawSvg.value = null);
    rawSvg.value = await fetch(url).then((r) => r.text());
  },
  { immediate: true }
);

// IMPORTANT: your old logic was *reversed*
const toneColor = computed(() =>
  props.backgroundTone === "secondary" ? "var(--color-secondary)" : "var(--color-primary)"
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
   PATTERN MODE SWITCH
---------------------------------------------- */
const patternToneClass = computed(() => {
  if (!props.backgroundClass?.includes("pattern-")) return "";
  return props.backgroundTone === "secondary" ? "pattern--secondary" : "pattern--primary";
});

/* ----------------------------------------------
   TEXT COLOR ENGINE (FINAL VERSION)
---------------------------------------------- */
function readVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const mockupTextColor = ref("inherit");

function computeMockupTextColor() {
  const cs = getComputedStyle(document.documentElement);
  const dark = cs.getPropertyValue("--color-text").trim();
  const light = cs.getPropertyValue("--color-text-inverse").trim();

  // If MockupRenderer forgot to send colors → use fallback detection
  const bgVars = props.bgColors && props.bgColors.length > 0 ? props.bgColors : detectBackgroundVars();

  let chosenMode = null;

  for (const v of bgVars) {
    const bg = readVar(v);
    if (!bg) continue;

    const mode = getTextModeForBackground(bg, dark, light);
    if (!chosenMode) chosenMode = mode;

    // If ANY bg forces white text → we accept white globally
    if (mode === "light") {
      mockupTextColor.value = light;
      return;
    }
  }

  // Otherwise follow default
  mockupTextColor.value = chosenMode === "dark" ? dark : light;
}

/* ----------------------------------------------
   BACKGROUND FALLBACK DETECTOR
---------------------------------------------- */
function detectBackgroundVars() {
  const cls = props.backgroundClass || "";

  if (cls.includes("bg--plain-primary")) return ["--color-primary"];
  if (cls.includes("bg--plain-secondary")) return ["--color-secondary"];

  if (cls.includes("bg--image"))
    return props.backgroundTone === "secondary" ? ["--color-secondary"] : ["--color-primary"];

  if (cls.includes("pattern-")) return ["--pattern-base", "--pattern-alt"];

  return ["--ui-section-bg"];
}

/* ----------------------------------------------
   LISTENERS
---------------------------------------------- */
onMounted(() => {
  computeMockupTextColor();
  window.addEventListener("brand-updated", computeMockupTextColor);
});

onBeforeUnmount(() => {
  window.removeEventListener("brand-updated", computeMockupTextColor);
});

watch(
  () => [props.backgroundClass, props.backgroundTone, props.bgColors],
  () => computeMockupTextColor()
);

/* ----------------------------------------------
   PATTERN CLASS
---------------------------------------------- */
const patternClass = computed(() => {
  if (!props.backgroundClass) return "";
  return props.backgroundClass
    .split(" ")
    .filter((cls) => cls.startsWith("pattern-"))
    .join(" ");
});

/* ----------------------------------------------
   ASPECT RATIO
---------------------------------------------- */
const aspectRatio = computed(() => {
  switch (props.size) {
    case "square":
      return "1 / 1";
    case "portrait":
      return "1080 / 1350";
    case "story":
      return "1080 / 1920";
    case "landscape":
      return "1080 / 566";
    case "cover":
      return "1584 / 396";
    default:
      return "1080 / 1350";
  }
});
</script>

<style scoped>
/* =========================================
   SIZING
   ========================================= */

.size--square {
  --safe-left: var(--safe-square-left);
  --safe-right: var(--safe-square-right);
  --safe-top: var(--safe-square-top);
  --safe-bottom: var(--safe-square-bottom);
}

.size--portrait {
  --safe-left: var(--safe-portrait-left);
  --safe-right: var(--safe-portrait-right);
  --safe-top: var(--safe-portrait-top);
  --safe-bottom: var(--safe-portrait-bottom);
}

.size--landscape {
  --safe-left: var(--safe-landscape-left);
  --safe-right: var(--safe-landscape-right);
  --safe-top: var(--safe-landscape-top);
  --safe-bottom: var(--safe-landscape-bottom);
}

.size--story {
  --safe-left: var(--safe-story-left);
  --safe-right: var(--safe-story-right);
  --safe-top: var(--safe-story-top);
  --safe-bottom: var(--safe-story-bottom);
}

.social-post {
  --safe-left: 2.5rem;
  --safe-right: 2.5rem;
  --safe-top: 2.5rem;
  --safe-bottom: 2.5rem;

  position: relative;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
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
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);
  max-width: none;
}

.post-content--primary,
.post-content--secondary {
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
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
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
   QUOTE POSTS
   ========================================= */

.post-quote {
  display: flex;
  gap: var(--space-20);
  margin-top: var(--space-30);
}

.post-quote__icon {
  width: 3rem;
  height: 3rem;
  background: var(--color-primary-light);
  border-radius: var(--radius-sm);
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

/* plain backgrounds */
.bg--plain-primary .post-bg__color {
  background: var(--color-primary);
}

.bg--plain-secondary .post-bg__color {
  background: var(--color-secondary);
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
   PATTERNS
   ========================================= */

/* pattern mode: pattern class holds the actual pattern,
   this just makes sure it shows on the pattern layer */
/* .bg--pattern .post-bg__pattern {
  opacity: 1;
} */

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
  background: var(--color-primary);
  opacity: 0.6;
}

.bg--image.bg--plain-secondary .post-bg__overlay {
  background: var(--color-secondary);
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
  box-sizing: border-box;
  overflow: hidden; /* never scroll, like a Figma frame */
}

/* TITLE + BODY should handle shrinkage */
.info-autolayout .post-text-block__headline {
  flex-shrink: 0;
}
.info-autolayout .post-text-block__body {
  flex-shrink: 1;
}

/* ============================================
   SQUARE 1:1  (default)
=============================================== */

.layout--square .info-autolayout {
  flex-direction: column;
  gap: var(--space-20);
  padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
  font-size: 100%;
}

/* ============================================
   PORTRAIT 5:4
   Slight compression, but still column
=============================================== */

.layout--portrait .info-autolayout {
  gap: var(--space-10);
  padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
  font-size: 95%;
}

/* ============================================
   STORY 9:16
   Stronger compression + small type downscale
=============================================== */

.layout--story .info-autolayout {
  gap: var(--space-5);
  padding: calc(var(--safe-top) * 0.7) calc(var(--safe-right) * 0.7) calc(var(--safe-bottom) * 0.7)
    calc(var(--safe-left) * 0.7);
  font-size: 88%;
}

/* ============================================
   LANDSCAPE 16:9
   Switch to row layout (side-by-side)
=============================================== */

.layout--landscape .info-autolayout {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  gap: var(--space-30);

  padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
  font-size: 95%;
}

/* headline left, paragraph right in landscape */
.layout--landscape .post-text-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 60%; /* prevents overflow */
}

/* allow paragraph to wrap earlier */
.layout--landscape .post-text-block__body {
  max-width: 100%;
}
</style>
