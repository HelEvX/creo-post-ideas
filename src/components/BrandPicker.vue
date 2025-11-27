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

      // 1. Reset to Creo default
      if (!this.selectedBrand) {
        root.removeAttribute("style");
        this.$emit("picked", null);
        return;
      }

      // 2. Fetch brand JSON FIRST
      const res = await fetch(`/brands/${this.selectedBrand}.json`);
      const brand = await res.json();

      // 3. Apply colors and semantic tokens
      Object.entries(brand).forEach(([key, value]) => {
        if (typeof value !== "string") return;
        const isSemantic =
          key.startsWith("color-") || key === "font-family" || key.startsWith("--color-") || key.startsWith("--font-");
        if (!isSemantic) return;
        const cssVar = key.startsWith("--") ? key : `--${key}`;
        root.style.setProperty(cssVar, value);
      });

      // 4. Apply fonts after colors
      if (brand["font-title"]) {
        root.style.setProperty("--font-title", brand["font-title"]);
      }
      if (brand["font-body"]) {
        root.style.setProperty("--font-body", brand["font-body"]);
      }

      // 5. Inject @import if specified
      if (brand.fonts && Array.isArray(brand.fonts.import)) {
        brand.fonts.import.forEach((url) => {
          if (!document.querySelector(`link[href="${url}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            document.head.appendChild(link);
          }
        });
      }

      // 6. Emit picked brand to parent (App.vue)
      console.log("Brand applied:", this.selectedBrand, brand);
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
      <option value="runkstervolksfeesten">Runkster Volksfeesten</option>
      <option value="ocrunkst">OCRunkst</option>
      <option value="wijkraadrunkst">Wijkraad Runkst</option>
      <option value="steviala">Steviala</option>
      <option value="kenis">Bakkerij Kenis</option>
    </select>

    <div class="brand-preview">
      <div class="color-swatch primary"></div>
      <div class="color-swatch primary-light"></div>
      <div class="color-swatch secondary"></div>
      <div class="color-swatch secondary-light"></div>
      <div class="color-swatch color-section-dark"></div>
    </div>
  </div>
</template>

<style scoped>
.brand-switcher-container {
  padding: var(--space-20);
  margin-top: var(--space-75);
  background-color: var(--ui-alt-section-bg);
  border: var(--ui-panel-border-soft);
  border-radius: var(--radius-md);
  display: inline-block;
  transition: var(--transition-default);
}

label {
  margin-right: 10px;
  color: var(--ui-heading-alt);
}

select {
  padding: 8px;
  border-radius: 4px;
  border: var(--ui-panel-border-soft);
  font-family: var(--font-body);
  background: var(--ui-section-bg);
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

.color-swatch.color-section-dark {
  background-color: var(--color-section-dark);
}
</style>
