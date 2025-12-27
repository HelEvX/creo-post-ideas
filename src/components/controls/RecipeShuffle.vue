<template>
  <div class="recipe-shuffle">
    <div class="recipe-info-container">
      <div class="controls">
        <button type="button" class="btn-primary" @click="prevRecipe">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <h4 class="recipe-title">
          {{ activeRecipe ? activeRecipe.title : "Basis" }}
        </h4>
        <button type="button" class="btn-primary" @click="nextRecipe">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <p class="recipe-desc">
        {{ activeRecipe ? activeRecipe.description : "De huisstijl zoals op de website." }}
      </p>

      <!-- Reset button -->
      <div class="reset-wrap">
        <button type="button" class="reset-btn btn-neutral" @click="resetBrand">
          <i class="fa-solid fa-rotate-left"></i> Reset
        </button>
      </div>
      <h4>Contrast Check</h4>

      <button type="button" class="contrast-toggle btn-neutral" @click="toggleContrastVisibility">
        {{ isContrastVisible ? "Verberg Details ▲" : "Toon Details ▼" }}
      </button>
    </div>

    <div class="contrast-check" v-show="isContrastVisible">
      <div class="contrast-list">
        <div v-for="item in contrastResults" :key="item.id" class="contrast-row">
          <!-- LEFT: Color pair swatches -->
          <div class="contrast-pair">
            <div class="swatch-single" :style="{ background: item.swatchBg }">
              <i class="fa-solid fa-square swatch-icon" :style="{ color: item.swatchText }"></i>
              <span class="swatch-text-label" :style="{ color: item.swatchText }"
                >A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9
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
   COLLAPSE ON MOBILE
-------------------------------------------------- */

const isContrastVisible = ref(false);
const isDesktop = ref(true);

function toggleContrastVisibility() {
  isContrastVisible.value = !isContrastVisible.value;
}

function updateBreakpoint() {
  isDesktop.value = window.innerWidth >= 1400;
  if (isDesktop.value) {
    isContrastVisible.value = true;
  }
}

onMounted(() => {
  updateBreakpoint();
  window.addEventListener("resize", updateBreakpoint);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBreakpoint);
});

/* --------------------------------------------------
   PROPS
-------------------------------------------------- */
const props = defineProps({
  brandTokens: { type: Object, required: true },
  scales: { type: Object, required: false },

  colored: {
    type: Boolean,
    default: true,
  },

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

function onDynamicTextUpdated() {
  scheduleContrastUpdate();
}

onMounted(() => {
  window.addEventListener("palette-updated", onPaletteUpdated);
  window.addEventListener("brand-updated", onBrandUpdated);
  window.addEventListener("dynamic-text-updated", onDynamicTextUpdated);

  scheduleContrastUpdate();
});

onBeforeUnmount(() => {
  window.removeEventListener("palette-updated", onPaletteUpdated);
  window.removeEventListener("brand-updated", onBrandUpdated);
  window.removeEventListener("dynamic-text-updated", onDynamicTextUpdated);
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
   MOCKUP-SCOPED VARIABLE READING  ← ADD THIS LABEL
-------------------------------------------------- */

function getMockupScopeEl() {
  return document.querySelector(".post-content") || document.documentElement;
}

function readVarFrom(el, name) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

function resolveCssColorFrom(el, value, depth = 0) {
  if (!value) return null;
  if (depth > 10) return value;

  const v = value.trim();

  if (v.startsWith("--")) {
    const next = readVarFrom(el, v);
    if (!next || next.trim() === "" || next.trim() === v) return null;
    return resolveCssColorFrom(el, next, depth + 1);
  }

  if (v.startsWith("var(")) {
    const inner = v.slice(4, -1).trim();
    const commaIdx = inner.indexOf(",");
    const name = (commaIdx === -1 ? inner : inner.slice(0, commaIdx)).trim();
    const fallback = (commaIdx === -1 ? "" : inner.slice(commaIdx + 1)).trim();

    const resolved = resolveCssColorFrom(el, name, depth + 1);
    if (!resolved || resolved.trim() === "") {
      return fallback ? resolveCssColorFrom(el, fallback, depth + 1) : null;
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
  // match App.vue mapping:
  // mode === "light"  -> use light text
  // mode === "dark"   -> use dark text
  return mode === "light" ? light : dark;
}

function applyCssVar(cssVarName, hexValue) {
  if (!cssVarName || !hexValue) return;
  document.documentElement.style.setProperty(cssVarName, hexValue, "important");
}

function raf() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function scheduleContrastUpdate() {
  if (scheduleContrastUpdate._pending) return;
  scheduleContrastUpdate._pending = true;
  await nextTick();
  await raf();
  await raf();
  updateContrastChecks();
  scheduleContrastUpdate._pending = false;
}

/* --------------------------------------------------
   APPLY RECIPE
-------------------------------------------------- */
// RecipeShuffle.vue

function applyActiveRecipe() {
  if (!props.scales || !activeRecipe.value) return;

  const root = document.documentElement;
  const roles = activeRecipe.value.roles;
  const scalesCopy = JSON.parse(JSON.stringify(props.scales));

  // --- STEP 1 ADD: shadow participation + recipe-driven shadow alpha ---
  const cs = getComputedStyle(root);
  const shadowCardRaw = cs.getPropertyValue("--shadow-card").trim();
  const brandUsesShadows = shadowCardRaw !== "" && shadowCardRaw.toLowerCase() !== "none";

  // Recipe role key: "--ui-shadow-alpha" expects ["neutral", idx] where idx is 0..10
  function idxToAlpha(idx) {
    const i = Math.max(0, Math.min(10, Number(idx)));
    const min = 0.06; // lightest usable
    const max = 0.3; // strongest usable
    return min + (i / 10) * (max - min);
  }

  for (const [cssVar, spec] of Object.entries(roles)) {
    // --- STEP 1 ADD: intercept shadow alpha role ---
    if (cssVar === "--ui-shadow-alpha") {
      // Only apply if brand enables shadows
      if (!brandUsesShadows) continue;

      if (Array.isArray(spec) && spec.length === 2) {
        const idx = spec[1];
        const alpha = idxToAlpha(idx); // e.g. 0.05 → 0.35

        root.style.setProperty("--color-shadow", `rgba(0, 0, 0, ${alpha})`, "important");
      }
      continue;
    }

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

watch(() => props.colored, scheduleContrastUpdate);

/* --------------------------------------------------
   CONTRAST PAIRS
   Each pair declares:
   - fg: rendered variable used in UI
   - bg: rendered background
   - fix: which SOURCE token family may be adjusted
-------------------------------------------------- */
const contrastPairs = ref([
  // Mockup main text on the mockup background
  {
    id: "main-title",
    fgVar: "--dynamic-title",
    bg: "CONTEXT",
    fixFgCandidates: ["--color-title", "--color-text-inverse"],
  },
  {
    id: "main-paragraph",
    fgVar: "--dynamic-text",
    bg: "CONTEXT",
    fixFgCandidates: ["--color-text", "--color-text-inverse"],
  },

  // Left card (alt panel)
  {
    id: "card1-caption",
    fgVar: "--text-soft-on-alt-panel",
    bg: "--ui-alt-panel-bg-derived",
    fixFgCandidates: ["--color-text-soft", "--color-text-soft-inverse"],
  },
  {
    id: "card1-title",
    fgVar: "--dynamic-title",
    bg: "--ui-alt-panel-bg-derived",
    fixFgCandidates: ["--color-title", "--color-text-inverse"],
  },
  {
    id: "card1-paragraph",
    fgVar: "--dynamic-text",
    bg: "--ui-alt-panel-bg-derived",
    fixFgCandidates: ["--color-text", "--color-text-inverse"],
  },

  // Right card (panel)
  {
    id: "card2-caption",
    fgVar: "--caption-on-panel",
    bg: "--ui-panel-bg",
    fixFgCandidates: ["--color-primary-dark", "--color-primary-lighter"],
  },
  {
    id: "card2-title",
    fgVar: "--title-on-panel",
    bg: "--ui-panel-bg",
    fixFgCandidates: ["--color-title", "--color-text-inverse"],
  },
  {
    id: "card2-paragraph",
    fgVar: "--text-on-panel",
    bg: "--ui-panel-bg",
    fixFgCandidates: ["--color-text", "--color-text-inverse"],
  },

  // Accent block (exactly matches InfoPost.vue)
  {
    id: "accent-text",
    fgVar: "ACCENT_TEXT",
    bg: "ACCENT_BG",
    fixFgCandidates: ["--color-text", "--color-text-inverse"],
  },
]);

/* --------------------------------------------------
   CONTRAST CHECK (SCORING)
-------------------------------------------------- */

function updateContrastChecks() {
  const scopeEl = getMockupScopeEl();

  const contextBgs = props.bgContext?.bgVars?.map((v) => resolveCssColorFrom(scopeEl, v)).filter(Boolean) || [];

  contrastResults.value = contrastPairs.value.map((p) => {
    const bgList =
      p.bg === "CONTEXT"
        ? contextBgs
        : p.bg === "ACCENT_BG"
        ? [
            resolveCssColorFrom(
              scopeEl,
              props.bgContext?.tone === "secondary" ? "--ui-primary-bg" : "--ui-secondary-bg"
            ),
          ].filter(Boolean)
        : [resolveCssColorFrom(scopeEl, p.bg)].filter(Boolean);

    // Determine the actual foreground var name for this row (accent is contextual)
    const fgVarName =
      p.fgVar === "ACCENT_TEXT"
        ? props.bgContext?.tone === "secondary"
          ? "--text-on-primary"
          : "--text-on-secondary"
        : p.fgVar;

    // Read the actual foreground color that is currently applied in the mockup scope
    const fgValue = resolveCssColorFrom(scopeEl, fgVarName);

    // If we cannot read either side, keep the row but mark it as failing
    if (!fgValue || bgList.length === 0) {
      const pillBg = resolveCssColorFrom(scopeEl, "--color-danger");
      const pillFg = pickReadablePillText(pillBg);
      return {
        id: p.id,
        ratio: 0,
        level: "fail",
        label: "slecht",
        bg: pillBg,
        fg: pillFg,
        swatchText: fgValue || null,
        swatchBg: bgList[0] || null,
        cssVarFg: fgVarName,
        cssVarBg: p.bg,
        fixFgCandidates: p.fixFgCandidates || [],
        _noFixPossible: !!noFixMap.value[p.id],
      };
    }

    // Worst-case background only (foreground is what is actually used on screen)
    let worstBg = null;
    let worstRatio = Infinity;

    for (const bg of bgList) {
      if (!bg) continue;
      const r = getContrastRatio(fgValue, bg);
      const rr = Number.isFinite(r) ? r : 0;
      if (rr < worstRatio) {
        worstRatio = rr;
        worstBg = bg;
      }
    }

    if (!worstBg) {
      const pillBg = resolveCssColorFrom(scopeEl, "--color-danger");
      const pillFg = pickReadablePillText(pillBg);
      return {
        id: p.id,
        ratio: 0,
        level: "fail",
        label: "slecht",
        bg: pillBg,
        fg: pillFg,
        swatchText: fgValue,
        swatchBg: null,
        cssVarFg: fgVarName,
        cssVarBg: p.bg,
        fixFgCandidates: p.fixFgCandidates || [],
        _noFixPossible: !!noFixMap.value[p.id],
      };
    }

    const result = evaluateContrastVisual(fgValue, worstBg);

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

    const pillBg = resolveCssColorFrom(scopeEl, statusVar);
    const pillFg = pickReadablePillText(pillBg);

    return {
      id: p.id,
      ratio: worstRatio,
      level: result.level,
      perceptual: result.perceptual,
      label,
      bg: pillBg,
      fg: pillFg,
      cssVarFg: fgVarName,
      cssVarBg: p.bg,
      fixFgCandidates: p.fixFgCandidates || [],
      swatchText: fgValue,
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
function normalizeColor(v) {
  return (v || "").trim().toLowerCase();
}

function pickFixSourceVar(scopeEl, candidates, currentFg) {
  const cur = normalizeColor(currentFg);
  for (const c of candidates || []) {
    const val = resolveCssColorFrom(scopeEl, c);
    if (normalizeColor(val) === cur) return c;
  }
  return (candidates && candidates[0]) || null;
}

async function fixContrast(item) {
  if (!item || !props.scales) return;
  if (item.label === "prima" || item.label === "goed") return;

  const scopeEl = getMockupScopeEl();

  noFixMap.value[item.id] = false;

  const bg = item.swatchBg;
  const fg = item.swatchText;

  if (!bg || !fg) {
    noFixMap.value[item.id] = true;
    updateContrastChecks();
    return;
  }

  const sourceVar = pickFixSourceVar(scopeEl, item.fixFgCandidates, fg);
  if (!sourceVar) {
    noFixMap.value[item.id] = true;
    updateContrastChecks();
    return;
  }

  const sourceColor = resolveCssColorFrom(scopeEl, sourceVar);
  if (!sourceColor) {
    noFixMap.value[item.id] = true;
    updateContrastChecks();
    return;
  }

  const step = 0.04;

  const darker = shade(sourceColor, step);
  const lighter = tint(sourceColor, step);

  const rCurrent = getContrastRatio(fg, bg);
  const rDarker = getContrastRatio(darker, bg);
  const rLighter = getContrastRatio(lighter, bg);

  let next = null;

  if (rDarker > rCurrent && rDarker >= rLighter) next = darker;
  if (rLighter > rCurrent && rLighter > rDarker) next = lighter;

  if (!next) {
    noFixMap.value[item.id] = true;
    updateContrastChecks();
    return;
  }

  applyCssVar(sourceVar, next);

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
  font-size: var(--fs-body-xs);
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
  gap: var(--space-10);
  padding: var(--space-5) var(--space-10);
  border-radius: var(--radius-sm);
  border: var(--ui-panel-border-soft);
  overflow: hidden;
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

/* ------------------------------------------------------
   RESPONSIVE COLLAPSE
------------------------------------------------------ */

.contrast-toggle {
  display: none;
  margin: var(--space-20) 0;
}

@media (max-width: 1399px) {
  .controls {
    width: 33.33%;
  }
  .contrast-toggle {
    display: inline-block;
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
    width: 80%;
  }
}

@media (max-width: 575px) {
  .controls {
    width: 100%;
  }
  .contrast-row {
    width: 100%;
  }
}
</style>
