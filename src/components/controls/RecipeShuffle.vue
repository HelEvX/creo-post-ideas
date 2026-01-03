<template>
  <div class="recipe-shuffle">
    <div class="recipe-info-container">
      <div class="controls">
        <button type="button" class="btn-primary" @click="prevRecipe" :disabled="!canNavigateRecipes">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <h4 class="recipe-title" :class="{ 'is-disabled': !canNavigateRecipes }">
          {{ activeRecipe ? activeRecipe.title : "Basis" }}
        </h4>

        <button type="button" class="btn-primary" @click="nextRecipe" :disabled="!canNavigateRecipes">
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
            <span v-if="item.label === 'prima' || item.label === 'goed'" class="icon-pass"> ✓ </span>

            <span v-else-if="item.label && item.label === 'slecht'" class="icon-fail"> ! </span>

            {{ item.label || "-" }}
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
import { anyToRgb, rgbToHsl, hslToRgb, rgbToHex, getContrastRatio } from "../../utils/colorBlender.js";

import { getTextModeForBackground } from "../../utils/colorLogic.js";

// DEBUG: logs evaluated contrast rows to console.
// Intentionally left enabled for development and thesis validation.
const DEBUG_CONTRAST = true;

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
   DISABLE RECIPES ON DEFAULT
-------------------------------------------------- */

const canNavigateRecipes = computed(() => {
  return !!props.scales && recipes.length > 0;
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

const noFixTimers = Object.create(null);

/* --------------------------------------------------
   LIFECYCLE
-------------------------------------------------- */
function onPaletteUpdated() {
  scheduleContrastUpdate();
}

function onMockupVisualsUpdated() {
  scheduleContrastUpdate();
}

onMounted(() => {
  window.addEventListener("palette-updated", onPaletteUpdated);
  window.addEventListener("mockup-visuals-updated", onMockupVisualsUpdated);

  scheduleContrastUpdate();
});

onBeforeUnmount(() => {
  window.removeEventListener("palette-updated", onPaletteUpdated);
  window.removeEventListener("mockup-visuals-updated", onMockupVisualsUpdated);
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

/* ------------------------------
   MOCKUP-SCOPED VARIABLE READING
--------------------------------- */

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

function readVarPreferred(scopeEl, name) {
  if (!name) return "";
  const isMockupScope = scopeEl && scopeEl.classList && scopeEl.classList.contains("post-content");

  // dynamic-* is mockup-scoped source of truth
  if (name.startsWith("--dynamic-")) {
    if (!isMockupScope) return "";
    return getComputedStyle(scopeEl).getPropertyValue(name).trim();
  }

  // other vars may live on root; also allow override on scope if present
  const scoped = scopeEl ? getComputedStyle(scopeEl).getPropertyValue(name).trim() : "";
  if (scoped) return scoped;

  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function resolveVarToComputed(scopeEl, varName, cssProp) {
  const raw = readVarPreferred(scopeEl, varName);
  if (!raw) return null;
  return resolveToComputedColor(raw, cssProp);
}

function resolveToComputedColor(value, cssProp = "color") {
  if (!value) return null;

  const v = String(value).trim();
  if (!v) return null;

  // fast path (already parseable by your utils)
  if (v.startsWith("#") || v.startsWith("rgb(") || v.startsWith("rgba(")) return v;

  // let the browser compute functions like color-mix(), var(), etc.
  const el = resolveToComputedColor._el || (resolveToComputedColor._el = document.createElement("span"));

  if (!el.isConnected) {
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.style.top = "-9999px";
    el.style.opacity = "0";
    document.body.appendChild(el);
  }

  if (cssProp === "backgroundColor") {
    el.style.backgroundColor = "";
    el.style.backgroundColor = v;
    return getComputedStyle(el).backgroundColor;
  }

  el.style.color = "";
  el.style.color = v;
  return getComputedStyle(el).color;
}

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

function applyCssVar(scopeEl, cssVarName, value) {
  if (!cssVarName || !value) return;

  const root = document.documentElement;
  const isMockupScope = scopeEl && scopeEl.classList && scopeEl.classList.contains("post-content");

  // dynamic-* may ONLY be written inside the mockup scope
  if (cssVarName.startsWith("--dynamic-")) {
    if (!isMockupScope) return;
    scopeEl.style.setProperty(cssVarName, value, "important");
    return;
  }

  // everything else (tokens like --ui-*, --caption-*, --text-*) must be written to root
  root.style.setProperty(cssVarName, value, "important");
}

function resolveScopedThenRoot(scopeEl, value) {
  const scoped = resolveCssColorFrom(scopeEl, value);
  if (scoped) return scoped;
  return resolveCssColor(value);
}

async function scheduleContrastUpdate() {
  if (scheduleContrastUpdate._pending) return;
  scheduleContrastUpdate._pending = true;

  await nextTick();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateContrastChecks();
      scheduleContrastUpdate._pending = false;
    });
  });
}

function triggerNoFixHint(id, timeout = 1500) {
  noFixMap.value[id] = true;

  if (noFixTimers[id]) {
    clearTimeout(noFixTimers[id]);
  }

  noFixTimers[id] = setTimeout(() => {
    noFixMap.value[id] = false;
    delete noFixTimers[id];

    updateContrastChecks();
  }, timeout);
}

/* --------------------------------------------------
   APPLY RECIPE
-------------------------------------------------- */

function applyActiveRecipe() {
  if (!props.scales || !activeRecipe.value) return;

  const root = document.documentElement;
  const roles = activeRecipe.value.roles;
  const scalesCopy = JSON.parse(JSON.stringify(props.scales));

  // Dark mode = inverted recipe
  if (activeRecipe.value?.id === "inverted") {
    root.classList.add("recipe-inverted");
  } else {
    root.classList.remove("recipe-inverted");
  }

  // Shadow participation + recipe-driven shadow alpha
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
    fixFgCandidates: ["--dynamic-title"], // fix what the swatch actually represents (scoped)
    largeText: true,
  },
  {
    id: "main-paragraph",
    fgVar: "--dynamic-text",
    bg: "CONTEXT",
    fixFgCandidates: ["--dynamic-text"], // fix what the swatch actually represents (scoped)
    largeText: true,
  },

  // Left card (alt panel)
  {
    id: "card1-caption",
    fgVar: "--caption-on-alt-panel",
    bg: "--ui-alt-panel-bg",
    fixFgCandidates: ["--caption-on-alt-panel"],
  },

  {
    id: "card1-title",
    fgVar: "--title-on-alt-panel",
    bg: "--ui-alt-panel-bg",
    fixFgCandidates: ["--title-on-alt-panel"],
  },
  {
    id: "card1-paragraph",
    fgVar: "--text-on-alt-panel",
    bg: "--ui-alt-panel-bg",
    fixFgCandidates: ["--text-on-alt-panel"],
  },

  // Right card (panel)
  {
    id: "card2-caption",
    fgVar: "--caption-on-panel",
    bg: "--ui-panel-bg",
    fixFgCandidates: ["--caption-on-panel"],
  },
  {
    id: "card2-title",
    fgVar: "--title-on-panel",
    bg: "--ui-panel-bg",
    fixFgCandidates: ["--title-on-panel"],
  },
  {
    id: "card2-paragraph",
    fgVar: "--text-on-panel",
    bg: "--ui-panel-bg",
    fixFgCandidates: ["--text-on-panel"],
  },

  // Accent block
  {
    id: "accent-caption",
    fgVar: "--caption-on-accent",
    bg: "ACCENT_BG",
    fixFgCandidates: ["--caption-on-accent"],
  },
  {
    id: "accent-text",
    fgVar: "--text-on-accent",
    bg: "ACCENT_BG",
    fixFgCandidates: ["--text-on-accent"],
  },
]);

/* --------------------------------------------------
   CONTRAST CHECK (SCORING)
-------------------------------------------------- */

function updateContrastChecks() {
  const scopeEl = getMockupScopeEl();

  // If mockup isn't mounted yet, try again next frame
  if (!scopeEl || !scopeEl.classList || !scopeEl.classList.contains("post-content")) {
    requestAnimationFrame(() => updateContrastChecks());
    return;
  }

  let contextBgs = props.bgContext?.bgVars?.map((v) => resolveCssColorFrom(scopeEl, v)).filter(Boolean) || [];

  // HARD FALLBACK — NEVER allow empty CONTEXT
  if (contextBgs.length === 0) {
    const cs = getComputedStyle(scopeEl);
    const bg = cs.backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)") {
      contextBgs = [bg];
    }
  }

  contrastResults.value = contrastPairs.value.map((p) => {
    let bgVarSource = null;

    const bgList =
      p.bg === "CONTEXT"
        ? contextBgs
            .slice(0, 1)
            .map((bg) => {
              bgVarSource = props.bgContext?.bgVars?.[0] || null;
              return resolveToComputedColor(bg, "backgroundColor");
            })
            .filter(Boolean)
        : p.bg === "ACCENT_BG"
        ? [
            (() => {
              bgVarSource = props.bgContext?.tone === "secondary" ? "--ui-primary-bg" : "--ui-secondary-bg";
              return resolveToComputedColor(resolveScopedThenRoot(scopeEl, bgVarSource), "backgroundColor");
            })(),
          ].filter(Boolean)
        : [
            (() => {
              bgVarSource = p.bg;
              return resolveToComputedColor(resolveScopedThenRoot(scopeEl, p.bg), "backgroundColor");
            })(),
          ].filter(Boolean);

    const fgVarName = p.fgVar;

    // Read the actual foreground color that is currently applied in the mockup scope
    const fgValue = resolveFgValue(scopeEl, fgVarName);

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
        bgVarSource,
        fixFgCandidates: p.fixFgCandidates || [],
        fixBgCandidates: p.fixBgCandidates || [],
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
        fixBgCandidates: p.fixBgCandidates || [],
        _noFixPossible: !!noFixMap.value[p.id],
      };
    }

    const isFirstTwo = p.id === "main-title" || p.id === "main-paragraph";

    // WCAG thresholds
    const AAA = 7.0;
    const AA = 4.5;
    const AA_LARGE = 3.0;
    const A = 2.0;

    let wcagLevel = "fail";
    if (worstRatio >= AAA) wcagLevel = "AAA";
    else if (worstRatio >= AA) wcagLevel = "AA";
    else if (worstRatio >= AA_LARGE) wcagLevel = "AA Large";
    else if (worstRatio >= A) wcagLevel = "A";

    let statusVar;
    let label;

    // Rows 1-2 (mockup headline/paragraph) are treated more leniently for "goed"
    if (isFirstTwo) {
      if (wcagLevel === "AAA" || wcagLevel === "AA") {
        statusVar = "--color-success-dark";
        label = "prima";
      } else if (wcagLevel === "AA Large") {
        statusVar = "--color-success";
        label = "goed";
      } else if (wcagLevel === "A") {
        statusVar = "--color-warning";
        label = "beperkt";
      } else {
        statusVar = "--color-danger";
        label = "slecht";
      }
    } else {
      // All other rows
      if (wcagLevel === "AAA") {
        statusVar = "--color-success-dark";
        label = "prima";
      } else if (wcagLevel === "AA") {
        statusVar = "--color-success";
        label = "goed";
      } else if (wcagLevel === "AA Large" || wcagLevel === "A") {
        statusVar = "--color-warning";
        label = "beperkt";
      } else {
        statusVar = "--color-danger";
        label = "slecht";
      }
    }

    const pillBg = resolveCssColorFrom(scopeEl, statusVar);
    const pillFg = pickReadablePillText(pillBg);

    return {
      id: p.id,
      ratio: worstRatio,
      level: wcagLevel,
      label,
      bg: pillBg,
      fg: pillFg,
      cssVarFg: fgVarName,
      cssVarBg: p.bg,
      bgVarSource,
      fixFgCandidates: p.fixFgCandidates || [],
      fixBgCandidates: p.fixBgCandidates || [],
      swatchText: fgValue,
      swatchBg: worstBg,
      _noFixPossible: !!noFixMap.value[p.id],
      _dbgFg: fgValue,
      _dbgBg: worstBg,
    };
  });

  if (DEBUG_CONTRAST) {
    console.table(
      contrastResults.value.map((r) => ({
        id: r.id,
        ratio: r.ratio,
        target: r._dbgTarget,
        fg: r._dbgFg,
        bg: r._dbgBg,
        label: r.label,
        level: r.level,
      }))
    );
  }
}

/* --------------------------------------------------
   FIX CONTRAST
-------------------------------------------------- */

async function fixContrast(item) {
  if (!item || !props.scales) return;

  const scopeEl = getMockupScopeEl();
  noFixMap.value[item.id] = false;

  const bg = item.swatchBg;
  if (!bg) {
    triggerNoFixHint(item.id);
    updateContrastChecks();
    return;
  }

  const sourceVar = item.fixFgCandidates && item.fixFgCandidates[0];
  if (!sourceVar) {
    triggerNoFixHint(item.id);
    updateContrastChecks();
    return;
  }

  const startFg = resolveVarToComputed(scopeEl, sourceVar, "color");
  if (!startFg) {
    triggerNoFixHint(item.id);
    updateContrastChecks();
    return;
  }

  // One-step nudge only (visible feedback), do not chase AA in one click
  const STEP_SIZE = 0.02;

  const r0 = getContrastRatio(startFg, bg);

  // Decide which direction improves contrast more, but apply only ONE step
  const darker = toneShift(startFg, -1, STEP_SIZE);
  const lighter = toneShift(startFg, +1, STEP_SIZE);

  const rDark = getContrastRatio(darker, bg);
  const rLight = getContrastRatio(lighter, bg);

  let nextFg = null;
  if (rDark > r0 || rLight > r0) {
    nextFg = rDark >= rLight ? darker : lighter;
  }

  if (nextFg) {
    applyCssVar(scopeEl, sourceVar, nextFg);
    await nextTick();
    window.dispatchEvent(new Event("dynamic-text-updated"));
    scheduleContrastUpdate();
    return;
  }

  // Background fallback: ONE tiny nudge (choose direction by contrast improvement)
  if (item.bgVarSource) {
    const bgVar = item.bgVarSource;

    const currentBg = resolveVarToComputed(scopeEl, bgVar, "backgroundColor");
    if (!currentBg) {
      triggerNoFixHint(item.id);
      updateContrastChecks();
      return;
    }

    const STEP_BG = 0.02;

    const rBase = getContrastRatio(startFg, currentBg);

    const darkerBg = toneShift(currentBg, -1, STEP_BG);
    const lighterBg = toneShift(currentBg, +1, STEP_BG);

    const rDark = getContrastRatio(startFg, darkerBg);
    const rLight = getContrastRatio(startFg, lighterBg);

    let nextBg = null;

    // apply ONLY if it improves contrast; pick best improvement
    if (rDark > rBase || rLight > rBase) {
      nextBg = rDark >= rLight ? darkerBg : lighterBg;
    }

    // optional safety clamp (prevents extremes)
    if (!nextBg) {
      triggerNoFixHint(item.id);
      updateContrastChecks();
      return;
    }

    if (isNearLimit(nextBg)) {
      triggerNoFixHint(item.id);
      updateContrastChecks();
      return;
    }

    applyCssVar(scopeEl, bgVar, nextBg);

    await nextTick();
    window.dispatchEvent(new Event("palette-updated"));
    scheduleContrastUpdate();
    return;
  }

  triggerNoFixHint(item.id);
  updateContrastChecks();
}

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

function resolveFgValue(scopeEl, fgVarName) {
  return resolveVarToComputed(scopeEl, fgVarName, "color");
}

function toneShift(hex, dir, amount) {
  // dir: +1 = lighter, -1 = darker
  // amount: 0..1
  const [h, s, l] = rgbToHsl(anyToRgb(hex));

  // diagonal move in tone space
  const newL = Math.min(1, Math.max(0, l + dir * amount));
  const newS = Math.min(1, Math.max(0, s - dir * amount * 0.35));

  return rgbToHex(hslToRgb([h, newS, newL]));
}

function isNearLimit(hex) {
  const [, , l] = rgbToHsl(anyToRgb(hex));
  return l < 0.04 || l > 0.96;
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
  font-size: var(--fs-body);
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

.recipe-title.is-disabled {
  color: var(--dynamic-disabled);
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
  line-height: 1;
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
