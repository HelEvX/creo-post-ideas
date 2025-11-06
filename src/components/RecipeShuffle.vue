<template>
  <div class="recipe-shuffle">
    <div class="current-recipe">
      <h3>{{ currentRecipe.title }}</h3>
      <p class="description">{{ currentRecipe.description }}</p>
      <div class="contrast-status">
        <span :class="contrastClass">Contrast: {{ contrastLabel }}</span>
      </div>
    </div>

    <button class="btn-primary" @click="shuffleRecipe">Shuffle Style</button>
  </div>
</template>

<script>
import { ref } from "vue";
import { recipes } from "../data/recipes";
import { applyRecipe } from "../utils/applyRecipe";

export default {
  name: "RecipeShuffle",
  setup() {
    const currentRecipe = ref(recipes[0]);

    const shuffleRecipe = () => {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      currentRecipe.value = recipes[randomIndex];
      applyRecipe(currentRecipe.value);
      checkContrast();
    };

    // --- Contrast check logic ---
    const contrastLabel = ref("");
    const contrastClass = ref("");

    const checkContrast = () => {
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--ui-background").trim();
      const textColor = getComputedStyle(document.documentElement).getPropertyValue("--ui-text").trim();

      const ratio = getContrastRatio(hexFromVar(bgColor), hexFromVar(textColor));

      if (ratio >= 4.5) {
        contrastLabel.value = "Readable";
        contrastClass.value = "contrast-good";
      } else if (ratio >= 3) {
        contrastLabel.value = "Moderate";
        contrastClass.value = "contrast-medium";
      } else {
        contrastLabel.value = "Low";
        contrastClass.value = "contrast-poor";
      }
    };

    // Convert var(--color) → hex if possible
    const hexFromVar = (value) => {
      const temp = document.createElement("div");
      temp.style.color = value;
      document.body.appendChild(temp);
      const rgb = getComputedStyle(temp).color;
      document.body.removeChild(temp);
      const match = rgb.match(/\d+/g);
      if (!match) return "#000000";
      const [r, g, b] = match.map(Number);
      return (
        "#" +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("")
      );
    };

    // Luminance + contrast ratio calculation
    const luminance = (hex) => {
      const rgb = hex
        .replace("#", "")
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16) / 255);
      const a = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const getContrastRatio = (hex1, hex2) => {
      const L1 = luminance(hex1);
      const L2 = luminance(hex2);
      return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    };

    // Apply initial recipe
    applyRecipe(currentRecipe.value);
    checkContrast();

    return { currentRecipe, shuffleRecipe, contrastLabel, contrastClass };
  },
};
</script>

<style scoped>
.recipe-shuffle {
  margin-top: 4rem;
  text-align: center;
}
.current-recipe {
  margin-bottom: 2rem;
}
.description {
  font-size: 1.6rem;
  opacity: 0.8;
}

.contrast-good {
  color: var(--color-success);
}

.contrast-medium {
  color: var(--color-warning);
}

.contrast-poor {
  color: var(--color-danger);
}

.contrast-good:hover {
  color: color-mix(in srgb, var(--color-success) 80%, #000);
}
.contrast-medium:hover {
  color: color-mix(in srgb, var(--color-warning) 80%, #000);
}
.contrast-poor:hover {
  color: color-mix(in srgb, var(--color-danger) 80%, #000);
}
</style>
