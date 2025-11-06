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
          "--color-primary-hover",
          "--color-primary-bright",
          "--color-accent",
          "--color-background",
          "--color-surface",
          "--color-panel",
          "--color-title",
          "--color-text",
          "--color-text-muted",
          "--color-inverse-text",
          "--color-header-bg",
          "--color-footer-bg",
          "--color-border-light",
          "--color-border-medium",
          "--color-border-dark",
          "--color-info",
          "--color-warning",
          "--color-danger",
          "--color-success",
          "--font-body",
          "--font-title",
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
      <div class="color-swatch header"></div>
      <div class="color-swatch accent"></div>
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
  gap: 10px;
  margin-top: 15px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--color-border-medium);
}

.color-swatch.primary {
  background-color: var(--color-primary);
}

.color-swatch.header {
  background-color: var(--color-header-bg);
}

.color-swatch.accent {
  background-color: var(--color-accent);
}
</style>
