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

        <!-- overlay (only active in image mode via CSS) -->
        <div class="post-bg__overlay"></div>
      </div>

      <SafeZoneOverlay v-if="showSafeZone" />

      <div
        ref="mockupScopeEl"
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
   OVERRIDE
---------------------------------------------- */

const altPanelCaptionOverride = ref(null);

function onAltPanelCaptionOverride(e) {
  altPanelCaptionOverride.value = e.detail;

  // Force an immediate recompute so mockupVars is rewritten with the override.
  // This is the only place where the caption color is actually applied.
  requestAnimationFrame(() => recomputeMockupVars());
}

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

// const toneColor = computed(() => "var(--mockup-decor)");

// const coloredLogo = computed(() => {
//   if (!rawSvg.value) return null;
//   const color = toneColor.value;

//   return rawSvg.value
//     .replace(/stroke:\s*#[0-9A-Fa-f]{3,6}/g, `stroke: ${color}`)
//     .replace(/fill:\s*#[0-9A-Fa-f]{3,6}/g, `fill: ${color}`)
//     .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
//     .replace(/fill="[^"]*"/g, `fill="${color}"`);
// });

const logoPatternStyle = computed(() => {
  if (!rawSvg.value) return null;

  const encoded = encodeURIComponent(rawSvg.value).replace(/'/g, "%27").replace(/"/g, "%22");

  return {
    "--logo-pattern-svg": `url("data:image/svg+xml,${encoded}")`,
  };
});

console.log("brandLogo:", props.brandLogo);

/* ----------------------------------------------
   TEXT COLORS (LOCAL)
---------------------------------------------- */
function readVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

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
    backgroundColor: "var(--dynamic-title)",
  };
});

/* ----------------------------------------------
   DERIVED ALT PANEL BACKGROUND
   - Uses resolved mockup background
   - Light bg  -> darker panel
   - Dark bg   -> lighter panel
   - Hue preserved
---------------------------------------------- */

const mockupScopeEl = ref(null);

const mockupVars = ref({
  "--dynamic-text": "",
  "--dynamic-title": "",
  "--dynamic-soft": "",
  "--ui-alt-panel-bg-derived": "",
  "--text-soft-on-alt-panel": "",
});

const resolvedText = computed(() => ({
  title: mockupVars.value["--dynamic-title"] || null,
  body: mockupVars.value["--dynamic-text"] || null,
}));

function recomputeMockupVars() {
  if (!props.bgColors || props.bgColors.length === 0) return;

  const cs = getComputedStyle(document.documentElement);

  const bodyDark = cs.getPropertyValue("--color-text").trim();
  const titleDark = cs.getPropertyValue("--color-title").trim();
  const captionDark = cs.getPropertyValue("--color-primary-dark").trim();

  const light = cs.getPropertyValue("--color-text-inverse").trim();
  const captionLight = cs.getPropertyValue("--color-primary-lighter").trim();

  if (!light || (!bodyDark && !titleDark)) return;

  // Resolve first available mockup background from bgColors
  let bgHex = null;
  for (const v of props.bgColors) {
    const val = readVar(v);
    if (val) {
      bgHex = val;
      break;
    }
  }
  if (!bgHex) return;

  // Decide text inversion by perceived mode
  const needsLight = getTextModeForBackground(bgHex, bodyDark || "#000", light) === "light";

  const mainText = needsLight ? light : bodyDark;
  const mainTitle = needsLight ? light : titleDark;
  const mainCaption = needsLight ? captionLight : captionDark;

  /* --------------------------------------------------
     DERIVED ALT-PANEL BACKGROUND (TOKEN-BASED)
     Direction depends on whether PRIMARY / SECONDARY
     base color is intrinsically light or dark
  -------------------------------------------------- */

  const bgVars = Array.isArray(props.bgColors) ? props.bgColors : [];
  const tone = props.backgroundTone === "secondary" ? "secondary" : "primary";

  const usesAltSectionBg = bgVars.includes("--ui-alt-section-bg");

  let derivedAltPanel;
  let altPanelIsLight = false;

  if (props.useColoredBackground === false || usesAltSectionBg) {
    derivedAltPanel = "var(--ui-section-bg)";
    altPanelIsLight = getTextModeForBackground(readVar("--ui-section-bg"), "#000", "#fff") === "dark";
  } else {
    const baseVar = tone === "secondary" ? "--ui-secondary-bg" : "--ui-primary-bg";
    const baseHex = readVar(baseVar);

    if (!baseHex) {
      derivedAltPanel = "var(--ui-section-bg)";
      altPanelIsLight = getTextModeForBackground(readVar("--ui-section-bg"), "#000", "#fff") === "dark";
    } else {
      const baseIsLight = getTextModeForBackground(baseHex, "#000", "#fff") === "dark";

      if (tone === "secondary") {
        derivedAltPanel = baseIsLight ? "var(--color-secondary-light)" : "var(--color-tertiary)";
      } else {
        derivedAltPanel = baseIsLight ? "var(--color-primary-light)" : "var(--color-tertiary)";
      }

      // derived panel lightness follows the chosen token
      altPanelIsLight = baseIsLight;
    }
  }

  /* --------------------------------------------------
     SOFT TEXT ON ALT-PANEL
     MUST MOVE IN OPPOSITE DIRECTION OF PANEL
     panel light  -> text darker
     panel dark   -> text lighter
  -------------------------------------------------- */

  let softOnAltPanel;

  if (altPanelCaptionOverride.value !== null) {
    softOnAltPanel = altPanelCaptionOverride.value;
  } else if (tone === "secondary") {
    softOnAltPanel = altPanelIsLight ? "var(--color-secondary-darker)" : "var(--color-secondary-lighter)";
  } else {
    softOnAltPanel = altPanelIsLight ? "var(--color-primary-darker)" : "var(--color-primary-lighter)";
  }

  console.log("[mockupVars] altPanelIsLight:", altPanelIsLight);
  console.log("[mockupVars] derivedAltPanel:", derivedAltPanel);
  console.log("[mockupVars] softOnAltPanel:", softOnAltPanel);

  mockupVars.value = {
    "--dynamic-text": mainText,
    "--dynamic-title": mainTitle,
    "--dynamic-soft": mainCaption,

    "--ui-alt-panel-bg-derived": derivedAltPanel,
    "--text-soft-on-alt-panel": softOnAltPanel,
  };
}

/* ----------------------------------------------
   RECOMPUTE ON PROP CHANGE
---------------------------------------------- */
watch(
  () => [props.backgroundClass, props.backgroundTone, props.bgColors, props.useColoredBackground],
  () => {
    recomputeMockupVars();
  },
  { immediate: true, deep: true }
);

/* ----------------------------------------------
   EXPORT TO STYLE INSPECTOR
---------------------------------------------- */
function resolveHex(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const resolvedVisualContext = computed(() => {
  const isSecondary = props.backgroundTone === "secondary";
  const isColored = props.useColoredBackground !== false;
  const isImage = props.backgroundClass?.includes("bg--image");

  const bgPrimary = resolveHex("--ui-primary-bg");
  const bgSecondary = resolveHex("--ui-secondary-bg");
  const bgNeutral = resolveHex("--ui-alt-section-bg");

  const backgroundHex = !isColored ? bgNeutral : isSecondary ? bgSecondary : bgPrimary;

  const decorHex = resolveHex("--mockup-decor");

  return {
    background: {
      base: backgroundHex,
      overlay: isImage ? backgroundHex : null,
    },

    text: {
      title: resolveHex("--dynamic-title"),
      body: resolveHex("--dynamic-text"),
      soft: resolveHex("--dynamic-soft"),
    },

    decoration: {
      decor: decorHex, // borders, icons, shapes, pattern, large logo
      watermark: resolveHex("--dynamic-title"),
    },

    surfaces: {
      panel: resolveHex("--ui-panel-bg"),
      altPanel: resolveHex("--ui-alt-panel-bg-derived"),
      altSection: resolveHex("--ui-alt-section-bg"),
    },

    accents: {
      accent: resolveHex("--dynamic-accent"),
    },
  };
});

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

function onPaletteUpdated() {
  // Do NOT clear overrides here. Palette updates include "fix" actions.
  requestAnimationFrame(() => recomputeMockupVars());
}

function onBrandUpdated() {
  // Brand switch / reset should drop manual overrides.
  altPanelCaptionOverride.value = null;
  requestAnimationFrame(() => recomputeMockupVars());
}

onMounted(() => {
  window.addEventListener("alt-panel-caption-override", onAltPanelCaptionOverride);
  window.addEventListener("palette-updated", onPaletteUpdated);
  window.addEventListener("brand-updated", onBrandUpdated);
  window.addEventListener("brand-reset", onBrandUpdated);
});

onBeforeUnmount(() => {
  window.removeEventListener("alt-panel-caption-override", onAltPanelCaptionOverride);
  window.removeEventListener("palette-updated", onPaletteUpdated);
  window.removeEventListener("brand-updated", onBrandUpdated);
  window.removeEventListener("brand-reset", onBrandUpdated);
});
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
  padding: clamp(0.5em, 6cqw, 2em);
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
  right: clamp(1rem, 4cqw, 2.5rem);
  bottom: clamp(0.5rem, 4cqw, 2.5rem);

  width: clamp(2.5rem, 10cqw, 6rem);
  height: clamp(2.5rem, 10cqw, 6rem);

  opacity: 0.5;

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
.post-bg__overlay,
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
  top: 0;
  left: 0;
  opacity: var(--pattern-opacity);
  transform: translate(-25%, 15%) scale(1.2);
  overflow: hidden;
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
