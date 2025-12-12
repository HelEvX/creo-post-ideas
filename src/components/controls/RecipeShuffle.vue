<script setup>
import { ref, watch, computed, nextTick, onMounted } from "vue";
import { recipes } from "../../data/recipes.js";
import {
  getContrastRatio,
  anyToRgb,
  rgbToHsl,
  tint,
  shade,
  tone,
  evaluateContrastVisual,
} from "../../utils/colorBlender.js";

// ---------------------------------------------
// Props
// ---------------------------------------------
const props = defineProps({
  brandTokens: { type: Object, required: true },
  scales: { type: Object, required: false },
});

// ---------------------------------------------
// Reactive State
// ---------------------------------------------
const index = ref(-1); // -1 means brand default
const total = recipes.length;
const activeRecipe = computed(() => {
  const i = index.value;
  if (i < 0) return null;
  // force reactivity by copying the object
  return { ...recipes[i] };
});

// ---------------------------------------------
// Lifecycle
// ---------------------------------------------
onMounted(() => {
  console.log("RecipeShuffle mounted");
});

// ---------------------------------------------
// Helpers
// ---------------------------------------------
function readCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function resolveRoleValue(v, scales = props.scales) {
  if (Array.isArray(v)) {
    const [scaleName, idx] = v;
    const arr = scales?.[scaleName];
    return arr?.[idx] || null;
  }
  if (typeof v === "string" && v.startsWith("var(")) {
    const cssVarName = v.slice(4, -1).trim();
    return readCSSVar(cssVarName);
  }
  if (typeof v === "string" && v.startsWith("#")) return v;
  return null;
}

function pickReadablePillText(bgHex) {
  const dark = readCSSVar("--color-text");
  const light = readCSSVar("--color-text-inverse");

  if (!bgHex || !dark || !light) return dark;

  // Only extract lightness (l) because h and s are not used
  const [, , l] = rgbToHsl(anyToRgb(bgHex));

  // VERY LIGHT BACKGROUND → dark text
  if (l >= 0.78) {
    return dark;
  }

  // VERY DARK BACKGROUND → white text
  if (l <= 0.32) {
    return light;
  }

  // Mid-tones → choose best contrast with small perceptual override
  const cDark = getContrastRatio(dark, bgHex);
  const cLight = getContrastRatio(light, bgHex);

  const bothMid = cDark >= 2.4 && cLight >= 2.4;

  if (bothMid && cLight > cDark * 0.9) {
    return light;
  }

  return cDark > cLight ? dark : light;
}

// ---------------------------------------------
// Apply Recipe
// ---------------------------------------------
function applyActiveRecipe() {
  if (!props.scales || !activeRecipe.value) return;
  const roles = activeRecipe.value.roles;
  const root = document.documentElement;

  // deep clone so new values are always re-resolved
  const scalesCopy = JSON.parse(JSON.stringify(props.scales));

  for (const [cssVar, spec] of Object.entries(roles)) {
    const hex = resolveRoleValue(spec, scalesCopy);
    if (hex) root.style.setProperty(cssVar, hex, "important");
  }

  // Log which recipe was applied
  console.log("🎨 Applied recipe:", activeRecipe.value?.title);

  // force repaint
  root.offsetHeight;

  // NEW: notify the rest of the app (logo, text, etc.) that the palette changed
  window.dispatchEvent(
    new CustomEvent("palette-updated", {
      detail: {
        recipeTitle: activeRecipe.value?.title || null,
      },
    })
  );
}

// ---------------------------------------------
// Navigation
// ---------------------------------------------
function advance(step) {
  const max = total;
  index.value = index.value < 0 ? 0 : (index.value + step + max) % max;

  applyActiveRecipe();
}

function nextRecipe() {
  if (!props.scales) {
    return;
  }
  advance(+1);
}
function prevRecipe() {
  if (!props.scales) {
    return;
  }
  advance(-1);
}

function resetBrand() {
  const slug = props.brandTokens?.slug;
  if (!slug) return;
  window.dispatchEvent(new CustomEvent("brand-reset", { detail: { slug } }));
}

// ---------------------------------------------
// Watcher — rebuild scales when brand changes
// ---------------------------------------------
watch(
  () => props.scales,
  () => {
    index.value = -1;
    nextTick(updateContrastChecks);
  },
  { immediate: true }
);

// ---------------------------------------------
// CONTRAST CHECKER
// ---------------------------------------------
const contrastPairs = ref([
  // MAIN BACKGROUND
  {
    id: "paragraph-main",
    labelbg: "main bg",
    labelfg: "paragraph",
    fg: "--color-text",
    bg: "--ui-section-bg",
  },
  {
    id: "soft-main",
    labelbg: "main bg",
    labelfg: "soft",
    fg: "--color-text-soft",
    bg: "--ui-section-bg",
  },
  {
    id: "disabled-main",
    labelbg: "main bg",
    labelfg: "disabled",
    fg: "--color-disabled-text",
    bg: "--ui-section-bg",
  },
  {
    id: "caption-main",
    labelbg: "main bg",
    labelfg: "caption",
    fg: "--ui-caption",
    bg: "--ui-section-bg",
  },

  // CARD
  {
    id: "paragraph-card",
    labelbg: "card bg",
    labelfg: "paragraph",
    fg: "--color-text",
    bg: "--ui-panel-bg",
  },

  // ACCENT
  {
    id: "text-accent",
    labelbg: "accent bg",
    labelfg: "inverse text",
    fg: "--color-text-inverse",
    bg: "--ui-accent",
  },

  // LABELS (optional system colors)
  {
    id: "label-main",
    labelbg: "label",
    labelfg: "label text",
    fg: "--ui-heading",
    bg: "--ui-section-bg",
  },
  {
    id: "label-card",
    labelbg: "label card",
    labelfg: "label text",
    fg: "--ui-heading",
    bg: "--ui-panel-bg",
  },
]);

const contrastResults = ref([]);

function applyCssVar(cssVarName, hexValue) {
  if (!cssVarName || !hexValue) return;
  document.documentElement.style.setProperty(cssVarName, hexValue, "important");
}

function updateContrastChecks() {
  contrastResults.value = contrastPairs.value.map((p) => {
    // Actual tested colors from CSS vars
    const actualFgHex = readCSSVar(p.fg);
    const actualBgHex = readCSSVar(p.bg);

    const result = evaluateContrastVisual(actualFgHex, actualBgHex);

    // status pill colors (unchanged behaviour)
    let statusVar = null;
    let userLabel = null;

    // AAA → "prima" → dark green
    if (result.level === "AAA") {
      statusVar = "--color-success-dark";
      userLabel = "prima";

      // AA → "goed" → green
    } else if (result.level === "AA") {
      statusVar = "--color-success";
      userLabel = "goed";

      // AA Large → "redelijk" → orange/yellow
    } else if (result.level === "AA Large") {
      statusVar = "--color-warning";
      userLabel = "redelijk";

      // perceptual acceptable → treat as AA
    } else if (result.level === "perceptual-pass") {
      statusVar = "--color-success";
      userLabel = "goed";

      // fail → "probleem" → red
    } else {
      statusVar = "--color-danger";
      userLabel = "probleem";
    }

    // resolve stoplight background color
    const statusBg = statusVar ? readCSSVar(statusVar) : null;

    // choose readable text for the pill (white or dark)
    const statusText = statusBg ? pickReadablePillText(statusBg) : "var(--color-text)";

    return {
      id: p.id,
      labelbg: p.labelbg,
      labelfg: p.labelfg,

      ratio: result.ratio, // numeric ratio
      level: result.level, // internal WCAG/perceptual code
      label: userLabel, // NEW: user-facing Dutch label

      // status pill styling
      bg: statusBg,
      fg: statusText,

      // swatch + fix logic
      cssVarFg: p.fg,
      cssVarBg: p.bg,
      swatchText: actualFgHex,
      swatchBg: actualBgHex,
    };
  });
}

async function fixContrast(item) {
  if (!item || !props.scales || !props.brandTokens) return;

  const fgVar = item.cssVarFg;
  const bgVar = item.cssVarBg;
  if (!fgVar || !bgVar) return;

  const currentFg = readCSSVar(fgVar);
  const currentBg = readCSSVar(bgVar);

  const targetRatio = 4.5; // AA text target
  let ratio = getContrastRatio(currentFg, currentBg);

  if (ratio >= targetRatio) return;

  let fg = currentFg;
  let attempts = 0;

  // nudges: small increments, no jumps
  const step = 0.04;

  while (ratio < targetRatio && attempts < 40) {
    // decide direction: lighten or darken text?
    const lighter = tint(fg, step);
    const darker = shade(fg, step);

    const ratioL = getContrastRatio(lighter, currentBg);
    const ratioD = getContrastRatio(darker, currentBg);

    // pick better nudge
    if (ratioL > ratio && ratioL >= ratioD) {
      fg = lighter;
      ratio = ratioL;
    } else if (ratioD > ratio) {
      fg = darker;
      ratio = ratioD;
    } else {
      // fallback: gentle tone shift
      fg = tone(fg, step);
      ratio = getContrastRatio(fg, currentBg);
    }

    attempts += 1;
  }

  applyCssVar(fgVar, fg);
  updateContrastChecks();
}

watch(index, () => updateContrastChecks(), { immediate: false });

defineExpose({ nextRecipe, prevRecipe });
</script>

<template>
  <div class="recipe-shuffle">
    <div class="controls">
      <button type="button" class="btn-primary" @click="prevRecipe">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <h5 class="recipe-title">
        {{ activeRecipe ? activeRecipe.title : "Brand default" }}
      </h5>
      <button type="button" class="btn-primary" @click="nextRecipe">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <p class="recipe-desc">
      {{ activeRecipe ? activeRecipe.description : "Site-matched palette loaded from the brand JSON." }}
    </p>

    <!-- Reset button -->
    <div class="reset-wrap">
      <button type="button" class="reset-btn" @click="resetBrand">
        <i class="fa-solid fa-rotate-left"></i> Reset Brand
      </button>
    </div>

    <div class="contrast-check">
      <h4>Contrast Check</h4>

      <div class="contrast-list">
        <div v-for="item in contrastResults" :key="item.id" class="contrast-row">
          <!-- LEFT: Color pair swatches -->
          <div class="contrast-pair">
            <div class="swatch-single" :style="{ background: item.swatchBg }">
              <i class="fa-solid fa-square swatch-icon" :style="{ color: item.swatchText }"></i>
              <span class="swatch-text-label" :style="{ color: item.swatchText }"
                >A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
              </span>
            </div>
          </div>

          <!-- MIDDLE: Score pill (existing logic) -->
          <div
            class="result-cell"
            :class="item.level ? item.level.toLowerCase().replace(' ', '-') : ''"
            :style="{
              background: item.bg,
              color: item.fg,
            }">
            <span
              v-if="item.level === 'AAA' || item.level === 'AA' || item.level === 'perceptual-pass'"
              class="icon-pass">
              ✓
            </span>
            <span v-else-if="item.level && item.level.toLowerCase().includes('fail')" class="icon-fail"> ! </span>

            {{ item.label || "—" }}
          </div>

          <!-- RIGHT: Fix button -->
          <button
            type="button"
            class="fix-btn btn-neutral"
            @click="fixContrast(item)"
            :disabled="item.level === 'AAA' || item.level === 'AA'">
            Verfijn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---------------------------------------------
   CONTAINER
--------------------------------------------- */
.recipe-shuffle {
  border-radius: var(--radius-md);
  padding: var(--space-20);
  background: var(--ui-section-bg);
  color: var(--text-on-section);
  display: flex;
  flex-direction: column;
}

/* ---------------------------------------------
   TOP CONTROLS
--------------------------------------------- */
.controls {
  display: flex;
  justify-content: space-between;
  background: var(--color-overlay);
  border-radius: var(--radius-sm);
  padding: var(--space-10);
}

@media (min-width: 576px) and (max-width: 992px) {
  .controls {
    flex-direction: column;
  }
}

.recipe-title {
  margin: var(--space-5) auto;
  text-align: center;
}

.recipe-desc {
  font-size: 1.3rem;
  opacity: 0.8;
  text-align: center;
}

.reset-wrap {
  text-align: center;
}

.reset-btn {
  background: none;
  border: var(--dynamic-text);
  color: var(--dynamic-text);
  border-radius: var(--radius-sm);
  padding: var(--space-5) var(--space-20);
  cursor: pointer;
}

.reset-btn:hover {
  scale: 1.05;
}

.reset-btn:active {
  scale: 0.95;
}

/* ---------------------------------------------
   CONTRAST CHECK
--------------------------------------------- */
.contrast-check {
  width: 100%;
  margin-top: var(--space-20);
  text-align: center;
}

.icon-pass,
.icon-fail {
  /* width: 1.2rem; */
  text-align: center;
  color: inherit;
}

.contrast-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* ------------------------------------------------------
   ADOBE-STYLE CONTRAST ROW LAYOUT (3 columns)
   swatches   |   fix button   |   score pill
------------------------------------------------------ */
.contrast-row {
  display: flex;
  align-items: center;
  gap: var(--space-20);
  padding: var(--space-10) 0;
}

/* ------------------------------------------------------
   COLOR PAIR — horizontal swatches exactly like Adobe
------------------------------------------------------ */
.contrast-pair {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-5);
  flex: 1 0 auto;
}

.swatch-pair {
  display: flex;
  flex-direction: row;
  height: var(--space-20);
  border-radius: var(--radius-sm);
  border: var(--border-width) solid var(--color-border-medium);
}

.swatch-single {
  width: var(--space-40);
  height: var(--space-30);
  border-radius: var(--radius-sm);
  border: var(--border-width) solid var(--color-border-medium);
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 0 var(--space-10);
  align-items: center;
  justify-content: left;
  gap: var(--space-5);
}

.swatch-icon {
  font-size: var(--fs-body-sm);
  line-height: 1;
}

.swatch-text-label {
  font-size: var(--fs-body-xs);
  font-weight: 600;
  line-height: 1;
  text-wrap: nowrap;
}

/* ------------------------------------------------------
   FIX BUTTON
------------------------------------------------------ */

.fix-btn {
  align-self: stretch;
}

/* ------------------------------------------------------
   SCORE PILL
------------------------------------------------------ */
.result-cell {
  flex: 0 1 20%;
  font-weight: 500;
  padding: var(--space-5) var(--space-10);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: var(--space-5);
  font-size: var(--fs-body-xs);
}
</style>
