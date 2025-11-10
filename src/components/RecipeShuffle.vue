<script setup>
console.log("RecipeShuffle script loaded");

import { ref, watch, computed } from "vue";
import { recipes } from "../data/recipes.js";
import { getContrastRatio } from "../utils/colorBlender.js";

// Props from BrandTokens or App.vue
const props = defineProps({
  brandTokens: { type: Object, required: true },
});

// State
const index = ref(0);
const total = recipes.length;
const activeRecipe = computed(() => recipes[index.value]);

// ---------------------------------------------
// CONTRAST CHECKER
// ---------------------------------------------

// 1. Declare reactive arrays
const contrastPairs = ref([
  // Primary text on main backgrounds
  { id: "text-section", label: "Body Text vs Section Background", fg: "--ui-text", bg: "--ui-section-bg" },
  { id: "text-alt-section", label: "Body Text vs Alt Section Background", fg: "--ui-text", bg: "--ui-alt-section-bg" },
  { id: "text-panel", label: "Body Text vs Panel Background", fg: "--ui-text", bg: "--ui-panel-bg" },

  // Headings and captions
  { id: "heading-section", label: "Heading vs Section Background", fg: "--ui-heading", bg: "--ui-section-bg" },
  {
    id: "heading-alt-section",
    label: "Heading vs Alt Section Background",
    fg: "--ui-heading",
    bg: "--ui-alt-section-bg",
  },
  { id: "caption-section", label: "Caption vs Section Background", fg: "--ui-caption", bg: "--ui-section-bg" },

  // Accent and link colors
  { id: "accent-section", label: "Accent vs Section Background", fg: "--ui-accent", bg: "--ui-section-bg" },
  {
    id: "accent-hover-section",
    label: "Accent Hover vs Section Background",
    fg: "--ui-accent-hover",
    bg: "--ui-section-bg",
  },
  { id: "link-section", label: "Link vs Section Background", fg: "--ui-link", bg: "--ui-section-bg" },
  { id: "link-hover-section", label: "Link Hover vs Section Background", fg: "--ui-link-hover", bg: "--ui-section-bg" },

  // Links on dark backgrounds (nav, hero, footer)
  { id: "link-dark", label: "Link on Dark (Hero/Nav/Footer)", fg: "--ui-link-on-dark", bg: "--ui-hero-bg" },
  { id: "link-dark-hover", label: "Link on Dark Hover", fg: "--ui-link-on-dark-hover", bg: "--ui-hero-bg" },

  // Soft/inverse use cases (for muted or inverted UI zones)
  { id: "soft-section", label: "Soft Text vs Section Background", fg: "--ui-soft", bg: "--ui-section-bg" },
  { id: "soft-alt-section", label: "Soft Text vs Alt Section Background", fg: "--ui-soft", bg: "--ui-alt-section-bg" },
]);

const contrastResults = ref([]);

// 2. Utility to read CSS variables
function getCSSVar(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// 3. Compute contrast between two variables
function evaluateContrast(fg, bg) {
  const fgColor = getCSSVar(fg);
  const bgColor = getCSSVar(bg);
  if (!fgColor || !bgColor) return null;

  const ratio = getContrastRatio(fgColor, bgColor);
  let level = "Fail";
  if (ratio >= 7) level = "AAA";
  else if (ratio >= 4.5) level = "AA";
  else if (ratio >= 3) level = "AA Large";

  return { ratio: ratio.toFixed(2), level };
}

// 4. Update table results
function updateContrastChecks() {
  const results = contrastPairs.value
    .map((pair) => {
      const res = evaluateContrast(pair.fg, pair.bg);
      if (!res) return null; // skip if contrast couldn't be computed
      return {
        id: pair.id,
        label: pair.label,
        ...res,
      };
    })
    .filter(Boolean); // remove nulls
  contrastResults.value = results;

  // --- Optional grouped debug log ---
  console.group("Recipe Shuffle Update");
  console.log("Active recipe:", activeRecipe.value.title);
  console.table(contrastResults.value);
  console.groupEnd();
}

// 5. React to recipe index changes (ensure 'index' is declared before this watch)
watch(index, () => updateContrastChecks(), { immediate: true });

// ---------------------------------------------
// RECIPE NAVIGATION & BRAND WATCH
// ---------------------------------------------

// Apply all roles from the current recipe to :root
function applyActiveRecipe() {
  const root = document.documentElement.style;
  const roles = activeRecipe.value.roles;

  for (const [varName, value] of Object.entries(roles)) {
    root.setProperty(varName, value);
  }
}

// Navigation
function nextRecipe() {
  index.value = (index.value + 1) % total;
  applyActiveRecipe();
  updateContrastChecks();
}
function prevRecipe() {
  index.value = (index.value - 1 + total) % total;
  applyActiveRecipe();
  updateContrastChecks();
}

// Auto apply first recipe + whenever brand changes
watch(
  () => props.brandTokens,
  () => {
    applyActiveRecipe();
    updateContrastChecks();
  },
  { immediate: true }
);
</script>

<template>
  <div class="recipe-shuffle">
    <div class="controls">
      <button @click="prevRecipe" aria-label="Previous recipe">‹</button>
      <button @click="nextRecipe" aria-label="Next recipe">›</button>
      <span class="recipe-title">{{ activeRecipe.title }}</span>
    </div>

    <p class="recipe-desc">{{ activeRecipe.description }}</p>

    <div class="contrast-check">
      <h4>Contrast Evaluation</h4>
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th>Ratio</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contrastResults" :key="item.id">
            <td>{{ item.label }}</td>
            <td>{{ item.ratio }}</td>
            <td :class="item.level ? item.level.toLowerCase().replace(' ', '-') : ''">
              {{ item.level || "—" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.recipe-shuffle {
  border: var(--ui-panel-border);
  border-radius: var(--radius-md);
  padding: var(--space-20);
  background: var(--ui-panel-bg);
  color: var(--ui-text);
  max-width: 480px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: var(--space-10);
}
.recipe-title {
  font-weight: 600;
  font-size: 1.4rem;
}
.recipe-desc {
  font-size: 1.3rem;
  opacity: 0.8;
  margin-bottom: var(--space-20);
}
button {
  background: var(--ui-accent);
  color: var(--ui-inverse);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  transition: var(--transition-default);
}
button:hover {
  background: var(--ui-accent-hover);
}
.contrast-check {
  margin-top: var(--space-20);
}
.contrast-check table {
  width: 100%;
  border-collapse: collapse;
}
.contrast-check th,
.contrast-check td {
  padding: 0.4rem 0.6rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}
.contrast-check td.aaa {
  color: #0a7d28;
}
.contrast-check td.aa {
  color: #4a9d26;
}
.contrast-check td.aa-large {
  color: #d19a0b;
}
.contrast-check td.fail {
  color: #d73c2c;
}
</style>
