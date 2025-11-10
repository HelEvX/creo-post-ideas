// -------------------------------------------
// applyRecipe.js
// Utility: Applies a recipe by reassigning UI color roles
// -------------------------------------------

export function applyRecipe(recipe) {
  if (!recipe || !recipe.roles) return;

  const root = document.documentElement;

  Object.entries(recipe.roles).forEach(([key, value]) => {
    root.style.setProperty(`--ui-${key}`, value);
  });

  // Optional typography and layout properties
  if (recipe.typography) {
    root.style.setProperty("--ui-typography", recipe.typography);
  }
}
