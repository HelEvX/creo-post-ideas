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
      {{ activeRecipe ? activeRecipe.description : "De kleuren van de website." }}
    </p>

    <!-- Reset button -->
    <div class="reset-wrap">
      <button type="button" class="reset-btn" @click="resetBrand">
        <i class="fa-solid fa-rotate-left"></i> Terug naar basis
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

<script setup>
import { ref, watch, computed, nextTick, onMounted } from "vue";
import { recipes } from "../../data/recipes.js";
import { getContrastRatio, tint, shade, evaluateContrastVisual } from "../../utils/colorBlender.js";
import { getTextModeForBackground } from "../../utils/colorLogic.js";

/* --------------------------------------------------
   PROPS
-------------------------------------------------- */
const props = defineProps({
  brandTokens: { type: Object, required: true },
  scales: { type: Object, required: false },

  // background context from mockup (primary / secondary / pattern)
  bgContext: {
    type: Object,
    default: () => ({
      bgVars: ["--ui-section-bg"],
    }),
  },
});

/* --------------------------------------------------
   STATE
-------------------------------------------------- */
const index = ref(-1);
const total = recipes.length;

const activeRecipe = computed(() => {
  if (index.value < 0) return null;
  return { ...recipes[index.value] };
});

/* --------------------------------------------------
   LIFECYCLE
-------------------------------------------------- */
onMounted(() => {
  console.log("RecipeShuffle mounted");
});

/* --------------------------------------------------
   CSS VARIABLE RESOLUTION (CRITICAL FIX)
-------------------------------------------------- */
function readCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Resolves chained vars:
// --ui-panel-bg → var(--color-panel) → #hex
function resolveCssColor(value, depth = 0) {
  if (!value) return null;
  if (depth > 10) return value;

  const v = value.trim();

  if (v.startsWith("--")) {
    const next = readCSSVar(v);
    if (!next || next === v) return null;
    return resolveCssColor(next, depth + 1);
  }

  if (v.startsWith("var(")) {
    const inner = v.slice(4, -1).trim();
    return resolveCssColor(inner, depth + 1);
  }

  return v;
}

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */
function pickReadablePillText(bgHex) {
  const dark = resolveCssColor("--color-text");
  const light = resolveCssColor("--color-text-inverse");
  if (!bgHex || !dark || !light) return dark;

  const mode = getTextModeForBackground(bgHex, dark, light);
  return mode === "dark" ? dark : light;
}

function applyCssVar(cssVarName, hexValue) {
  if (!cssVarName || !hexValue) return;
  document.documentElement.style.setProperty(cssVarName, hexValue, "important");
}

/* --------------------------------------------------
   APPLY RECIPE
-------------------------------------------------- */
function applyActiveRecipe() {
  if (!props.scales || !activeRecipe.value) return;

  const root = document.documentElement;
  const roles = activeRecipe.value.roles;
  const scalesCopy = JSON.parse(JSON.stringify(props.scales));

  for (const [cssVar, spec] of Object.entries(roles)) {
    const hex = Array.isArray(spec)
      ? scalesCopy?.[spec[0]]?.[spec[1]]
      : spec?.startsWith("var(")
      ? resolveCssColor(spec)
      : spec;

    if (hex) root.style.setProperty(cssVar, hex, "important");
  }

  root.offsetHeight;
  window.dispatchEvent(new CustomEvent("palette-updated"));
}

/* --------------------------------------------------
   NAVIGATION
-------------------------------------------------- */
function advance(step) {
  const max = total;
  index.value = index.value < 0 ? 0 : (index.value + step + max) % max;
  applyActiveRecipe();
}
function nextRecipe() {
  if (!props.scales) return;
  advance(+1);
}
function prevRecipe() {
  if (!props.scales) return;
  advance(-1);
}
function resetBrand() {
  const slug = props.brandTokens?.slug;
  if (!slug) return;
  window.dispatchEvent(new CustomEvent("brand-reset", { detail: { slug } }));
}

/* --------------------------------------------------
   WATCHERS
-------------------------------------------------- */
watch(
  () => props.scales,
  () => {
    index.value = -1;
    nextTick(updateContrastChecks);
  },
  { immediate: true }
);

watch(index, updateContrastChecks);

watch(() => props.bgContext, updateContrastChecks, { deep: true });

/* --------------------------------------------------
   CONTRAST PAIRS
-------------------------------------------------- */
const contrastPairs = ref([
  { id: "paragraph-main", fg: "--text-on-panel", bg: "--ui-surface-bg" },
  { id: "soft-main", fg: "--text-soft-on-panel", bg: "--ui-surface-bg" },
  { id: "caption-main", fg: "--ui-caption", bg: "--ui-surface-bg" },
  //
  { id: "paragraph-alt", fg: "--text-on-panel", bg: "--ui-panel-bg" },
  { id: "soft-alt", fg: "--text-soft-on-panel", bg: "--ui-panel-bg" },
  { id: "caption-alt", fg: "--ui-caption", bg: "--ui-panel-bg" },
  //

  //
  { id: "paragraph-card", fg: "--color-text", bg: "--ui-panel-bg" },
  { id: "text-accent", fg: "--color-text-inverse", bg: "--ui-accent" },
  { id: "label-main", fg: "--color-text", bg: "CONTEXT" },
  { id: "label-card", fg: "--ui-accent", bg: "--ui-alt-panel-bg" },
]);

const contrastResults = ref([]);

/* --------------------------------------------------
   CONTRAST CHECK (SCORING)
-------------------------------------------------- */
function updateContrastChecks() {
  const contextBgs = props.bgContext?.bgVars?.map(resolveCssColor).filter(Boolean) || [];

  contrastResults.value = contrastPairs.value.map((p) => {
    const fg = resolveCssColor(p.fg);

    // resolve background
    const bgList = p.bg === "CONTEXT" ? contextBgs : [resolveCssColor(p.bg)].filter(Boolean);

    if (!fg || bgList.length === 0) {
      return {
        id: p.id,
        ratio: 0,
        level: "fail",
        label: "probleem",
        bg: "#d9534f",
        fg: "#ffffff",
        swatchText: fg,
        swatchBg: bgList[0] || null,
        cssVarFg: p.fg,
        cssVarBg: p.bg,
      };
    }

    // worst-case contrast across all backgrounds
    const ratios = bgList.map((bg) => getContrastRatio(fg, bg));
    const worstRatio = Math.min(...ratios);
    const worstBg = bgList[ratios.indexOf(worstRatio)];

    const result = evaluateContrastVisual(fg, worstBg);

    let statusVar;
    let label;

    if (result.level === "AAA") {
      statusVar = "--color-success-dark";
      label = "prima";
    } else if (result.level === "AA" || result.level === "perceptual-pass") {
      statusVar = "--color-success";
      label = "goed";
    } else if (result.level === "AA Large") {
      statusVar = "--color-warning";
      label = "redelijk";
    } else {
      statusVar = "--color-danger";
      label = "probleem";
    }

    const pillBg = resolveCssColor(statusVar);
    const pillFg = pickReadablePillText(pillBg);

    return {
      id: p.id,
      ratio: worstRatio,
      level: result.level,
      label,

      bg: pillBg,
      fg: pillFg,

      cssVarFg: p.fg,
      cssVarBg: p.bg,

      swatchText: fg,
      swatchBg: worstBg,
    };
  });
}

/* --------------------------------------------------
   FIX CONTRAST (FINAL BEHAVIOR)
-------------------------------------------------- */
async function fixContrast(item) {
  if (!item || !props.scales) return;

  // only allow fixes where it makes sense
  if (item.label !== "redelijk" && item.label !== "probleem") return;

  const fgVar = item.cssVarFg;
  const bgVar = item.cssVarBg;

  let fg = resolveCssColor(fgVar);
  let bg = resolveCssColor(bgVar);
  if (!fg || !bg) return;

  const targetRatio = item.label === "redelijk" ? 3 : 4.5;
  let ratio = getContrastRatio(fg, bg);
  if (ratio >= targetRatio) return;

  const white = readCSSVar("--color-text-inverse");
  const isPureWhiteText = getContrastRatio(fg, white) < 1.05;

  const step = 0.04;
  let attempts = 0;

  while (ratio < targetRatio && attempts < 40) {
    let nextFg = fg;
    let nextBg = bg;

    if (isPureWhiteText) {
      // text cannot go lighter -> move background darker
      nextBg = shade(bg, step);
    } else {
      // try improving text first, without killing saturation
      const lighter = tint(fg, step);
      const darker = shade(fg, step);

      const rL = getContrastRatio(lighter, bg);
      const rD = getContrastRatio(darker, bg);

      if (rL > ratio && rL >= rD) {
        nextFg = lighter;
      } else if (rD > ratio) {
        nextFg = darker;
      } else {
        // ceiling hit -> nudge background instead
        nextBg = shade(bg, step);
      }
    }

    const nextRatio = getContrastRatio(nextFg, nextBg);
    if (nextRatio <= ratio) break;

    fg = nextFg;
    bg = nextBg;
    ratio = nextRatio;
    attempts++;
  }

  applyCssVar(fgVar, fg);
  if (isPureWhiteText) {
    applyCssVar(bgVar, bg);
  }

  updateContrastChecks();
}

defineExpose({ nextRecipe, prevRecipe });
</script>

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
  max-width: 680px;
  margin: 0 auto;
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
  margin-top: var(--space-50);
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
