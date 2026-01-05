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
      <!-- Shown in master version (clients only see their own brands) -->
      <div class="container" v-if="showBrandPicker">
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
            :colored="useColoredBackground" />

          <!-- MAIN COLUMN -->
          <main class="col-12 col-xxl-9 col-3xl-9 app__main">
            <!-- CANVAS -->
            <div class="app__canvas">
              <MainPreview
                :brandTokens="brandTokens"
                :scales="scales"
                @update-tone="backgroundTone = $event"
                @update-mode="backgroundMode = $event"
                @update-colored="useColoredBackground = $event" />
            </div>
          </main>
        </div>
      </div>
    </section>
    <!-- === END: Preview Zone === -->

    <!-- ABOUT (purpose of tool) -->
    <section class="section section-about alt">
      <div class="container">
        <div class="row text-block-900 center">
          <div class="col-12">
            <h5>DOELSTELLING</h5>
            <h2>Een Instagram<span>*</span> design spieker</h2>
            <p>Je klanten moeten je merk direct herkennen wanneer ze door hun 'feed' scrollen.</p>
            <p>
              Je hebt een logo en je website is klaar. Toch is ontwerpen voor Instagram niet zo eenvoudig. Hoe komt dat?
            </p>
            <p>
              Je twijfelt misschien over het lettertype, of je vindt geen geschikte combinatie voor achtergrond- en
              tekstkleuren.
            </p>
            <p>
              Met <strong>Voorbeeld-ig</strong> geven we eenvoudige voorbeelden van Instagram posts in jouw huisstijl.
              Je kan verschillende soorten inhouden en formaten bekijken, als startpunt voor je eigen creaties.
            </p>
            <p>
              Maar er is meer! De ingebouwde kleurcombinaties van deze tool geven jouw huisstijl een unieke toets. Maak
              je palet eens extra levendig of net sober. Probeer eens een 'donkere' versie uit of hou het minimaal. Bij
              elke nieuwe mix kan je bovendien het contrast tussen tekst en achtergrond controleren en verbeteren. Een
              leesbare boodschap is gegarandeerd!
            </p>
            <p>
              Kopieer je kleuren met één klik en ga meteen aan de slag in jouw favoriete design-app. Veel
              ontwerpplezier!
            </p>
            <p class="starred-text">(*) en andere sociale media</p>
            <!-- This tool helps ensure visual consistency between your website and social channels by applying your
                theme across interface elements and mockups. -->
          </div>
        </div>
      </div>
    </section>

    <!-- INSTAGRAM GRID VIEW -->
    <section class="section section-gallery">
      <div class="container">
        <!-- <div class="row text-block-900 center">
          <div class="col-12">
            <h2>Instagram Grid</h2>
          </div>
        </div> -->
        <div class="row">
          <div class="col-12 section-gallery__grid">
            <InstagramGrid
              v-if="brandTokens && brandTokens.ig"
              :brandTokens="brandTokens"
              :ig="brandTokens.ig"
              :images="galleryImages" />
          </div>
        </div>
        <div class="row text-block-900 center">
          <p>— einde van de mockup —</p>
        </div>
      </div>
    </section>

    <!-- REVIEW FORM -->
    <section class="section section-review">
      <div class="container">
        <div class="row text-block-900 center">
          <div class="col-12">
            <h2>Geef ons feedback</h2>
          </div>
          <!-- blog text width (900px max) -->
          <div class="col-12">
            <form class="review-form" @submit.prevent="submitReview">
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
          <div class="col-3">
            <a href="#">Privacy</a>
          </div>
          <div class="col-9 right">
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
  "pattern-distorted-mesh",
  "pattern-geometric-flowers",
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
      useColoredBackground: true,

      galleryImages: demoImages,

      //  DYNAMIC TEXT SUSPENSION (for contrast fixing)
      suspendDynamicText: false,

      // MASTER version
      showBrandPicker: true,
    };
  },

  computed: {
    mockupBgContext() {
      if (this.useColoredBackground === false) {
        return {
          type: this.backgroundMode,
          tone: this.backgroundTone,
          bgVars: ["--ui-alt-section-bg"],
        };
      }

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
        this.updateDynamicTextRoles();
      });
    },

    /* ----------------------------------------------
       DYNAMIC TEXT + OVERLAY RESOLUTION
    ---------------------------------------------- */
    updateDynamicTextRoles() {
      // GUARD
      if (this.suspendDynamicText) return;

      const root = document.documentElement;
      const cs = getComputedStyle(root);

      // HELPER
      const getVar = (name) => cs.getPropertyValue(name).trim();

      const dark = getVar("--color-text");
      const light = getVar("--color-text-inverse");

      const softDark = getVar("--color-soft");
      const softLight = getVar("--color-soft-inverse");

      const disabledDark = getVar("--color-disabled");
      const disabledLight = getVar("--color-disabled-inverse");

      const faintDark = getVar("--color-faint");
      const faintLight = getVar("--color-faint-inverse");

      const titleDark = getVar("--color-title");

      const captionDark = getVar("--color-soft");
      const captionLight = getVar("--color-soft-inverse");

      const captionPriDark = getVar("--color-primary-dark");
      const captionPriLight = getVar("--color-primary-lighter");

      const captionSecDark = getVar("--color-tertiary"); // same as secondary-dark unless defined
      const captionSecLight = getVar("--color-secondary-lighter");

      const overlayDark = getVar("--black-50");
      const overlayLight = getVar("--white-50");

      /* ----------------------------------------------
     ACCENT BACKGROUND RESOLUTION (EXPLICIT)
     ---------------------------------------------- */

      const accentBg =
        this.mockupBgContext?.tone === "secondary"
          ? cs.getPropertyValue("--ui-primary-bg").trim()
          : cs.getPropertyValue("--ui-secondary-bg").trim();

      if (accentBg) {
        root.style.setProperty("--ui-accent-bg", accentBg);
      }

      /* ----------------------------------------------
         PER-SURFACE ROLE ASSIGNMENT
      ---------------------------------------------- */
      function apply(surfaceKey, bgVarName) {
        const bg = cs.getPropertyValue(bgVarName).trim();
        if (!bg) return;

        const mode = getTextModeForBackground(bg, dark, light);
        if (!mode) return;

        // mode === "dark" means: background is light → dark text is readable
        if (mode === "dark") {
          root.style.setProperty(`--text-on-${surfaceKey}`, dark);
          root.style.setProperty(`--title-on-${surfaceKey}`, titleDark);
          root.style.setProperty(`--soft-on-${surfaceKey}`, softDark);
          root.style.setProperty(`--disabled-on-${surfaceKey}`, disabledDark);
          root.style.setProperty(`--faint-on-${surfaceKey}`, faintDark);
          root.style.setProperty(`--caption-on-${surfaceKey}`, captionDark);
          root.style.setProperty(`--caption-pri-on-${surfaceKey}`, captionPriDark);
          root.style.setProperty(`--caption-sec-on-${surfaceKey}`, captionSecDark);
          root.style.setProperty(`--overlay-on-${surfaceKey}`, overlayDark);
        } else {
          root.style.setProperty(`--text-on-${surfaceKey}`, light);
          root.style.setProperty(`--title-on-${surfaceKey}`, light);
          root.style.setProperty(`--soft-on-${surfaceKey}`, softLight);
          root.style.setProperty(`--disabled-on-${surfaceKey}`, disabledLight);
          root.style.setProperty(`--faint-on-${surfaceKey}`, faintLight);
          root.style.setProperty(`--caption-on-${surfaceKey}`, captionLight);
          root.style.setProperty(`--caption-pri-on-${surfaceKey}`, captionPriLight);
          root.style.setProperty(`--caption-sec-on-${surfaceKey}`, captionSecLight);
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
        ["accent", "--ui-accent-bg"],
      ];

      surfaces.forEach(([key, bgVar]) => apply(key, bgVar));

      /* ----------------------------------------------
         DYNAMIC TEXT (CONTENT LAYER)
      ---------------------------------------------- */
      const textOnSection = getVar("--text-on-section");
      const titleOnSection = getVar("--title-on-section");
      const softOnSection = getVar("--soft-on-section");
      const disabledOnSection = getVar("--disabled-on-section");
      const faintOnSection = getVar("--faint-on-section");
      const textOnFooter = getVar("--soft-on-footer");
      const textOnNav = getVar("--text-on-nav");

      if (textOnSection) root.style.setProperty("--dynamic-text", textOnSection);
      if (titleOnSection) root.style.setProperty("--dynamic-title", titleOnSection);
      if (softOnSection) root.style.setProperty("--dynamic-soft", softOnSection);
      if (disabledOnSection) root.style.setProperty("--dynamic-disabled", disabledOnSection);
      if (faintOnSection) root.style.setProperty("--dynamic-faint", faintOnSection);
      if (textOnFooter) root.style.setProperty("--dynamic-footer", textOnFooter);
      if (textOnNav) root.style.setProperty("--dynamic-nav", textOnNav);

      /* ----------------------------------------------
        DYNAMIC OVERLAY (MOCKUP ONLY)
      ---------------------------------------------- */
      const bgVars = this.useColoredBackground ? this.mockupBgContext?.bgVars || [] : ["--ui-alt-section-bg"];

      let resolvedBg = null;

      for (const v of bgVars) {
        const val = cs.getPropertyValue(v).trim();
        if (val) {
          resolvedBg = val;
          break;
        }
      }

      if (resolvedBg) {
        const mode = getTextModeForBackground(resolvedBg, dark, light);
        root.style.setProperty("--dynamic-overlay", mode === "dark" ? overlayDark : overlayLight);
      }

      // ----------------------------------------------
      // BUTTON HOVER / ACTIVE MIX
      // follows actual UI section background polarity
      // ----------------------------------------------
      const sectionBg = cs.getPropertyValue("--ui-section-bg").trim();

      if (sectionBg) {
        const hoverMode = getTextModeForBackground(sectionBg, dark, light);

        // dark surface -> lighten on hover
        // light surface -> darken on hover
        root.style.setProperty("--btn-mix-hover", hoverMode === "light" ? "white" : "black");
        root.style.setProperty("--btn-mix-active", hoverMode === "light" ? "white" : "black");
      }

      window.dispatchEvent(new Event("dynamic-text-updated"));
    },

    /* ----------------------------------------------
       BRAND LOADING
    ---------------------------------------------- */
    async onBrandPicked(payload) {
      const root = document.documentElement;

      // ALWAYS reset brand-scoped classes first
      root.classList.remove(...Array.from(root.classList).filter((c) => c.startsWith("brand--")));

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

      root.classList.remove(...Array.from(root.classList).filter((c) => c.startsWith("brand--")));
      root.classList.add(`brand--${slug}`);

      const res = await fetch(`/brands/${slug}.json`);
      const data = await res.json();

      // Inject font imports (needed for URL-based brand loading)
      if (data.fonts && Array.isArray(data.fonts.import)) {
        data.fonts.import.forEach((url) => {
          if (!document.querySelector(`link[href="${url}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            document.head.appendChild(link);
          }
        });
      }

      // Let the browser register the new @font-face rules before applying vars
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      root.removeAttribute("style");

      // Keys applied (COLORS + FONTS ONLY)
      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith("color-") || k.startsWith("--color-") || k.startsWith("font-")) {
          const cssVar = k.startsWith("--") ? k : `--${k}`;
          root.style.setProperty(cssVar, v);
        }
      }

      /* ----------------------------------------------
          MOCKUP-ONLY: BORDER + SHADOW
          (do NOT touch UI border / shadow variables)
        ---------------------------------------------- */

      // defensive helpers
      const t = (val) => (typeof val === "string" ? val.trim() : val);
      const isTrue = (val) => val === true || (typeof val === "string" && val.trim().toLowerCase() === "true");

      // flags from JSON
      const borderEnabled = isTrue(data["border-enabled"]);
      const shadowEnabled = isTrue(data["shadow-enabled"]);

      // border radius (allowed to be global)
      if (t(data["card-radius"])) {
        root.style.setProperty("--card-radius", t(data["card-radius"]));
      }

      if (borderEnabled) {
        const w = t(data["border-width-card"]) || "0";
        root.style.setProperty("--card-border", `${w} solid var(--color-border-card)`);
      } else {
        root.style.setProperty("--card-border", "none");
      }

      if (shadowEnabled) {
        const x = t(data["shadow-x"]) || "0";
        const y = t(data["shadow-y"]) || "0";
        const blur = t(data["shadow-blur"]) || "0";

        // brand default shadow color
        const rgb = t(data["shadow-rgb"]);
        if (rgb) {
          root.style.setProperty("--shadow-rgb", rgb);
        }

        // brand default shadow alpha
        const alpha = t(data["shadow-alpha"]);
        if (alpha) {
          root.style.setProperty("--shadow-alpha", alpha);
        }

        root.style.setProperty("--card-shadow", `${x} ${y} ${blur} var(--color-shadow)`);
      } else {
        root.style.setProperty("--card-shadow", "none");
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

    if (brand) {
      this.showBrandPicker = false;
      this.onBrandPicked(brand);
    } else {
      this.showBrandPicker = true;
      this.onBrandPicked(null);
    }

    window.addEventListener("brand-reset", (e) => {
      const { slug } = e.detail || {};
      if (slug) this.onBrandPicked(slug);
    });

    window.addEventListener("palette-updated", this.scheduleDynamicTextUpdate);
    window.addEventListener("accent-updated", this.scheduleDynamicTextUpdate);

    this.scheduleDynamicTextUpdate();
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
  background: var(--ui-alt-section-bg);
  height: auto;
  transform: translateY(6px) scale(0.99);
  transition: var(--transition-default);
}

.app__layout {
  transform: translateY(0);
}

.app__layout,
.app__layout * {
  transition: background-color var(--transition-default), color var(--transition-default),
    border-color var(--transition-default), fill var(--transition-default);
}

@media (max-width: 767px) {
  .app__layout {
    padding: 0;
    background: transparent;
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
  color: var(--ui-secondary-bg);
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
  font-weight: var(--fw-title);
  letter-spacing: -0.01em;
}
p.hero-subtitle {
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-title);
  color: var(--dynamic-soft);
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

.section-gallery h2 {
  /* text-align: center; */
  padding-top: var(--space-30);
}

.section-gallery p {
  font-size: var(--fs-body-sm);
  color: var(--dynamic-disabled);
}

.section-about .starred-text {
  font-size: var(--fs-body-sm);
}

.section-about .starred-text,
.section-about span {
  color: var(--color-tertiary);
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
  height: 100%;
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
