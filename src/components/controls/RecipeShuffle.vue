<template>
  <div class="recipe-shuffle">
    <div class="recipe-info-container">
      <div class="controls">
        <button type="button" class="btn-primary" @click="prevRecipe">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <h5 class="recipe-title">
          {{ activeRecipe ? activeRecipe.title : "Basis" }}
        </h5>
        <button type="button" class="btn-primary" @click="nextRecipe">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <p class="recipe-desc">
        {{ activeRecipe ? activeRecipe.description : "De huisstijl zoals op de website." }}
      </p>

      <!-- Reset button -->
      <div class="reset-wrap">
        <button type="button" class="reset-btn" @click="resetBrand">
          <i class="fa-solid fa-rotate-left"></i> Reset
        </button>
      </div>
      <h4>Contrast Check</h4>
    </div>

    <div class="contrast-check">
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
            <i class="fa-solid fa-wrench fix-btn_icon"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
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
function onPaletteUpdated() {
  scheduleContrastUpdate();
}

function onBrandUpdated() {
  scheduleContrastUpdate();
}

onMounted(() => {
  window.addEventListener("palette-updated", onPaletteUpdated);
  window.addEventListener("brand-updated", onBrandUpdated);
  scheduleContrastUpdate();
});

onBeforeUnmount(() => {
  window.removeEventListener("palette-updated", onPaletteUpdated);
  window.removeEventListener("brand-updated", onBrandUpdated);
});

/* --------------------------------------------------
   CSS VARIABLE RESOLUTION
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

function raf() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function scheduleContrastUpdate() {
  await nextTick();
  await raf();
  await raf();
  updateContrastChecks();
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
    scheduleContrastUpdate();
  },
  { immediate: true }
);

watch(index, scheduleContrastUpdate);

watch(() => props.bgContext, scheduleContrastUpdate, { deep: true });

/* --------------------------------------------------
   CONTRAST PAIRS
-------------------------------------------------- */
const contrastPairs = ref([
  // main bg (primary/secondary via CONTEXT)
  { id: "main-title", fg: "--dynamic-title", bg: "CONTEXT" }, // check large title against main post background
  { id: "main-paragraph", fg: "--dynamic-text", bg: "CONTEXT" }, // check large paragraph against main post background

  // card 1 bg (left) = ui-section-bg
  { id: "card1-caption", fg: "--ui-caption", bg: "--ui-section-bg" }, // check card icon+caption against card background for card 1
  { id: "card1-title", fg: "--title-on-section", bg: "--ui-section-bg" }, // check card title against card background for card 1
  { id: "card1-paragraph", fg: "--text-on-section", bg: "--ui-section-bg" }, // check card paragraph against card background for card 1

  // card 2 bg (right) = ui-panel-bg
  { id: "card2-caption", fg: "--ui-caption", bg: "--ui-panel-bg" }, // check card icon+caption against card background for card 2
  { id: "card2-title", fg: "--title-on-panel", bg: "--ui-panel-bg" }, // check card title against card background for card 2
  { id: "card2-paragraph", fg: "--text-on-panel", bg: "--ui-panel-bg" }, // check card paragraph against card background for card 2

  // accent bg + inverse text
  { id: "accent-text", fg: "--dynamic-text", bg: "--dynamic-accent" }, // check text against accent bg for the decorative element
]);

const contrastResults = ref([]);

/* --------------------------------------------------
   CONTRAST CHECK (SCORING)
-------------------------------------------------- */
function dynamicTitleForBg(bgHex) {
  const dark = resolveCssColor("--color-title");
  const light = resolveCssColor("--color-text-inverse");
  if (!bgHex || !dark || !light) return dark;
  const mode = getTextModeForBackground(bgHex, dark, light);
  return mode === "dark" ? dark : light;
}

function dynamicBodyForBg(bgHex) {
  const dark = resolveCssColor("--color-text");
  const light = resolveCssColor("--color-text-inverse");
  if (!bgHex || !dark || !light) return dark;
  const mode = getTextModeForBackground(bgHex, dark, light);
  return mode === "dark" ? dark : light;
}

function fgForBgPair(fgVar, bgHex) {
  if (fgVar === "--dynamic-title") return dynamicTitleForBg(bgHex);
  if (fgVar === "--dynamic-text") return dynamicBodyForBg(bgHex);
  return resolveCssColor(fgVar);
}

function updateContrastChecks() {
  const contextBgs = props.bgContext?.bgVars?.map(resolveCssColor).filter(Boolean) || [];

  contrastResults.value = contrastPairs.value.map((p) => {
    const bgList = p.bg === "CONTEXT" ? contextBgs : [resolveCssColor(p.bg)].filter(Boolean);

    if (bgList.length === 0) {
      return {
        id: p.id,
        ratio: 0,
        level: "fail",
        label: "slecht",
        bg: "var(--ui-danger-bg)",
        fg: "var(--ui-dynamic-text)",
        swatchText: null,
        swatchBg: null,
        cssVarFg: p.fg,
        cssVarBg: p.bg,
      };
    }

    // compute worst-case ratio across all backgrounds
    const ratios = bgList.map((bg) => {
      const fg = fgForBgPair(p.fg, bg);
      if (!fg) return 0;
      return getContrastRatio(fg, bg);
    });

    const worstRatio = Math.min(...ratios);
    const worstBg = bgList[ratios.indexOf(worstRatio)];
    const worstFg = fgForBgPair(p.fg, worstBg);

    if (!worstFg) {
      return {
        id: p.id,
        ratio: 0,
        level: "fail",
        label: "slecht",
        bg: "var(--ui-danger-bg)",
        fg: "var(--ui-dynamic-text)",
        swatchText: null,
        swatchBg: worstBg,
        cssVarFg: p.fg,
        cssVarBg: p.bg,
      };
    }

    const result = evaluateContrastVisual(worstFg, worstBg);

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
      label = "beperkt";
    } else {
      statusVar = "--color-danger";
      label = "slecht";
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

      swatchText: worstFg,
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
  if (item.label !== "beperkt" && item.label !== "slecht") return;

  const fgVar = item.cssVarFg;
  const bgVar = item.cssVarBg;

  let fg = resolveCssColor(fgVar);
  let bg = resolveCssColor(bgVar);
  if (!fg || !bg) return;

  const targetRatio = item.label === "beperkt" ? 3 : 4.5;
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

.recipe-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.recipe-shuffle {
  border-radius: var(--radius-md);
  padding: var(--space-20);
  background: var(--ui-section-bg);
  color: var(--text-on-section);
  display: flex;
  flex-direction: column;
  gap: var(--space-30);
}

/* ---------------------------------------------
   TOP CONTROLS
--------------------------------------------- */
.controls {
  display: flex;
  justify-content: space-between;
  background: var(--color-overlay);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-20);
  width: 100%;
}

.recipe-title {
  align-items: center;
  text-align: center;
  padding: var(--space-10);
  margin-bottom: 0;
}

.recipe-desc {
  font-size: var(--fs-body-xs);
  opacity: 0.8;
  text-align: center;
}

.reset-wrap {
  text-align: center;
  margin-bottom: var(--space-30);
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
  align-items: stretch;
  gap: var(--space-20);
  padding: var(--space-10) 0;
  width: 100%;
}

/* ------------------------------------------------------
   COLOR PAIR
------------------------------------------------------ */
.contrast-pair {
  flex: 1 1 auto;
  min-width: 0;
}

.swatch-single {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-5) var(--space-10);
  border-radius: var(--radius-sm);
  border: var(--ui-panel-border);
  overflow: hidden;
}

@media (max-width: 1399px) {
  .controls {
    width: 33.33%;
  }
  .contrast-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--space-5) var(--space-50);
  }
  .contrast-row {
    width: calc((100% - var(--space-100)) / 3);
  }
}
@media (max-width: 991px) {
  .controls {
    width: 50%;
    justify-content: space-between;
  }
  .contrast-row {
    width: calc((100% - var(--space-50)) / 2);
  }
}
@media (min-width: 576px) and (max-width: 767px) {
  .controls {
    width: 100%;
    justify-content: space-evenly;
  }
  .contrast-list {
    flex-direction: column;
    flex-wrap: nowrap;
  }
}
@media (max-width: 575px) {
  .controls {
    width: 100%;
    justify-content: space-around;
  }
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
  flex: 0 0 var(--space-30);
  padding: 0;
}

/* ------------------------------------------------------
   SCORE PILL
------------------------------------------------------ */
.result-cell {
  flex: 0 0 7rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-5);
  font-weight: 600;
  font-size: var(--fs-body-xs);
  border-radius: var(--radius-md);
}
</style>
