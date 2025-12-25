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
            <h1 class="hero-title">Jouw huisstijl, jouw socials</h1>
            <p class="hero-subtitle">Visualiseer posts die perfect bij je website passen.</p>
            <!-- Preview your posts using your site's look & feel. -->
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
          <ControlsPanel
            :brandTokens="brandTokens"
            :scales="scales"
            :mockupBgContext="mockupBgContext"
            @picked="onBrandPicked" />

          <!-- MAIN COLUMN -->
          <main class="col-12 col-xxl-9 col-3xl-9 app__main">
            <!-- CANVAS -->
            <div class="app__canvas">
              <MainPreview
                :brandTokens="brandTokens"
                :scales="scales"
                @update-tone="backgroundTone = $event"
                @update-mode="backgroundMode = $event" />
            </div>
          </main>
        </div>
      </div>
    </section>
    <!-- === END: Preview Zone === -->

    <!-- INSTAGRAM GRID VIEW -->
    <section class="section section-gallery">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2>Instagram Grid Preview</h2>
          </div>

          <div class="col-12 section-gallery__grid">
            <InstagramGrid v-if="brandTokens && brandTokens.ig" :ig="brandTokens.ig" :images="galleryImages" />
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
              <h2>Jouw missie: betere Instagram posts!</h2>
              <p>
                Je weet welke kleur je logo heeft en hoe je website eruit ziet, dat spreekt. Maar zelf een post voor
                Instagram of andere sociale mediakanalen ontwerpen is daarom niet altijd eenvoudig. Want het blijft
                belangrijk dat jouw klanten je merk direct herkennen wanneer ze door hun 'feed' scrollen.
              </p>
              <p>
                Misschien twijfel je wel eens over het lettertype? Of vraag je jezelf af welke kleur het beste gaat
                werken als achtergrond voor je tekst? Via enkele eenvoudige <strong>voorbeeld</strong>en van instagram
                (<strong>ig</strong>) posts, geeft deze tool je een goed startpunt. Een leesbare kleurcombinatie kiezen
                doe je hier in een oogopslag!
              </p>
              <p>
                Heb je een boodschap in gedachten waar gerust een straffe kleurenmix bij past, of ben je net op zoek
                naar iets eenvoudig en strak? Maak je graag indruk met een evenwichtig, uitgekiend grid maar ben je toch
                benieuwd naar opties om eens af te wisselen?
              </p>
              <p>...</p>
              <!-- This tool helps ensure visual consistency between your website and social channels by applying your
                theme across interface elements and mockups. -->
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
            <h2>Geef ons feedback</h2>
          </div>
          <!-- blog text width (900px max) -->
          <div class="col-12">
            <form class="review-form text-block-900" @submit.prevent="submitReview">
              <div class="form-row">
                <label for="name">Jouw (bedrijfs-) naam</label>
                <input id="name" type="text" required />
              </div>
              <div class="form-row">
                <label for="review">Jouw feedback</label>
                <textarea id="review" rows="5" required></textarea>
              </div>
              <button class="btn-primary" type="submit">Verzend</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="site-footer">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-6">
            <a href="#">Privacy</a>
          </div>
          <div class="col-12 col-md-6 right">
            <p>_webpage by <span>Creo Websolutions</span></p>
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
      brandTokens: null,
      scales: null,

      // shared background state
      backgroundTone: "primary", // "primary" | "secondary"
      backgroundMode: "color", // "color" | "pattern" | "image"

      galleryImages: demoImages,
    };
  },

  computed: {
    mockupBgContext() {
      // pattern bg
      if (this.backgroundMode === "pattern") {
        return {
          type: "pattern",
          tone: this.backgroundTone,
          bgVars: this.backgroundTone === "secondary" ? ["--ui-secondary-bg"] : ["--ui-primary-bg"],
        };
      }

      // image bg
      if (this.backgroundMode === "image") {
        return {
          type: "image",
          tone: this.backgroundTone,
          bgVars: this.backgroundTone === "secondary" ? ["--ui-secondary-bg"] : ["--ui-primary-bg"],
        };
      }

      // plain color (default)
      return {
        type: "color",
        tone: this.backgroundTone,
        bgVars: this.backgroundTone === "secondary" ? ["--ui-secondary-bg"] : ["--ui-primary-bg"],
      };
    },
  },

  watch: {
    // react to mockup controls immediately
    backgroundTone() {
      this.scheduleDynamicTextUpdate();
    },
    backgroundMode() {
      this.scheduleDynamicTextUpdate();
    },
    mockupBgContext: {
      handler() {
        this.scheduleDynamicTextUpdate();
      },
      deep: true,
    },
  },

  methods: {
    /* ----------------------------------------------
       SCHEDULE UPDATE
       Avoid timing issues on brand load / toggle
    ---------------------------------------------- */
    scheduleDynamicTextUpdate() {
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          this.updateDynamicTextRoles();
        });
      });
    },

    /* ----------------------------------------------
       DYNAMIC TEXT + OVERLAY RESOLUTION
    ---------------------------------------------- */
    updateDynamicTextRoles() {
      const root = document.documentElement;
      const cs = getComputedStyle(root);

      const dark = cs.getPropertyValue("--color-text").trim();
      const light = cs.getPropertyValue("--color-text-inverse").trim();

      const softDark = cs.getPropertyValue("--color-text-soft").trim();
      const softLight = cs.getPropertyValue("--color-text-soft-inverse").trim();

      const disabledDark = cs.getPropertyValue("--color-disabled").trim();
      const disabledLight = cs.getPropertyValue("--color-disabled-inverse").trim();

      const titleDark = cs.getPropertyValue("--color-title").trim();

      const overlayDark = cs.getPropertyValue("--black-50").trim();
      const overlayLight = cs.getPropertyValue("--white-50").trim();

      /* ----------------------------------------------
         PER-SURFACE ROLE ASSIGNMENT
      ---------------------------------------------- */
      function apply(surfaceKey, bgVarName) {
        const bg = cs.getPropertyValue(bgVarName).trim();
        if (!bg) return;

        const mode = getTextModeForBackground(bg, dark, light);
        if (!mode) return;

        if (mode === "dark") {
          root.style.setProperty(`--text-on-${surfaceKey}`, dark);
          root.style.setProperty(`--title-on-${surfaceKey}`, titleDark);
          root.style.setProperty(`--text-soft-on-${surfaceKey}`, softDark);
          root.style.setProperty(`--disabled-on-${surfaceKey}`, disabledDark);
          root.style.setProperty(`--overlay-on-${surfaceKey}`, overlayDark);
        } else {
          root.style.setProperty(`--text-on-${surfaceKey}`, light);
          root.style.setProperty(`--title-on-${surfaceKey}`, light);
          root.style.setProperty(`--text-soft-on-${surfaceKey}`, softLight);
          root.style.setProperty(`--disabled-on-${surfaceKey}`, disabledLight);
          root.style.setProperty(`--overlay-on-${surfaceKey}`, overlayLight);
        }
      }

      const surfaces = [
        ["nav", "--ui-nav-bg"],
        ["footer", "--ui-footer-bg"],
        ["section", "--ui-section-bg"],
        ["alt-section", "--ui-alt-section-bg"],
        ["panel", "--ui-panel-bg"],
        ["alt-panel", "--ui-alt-panel-bg"],
        ["primary", "--ui-primary-bg"],
        ["secondary", "--ui-secondary-bg"],
      ];

      surfaces.forEach(([key, bgVar]) => apply(key, bgVar));

      /* ----------------------------------------------
         DYNAMIC TEXT (CONTENT LAYER)
         Always based on SECTION surface
      ---------------------------------------------- */
      const textOnSection = cs.getPropertyValue("--text-on-section").trim();
      const titleOnSection = cs.getPropertyValue("--title-on-section").trim();
      const softOnSection = cs.getPropertyValue("--text-soft-on-section").trim();
      const disabledOnSection = cs.getPropertyValue("--disabled-on-section").trim();

      if (textOnSection) root.style.setProperty("--dynamic-text", textOnSection);
      if (titleOnSection) root.style.setProperty("--dynamic-title", titleOnSection);
      if (softOnSection) root.style.setProperty("--dynamic-soft", softOnSection);
      if (disabledOnSection) root.style.setProperty("--dynamic-disabled", disabledOnSection);

      /* ----------------------------------------------
         DYNAMIC OVERLAY (MOCKUP ONLY)
         Uses EXACT mockup background, not UI sections
      ---------------------------------------------- */
      const overlayBgVar = this.mockupBgContext?.bgVars?.[0];
      if (overlayBgVar) {
        const bg = cs.getPropertyValue(overlayBgVar).trim();
        if (bg) {
          const mode = getTextModeForBackground(bg, dark, light);
          root.style.setProperty("--dynamic-overlay", mode === "dark" ? overlayDark : overlayLight);
        }
      }
    },

    /* ----------------------------------------------
       BRAND LOADING
    ---------------------------------------------- */
    async onBrandPicked(payload) {
      const root = document.documentElement;

      if (!payload) {
        root.removeAttribute("style");

        this.brandTokens = { slug: "creo" };
        this.scales = null;

        this.scheduleDynamicTextUpdate();
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

      await this.$nextTick();
      this.brandTokens = { ...data, slug };
      this.scales = buildBrandScales(this.brandTokens);

      this.scheduleDynamicTextUpdate();
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

    window.addEventListener("palette-updated", this.scheduleDynamicTextUpdate);
    this.scheduleDynamicTextUpdate();
  },

  beforeUnmount() {
    window.removeEventListener("palette-updated", this.scheduleDynamicTextUpdate);
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
  margin: var(--space-75) 0 0;
  padding: var(--space-25) 0;
  background-color: var(--ui-alt-section-bg);
  height: auto;
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
  padding: var(--space-10) 0;
}

.site-footer p,
.site-footer a {
  margin-bottom: 0;
  font-size: var(--fs-body-sm);
}

.site-footer p span {
  color: var(--color-primary);
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
  color: var(--dynamic-title);
}
p.hero-subtitle {
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-title);
  color: var(--color-title);
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
  color: var(--color-title);
}

.section h3 {
  color: var(--color-title);
}

.section h4 {
  color: var(--dynamic-soft);
}

.section-gallery h2 {
  text-align: center;
  padding-top: var(--space-30);
}

/* ----------------------------------------------------
   LINKS
   ---------------------------------------------------- */

/* Links appearing on dark backgrounds (footer, hero, nav, etc.) */
.section.alt a,
.site-footer a,
.site-footer p,
.hero a,
.site-nav a {
  color: var(--dynamic-footer);
}

.section.alt a:hover,
.site-footer a:hover,
.hero a:hover,
.site-nav a:hover {
  color: var(--dynamic-footer);
}

/* ======================================================
   TRANSITIONS
   ====================================================== */

.site-nav,
.site-footer,
.hero,
.section,
.section-alt {
  transition: var(--transition-default);
}

/* ======================================================
   APP LAYOUT
   ====================================================== */

.app__canvas {
  background: var(--ui-section-bg);
  border-radius: var(--radius-lg);
  padding: var(--space-25);
}

.app__main,
.app__sidebar {
  margin: var(--space-25) 0;
}

.app__sidebar,
.app__sidebar-block {
  padding-top: var(--space-25);
  padding-bottom: var(--space-25);
}

.app__sidebar {
  border-radius: var(--radius-lg);
  background: var(--ui-panel-bg);
  margin-left: var(--space-25);
  margin-right: var(--space-25);
}

.app__sidebar-block {
  background: var(--color-overlay-soft);
  border-radius: var(--radius-md);
  padding: var(--space-10);
}

@media (max-width: 991px) {
  .section-gallery__grid {
    padding: 0 !important;
  }
}

/* =======================================================
   VERY LARGE SCREENS ≥ 1600px (3xl breakpoint)
   ======================================================= */

/* =======================================================
   LARGE SCREENS ≥ 1400px (xxl breakpoint)
   Sidebar sticks to left screen edge
   ======================================================= */

@media (min-width: 1400px) {
  .app__sidebar {
    margin-left: 0;
    margin-right: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

/* =======================================================
   DESKTOP ≥ 1200px (xl breakpoint)
   ======================================================= */

/* =======================================================
   DESKTOP ≥ 992px (lg breakpoint)
   ======================================================= */

/* =======================================================
   TABLET HOR ≥ 768px (md breakpoint)
   ======================================================= */

/* =======================================================
   TABLET VER ≥ 576px (sm breakpoint)
   ======================================================= */
@media (max-width: 767px) {
  .app__sidebar {
    margin-left: 0;
    margin-right: 0;
    border-radius: 0;
  }
  .app__main {
    padding-left: 0 !important;
    padding-right: 0 !important;
    border-radius: 0;
  }
  .app__canvas {
    border-radius: 0;
  }
}

/* =======================================================
   MOBILE < 576px (xs breakpoint)
   ======================================================= */
</style>
