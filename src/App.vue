<template>
  <div id="app">
    <!-- NAV -->
    <header class="site-nav">
      <div class="container">
        <div class="row align-center between">
          <div class="col-12">
            <BrandLogo :brandTokens="brandTokens" />
          </div>
        </div>
      </div>
    </header>

    <!-- HERO -->
    <section class="hero">
      <div class="container">
        <div class="row align-center">
          <div class="col-12">
            <h1 class="hero-title">Visualize Your Brand's Social Style</h1>
            <p class="hero-subtitle">Preview your posts using your site's look & feel.</p>
          </div>
        </div>
      </div>
      <!-- For master version (clients only see their own brands) -->
      <div class="container">
        <div class="row align-center">
          <div class="col-12">
            <BrandPicker @picked="onBrandPicked" />
          </div>
        </div>
      </div>
    </section>

    <!-- === START: App Layout === -->
    <section class="app__layout">
      <div class="container-full">
        <div class="row between">
          <ControlsPanel :brandTokens="brandTokens" :scales="scales" @picked="onBrandPicked" />

          <!-- MAIN COLUMN -->
          <main class="col-12 col-md-9 app__main">
            <!-- CANVAS -->
            <section class="app__canvas">
              <MainPreview :brandTokens="brandTokens" :scales="scales" />
            </section>

            <!-- FINALIZATION ZONE -->
            <section class="app__finalization">
              <BrandGallery :brandTokens="brandTokens" :scales="scales" />
            </section>
          </main>
        </div>
      </div>
    </section>
    <!-- === END: App Layout === -->

    <!-- GALLERY -->
    <section class="section section-gallery">
      <div class="container">
        <div class="row">
          <div class="col-12"><h2>Example previews</h2></div>

          <!-- 3-up (4+4+4) -->
          <div class="col-12 col-md-4">
            <div class="card align-center">
              <p>Test paragraaf</p>
              <!-- <img src="../src/assets/img/preview_placeholder.webp" alt="Preview 1" /> -->
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="card alt align-center">
              <p>Test paragraaf</p>
              <!-- <img src="../src/assets/img/preview_placeholder.webp" alt="Preview 2" /> -->
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="card align-center">
              <p>Test paragraaf</p>
              <!-- <img src="../src/assets/img/preview_placeholder.webp" alt="Preview 3" /> -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT (purpose of tool) -->
    <section class="section section-about alt">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="text-block-900">
              <h2>About this tool</h2>
              <p>
                This tool helps ensure visual consistency between your website and social channels by applying your
                theme across interface elements and mockups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- REVIEW FORM -->
    <section class="section section-review">
      <div class="container">
        <div class="row center">
          <div class="col-12">
            <h2>Send your feedback</h2>
          </div>
          <!-- blog text width (900px max) -->
          <div class="col-12">
            <form class="review-form text-block-900" @submit.prevent="submitReview">
              <div class="form-row">
                <label for="name">Your name</label>
                <input id="name" type="text" required />
              </div>
              <div class="form-row">
                <label for="review">Your review</label>
                <textarea id="review" rows="5" required></textarea>
              </div>
              <button type="submit">Send review</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="site-footer">
      <div class="container">
        <div class="row between align-center">
          <div class="col-12 col-md-6">
            <p>© 2025 Creo Websolutions</p>
          </div>
          <div class="col-12 col-md-6 right">
            <a href="#" class="footer-link">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import BrandLogo from "./components/BrandLogo.vue";
import ControlsPanel from "./components/ControlsPanel.vue";
import BrandPicker from "./components/BrandPicker.vue";
import MainPreview from "./components/MainPreview.vue";
import BrandGallery from "./components/BrandGallery.vue";
import { buildBrandScales, getContrastRatio } from "./utils/colorBlender.js";

export default {
  name: "App",
  components: { BrandLogo, BrandPicker, ControlsPanel, MainPreview, BrandGallery },

  data() {
    return {
      brandTokens: null, // active brand JSON
      scales: null, // built color scales for recipes
    };
  },

  methods: {
    updateDynamicTextRoles() {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      // use the main section background as reference surface
      const bg =
        styles.getPropertyValue("--ui-section-bg").trim() || styles.getPropertyValue("--color-background").trim();

      const dark = styles.getPropertyValue("--color-text").trim();
      const light = styles.getPropertyValue("--color-text-inverse").trim();

      if (!bg || !dark || !light) return;

      const contrastDark = getContrastRatio(dark, bg);
      const contrastLight = getContrastRatio(light, bg);

      const useLight = contrastLight >= contrastDark;

      if (useLight) {
        // dark background -> light text system
        root.style.setProperty("--ui-text", "var(--color-text-inverse)");
        root.style.setProperty("--ui-soft", "var(--color-text-muted)");
        root.style.setProperty("--ui-muted", "var(--color-text-faint)");
        root.style.setProperty("--ui-faint", "var(--color-text-faint)");
      } else {
        // light background -> dark text system
        root.style.setProperty("--ui-text", "var(--color-text)");
        root.style.setProperty("--ui-soft", "var(--color-text-soft)");
        root.style.setProperty("--ui-muted", "var(--color-text-soft)");
        root.style.setProperty("--ui-faint", "var(--color-text-soft)");
      }
    },

    async onBrandPicked(payload) {
      if (!payload) {
        this.brandTokens = null;
        this.scales = null;
        console.log("🔁 Reset to default Creo theme");
        // reset text roles to default for base theme
        this.updateDynamicTextRoles();
        return;
      }

      let data;
      if (typeof payload === "object" && payload.tokens) {
        // If a full token object is provided, use it but re-fetch anyway to refresh all
        const slug = payload.slug || payload.tokens.meta?.slug || payload.tokens.name.toLowerCase();
        const res = await fetch(`/brands/${slug}.json`);
        data = await res.json();
      } else {
        const slug = typeof payload === "string" ? payload : payload.slug;
        const res = await fetch(`/brands/${slug}.json`);
        data = await res.json();
      }

      const root = document.documentElement;
      root.removeAttribute("style");
      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith("color-") || k.startsWith("--color-") || k.startsWith("font-")) {
          const cssVar = k.startsWith("--") ? k : `--${k}`;
          root.style.setProperty(cssVar, v);
        }
      }

      await this.$nextTick();
      this.brandTokens = { ...data };
      this.scales = buildBrandScales(this.brandTokens);
      console.log("✅ Brand reapplied from JSON:", this.brandTokens.name);

      // brand changed -> recompute text roles
      this.updateDynamicTextRoles();
    },
  },

  mounted() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    if (brand) this.onBrandPicked(brand);

    // Handle reset event from RecipeShuffle
    window.addEventListener("brand-reset", (e) => {
      const { slug, tokens } = e.detail || {};
      this.onBrandPicked({ slug, tokens });
    });

    // NEW: react when recipes change the palette
    window.addEventListener("palette-updated", this.updateDynamicTextRoles);

    // initial pass for default theme
    this.updateDynamicTextRoles();
  },

  beforeUnmount() {
    window.removeEventListener("palette-updated", this.updateDynamicTextRoles);
  },
};
</script>

<style>
/* 
------------------------------------------------------
LAYOUT ELEMENTS — use dynamic UI roles 
Stylings for components specific to the app shell
------------------------------------------------------
*/

/* ----------------------------------------------------
   NAV & FOOTER
   ---------------------------------------------------- */
.site-nav {
  background: var(--ui-nav-bg);
  color: var(--ui-inverse);
  padding: var(--space-20) 0;
}
.site-footer {
  background: var(--ui-footer-bg);
  color: var(--ui-muted);
}

/* ----------------------------------------------------
   HERO
   ---------------------------------------------------- */
.hero {
  height: fit-content;
  background: var(--ui-hero-bg);
  padding: var(--space-50) 0;
  margin-bottom: var(--space-30);
}
h1.hero-title {
  font-size: var(--fs-hero);
  color: var(--ui-heading);
}
p.hero-subtitle {
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-title);
  color: var(--ui-soft);
  margin-bottom: 0;
}

/* ----------------------------------------------------
   SECTIONS
   ---------------------------------------------------- */
.section {
  padding: var(--space-75) 0;
  background: var(--ui-section-bg);
}
.section.alt {
  background: var(--ui-alt-section-bg);
}

/* Section title colors */
.section h2 {
  color: var(--ui-heading-alt);
}

.section h3 {
  color: var(--ui-caption);
}

.section h4 {
  color: var(--ui-soft);
}

/* ----------------------------------------------------
   LINKS
   ---------------------------------------------------- */

/* Links appearing on dark backgrounds (footer, hero, nav, etc.) */
.section.alt a,
.site-footer a,
.hero a,
.site-nav a {
  color: var(--ui-link-on-dark);
}

.section.alt a:hover,
.site-footer a:hover,
.hero a:hover,
.site-nav a:hover {
  color: var(--ui-link-on-dark-hover);
}

/* ----------------------------------------------------
   GALLERY
   ---------------------------------------------------- */
.card {
  background: var(--ui-panel-bg);
  border: var(--ui-panel-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow);
  margin-bottom: var(--space-50);
}
.card.alt {
  background: var(--ui-alt-panel-bg);
  color: var(--ui-muted);
  border: var(--ui-alt-panel-border);
}
.card img {
  display: block;
  width: 100%;
  height: auto;
}

/* Transitions */

.site-nav,
.site-footer,
.hero,
.section,
.section-alt,
.card {
  transition: var(--transition-default);
}

/* ======================================================
   APP LAYOUT
   ====================================================== */

.app__canvas,
.app__finalization {
  background: var(--ui-section-bg);
  border: var(--ui-panel-border-soft);
  border-radius: var(--radius-lg);
  padding: var(--space-25);
}

.app__finalization {
  margin-top: var(--space-25);
}
</style>
