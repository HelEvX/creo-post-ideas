<template>
  <div class="brand-switcher-container">
    <label for="brand-select">Klantenlijst:</label>
    <select id="brand-select" @change="onChange">
      <option value="">(kies een klant)</option>
      <option value="creo">Creo Websolutions</option>
      <!--  -->
      <option value="astamoris">Astamoris</option>
      <option value="blooloc">Blooloc</option>
      <option value="brusselsmindfulness">Brussels Mindfulness</option>
      <option value="caffepiu">Caffe Piu</option>
      <!-- testsite -->
      <option value="candyandmore">Candy & More</option>
      <option value="cardgameshop">Card Game Shop</option>
      <!-- testsite -->
      <option value="cashandco">Cash & co</option>
      <option value="comul">Comul</option>
      <option value="divafashion">Diva Fashion</option>
      <!-- testsite -->
      <option value="elegance">Elegance Lingerie</option>
      <!-- <option value="ellevation">Ellevation</option> -->
      <option value="glaede">Glaede</option>
      <option value="godare">Go Dare</option>
      <option value="groomer">Groomer</option>
      <option value="hopsakee">Hop-Sa-Kee</option>
      <option value="kenis">Kenis</option>
      <option value="keukentje">Keukentje</option>
      <option value="kookplaneet">Kookplaneet</option>
      <option value="lilistea">Lili's Tea</option>
      <!-- testsite -->
      <option value="ocrunkst">OCRunkst</option>
      <option value="peakmove">Peak Move</option>
      <option value="runkstervolksfeesten">Runkster Volksfeesten</option>
      <!-- <option value="sandrawouters">Sandra Wouters</option> -->
      <option value="steviala">Steviala</option>
      <option value="tropical">Tropical</option>
      <option value="wijkraadrunkst">Wijkraad Runkst</option>
    </select>

    <div class="brand-preview">
      <div class="color-swatch primary"></div>
      <div class="color-swatch primary-light"></div>
      <div class="color-swatch secondary"></div>
      <div class="color-swatch accent"></div>
      <!-- tertiary or secondary-darker -->
      <div class="color-swatch title"></div>
    </div>
    <div class="brand-preview-logolink">
      <a
        v-if="brandMeta && brandMeta.url && brandMeta.logo"
        class="brand-preview-logolink"
        :href="brandMeta.url"
        target="_blank"
        rel="noopener noreferrer">
        <img class="brand-preview-logo" :src="brandMeta.logo" :alt="brandMeta.name" />
        <span class="brand-preview-name">
          {{ brandMeta.name }}
        </span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "BrandPicker",
  emits: ["picked"],

  data() {
    return {
      selectedBrand: "",
      brandMeta: null,
    };
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
        this.brandMeta = null;
        this.$emit("picked", null);
        return;
      }

      // 2. Fetch brand JSON FIRST
      const res = await fetch(`/brands/${this.selectedBrand}.json`);
      const brand = await res.json();

      // 2b. Store logo + link metadata
      this.brandMeta = {
        name: brand.name || this.selectedBrand,
        url: brand.ig?.url || null,
        logo: brand.ig?.highlightIcon ? `/highlights/${brand.ig.highlightIcon}` : null,
      };

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

<style scoped>
.brand-switcher-container {
  padding: var(--space-20);
  margin-top: var(--space-75);
  background: var(--ui-alt-section-bg);
  border: var(--ui-panel-border-soft);
  border-radius: var(--radius-md);
  display: inline-block;
  transition: var(--transition-default);
}

label {
  font-weight: 500;
  color: var(--dynamic-text);
}

select {
  padding: 8px;
  border-radius: 4px;
  border: var(--ui-panel-border-soft);
  font-family: var(--font-body);
  background: var(--ui-section-bg);
  color: var(--dynamic-text);
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
  border: 1px solid var(--dynamic-faint);
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

.color-swatch.title {
  background-color: var(--color-title);
}

.color-swatch.accent {
  background-color: var(--color-tertiary);
}

/* Brand logo + link */

.brand-preview-logolink {
  .brand-preview-logolink {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: var(--dynamic-text);
    font-family: var(--font-body);
    cursor: pointer;
  }

  .brand-preview-logolink:hover {
    text-decoration: underline;
  }

  .brand-preview-logo {
    height: 5rem;
    width: auto;
    display: block;
  }

  .brand-preview-name {
    font-weight: 500;
    font-size: var(--fs-body-sm);
  }
}
</style>
