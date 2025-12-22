<template>
  <aside class="main-preview__styles">
    <div class="styles__fonts">
      <h6>Lettertypes</h6>
      <p class="styles__hint">Grote tekst</p>
      <div class="title-font">{{ titleFont }}</div>
      <p class="styles__hint">Gewone tekst</p>
      <div class="body-font">{{ bodyFont }}</div>
    </div>

    <div class="main-preview__styles__swatches">
      <h6>Kleuren</h6>
      <p class="styles__hint">Klik om te kopieren</p>
      <div class="main-preview__styles__swatch-container">
        <button
          v-for="color in swatches"
          :key="color"
          class="main-preview__styles__swatch"
          :style="{ background: color, color: swatchTextColor(color) }"
          @click="copyColor(color)">
          <span class="swatch__label">{{ color }}</span>
          <span v-if="copied === color" class="swatch__toast">Gekopieerd</span>
        </button>
      </div>
    </div>

    <div class="main-preview__styles__other">
      <div>
        <h6>Randen & hoeken</h6>
        <div class="main-preview__styles__corners"></div>
      </div>
      <div>
        <h6>Shaduw</h6>
        <div class="main-preview__styles__shadows"></div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from "vue";
import { getTextModeForBackground } from "@/utils/colorLogic.js";

const props = defineProps({
  titleFont: String,
  bodyFont: String,
  styles: Object,
});

const copied = ref(null);

function readCss(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const swatchInk = computed(() => {
  const dark = readCss("--color-text") || "var(--ui-text)";
  const light = readCss("--color-text-inverse") || "var(--white)";
  return { dark, light };
});

function swatchTextColor(bgHex) {
  const { dark, light } = swatchInk.value;
  return getTextModeForBackground(bgHex, dark, light) === "light" ? light : dark;
}

function isColor(value) {
  return typeof value === "string" && (value.startsWith("#") || value.startsWith("rgb") || value.startsWith("hsl"));
}

function collectColors(obj, out) {
  if (!obj) return;
  for (const v of Object.values(obj)) {
    if (isColor(v)) out.push(v);
    else if (typeof v === "object") collectColors(v, out);
  }
}

const swatches = computed(() => {
  const colors = [];
  collectColors(props.styles, colors);
  return Array.from(new Set(colors));
});

async function copyColor(hex) {
  await navigator.clipboard.writeText(hex);
  copied.value = hex;
  setTimeout(() => (copied.value = null), 1000);
}
</script>

<style scoped>
.main-preview__styles {
  padding-right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-20);
}
@media (max-width: 991px) {
  .main-preview__styles {
    padding: var(--space-50) var(--space-20) var(--space-20);
  }
}

.main-preview__styles h6 {
  text-align: left;
}

p.styles__hint {
  text-align: left;
  font-size: var(--fs-body-xs);
  opacity: 0.8;
  border-bottom: var(--ui-panel-border);
  margin: 0 0 var(--space-5);
}

.title-font {
  font-family: var(--font-title);
  font-weight: var(--fw-title);
}

.body-font,
.title-font {
  margin-bottom: var(--space-20);
  text-align: left;
}

/* swatch styling */

.main-preview__styles div {
  width: 100%;
}

.main-preview__styles__swatch-container {
  display: flex;
  flex-direction: column;

  width: 100%;
  gap: var(--space-20);
}

.main-preview__styles__swatches {
  margin-bottom: var(--space-20);
}

.main-preview__styles__swatch {
  width: 100%;
  height: 4rem;
  border: var(--ui-panel-border-soft);
  border-radius: var(--radius-sm);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.swatch__label {
  font-weight: 500;
  letter-spacing: 0.06em;
}

.swatch__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.95;
}

.swatch__toast {
  position: absolute;
  right: 0.6rem;
  bottom: 0.45rem;
  background: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fs-body-xs);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
}
@media (max-width: 1199px) {
  .swatch__toast {
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
}

/* CORNERS & SHADOW STYLES */

.main-preview__styles__other {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.main-preview__styles__other h6 {
  margin-bottom: var(--space-10);
}

.main-preview__styles__corners {
  padding: var(--space-25);
  border: var(--border-solid-card);
  border-radius: var(--border-radius-card);
}

.main-preview__styles__shadows {
  padding: var(--space-25);
  box-shadow: var(--shadow);
}
</style>
