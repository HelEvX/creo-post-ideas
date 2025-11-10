<script>
export default {
  name: "BrandPicker",
  emits: ["picked"],

  data() {
    return { selectedBrand: "" };
  },

  methods: {
    async onChange(e) {
      this.selectedBrand = e.target.value;
      await this.applyBrand();
    },

    async applyBrand() {
      const root = document.documentElement;

      // Reset to Creo base (global.css) if empty
      // if (!this.selectedBrand) {
      //   const semanticVars = [
      //     "--color-primary",
      //     "--color-primary-dark",
      //     "--color-primary-darker",
      //     "--color-primary-light",
      //     "--color-primary-lighter",

      //     "--color-secondary",
      //     "--color-secondary-dark",
      //     "--color-secondary-darker",
      //     "--color-secondary-light",
      //     "--color-secondary-lighter",

      //     "--color-background",
      //     "--color-surface",
      //     "--color-panel",
      //     "--color-panel-alt",
      //     "--color-overlay",

      //     "--color-title",
      //     "--color-title-alt",
      //     "--color-subtitle",
      //     "--color-text",
      //     "--color-text-soft",
      //     "--color-text-faint",
      //     "--color-text-muted",
      //     "--color-text-inverse",

      //     "--color-header-bg",
      //     "--color-footer-bg",
      //     "--color-section-dark",
      //     "--color-section-dark-alt",

      //     "--color-border-light",
      //     "--color-border-medium",
      //     "--color-border-dark",

      //     "--color-info",
      //     "--color-warning",
      //     "--color-danger",
      //     "--color-success",

      //     "--color-shadow",
      //     "--color-disabled-bg",
      //     "--color-disabled-text",

      //     "--font-title",
      //     "--font-body",
      //   ];

      //   semanticVars.forEach((v) => root.style.removeProperty(v));
      //   console.log("Brand reset to Creo default (global.css)");
      //   this.$emit("picked", null); // notify parent
      //   console.log("Emitted picked event:", { slug: this.selectedBrand, tokens: brand });
      //   return;
      // }

      if (!this.selectedBrand) {
        root.removeAttribute("style");
        console.log("Brand reset to Creo default (global.css)");
        this.$emit("picked", null);
        return;
      }

      // Fetch and APPLY (keep existing working behavior)
      const res = await fetch(`/brands/${this.selectedBrand}.json`);
      const brand = await res.json();

      Object.entries(brand).forEach(([key, value]) => {
        if (typeof value !== "string") return;
        const isSemantic =
          key.startsWith("color-") || key === "font-family" || key.startsWith("--color-") || key.startsWith("--font-");
        if (!isSemantic) return;
        const cssVar = key.startsWith("--") ? key : `--${key}`;
        root.style.setProperty(cssVar, value);
      });

      // ALSO emit so App.vue + RecipeShuffle can react
      this.$emit("picked", { slug: this.selectedBrand, tokens: brand });
    },
  },
};
</script>

<template>
  <div class="brand-switcher-container">
    <label for="brand-select">Select a Brand:</label>
    <select id="brand-select" @change="onChange">
      <option value="">Creo (default)</option>
      <option value="groomer">Groomer</option>
      <option value="ocrunkst">OCRunkst</option>
      <option value="steviala">Steviala</option>
    </select>

    <div class="brand-preview">
      <div class="color-swatch primary"></div>
      <div class="color-swatch primary-light"></div>
      <div class="color-swatch secondary"></div>
      <div class="color-swatch secondary-light"></div>
      <div class="color-swatch text"></div>
    </div>
  </div>
</template>

<style scoped>
.brand-switcher-container {
  padding: 20px;
  margin-top: var(--space-75);
  background-color: var(--color-surface);
  border: var(--ui-panel-border-soft);
  border-radius: var(--radius-md);
  display: inline-block;
  transition: var(--transition-default);
}

label {
  margin-right: 10px;
  color: var(--color-primary);
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--color-border-light);
  font-family: var(--font-body);
  background: var(--color-background);
  color: var(--color-text);
}

/* Preview swatches */
.brand-preview {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.color-swatch {
  width: 4rem;
  height: 4rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
}

.color-swatch.primary {
  background-color: var(--color-primary);
}

.color-swatch.primary-light {
  background-color: var(--color-primary-light);
}

.color-swatch.secondary {
  background-color: var(--color-secondary);
}

.color-swatch.secondary-light {
  background-color: var(--color-secondary-light);
}

.color-swatch.text {
  background-color: var(--color-text);
}
</style>
