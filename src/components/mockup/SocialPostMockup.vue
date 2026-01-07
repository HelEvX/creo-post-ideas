<template>
  <PostWrapper :size="size">
    <div class="social-post" :class="[`size--${size}`, backgroundClass]">
      <PostBackground
        :backgroundClass="backgroundClass"
        :brandLogo="brandLogo"
        :usePhoto="usePhoto"
        :photoSrc="photoSrc" />

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
        <PostWatermark :brandLogoSmall="brandLogoSmall" :bgColors="bgColors" />
      </div>
    </div>
  </PostWrapper>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { getTextModeForBackground } from "@/utils/colorLogic.js";
import PostWrapper from "@/components/mockup/PostWrapper.vue";
import PostBackground from "@/components/mockup/PostBackground.vue";
import SafeZoneOverlay from "@/components/mockup/SafeZoneOverlay.vue";
import PostWatermark from "@/components/mockup/PostWatermark.vue";

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

function resolveAccentBg(cs) {
  if (!cs) return null;

  const explicit = cs.getPropertyValue("--ui-accent-bg").trim();
  if (explicit) return explicit;

  const primary = cs.getPropertyValue("--ui-primary-bg").trim();
  const secondary = cs.getPropertyValue("--ui-secondary-bg").trim();
  if (!primary || !secondary) return null;

  return props.backgroundTone === "secondary" ? primary : secondary;
}

function readCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || null;
}

function readCssVarFromEl(el, name) {
  if (!el) return null;
  return getComputedStyle(el).getPropertyValue(name).trim() || null;
}

function getPostContentEl() {
  return document.querySelector(".post-content");
}

const visualTick = ref(0);

/* ----------------------------------------------
   MOCKUP-SCOPED ROLES
   - dynamic-* (text on overall mockup background)
   - surface captions (panel / alt-panel / accent)
---------------------------------------------- */

const mockupVars = ref({
  "--dynamic-text": "",
  "--dynamic-title": "",
  "--dynamic-soft": "",

  "--caption-pri-on-alt-panel": "",
  "--caption-sec-on-panel": "",
  "--caption-on-accent": "",
});

function recomputeMockupVars() {
  const root = getRootStyle();

  /* base text tokens from App.vue */
  const textDark = root.getPropertyValue("--color-text").trim();
  const titleDark = root.getPropertyValue("--color-title").trim();
  const softDark = root.getPropertyValue("--color-soft").trim();

  const textLight = root.getPropertyValue("--color-text-inverse").trim();
  const softLight = root.getPropertyValue("--color-soft-inverse").trim();

  /* caption tones */
  const primaryDark = root.getPropertyValue("--color-primary-darker").trim();
  const secondaryDark = root.getPropertyValue("--color-tertiary").trim(); /* same as secondary-darker unless defined */

  const primaryLight = root.getPropertyValue("--color-primary-lighter").trim();
  const secondaryLight = root.getPropertyValue("--color-secondary-lighter").trim();

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

  const panelBg = root.getPropertyValue("--ui-panel-bg").trim();
  const altPanelBg = root.getPropertyValue("--ui-alt-panel-bg").trim();

  const panelMode = getTextModeForBackground(panelBg, textDark, textLight);
  const altPanelMode = getTextModeForBackground(altPanelBg, textDark, textLight);

  /* panel */
  const panelCaption =
    props.backgroundTone === "secondary"
      ? panelMode === "light"
        ? secondaryLight
        : secondaryDark
      : panelMode === "light"
      ? primaryLight
      : primaryDark;

  /* alt-panel */
  const altPanelCaption =
    props.backgroundTone === "secondary"
      ? altPanelMode === "light"
        ? primaryLight
        : primaryDark
      : altPanelMode === "light"
      ? secondaryLight
      : secondaryDark;

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
     make sure value can be read before resolver overwrites it
  ---------------------------------------------- */

  mockupVars.value = {
    "--dynamic-text": `var(--fix-dynamic-text, ${dynamicText})`,
    "--dynamic-title": `var(--fix-dynamic-title, ${dynamicTitle})`,
    "--dynamic-soft": `var(--fix-dynamic-soft, ${dynamicSoft})`,

    "--title-on-panel": `var(--fix-title-on-panel, ${readCssVar("--title-on-panel")})`,
    "--title-on-alt-panel": `var(--fix-title-on-alt-panel, ${readCssVar("--title-on-alt-panel")})`,

    "--text-on-panel": `var(--fix-text-on-panel, ${readCssVar("--text-on-panel")})`,
    "--text-on-alt-panel": `var(--fix-text-on-alt-panel, ${readCssVar("--text-on-alt-panel")})`,

    "--caption-sec-on-panel": `var(--fix-caption-sec-on-panel, ${panelCaption})`,
    "--caption-pri-on-alt-panel": `var(--fix-caption-pri-on-alt-panel, ${altPanelCaption})`,
    "--caption-on-accent": `var(--fix-caption-on-accent, ${accentCaption})`,
  };

  visualTick.value++;

  window.dispatchEvent(new Event("mockup-visuals-updated"));
}

/* ----------------------------------------------
   RECOMPUTE TRIGGERS
---------------------------------------------- */
watch(
  () => [props.backgroundClass, props.backgroundTone, props.bgColors],
  () => {
    cancelAnimationFrame(rafId);
    scheduleRecompute();
  },
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

const resolvedVisualContext = computed(() => {
  // reactive trigger so this recomputes whenever mockupVars are recalculated
  visualTick.value;

  const postEl = getPostContentEl();

  // prefer the actual bg used for the mockup (derived from bgColors)
  const mockupBg = resolveFirstBg(props.bgColors) || readCssVar("--ui-alt-section-bg");

  return {
    background: {
      mockup: mockupBg,
      panel: readCssVar("--ui-panel-bg"),
      altPanel: readCssVar("--ui-alt-panel-bg"),
      accent: readCssVar("--ui-accent-bg"),
    },

    text: {
      // these live on .post-content (inline vars), not on :root
      mockup: {
        title: readCssVarFromEl(postEl, "--dynamic-title"),
        body: readCssVarFromEl(postEl, "--dynamic-text"),
        soft: readCssVarFromEl(postEl, "--dynamic-soft"),
      },

      panel: {
        title: readCssVar("--title-on-panel"),
        body: readCssVar("--text-on-panel"),
        caption: readCssVarFromEl(postEl, "--caption-sec-on-panel") || readCssVar("--caption-sec-on-panel"),
      },

      altPanel: {
        title: readCssVar("--title-on-alt-panel"),
        body: readCssVar("--text-on-alt-panel"),
        caption: readCssVarFromEl(postEl, "--caption-pri-on-alt-panel") || readCssVar("--caption-pri-on-alt-panel"),
      },

      accent: {
        title: readCssVar("--title-on-accent"),
        body: readCssVar("--text-on-accent"),
        caption: readCssVarFromEl(postEl, "--caption-on-accent") || readCssVar("--caption-on-accent"),
      },
    },

    decoration: {
      decor: readCssVarFromEl(postEl, "--mockup-decor") || readCssVar("--mockup-decor"),
    },
  };
});

const emit = defineEmits(["resolved-visuals"]);

watch(resolvedVisualContext, (val) => emit("resolved-visuals", val), { immediate: true, deep: true });
</script>

<style scoped>
/* ========
   SIZING
   ======== */

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

/* ============
   POST CONTENT
   ============ */

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

/* =================
   SAFE ZONE CONTENT
   ================= */

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
</style>
