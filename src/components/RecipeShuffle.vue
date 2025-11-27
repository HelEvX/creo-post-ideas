<script setup>
import { ref, watch, computed, nextTick, onMounted } from "vue";
import { recipes } from "../data/recipes.js";
import { getContrastRatio } from "../utils/colorBlender.js";

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

// ---------------------------------------------
// Apply Recipe
// ---------------------------------------------
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
  const event = new CustomEvent("brand-reset", {
    detail: {
      slug: props.brandTokens.meta?.slug || props.brandTokens.slug || props.brandTokens.name.toLowerCase(),
      tokens: props.brandTokens,
    },
  });
  window.dispatchEvent(event);
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
  { id: "text-section", labelbg: "section", labelfg: "text", fg: "--ui-text", bg: "--ui-section-bg" },
  { id: "text-alt-section", labelbg: "alt section", labelfg: "text", fg: "--ui-text", bg: "--ui-alt-section-bg" },
  { id: "text-panel", labelbg: "panel", labelfg: "text", fg: "--ui-text", bg: "--ui-panel-bg" },
  { id: "heading-section", labelbg: "section", labelfg: "title", fg: "--ui-heading", bg: "--ui-section-bg" },
  {
    id: "heading-alt-section",
    labelbg: "alt section",
    labelfg: "title",
    fg: "--ui-heading",
    bg: "--ui-alt-section-bg",
  },
  { id: "soft-section", labelbg: "section", labelfg: "subtitle", fg: "--ui-soft", bg: "--ui-section-bg" },
  { id: "caption-section", labelbg: "section", labelfg: "caption", fg: "--ui-caption", bg: "--ui-section-bg" },
  { id: "accent-section", labelbg: "section", labelfg: "accent", fg: "--ui-accent", bg: "--ui-section-bg" },
  { id: "link-section", labelbg: "section", labelfg: "link", fg: "--ui-link", bg: "--ui-section-bg" },
]);

const contrastResults = ref([]);

function evalContrast(fgVar, bgVar) {
  const fg = readCSSVar(fgVar);
  const bg = readCSSVar(bgVar);
  if (!fg || !bg) return { ratio: "-", level: "N/A" };
  const r = getContrastRatio(fg, bg);
  let level = "Fail";
  if (r >= 7) level = "AAA";
  else if (r >= 4.5) level = "AA";
  else if (r >= 3) level = "AA Large";
  return { ratio: r.toFixed(2), level };
}

function pickReadableText(backgroundHex) {
  const textDark = readCSSVar("--ui-text") || null;
  const textLight = readCSSVar("--ui-inverse") || null;

  if (!backgroundHex || !textDark || !textLight) {
    return "var(--ui-text)";
  }

  const contrastDark = getContrastRatio(textDark, backgroundHex);
  const contrastLight = getContrastRatio(textLight, backgroundHex);

  return contrastLight >= contrastDark ? "var(--ui-inverse)" : "var(--ui-text)";
}

function updateContrastChecks() {
  contrastResults.value = contrastPairs.value.map((p) => {
    const result = evalContrast(p.fg, p.bg);

    // pick background variable based on AA/AAA/Fail
    let bgVar = null;
    if (result.level === "AAA") bgVar = "--color-success-dark";
    else if (result.level === "AA") bgVar = "--color-success";
    else if (result.level === "AA Large") bgVar = "--color-warning";
    else if (result.level === "Fail") bgVar = "--color-danger";

    const bgHex = bgVar ? readCSSVar(bgVar) : null;
    const textColor = bgHex ? pickReadableText(bgHex) : "var(--ui-text)";

    return {
      id: p.id,
      labelbg: p.labelbg,
      labelfg: p.labelfg,
      ratio: result.ratio,
      level: result.level,
      bg: bgHex,
      fg: textColor,
    };
  });
}

watch(index, () => updateContrastChecks(), { immediate: false });

defineExpose({ nextRecipe, prevRecipe });
</script>

<template>
  <div class="recipe-shuffle">
    <div class="controls">
      <button type="button" @click="prevRecipe">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <h5 class="recipe-title">
        {{ activeRecipe ? activeRecipe.title : "Brand default" }}
      </h5>
      <button type="button" @click="nextRecipe">
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
      <table>
        <thead>
          <tr>
            <th>Background</th>
            <th>Text</th>
            <!-- <th>Ratio</th> -->
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contrastResults" :key="item.id">
            <td>{{ item.labelbg }}</td>
            <td>{{ item.labelfg }}</td>
            <!-- <td>{{ item.ratio }}</td> -->
            <td
              :class="['result-cell', item.level ? item.level.toLowerCase().replace(' ', '-') : '']"
              :style="{
                background: item.bg,
                color: item.fg,
              }">
              <span v-if="item.level === 'AAA' || item.level === 'AA'" class="icon-pass">✓</span>
              <span v-else-if="item.level && item.level.toLowerCase().includes('fail')" class="icon-fail">!</span>

              {{ item.level || "—" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* ---------------------------------------------
   CONTAINER
--------------------------------------------- */
.recipe-shuffle {
  border: var(--ui-panel-border);
  border-radius: var(--radius-md);
  padding: var(--space-20);
  background: var(--ui-panel-bg);
  color: var(--ui-text);
  display: flex;
  flex-direction: column;
  gap: var(--space-20);
}

/* ---------------------------------------------
   TOP CONTROLS
--------------------------------------------- */
.controls {
  display: flex;
  justify-content: space-between;
  background: var(--ui-faint);
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

button {
  background: var(--ui-accent);
  color: var(--ui-inverse);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-5) var(--space-20);
  cursor: pointer;
  transition: var(--transition-default);
}

button:hover {
  background: var(--ui-accent-hover);
}

.reset-wrap {
  text-align: center;
}

.reset-btn {
  background: none;
  border: 1px solid var(--ui-accent);
  color: var(--ui-accent);
  border-radius: var(--radius-sm);
  padding: var(--space-5) var(--space-20);
  cursor: pointer;
}

.reset-btn:hover {
  background: var(--ui-accent);
  color: var(--ui-inverse);
}

/* ---------------------------------------------
   CONTRAST CHECK
--------------------------------------------- */
.contrast-check {
  width: 100%;
  margin-top: var(--space-20);
  text-align: center;
}

.contrast-check table {
  width: 100%;
  border-collapse: collapse;
}

/* Make each row flex */
.contrast-check tr {
  display: flex;
  width: 100%;
  /* border-bottom: 1px solid var(--color-border-dark); */
  padding: var(--space-5) 0;
}

@media (min-width: 576px) and (max-width: 992px) {
  .contrast-check th {
    display: none;
  }
  .contrast-check tr {
    flex-direction: column;
    margin-bottom: var(--space-10);
  }
}

.contrast-check td:first-child,
.contrast-check th:first-child {
  width: 33.33%;
  text-align: left;
}

.contrast-check td:nth-child(2),
.contrast-check th:nth-child(2) {
  flex: 1 0 auto;
  text-align: left;
}

/* last column tight + right */
.contrast-check td:last-child,
.contrast-check th:last-child {
  flex-shrink: 0;
  text-align: right;
}

.contrast-check th,
.contrast-check td {
  padding: var(--space-5) var(--space-10);
}

/* Pills */
.contrast-check td.result-cell {
  font-weight: 500;
  padding: var(--space-5) var(--space-10);
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: var(--space-5);
}

.icon-pass,
.icon-fail {
  /* width: 1.2rem; */
  text-align: center;
  color: inherit;
}
</style>
