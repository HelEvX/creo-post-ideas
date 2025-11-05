<script>
export default {
  name: "ThemeSwitcher",
  data() {
    return { selectedTheme: "" };
  },
  mounted() {
    // optional: default to "creo" empty -> use base global.css vars
  },
  methods: {
    async onChange(e) {
      this.selectedTheme = e.target.value;
      await this.applyTheme();
    },
    async applyTheme() {
      if (!this.selectedTheme) {
        // Reset to defaults from global.css
        const root = document.documentElement;
        [
          "--color-primary",
          "--color-accent",
          "--color-background",
          "--color-footer-bg",
          "--font-body",
          "--font-title",
          "--ui-background",
          "--ui-text",
          "--ui-accent",
        ].forEach((v) => root.style.removeProperty(v));
        return;
      }

      const res = await fetch(`/themes/${this.selectedTheme}.json`);
      const t = await res.json();

      // Map JSON -> CSS tokens used by the app
      const root = document.documentElement;
      const map = {
        "primary-color": "--color-primary",
        "accent-color": "--color-accent",
        "background-color": "--color-background",
        // Use client “secondary” as the common dark band (nav/footer)
        "secondary-color": "--color-footer-bg",
        "font-family": "--font-body",
      };

      Object.entries(map).forEach(([jsonKey, cssVar]) => {
        if (t[jsonKey]) root.style.setProperty(cssVar, t[jsonKey]);
      });

      // Title font follows body unless you have a separate one
      if (t["font-family"]) {
        root.style.setProperty("--font-title", t["font-family"]);
      }

      // Initialize UI roles from the base theme (recipes will override)
      const bg = getComputedStyle(root)
        .getPropertyValue("--color-background")
        .trim();
      const text = getComputedStyle(root)
        .getPropertyValue("--color-text")
        .trim(); // from global.css
      const acc = getComputedStyle(root)
        .getPropertyValue("--color-primary")
        .trim();

      root.style.setProperty("--ui-background", bg);
      root.style.setProperty("--ui-text", text);
      root.style.setProperty("--ui-accent", acc);
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
    </select>
  </div>
</template>

<style>
.theme-switcher-container {
  padding: 20px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  display: inline-block;
  margin: 20px;
  transition: background-color 0.3s ease;
}

label {
  margin-right: 10px;
  color: var(--primary-color);
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--primary-color);
  font-family: var(--font-family);
}

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
  border: 1px solid #ccc;
}

/* Each color pulls from a theme variable */
.color-swatch.primary {
  background-color: var(--primary-color);
}

.color-swatch.secondary {
  background-color: var(--secondary-color);
}

.color-swatch.accent {
  background-color: var(--accent-color);
}
</style>
