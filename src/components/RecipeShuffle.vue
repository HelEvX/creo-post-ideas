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
  { id: "text-section", label: "Body vs Section", fg: "--ui-text", bg: "--ui-section-bg" },
  { id: "text-alt-section", label: "Body vs Alt Section", fg: "--ui-text", bg: "--ui-alt-section-bg" },
  { id: "text-panel", label: "Body vs Panel", fg: "--ui-text", bg: "--ui-panel-bg" },
  { id: "heading-section", label: "Heading vs Section", fg: "--ui-heading", bg: "--ui-section-bg" },
  { id: "heading-alt-section", label: "Heading vs Alt Sec", fg: "--ui-heading", bg: "--ui-alt-section-bg" },
  { id: "caption-section", label: "Caption vs Section", fg: "--ui-caption", bg: "--ui-section-bg" },
  { id: "accent-section", label: "Accent vs Section", fg: "--ui-accent", bg: "--ui-section-bg" },
  { id: "link-section", label: "Link vs Section", fg: "--ui-link", bg: "--ui-section-bg" },
  { id: "soft-section", label: "Soft vs Section", fg: "--ui-soft", bg: "--ui-section-bg" },
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

function updateContrastChecks() {
  contrastResults.value = contrastPairs.value.map((p) => ({
    id: p.id,
    label: p.label,
    ...evalContrast(p.fg, p.bg),
  }));
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
  /* align-items: center; */
  justify-content: space-between;
  /* gap: 0.5rem; */
  margin-bottom: var(--space-10);
  background: var(--ui-faint);
  border-radius: var(--radius-sm);
}
.recipe-title {
  /* font-weight: 600; */
  /* font-size: 1.4rem; */
  margin: 0.5rem auto;
  text-align: center;
}
.recipe-desc {
  font-size: 1.3rem;
  opacity: 0.8;
  margin-bottom: var(--space-20);
  text-align: center;
}
button {
  background: var(--ui-accent);
  color: var(--ui-inverse);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.4rem 1.4rem;
  cursor: pointer;
  transition: var(--transition-default);
}
button:hover {
  background: var(--ui-accent-hover);
}
.reset-wrap {
  text-align: center;
  margin-bottom: var(--space-20);
}
.reset-btn {
  background: none;
  border: 1px solid var(--ui-accent);
  color: var(--ui-accent);
  border-radius: var(--radius-sm);
  padding: 0.4rem 1.2rem;
  cursor: pointer;
  transition: var(--transition-default);
}
.reset-btn:hover {
  background: var(--ui-accent);
  color: var(--ui-inverse);
}
.contrast-check {
  margin-top: var(--space-20);
  text-align: center;
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
