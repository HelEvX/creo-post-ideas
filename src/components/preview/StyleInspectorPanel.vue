<template>
  <aside class="main-preview__styles">
    <div class="styles__fonts">
      <h6>Lettertypes</h6>
      <!-- IF font_source === 'google' THEN render_as_link ELSE render_as_text -->
      <p class="styles__hint">Grote tekst</p>
      <a
        v-if="titleFontData.link"
        :href="titleFontData.link"
        target="_blank"
        rel="noopener"
        class="title-font font-row is-link">
        {{ titleFontData.name }}
      </a>

      <div v-else class="title-font font-row">
        {{ titleFontData.name }}
      </div>

      <p class="styles__hint">Gewone tekst</p>
      <a
        v-if="bodyFontData.link"
        :href="bodyFontData.link"
        target="_blank"
        rel="noopener"
        class="body-font font-row is-link">
        {{ bodyFontData.name }}
      </a>

      <div v-else class="body-font font-row">
        {{ bodyFontData.name }}
      </div>
    </div>

    <div class="main-preview__styles__swatches">
      <h6>Kleuren</h6>
      <p class="styles__hint">Klik om te kopieren</p>
      <div class="main-preview__styles__swatch-container">
        <button
          v-for="color in swatches"
          :key="`${color.hex}-${color.alpha}`"
          class="main-preview__styles__swatch"
          :style="{
            background: swatchBackground(color),
            color: swatchTextColor(color.hex),
          }"
          @click="copyColor(color)">
          <span class="swatch__label">{{ swatchLabel(color) }}</span>
          <span v-if="copied === swatchLabel(color)" class="swatch__toast">Gekopieerd</span>
        </button>
      </div>
    </div>

    <div class="main-preview__styles__other">
      <div>
        <h6>Randen & hoeken</h6>
        <div class="main-preview__styles__borders-corners">
          <div class="card main-preview__styles__borders"></div>
          <div class="card main-preview__styles__corners"></div>
        </div>
      </div>
      <div>
        <h6>Shaduw</h6>
        <div class="card main-preview__styles__shadows"></div>
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

/* ------------------------------------------------------------
   FONTS: clean name + source from imports (not from name)
------------------------------------------------------------ */

function cleanFontName(font) {
  if (!font) return null;
  return font.split(",")[0].replace(/['"]/g, "").trim();
}

function detectFontSource(name) {
  if (!name) return "unknown";

  // Adobe fonts in your system are kebab-case
  if (/^[a-z0-9-]+$/.test(name)) return "adobe";

  // Everything else is Google Fonts
  return "google";
}

function buildFontLink(name, source) {
  if (!name) return null;

  if (source === "google") {
    return `https://fonts.google.com/specimen/${name.replace(/\s+/g, "+")}`;
  }

  if (source === "adobe") {
    return `https://fonts.adobe.com/fonts/${name.toLowerCase()}`;
  }

  return null;
}

function fontData(fontFamilyString) {
  const name = cleanFontName(fontFamilyString);
  const source = detectFontSource(name);
  return {
    name,
    source,
    link: buildFontLink(name, source),
  };
}

const titleFontData = computed(() => fontData(props.titleFont));
const bodyFontData = computed(() => fontData(props.bodyFont));

/* ------------------------------------------------------------
   SWATCHES (normalized, unique, visible colors only)
------------------------------------------------------------ */

/* one reusable probe to resolve var() / color-mix() / named colors into computed rgb/rgba */
let _probeEl = null;
function resolveToComputedRgb(value) {
  if (!value) return null;

  if (!_probeEl) {
    _probeEl = document.createElement("span");
    _probeEl.setAttribute("data-color-probe", "true");
    _probeEl.style.position = "absolute";
    _probeEl.style.left = "-9999px";
    _probeEl.style.top = "-9999px";
    _probeEl.style.opacity = "0";
    _probeEl.style.pointerEvents = "none";
    document.body.appendChild(_probeEl);
  }

  _probeEl.style.color = "";
  _probeEl.style.color = value;

  const computed = getComputedStyle(_probeEl).color;
  if (!computed) return null;

  // If browser couldn't parse, computed can be empty or unchanged; guard on obvious failures.
  if (computed === "rgba(0, 0, 0, 0)") return null;

  return computed;
}

function swatchTextColor(bgHex) {
  const root = getComputedStyle(document.documentElement);

  const dark = root.getPropertyValue("--color-text").trim() || "#000000";
  const light = root.getPropertyValue("--color-text-inverse").trim() || "#ffffff";

  return getTextModeForBackground(bgHex, dark, light) === "light" ? light : dark;
}

function normalizeColor(value) {
  if (!value) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  // Hex (3/4/6/8)
  if (raw.startsWith("#")) {
    const hex = raw.toLowerCase();

    if (hex.length === 4) {
      const r = hex[1],
        g = hex[2],
        b = hex[3];
      return { hex: `#${r}${r}${g}${g}${b}${b}`, alpha: 100 };
    }

    if (hex.length === 5) {
      const r = hex[1],
        g = hex[2],
        b = hex[3],
        a = hex[4];
      const alpha = Math.round((parseInt(a + a, 16) / 255) * 100);
      return { hex: `#${r}${r}${g}${g}${b}${b}`, alpha };
    }

    if (hex.length === 7) return { hex, alpha: 100 };

    if (hex.length === 9) {
      const rgb = hex.slice(0, 7);
      const a = hex.slice(7, 9);
      const alpha = Math.round((parseInt(a, 16) / 255) * 100);
      return { hex: rgb, alpha };
    }

    return null;
  }

  // If not rgb/rgba already, resolve to computed rgb/rgba (handles var(--x), color-mix, named)
  const resolved = raw.startsWith("rgb") ? raw : resolveToComputedRgb(raw);
  if (!resolved) return null;

  const m = resolved.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (!m) return null;

  const r = Number(m[1]).toString(16).padStart(2, "0");
  const g = Number(m[2]).toString(16).padStart(2, "0");
  const b = Number(m[3]).toString(16).padStart(2, "0");
  const a = m[4] !== undefined ? Math.round(Number(m[4]) * 100) : 100;

  return { hex: `#${r}${g}${b}`, alpha: a };
}

function collectActiveColors(ctx) {
  if (!ctx) return [];

  const root = getComputedStyle(document.documentElement);

  return [
    // backgrounds
    ctx.background?.mockup,
    ctx.background?.panel,
    ctx.background?.altPanel,
    ctx.background?.accent || root.getPropertyValue("--ui-accent-bg").trim(),

    // decoration
    ctx.decoration?.decor,

    // mockup text
    ctx.text?.mockup?.title,
    ctx.text?.mockup?.body,
    ctx.text?.mockup?.soft,

    // panel text
    ctx.text?.panel?.title,
    ctx.text?.panel?.body,
    ctx.text?.panel?.caption,

    // alt panel text
    ctx.text?.altPanel?.title,
    ctx.text?.altPanel?.body,
    ctx.text?.altPanel?.caption,

    // accent text
    ctx.text?.accent?.title,
    ctx.text?.accent?.body,
    ctx.text?.accent?.caption,
  ].filter(Boolean);
}

const swatches = computed(() => {
  const raw = collectActiveColors(props.styles);

  const normalized = raw.map(normalizeColor).filter(Boolean);

  const unique = new Map();
  for (const c of normalized) {
    const key = `${c.hex}-${c.alpha}`;
    if (!unique.has(key)) unique.set(key, c);
  }

  return Array.from(unique.values());
});

// Exports

function swatchLabel({ hex, alpha }) {
  return alpha < 100 ? `${hex} (${alpha}%)` : hex;
}

function swatchBackground({ hex, alpha }) {
  if (alpha === 100) return hex;
  return `${hex}${Math.round((alpha / 100) * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

// Copy

function toRgba({ hex, alpha }) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha === 100) return hex;

  return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
}

async function copyColor(color) {
  await navigator.clipboard.writeText(toRgba(color));
  copied.value = swatchLabel(color);
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
  font-size: var(--fs-body-sm);
  opacity: 0.8;
  border-bottom: var(--ui-panel-border);
  margin: 0 0 var(--space-10);
}

.font-row {
  display: block;
  width: 100%;
  padding: var(--space-5) 0;
  margin-bottom: var(--space-20);
  text-align: left;
}

.title-font {
  font-family: var(--font-title);
  font-weight: var(--fw-title);
}

.body-font,
.title-font {
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
  gap: var(--space-10);
}

.main-preview__styles__swatches {
  margin-bottom: var(--space-20);
}

.main-preview__styles__swatch {
  width: 100%;
  max-width: 25rem;
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
  background: var(--black-75);
  color: var(--white);
  font-size: var(--fs-body-xs);
  padding: var(--space-5) var(--space-10);
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

.main-preview__styles__borders-corners {
  display: flex;
  gap: 0.5rem;
}

.main-preview__styles__borders {
  height: 4rem;
  background-color: var(--white);
  padding: var(--space-25);
  border-radius: 0;
  box-shadow: none;
}

.main-preview__styles__corners {
  height: 4rem;
  background-color: var(--black-75);
  padding: var(--space-25);
  border: none;
  box-shadow: none;
}

.main-preview__styles__shadows {
  height: 4rem;
  background-color: var(--white);
  padding: var(--space-25);
  border: none;
  border-radius: 0;
}
</style>
