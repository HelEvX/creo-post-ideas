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
    </div>

    <div class="contrast-check__header">
      <div class="empty-div"></div>
      <h4>Contrast Check</h4>

      <!-- Reset button -->
      <div class="reset-wrap">
        <button type="button" class="reset-btn btn-neutral" @click="resetContrastFixes">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </div>

    <ContrastChecker :bgContext="bgContext" :scales="scales" :colored="colored" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { recipes } from "../../data/recipes.js";
import ContrastChecker from "@/components/controls/ContrastChecker.vue";

/* --------------------------------------------------
   PROPS
-------------------------------------------------- */
const EVT_PALETTE = "palette-updated";

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

function resetContrastFixes() {
  const root = document.documentElement;
  const scopeEl = document.querySelector(".post-content") || document.documentElement;

  // clear root-level fix vars
  for (const prop of root.style) {
    if (prop.startsWith("--fix-")) {
      root.style.removeProperty(prop);
    }
  }

  // clear mockup-scoped fix vars
  if (scopeEl) {
    for (const prop of scopeEl.style) {
      if (prop.startsWith("--fix-")) {
        scopeEl.style.removeProperty(prop);
      }
    }
  }

  // rebuild the current visual state
  applyActiveRecipe();

  window.dispatchEvent(new Event("dynamic-text-updated"));
  window.dispatchEvent(new Event("palette-updated"));
}

/* --------------------------------------------------
   DISABLE RECIPES ON DEFAULT
-------------------------------------------------- */

const canNavigateRecipes = computed(() => {
  return !!props.scales && recipes.length > 0;
});

/* --------------------------------------------------
   STATE (default added to the list)
-------------------------------------------------- */
const index = ref(0);
const total = recipes.length + 1;

const activeRecipe = computed(() => {
  if (index.value === 0) return null; // default
  return { ...recipes[index.value - 1] };
});

/* --------------------------------------------------
   APPLY RECIPE
-------------------------------------------------- */

function readCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// GLOBAL resolver.
// Use ONLY for root-level UI tokens and brand variables
// that are not expected to be overridden per-mockup.
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
   RECIPE OVERRIDE CLEANUP (DEFAULT SLOT)
-------------------------------------------------- */

const RECIPE_ROLE_VARS = Array.from(
  new Set((recipes || []).flatMap((r) => Object.keys(r?.roles || {})).filter(Boolean))
);

function clearRecipeOverrides() {
  const root = document.documentElement;

  // remove all vars that recipes can override
  for (const v of RECIPE_ROLE_VARS) {
    root.style.removeProperty(v);
  }

  // remove recipe mode class
  root.classList.remove("recipe-inverted");
}

function applyActiveRecipe() {
  const root = document.documentElement;

  // DEFAULT (index === 0): revert to base brand tokens (no recipe overrides)
  if (!activeRecipe.value) {
    clearRecipeOverrides();
    window.dispatchEvent(new CustomEvent(EVT_PALETTE));
    return;
  }

  if (!props.scales) return;

  const roles = activeRecipe.value.roles;
  const scalesCopy = JSON.parse(JSON.stringify(props.scales));

  // Dark mode = inverted recipe
  if (activeRecipe.value.id === "inverted") {
    root.classList.add("recipe-inverted");
  } else {
    root.classList.remove("recipe-inverted");
  }

  // Shadow participation + recipe-driven shadow alpha
  const cs = getComputedStyle(root);
  const shadowCardRaw = cs.getPropertyValue("--card-shadow").trim();
  const brandUsesShadows = shadowCardRaw !== "" && shadowCardRaw.toLowerCase() !== "none";

  // Recipe role key: "--shadow-alpha" expects ["neutral", idx] where idx is 0..10
  function idxToAlpha(idx, baseAlpha) {
    const i = Math.max(0, Math.min(11, Number(idx)));

    // index 5 = identity
    if (i === 5) return baseAlpha;

    // 6 -> 11 : ramp up to fully opaque
    if (i > 5) {
      const t = (i - 5) / 6;
      return baseAlpha + t * (1 - baseAlpha);
    }

    // 0 -> 4 : ramp down to invisible
    if (i === 0) return 0;

    const t = i / 5;
    return baseAlpha * t;
  }

  for (const [cssVar, spec] of Object.entries(roles)) {
    if (cssVar === "--shadow-alpha") {
      if (!brandUsesShadows) continue;

      const idx = Array.isArray(spec) ? spec[1] : spec;
      if (idx == null) continue;

      const baseAlpha = parseFloat(getComputedStyle(root).getPropertyValue("--shadow-alpha")) || 0;
      const alpha = idxToAlpha(idx, baseAlpha);

      root.style.setProperty("--shadow-alpha", alpha, "important");
      continue;
    }

    if (cssVar === "--border-alpha") {
      const idx = Array.isArray(spec) ? spec[1] : spec;
      if (idx == null) continue;

      const baseAlpha = parseFloat(getComputedStyle(root).getPropertyValue("--border-alpha")) || 0;
      const alpha = idxToAlpha(idx, baseAlpha);

      root.style.setProperty("--border-alpha", alpha, "important");
      continue;
    }

    const hex = Array.isArray(spec)
      ? scalesCopy?.[spec[0]]?.[spec[1]]
      : spec?.startsWith("var(")
      ? resolveCssColor(spec)
      : spec;

    if (hex) {
      root.style.setProperty(cssVar, hex, "important");
    }
  }

  window.dispatchEvent(new CustomEvent(EVT_PALETTE));
}

/* --------------------------------------------------
   NAVIGATION
-------------------------------------------------- */
function advance(step) {
  index.value = (index.value + step + total) % total;
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

/* --------------------------------------------------
   WATCHERS
-------------------------------------------------- */
watch(
  () => props.scales,
  () => {
    index.value = 0; // start on default
    applyActiveRecipe();
  },
  { immediate: true }
);

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

.recipe-title.is-disabled {
  color: var(--dynamic-disabled);
}

/* ---------------------------------------------
   CONTRAST CHECK HEADER
--------------------------------------------- */

.contrast-check__header {
  display: flex;
  margin: var(--space-10) 0 var(--space-20);
  align-items: center;
  justify-content: space-between;
}

.contrast-check__header h4 {
  text-align: center;
}

@media (max-width: 1399.98px) {
  .contrast-check__header {
    justify-content: center;
  }
}

.contrast-check__header h4 {
  align-items: center;
  padding: 0 var(--space-10);
  flex: 0 1 100%;
}
@media (max-width: 1399.98px) {
  .contrast-check__header h4 {
    flex: 0 1 20%;
  }
}
@media (max-width: 991.98px) {
  .contrast-check__header h4 {
    flex: 0 1 35%;
  }
}
@media (max-width: 575.98px) {
  .contrast-check__header h4 {
    flex: 0 1 100%;
  }
}

.contrast-check__header .empty-div {
  width: 3rem;
}

/* ---------------------------------------------
   RESET BTN
--------------------------------------------- */
.reset-wrap {
  flex: 0 1 auto;
  text-align: center;
}

.reset-btn {
  width: 3rem;
  padding: 0.5rem 0;
}
</style>
