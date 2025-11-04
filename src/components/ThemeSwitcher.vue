<template>
  <div class="theme-switcher-container">
    <label for="theme-select">Select a Theme:</label>
    <select id="theme-select" v-model="selectedTheme" @change="applyTheme">
      <option value="">Default (Creo)</option>
      <option value="groomer">Groomer</option>
      <option value="ocrunkst">OCRunkst</option>
    </select>

    <div class="theme-preview">
      <div class="color-swatch primary"></div>
      <div class="color-swatch secondary"></div>
      <div class="color-swatch accent"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ThemeSwitcher",
  data() {
    return {
      selectedTheme: "", // matches Default (Creo)
    };
  },
  methods: {
    async applyTheme() {
      if (!this.selectedTheme) {
        document.documentElement.removeAttribute("style");
        console.log("Restored default Creo theme");
        return;
      }

      const response = await fetch(`/themes/${this.selectedTheme}.json`);
      const theme = await response.json();
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
      console.log("Applied theme:", this.selectedTheme);
    },
  },
};
</script>

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
