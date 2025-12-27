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
   FIX TARGET RESOLUTION
   - Never write to --dynamic-* (derived, overwritten by App.vue)
   - Choose a SOURCE token to adjust based on pair intent
-------------------------------------------------- */
function getFixableSourceVar(item) {
  // 1. Dynamic text → underlying neutral tokens
  if (item.cssVarFg === "--dynamic-title") return "--color-title";
  if (item.cssVarFg === "--dynamic-text") return "--color-text";
  if (item.cssVarFg === "--dynamic-soft") return "--color-text-soft";

  // 2. Panel text
  if (item.cssVarFg === "--title-on-panel") return "--color-title";
  if (item.cssVarFg === "--text-on-panel") return "--color-text";
  if (item.cssVarFg === "--caption-on-panel") return "--color-primary";

  // 3. Brand-colored text
  if (item.fix === "brand-text") {
    return props.bgContext?.tone === "secondary" ? "--color-secondary" : "--color-primary";
  }

  return null;
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

// ensure contrast recalculates when mockup bg actually resolves
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

  { id: "card1-caption", fg: "--dynamic-soft", bg: "--ui-alt-panel-bg-derived", fix: "neutral-text" },
  { id: "card1-title", fg: "--dynamic-title", bg: "--ui-alt-panel-bg-derived", fix: "neutral-text" },
  { id: "card1-paragraph", fg: "--dynamic-text", bg: "--ui-alt-panel-bg-derived", fix: "neutral-text" },

  { id: "card2-caption", fg: "--caption-on-panel", bg: "--ui-panel-bg", fix: "brand-text" },
  { id: "card2-title", fg: "--title-on-panel", bg: "--ui-panel-bg", fix: "neutral-text" },
  { id: "card2-paragraph", fg: "--text-on-panel", bg: "--ui-panel-bg", fix: "neutral-text" },

  { id: "accent-text", fg: "ACCENT_FG", bg: "ACCENT_BG", fix: "neutral-text" },
]);

/* --------------------------------------------------
   CONTRAST CHECK (SCORING)
-------------------------------------------------- */

function updateContrastChecks() {
  const contextBgs = props.bgContext?.bgVars?.map(resolveCssColor).filter(Boolean) || [];

  contrastResults.value = contrastPairs.value.map((p) => {
    const bgList =
      p.bg === "CONTEXT"
        ? contextBgs
        : p.bg === "ACCENT_BG"
        ? [resolveCssColor(props.bgContext?.tone === "secondary" ? "--ui-primary-bg" : "--ui-secondary-bg")].filter(
            Boolean
          )
        : [resolveCssColor(p.bg)].filter(Boolean);

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

    let worstBg = null;
    let worstFg = null;
    let worstFgSourceVar = null;
    let worstRatio = Infinity;

    for (const bg of bgList) {
      let fg;
      let fgSourceVar = null;

      if (p.fg === "--dynamic-title") {
        const darkVar = "--color-title";
        const lightVar = "--color-text-inverse";
        const dark = resolveCssColor(darkVar);
        const light = resolveCssColor(lightVar);
        const useLight = getTextModeForBackground(bg, dark, light) === "light";
        fg = useLight ? light : dark;
        fgSourceVar = useLight ? lightVar : darkVar;
      } else if (p.fg === "--dynamic-text") {
        const darkVar = "--color-text";
        const lightVar = "--color-text-inverse";
        const dark = resolveCssColor(darkVar);
        const light = resolveCssColor(lightVar);
        const useLight = getTextModeForBackground(bg, dark, light) === "light";
        fg = useLight ? light : dark;
        fgSourceVar = useLight ? lightVar : darkVar;
      } else if (p.fg === "--dynamic-soft") {
        const darkVar = "--color-text-soft";
        const lightVar = "--color-text-soft-inverse";
        const dark = resolveCssColor(darkVar);
        const light = resolveCssColor(lightVar);
        const useLight = getTextModeForBackground(bg, dark, light) === "light";
        fg = useLight ? light : dark;
        fgSourceVar = useLight ? lightVar : darkVar;
      } else if (p.fg === "ACCENT_FG") {
        // Match InfoPost.vue behavior
        const isSecondaryMode = props.bgContext?.tone === "secondary";
        const varName = isSecondaryMode ? "--text-on-primary" : "--text-on-secondary";
        fg = resolveCssColor(varName);
        fgSourceVar = null; // derived role, do not write directly
      } else {
        fg = resolveCssColor(p.fg);
        fgSourceVar = null;
      }

      if (!fg || !bg) continue;

      const r = getContrastRatio(fg, bg);
      const rr = Number.isFinite(r) ? r : 0;

      if (rr < worstRatio) {
        worstRatio = rr;
        worstBg = bg;
        worstFg = fg;
        worstFgSourceVar = fgSourceVar;
      }
    }

    if (!worstBg || !worstFg) {
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
      fgSourceVar: worstFgSourceVar,
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
    // cannot safely "fix" against a context background; it can change (pattern/image/tone)
    noFixMap.value[item.id] = true;
    updateContrastChecks();
    return;
  }

  if (item.cssVarBg === "--ui-alt-panel-bg-derived") {
    // background is derived, we never change it
    // continue, but ONLY text fixes are allowed
  }

  noFixMap.value[item.id] = false;

  // IMPORTANT:
  // - For CONTEXT rows, cssVarBg is "CONTEXT" and must NOT be resolved as a CSS var.
  // - Always use the already computed worst-case values.
  const bg = resolveCssColor(item.cssVarBg);
  const effectiveFg = item.swatchText;
  const sourceVar = item.fgSourceVar || getFixableSourceVar(item);

  if (!bg || !effectiveFg || !sourceVar) {
    noFixMap.value[item.id] = true;
    updateContrastChecks();
    return;
  }

  const sourceColor = resolveCssColor(sourceVar);
  if (!sourceColor) {
    noFixMap.value[item.id] = true;
    updateContrastChecks();
    return;
  }

  const step = 0.04;

  const darker = shade(sourceColor, step);
  const lighter = tint(sourceColor, step);

  const rCurrent = getContrastRatio(effectiveFg, bg);
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
