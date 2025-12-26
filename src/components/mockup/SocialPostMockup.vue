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

      <div
        class="post-content"
        :class="`post-content--${backgroundTone}`"
        :style="mockupTextVars"
        :post-type="postType || null">
        <div class="post-free">
          <slot name="free" />
        </div>
        <div class="post-safe">
          <slot name="safe" />
        </div>
        <div class="post-watermark"></div>
      </div>
    </div>
  </PostWrapper>
</template>

<script setup>
import PostWrapper from "@/components/mockup/PostWrapper.vue";
import { ref, watch, computed } from "vue";
import { getTextModeForBackground } from "@/utils/colorLogic.js";
import { tint, shade } from "@/utils/colorBlender.js";
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
  showSafeZone: {
    type: Boolean,
    default: false,
  },
  postType: String,
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

/* ----------------------------------------------
   DERIVED ALT PANEL BACKGROUND
   - Uses resolved mockup background
   - Light bg  -> darker panel
   - Dark bg   -> lighter panel
   - Hue preserved
---------------------------------------------- */
function recomputeAltPanelBg() {
  if (!props.bgColors || props.bgColors.length === 0) return;

  const cs = getComputedStyle(document.documentElement);
  const darkText = cs.getPropertyValue("--color-text").trim();
  const lightText = cs.getPropertyValue("--color-text-inverse").trim();

  let bgHex = null;
  for (const v of props.bgColors) {
    const val = readVar(v);
    if (val) {
      bgHex = val;
      break;
    }
  }
  if (!bgHex) return;

  const mode = getTextModeForBackground(bgHex, darkText, lightText);
  const STEP1 = 0.18;
  const STEP2 = 0.06;

  const derived = mode === "light" ? tint(bgHex, STEP1) : shade(bgHex, STEP2);

  document.documentElement.style.setProperty("--ui-alt-panel-bg-derived", derived);
}

const mockupTextVars = ref({
  "--dynamic-text": "",
  "--dynamic-title": "",
});

const resolvedText = computed(() => ({
  title: mockupTextVars.value["--dynamic-title"] || null,
  body: mockupTextVars.value["--dynamic-text"] || null,
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

  mockupTextVars.value = {
    "--dynamic-text": mainText,
    "--dynamic-title": mainTitle,
  };
}

/* ----------------------------------------------
   RECOMPUTE ON PROP CHANGE
---------------------------------------------- */
watch(
  () => [props.backgroundClass, props.backgroundTone, props.bgColors, props.useColoredBackground],
  () => {
    recomputeMockupTextVars();
    recomputeAltPanelBg();
  },
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
    altSection: resolveHex("--ui-alt-section-bg"), // neutral bg
    altPanel: resolveHex("--ui-alt-panel-bg"),
    panel: resolveHex("--ui-panel-bg"),
  },

  accents: {
    accent: resolveHex("--dynamic-accent"),
  },

  textStatic: {
    titleOnSection: resolveHex("--dynamic-title"),
    bodyOnSection: resolveHex("--dynamic-text"),

    titleOnPanel: resolveHex("--title-on-panel"),
    bodyOnPanel: resolveHex("--text-on-panel"),
    captionOnPanel: resolveHex("--dynamic-caption"),

    titleOnAltPanel: resolveHex("--title-on-alt-panel"),
    bodyOnAltPanel: resolveHex("--text-on-alt-panel"),
    captionOnAltPanel: resolveHex("--dynamic-alt-caption"),

    accentText: resolveHex("--dynamic-text"),
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
  transform: scale(var(--scale));
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
  scale: 0.95; /* create 'padding'*/
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
}

.post-watermark {
  margin: var(--space-20);
  width: var(--space-50);
  height: var(--space-50);
  opacity: 0.6;
  background: var(--red-500);
  position: absolute;
  bottom: 0;
  right: 0;
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
.post-bg__overlay,
.post-bg__logo {
  position: absolute;
  inset: 0;
  pointer-events: none;
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
   LOGO BACKGROUND
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
</style>
