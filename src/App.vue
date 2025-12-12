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

    <!-- === START: Preview Zone === -->
    <section class="app__layout">
      <div class="container-full">
        <div class="row between">
          <ControlsPanel :brandTokens="brandTokens" :scales="scales" @picked="onBrandPicked" />

          <!-- MAIN COLUMN -->
          <main class="col-12 col-md-9 app__main">
            <!-- CANVAS -->
            <div class="app__canvas">
              <MainPreview :brandTokens="brandTokens" :scales="scales" />
            </div>
          </main>
        </div>
      </div>
    </section>
    <!-- === END: Preview Zone === -->

    <!-- == START: Finalization Zone -->
    <!-- <section class="col-12 app__finalization">
      <div class="row">
        <BrandGallery :brandTokens="brandTokens" :scales="scales" />
      </div>
    </section> -->
    <!-- == END: Finalization Zone -->

    <!-- INSTAGRAM GRID VIEW -->
    <section class="section section-gallery alt">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2>Instagram Grid Preview</h2>
          </div>

          <div class="col-12" style="display: flex; justify-content: center">
            <InstagramGrid v-if="brandTokens && brandTokens.ig" :ig="brandTokens.ig" :images="galleryImages" />
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT (purpose of tool) -->
    <section class="section section-about">
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
    <section class="section section-review alt">
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
              <button class="btn-primary" type="submit">Send review</button>
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
import BrandLogo from "./components/brand/BrandLogo.vue";
import ControlsPanel from "./components/controls/ControlsPanel.vue";
import BrandPicker from "./components/brand/BrandPicker.vue";
import MainPreview from "./components/preview/MainPreview.vue";
// import BrandGallery from "./components/brand/BrandGallery.vue";
import InstagramGrid from "@/components/InstagramGrid.vue";
import { buildBrandScales } from "./utils/colorBlender.js";
import { getTextModeForBackground } from "./utils/colorLogic.js";

const demoImages = [
  "pattern-geometric-flowers",
  "pattern-distorted-mesh",
  "pattern-rhombus-stripes",
  "pattern-nested-diamond",
  "pattern-wavy",
  "pattern-folded-zigzag",
];

export default {
  name: "App",
  components: { BrandLogo, BrandPicker, ControlsPanel, MainPreview, InstagramGrid },

  data() {
    return {
      brandTokens: null, // active brand JSON
      scales: null, // built color scales for recipes

      galleryImages: demoImages,
    };
  },

  methods: {
    updateDynamicTextRoles() {
      const root = document.documentElement;
      const cs = getComputedStyle(root);

      const dark = cs.getPropertyValue("--color-text").trim();
      const light = cs.getPropertyValue("--color-text-inverse").trim();

      const softDark = cs.getPropertyValue("--color-text-soft").trim();
      const softLight = cs.getPropertyValue("--color-text-soft-inverse").trim();

      const disabledDark = cs.getPropertyValue("--color-disabled-text").trim();
      const disabledLight = cs.getPropertyValue("--color-disabled-text-inverse").trim();

      function apply(surfaceKey, bgVarName) {
        const bg = cs.getPropertyValue(bgVarName).trim();
        if (!bg) return;

        const mode = getTextModeForBackground(bg, dark, light);
        if (!mode) return;

        if (mode === "dark") {
          // background is light → use dark text series
          root.style.setProperty(`--text-on-${surfaceKey}`, dark);
          root.style.setProperty(`--text-soft-on-${surfaceKey}`, softDark);
          root.style.setProperty(`--text-disabled-on-${surfaceKey}`, disabledDark);
        } else {
          // background is dark → use light text series
          root.style.setProperty(`--text-on-${surfaceKey}`, light);
          root.style.setProperty(`--text-soft-on-${surfaceKey}`, softLight);
          root.style.setProperty(`--text-disabled-on-${surfaceKey}`, disabledLight);
        }
      }

      const surfaces = [
        ["nav", "--ui-nav-bg"],
        ["footer", "--ui-footer-bg"],
        ["section", "--ui-section-bg"],
        ["alt-section", "--ui-alt-section-bg"],
        ["panel", "--ui-panel-bg"],
        ["alt-panel", "--ui-alt-panel-bg"],
        ["primary", "--color-primary"],
        ["secondary", "--color-secondary"],
      ];

      surfaces.forEach(([key, bgVar]) => apply(key, bgVar));

      // body defaults follow "section"
      const textOnSection = cs.getPropertyValue("--text-on-section").trim();
      const softOnSection = cs.getPropertyValue("--text-soft-on-section").trim();
      const disabledOnSection = cs.getPropertyValue("--text-disabled-on-section").trim();

      if (textOnSection) {
        root.style.setProperty("--dynamic-text", textOnSection);
      }
      if (softOnSection) {
        root.style.setProperty("--dynamic-soft", softOnSection);
      }
      if (disabledOnSection) {
        root.style.setProperty("--dynamic-disabled", disabledOnSection);
      }
    },

    async onBrandPicked(payload) {
      const root = document.documentElement;

      if (!payload) {
        const root = document.documentElement;
        root.removeAttribute("style");

        this.brandTokens = { slug: "creo" };
        this.scales = null;

        this.updateDynamicTextRoles();

        // notify mockups to recompute text
        window.dispatchEvent(new Event("brand-updated"));

        return;
      }

      let slug;
      if (typeof payload === "object" && payload.tokens) {
        slug = payload.slug || payload.tokens.meta?.slug || payload.tokens.name.toLowerCase();
      } else {
        slug = typeof payload === "string" ? payload : payload.slug;
      }

      const res = await fetch(`/brands/${slug}.json`);
      const data = await res.json();

      root.removeAttribute("style");

      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith("color-") || k.startsWith("--color-") || k.startsWith("font-")) {
          const cssVar = k.startsWith("--") ? k : `--${k}`;
          root.style.setProperty(cssVar, v);
        }
      }

      root.style.setProperty("--ig-tile-bg", (data["color-primary"] || "#888") + "15");
      root.style.setProperty("--ig-tile-fg", data["color-text-soft"] || "#444");

      await this.$nextTick();
      this.brandTokens = { ...data, slug };
      this.scales = buildBrandScales(this.brandTokens);

      this.updateDynamicTextRoles();

      // notify mockups to recompute text for this brand
      window.dispatchEvent(new Event("brand-updated"));
    },
  },

  mounted() {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    if (brand) this.onBrandPicked(brand);

    window.addEventListener("brand-reset", (e) => {
      const { slug } = e.detail || {};
      if (slug) this.onBrandPicked(slug);
    });

    window.addEventListener("palette-updated", this.updateDynamicTextRoles);

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
LAYOUT ELEMENTS — using dynamic UI roles 
Stylings for components specific to the app shell
------------------------------------------------------
*/

.app__layout {
  margin: var(--space-100) 0;
}

@media (min-width: 992px) {
  .app__layout .row {
    align-items: stretch;
  }
}

/* ----------------------------------------------------
   NAV & FOOTER
   ---------------------------------------------------- */
.site-nav {
  background: var(--ui-nav-bg);
  padding: var(--space-20) 0;
}
.site-footer {
  background: var(--ui-footer-bg);
  color: var(--text-soft-on-footer);
}

/* ----------------------------------------------------
   HERO
   ---------------------------------------------------- */
.hero {
  height: fit-content;
  background: var(--ui-section-bg);
  margin-top: var(--space-75);
}
h1.hero-title {
  font-size: var(--fs-hero);
  color: var(--ui-heading);
}
p.hero-subtitle {
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-title);
  color: var(--text-soft-on-hero);
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
  color: var(--dynamic-soft);
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
  margin-bottom: var(--space-50);
  color: var(--text-on-panel);
}
.card.alt {
  background: var(--ui-alt-panel-bg);
  color: var(--text-on-alt-panel);
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
  border-radius: var(--radius-lg);
  padding: var(--space-25);
}

.app__canvas {
  border: var(--ui-panel-border-soft);
}

.app__finalization {
  margin: var(--space-50) 0;
}

.section-gallery h2 {
  text-align: center;
  padding-bottom: var(--space-50);
}

/* =======================================================
   DESKTOP ≥ 992px (lg breakpoint)
   Make sidebar and main column equal height
   ======================================================= */

@media (min-width: 992px) {
  /* Let the two columns in this row stretch to the same height */
  .app__layout .row.between {
    align-items: stretch;
  }

  /* Columns become flex containers so their inner panels can fill them */
  .app__sidebar,
  .app__main {
    display: flex;
    flex-direction: column;
  }

  /* Sidebar content (the pale panel) fills the full column height */
  .app__sidebar > * {
    height: 100%;
  }

  /* Canvas panel fills the full main column height */
  .app__canvas {
    height: 100%;
  }
}
</style>
