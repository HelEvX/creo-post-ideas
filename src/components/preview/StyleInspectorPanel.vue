<template>
  <aside class="main-preview__styles">
    <h6>Stijlkenmerken</h6>

    <div class="main-preview__styles__container">
      <div class="styles__fonts">
        <p class="styles__hint">Lettertype titels</p>
        <div class="title-font">{{ titleFont }}</div>
        <p class="styles__hint">Lettertype tekst</p>
        <div class="body-font">{{ bodyFont }}</div>
      </div>

      <div class="main-preview__styles__swatches">
        <p class="styles__hint">Tik op een kleur om te kopieren.</p>
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

      <!-- <div>
        <div class="main-preview__styles__corners"></div>
        <div class="main-preview__styles__shadows"></div>
      </div> -->
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
}

.main-preview__styles h6 {
  text-align: center;
}

.main-preview__styles__container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-30);
}

p.styles__hint {
  text-align: left;
  font-size: var(--fs-body-sm);
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

.main-preview__styles__swatches {
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
  width: 100%;
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

.swatch__meta {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.9rem;
  color: var(--dynamic-text);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

.swatch__code {
  font-weight: 600;
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

/* CORNERS & SHADOW STYLES */

.main-preview__styles__corners {
  height: 5rem;
  width: 5rem;
  border-left: var(--ui-swatch-border);
  border-top: var(--ui-swatch-border);
  border-radius: var(--radius-lg) 0 0 0;
  margin: 2rem 3rem 3rem 2rem;
}

.main-preview__styles__shadows {
  height: 6rem;
  width: 6rem;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  margin: 2rem;
}

/* ================================ */
/* ======== RESPONSIVE ============ */
/* ================================ */

@media (max-width: 1199px) {
  .main-preview__styles__container {
    flex-direction: row;
  }

  .styles__hint {
    display: none;
  }

  .main-preview__styles__swatches {
    flex-direction: row;
    flex: 1;
    padding: 0 var(--space-50);
  }

  .swatch__code {
    display: none;
  }

  .swatch__meta {
    justify-content: center;
    padding: 0;
  }

  .swatch__toast {
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
}
</style>
