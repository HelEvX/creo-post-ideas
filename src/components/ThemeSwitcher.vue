<script>
export default {
  name: "ThemeSwitcher",
  data() {
    return { selectedTheme: "" };
  },
  methods: {
    async onChange(e) {
      this.selectedTheme = e.target.value;
      await this.applyTheme();
    },

    async applyTheme() {
      const root = document.documentElement;

      // 1. Reset to Creo base (global.css) if empty
      if (!this.selectedTheme) {
        // Explicitly remove all known semantic overrides
        const semanticVars = [
          "--color-primary",
          "--color-primary-dark",
          "--color-primary-darker",
          "--color-primary-light",
          "--color-primary-lighter",
          "--color-secondary",
          "--color-secondary-dark",
          "--color-secondary-darker",
          "--color-secondary-light",
          "--color-secondary-lighter",
          "--color-background",
          "--color-surface",
          "--color-panel",
          "--color-overlay",
          "--color-title",
          "--color-subtitle",
          "--color-text",
          "--color-text-soft",
          "--color-text-muted",
          "--color-inverse-text",
          "--color-header-bg",
          "--color-footer-bg",
          "--color-section-dark",
          "--color-section-dark-alt",
          "--color-heading-on-dark",
          "--color-text-on-dark",
          "--color-icon-on-dark",
          "--color-border-light",
          "--color-border-medium",
          "--color-border-dark",
          "--color-info",
          "--color-warning",
          "--color-danger",
          "--color-success",
          "--color-shadow",
          "--color-disabled-bg",
          "--color-disabled-text",
          "--font-title",
          "--font-body",
        ];

        semanticVars.forEach((v) => root.style.removeProperty(v));
        console.log("Theme reset to Creo default (global.css)");
        return;
      }

      // 2. Fetch theme JSON
      const res = await fetch(`/themes/${this.selectedTheme}.json`);
      const theme = await res.json();

      // 3. Apply all key/value pairs as CSS variables
      Object.entries(theme).forEach(([key, value]) => {
        if (typeof value !== "string") return;
        const isSemantic =
          key.startsWith("color-") || key === "font-family" || key.startsWith("--color-") || key.startsWith("--font-");

        if (!isSemantic) return;

        const cssVar = key.startsWith("--") ? key : `--${key}`;
        document.documentElement.style.setProperty(cssVar, value);
      });
    },
  },
};
</script>

<template>
  <div class="theme-switcher-container">
    <label for="theme-select">Select a Theme:</label>
    <select id="theme-select" @change="onChange">
      <option value="">Creo (default)</option>
      <option value="groomer">Groomer</option>
      <option value="ocrunkst">OCRunkst</option>
      <option value="steviala">Steviala</option>
    </select>

    <div class="theme-preview">
      <div class="color-swatch primary"></div>
      <div class="color-swatch primary-light"></div>
      <div class="color-swatch secondary"></div>
      <div class="color-swatch secondary-light"></div>
      <div class="color-swatch text"></div>
    </div>
  </div>
</template>

<style>
.theme-switcher-container {
  padding: 20px;
  background-color: var(--color-surface);
  border-radius: 8px;
  display: inline-block;
  margin: 20px;
  transition: background-color 0.3s ease;
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
.theme-preview {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.color-swatch {
  width: 4rem;
  height: 4rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-medium);
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
