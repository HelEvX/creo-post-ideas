<template>
  <PostWrapper :aspectRatio="aspectRatio" :class="[`size--${size}`]">
    <div class="social-post">
      <div class="post-bg" :class="backgroundClass">
        <!-- plain color layer -->
        <div class="post-bg__color"></div>

        <!-- pattern layer -->
        <div class="post-bg__pattern" :class="patternClass"></div>

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
        <slot />
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
import { getContrastRatio } from "@/utils/colorBlender.js";

const props = defineProps({
  size: String,
  backgroundType: String,
  backgroundClass: String,
  backgroundTone: String,
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

const rawSvg = ref(null);
const mockupTextColor = ref("inherit");

// Load SVG file as text
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

// Tone → pick primary or secondary color for the logo
const toneColor = computed(() =>
  props.backgroundTone === "secondary" ? "var(--color-primary)" : "var(--color-secondary)"
);

// Rewrite SVG fill/stroke to match brand colors
const coloredLogo = computed(() => {
  if (!rawSvg.value) return null;

  const color = toneColor.value;

  return rawSvg.value
    .replace(/stroke:\s*#[0-9A-Fa-f]{3,6}/g, `stroke: ${color}`)
    .replace(/fill:\s*#[0-9A-Fa-f]{3,6}/g, `fill: ${color}`)
    .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
    .replace(/fill="[^"]*"/g, `fill="${color}"`);
});

// Decide text color for mockup based on brand vars
function computeMockupTextColor() {
  const root = document.documentElement;
  const cs = getComputedStyle(root);

  const dark = cs.getPropertyValue("--color-text").trim();
  const light = cs.getPropertyValue("--color-text-inverse").trim();

  if (!dark || !light) {
    mockupTextColor.value = "inherit";
    return;
  }

  // primary/secondary tone
  const tone = props.backgroundTone === "secondary" ? "secondary" : "primary";
  const bgVar = tone === "secondary" ? "--color-secondary" : "--color-primary";
  const bg = cs.getPropertyValue(bgVar).trim();

  if (!bg) {
    mockupTextColor.value = "inherit";
    return;
  }

  const cDark = getContrastRatio(dark, bg);
  const cLight = getContrastRatio(light, bg);

  mockupTextColor.value = cLight >= cDark ? light : dark;
}

onMounted(() => {
  computeMockupTextColor();
  window.addEventListener("brand-updated", computeMockupTextColor);
});

onBeforeUnmount(() => {
  window.removeEventListener("brand-updated", computeMockupTextColor);
});

// Recompute if tone or bg class changes (primary/secondary, image, etc.)
watch(
  () => [props.backgroundTone, props.backgroundClass],
  () => {
    computeMockupTextColor();
  }
);

const patternClass = computed(() => {
  if (!props.backgroundClass) return "";
  return props.backgroundClass
    .split(" ")
    .filter((cls) => cls.startsWith("pattern-"))
    .join(" ");
});

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
</style>
