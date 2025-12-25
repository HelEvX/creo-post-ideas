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

          <!-- MIDDLE: Score pill -->
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
            :disabled="item.label === 'prima' || item.label === 'goed'">
            <i class="fa-solid fa-wrench fix-btn_icon"></i>
            <span v-if="item._noFixPossible" class="no-fix-hint"> geen beter contrast gevonden</span>
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

  // background context from mockup (primary / secondary / neutral / pattern)
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

const noFixMap = ref(Object.create(null));
const contrastResults = ref([]);

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
function resolveCssColor(value, depth = 0) {
  if (!value) return null;
  if (depth > 10) return value;

  const v = value.trim();

  // CSS var name: --foo
  if (v.startsWith("--")) {
    const next = readCSSVar(v);
    if (!next || next.trim() === "" || next.trim() === v) return null;
    return resolveCssColor(next, depth + 1);
  }

  // var(--foo) or var(--foo, fallback)
  if (v.startsWith("var(")) {
    const inner = v.slice(4, -1).trim();

    // split on first comma only
    const commaIdx = inner.indexOf(",");
    const name = (commaIdx === -1 ? inner : inner.slice(0, commaIdx)).trim();
    const fallback = (commaIdx === -1 ? "" : inner.slice(commaIdx + 1)).trim();

    const resolved = resolveCssColor(name, depth + 1);
    if (!resolved || resolved.trim() === "") {
      return fallback ? resolveCssColor(fallback, depth + 1) : null;
    }

    return resolved;
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
   FIX TARGET RESOLUTION
   - Never write to --dynamic-* (derived, overwritten by App.vue)
   - Choose a SOURCE token to adjust based on pair intent
-------------------------------------------------- */
function getFixableSourceVar(item) {
  const fg = item.cssVarFg;

  // --- surface-specific text roles ---
  if (fg === "--alt-caption-on-alt-panel") return "--color-caption-alt";
  if (fg === "--caption-on-panel") return "--color-caption";
  if (fg === "--text-on-alt-panel") return "--color-text";
  if (fg === "--text-on-panel") return "--color-text";
  if (fg === "--title-on-alt-panel") return "--color-title";
  if (fg === "--title-on-panel") return "--color-title";

  // --- mockup background text ---
  if (item.fix === "neutral-text") {
    return fg === "--dynamic-title" ? "--color-title" : "--color-text";
  }

  // --- brand-colored text on neutral backgrounds ---
  if (item.fix === "brand-text") {
    const tone = props.bgContext?.tone || "primary";
    return tone === "secondary" ? "--color-secondary" : "--color-primary";
  }

  return null;
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

// add opacity

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

/*
  ADDED:
  bgContext watcher ensures contrast recalculates when the mockup
  background actually resolves (pattern/image/tone changes).
*/
watch(() => props.bgContext, scheduleContrastUpdate, { deep: true });

/* --------------------------------------------------
   CONTRAST PAIRS
   Each pair declares:
   - fg: rendered variable used in UI
   - bg: rendered background
   - fix: which SOURCE token family may be adjusted
-------------------------------------------------- */
const contrastPairs = ref([
  { id: "main-title", fg: "--dynamic-title", bg: "CONTEXT", fix: "neutral-text" },
  { id: "main-paragraph", fg: "--dynamic-text", bg: "CONTEXT", fix: "neutral-text" },

  { id: "card1-caption", fg: "--alt-caption-on-alt-panel", bg: "--ui-alt-panel-bg", fix: "brand-text" },
  { id: "card1-title", fg: "--dynamic-title", bg: "--ui-alt-panel-bg", fix: "brand-text" },
  { id: "card1-paragraph", fg: "--dynamic-text", bg: "--ui-alt-panel-bg", fix: "brand-text" },

  { id: "card2-caption", fg: "--caption-on-panel", bg: "--ui-panel-bg", fix: "brand-text" },
  { id: "card2-title", fg: "--dynamic-title", bg: "--ui-panel-bg", fix: "brand-text" },
  { id: "card2-paragraph", fg: "--dynamic-text", bg: "--ui-panel-bg", fix: "brand-text" },

  { id: "accent-text", fg: "--dynamic-text", bg: "--dynamic-accent", fix: "neutral-text" },
]);

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
      const pillBg = resolveCssColor("--color-danger");
      const pillFg = pickReadablePillText(pillBg);
      return {
        id: p.id,
        ratio: 0,
        level: "fail",
        label: "slecht",
        bg: pillBg,
        fg: pillFg,
        swatchText: null,
        swatchBg: null,
        cssVarFg: p.fg,
        cssVarBg: p.bg,
        fix: p.fix,
        _noFixPossible: !!noFixMap.value[p.id],
      };
    }

    const ratios = bgList.map((bg) => {
      const fg = fgForBgPair(p.fg, bg);
      if (!fg) return 0;
      const r = getContrastRatio(fg, bg);
      return Number.isFinite(r) ? r : 0;
    });

    const worstRatio = Math.min(...ratios);
    const worstBg = bgList[ratios.indexOf(worstRatio)];
    const worstFg = fgForBgPair(p.fg, worstBg);

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
      perceptual: result.perceptual,
      label,
      bg: pillBg,
      fg: pillFg,
      cssVarFg: p.fg,
      cssVarBg: p.bg,
      fix: p.fix,
      swatchText: worstFg,
      swatchBg: worstBg,
      _noFixPossible: !!noFixMap.value[p.id],
    };
  });
}

/* --------------------------------------------------
   FIX CONTRAST
   - One step per click
   - Never write to --dynamic-* (derived)
-------------------------------------------------- */
async function fixContrast(item) {
  if (!item || !props.scales) return;
  if (item.label === "prima" || item.label === "goed") return;

  if (item.cssVarBg === "CONTEXT") {
    noFixMap.value[item.id] = true;
    updateContrastChecks();
    return;
  }

  noFixMap.value[item.id] = false;

  const bg = resolveCssColor(item.cssVarBg);
  const effectiveFg = item.swatchText;
  const sourceVar = getFixableSourceVar(item);
  if (!bg || !effectiveFg || !sourceVar) return;

  const sourceColor = resolveCssColor(sourceVar);
  if (!sourceColor) return;

  const EPS = 0.0001;
  const step = 0.04;

  const currentRatio = evaluateContrastVisual(effectiveFg, bg).ratio;

  const darker = shade(sourceColor, step);
  const lighter = tint(sourceColor, step);

  const rD = getContrastRatio(darker, bg);
  const rL = getContrastRatio(lighter, bg);

  if (Number.isFinite(rD) && rD > currentRatio + EPS && rD >= rL) {
    applyCssVar(sourceVar, darker);
  } else if (Number.isFinite(rL) && rL > currentRatio + EPS) {
    applyCssVar(sourceVar, lighter);
  } else {
    noFixMap.value[item.id] = true;
    updateContrastChecks();
    return;
  }

  await nextTick();
  window.dispatchEvent(new Event("palette-updated"));
  scheduleContrastUpdate();
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
  background: var(--color-overlay-soft);
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
  color: var(--dynamic-soft);
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
  border: var(--ui-panel-border-soft);
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
@media (max-width: 767px) {
  .controls {
    width: 100%;
    justify-content: space-evenly;
  }
  .contrast-row {
    width: calc((100% - var(--space-50)) / 2);
  }
}
@media (max-width: 575px) {
  .controls {
    width: 100%;
    justify-content: space-around;
  }
  .contrast-row {
    width: 100%;
  }
}

.swatch-text-label {
  font-size: var(--fs-body-xs);
  font-weight: var(--fw-title);
  line-height: 1;
  text-wrap: nowrap;
}

/* ------------------------------------------------------
   FIX BUTTON
------------------------------------------------------ */

.fix-btn {
  flex: 0 0 var(--space-30);
  padding: 0;
  position: relative;
}

.no-fix-hint {
  position: absolute;
  min-width: 8rem;
  z-index: 50;
  top: 25%;
  right: 0;
  transform: translate(100%, -50%);
  font-size: var(--fs-body-tiny);
  background-color: var(--black-75);
  padding: var(--space-5) var(--space-10);
  border-radius: var(--radius-sm);
  font-weight: 300;
  color: var(--white);
  text-align: left;
}
@media (max-width: 767px) {
  .no-fix-hint {
    top: 100%;
    right: 25%;
    transform: translateX(75%);
  }
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
  font-weight: var(--fw-title);
  font-size: var(--fs-body-xs);
  border-radius: var(--radius-md);
}
</style>
