<template>
  <div id="app">
    <!-- NAV -->
    <header class="site-nav">
      <div class="container">
        <div class="row align-center between">
          <div class="col-6 col-md-4">
            <a class="logo" href="#"><img src="../src/assets/img/Logo__wordmark.svg" alt="Creo beeldmerk" /></a>
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
      <div class="container">
        <div class="row align-center">
          <div class="col-6 col-md-12">
            <BrandPicker @picked="onBrandPicked" />
          </div>
        </div>
      </div>
    </section>

    <!-- === START: App Layout (Three-region) === -->
    <section class="app__layout">
      <div class="container-full">
        <div class="row between">
          <!-- SIDEBAR -->
          <aside class="col-12 col-md-3 app__sidebar">
            <h3 class="app__sidebar-title">Control Panel</h3>
            <div class="app__sidebar-block" v-if="brandTokens">
              <RecipeShuffle :brandTokens="brandTokens" />
            </div>
          </aside>

          <!-- MAIN COLUMN -->
          <main class="col-12 col-md-9 app__main">
            <!-- CANVAS -->
            <section class="app__canvas">
              <div class="mockup-wrapper text-center">
                <div>Main Preview Area</div>
                <!-- example component usage -->
                <!-- <RecipeShuffle /> -->
              </div>
            </section>

            <!-- FINALIZATION ZONE -->
            <section class="app__finalization">
              <div class="app__finalization-block">Brand Consistency Gallery</div>
              <div class="app__finalization-block">Export Buttons</div>
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
import BrandPicker from "./components/BrandPicker.vue";
import RecipeShuffle from "./components/RecipeShuffle.vue";

export default {
  name: "App",
  components: {
    BrandPicker,
    RecipeShuffle,
  },

  data() {
    return {
      brandTokens: null,
    };
  },

  methods: {
    async onBrandPicked(payload) {
      // Reset to Creo base if picker emits null
      if (!payload) {
        this.brandTokens = null;
        return;
      }

      // Handle both {slug, tokens} object and plain slug string
      let data;
      if (typeof payload === "object" && payload.tokens) {
        data = payload.tokens;
      } else {
        const slug = typeof payload === "string" ? payload : payload.slug;
        const res = await fetch(`/brands/${slug}.json`);
        data = await res.json();
      }

      // Apply all color tokens to the root
      const root = document.documentElement;
      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith("color-") || k.startsWith("--color-") || k.startsWith("font-")) {
          const cssVar = k.startsWith("--") ? k : `--${k}`;
          root.style.setProperty(cssVar, v);
        }
      }

      this.brandTokens = data;
      // confirm data flow
      console.log("brandTokens now:", this.brandTokens);
    },

    submitReview() {
      alert("Thank you for your feedback!");
    },
  },

  mounted() {
    // Optional: preload brand via ?brand=slug for client links
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    if (brand) this.onBrandPicked(brand);
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
}
h1.hero-title {
  font-size: var(--fs-hero);
  color: var(--ui-heading);
}
p.hero-subtitle {
  font-size: var(--fs-body-lg);
  font-weight: 600;
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

/* Logo svg or text link */
a.logo {
  font-family: var(--font-title);
  font-weight: 700;
  font-size: var(--fs-h4);
  color: var(--ui-inverse);
}
a.logo:hover {
  color: var(--ui-faint);
}
a.logo img {
  height: 6rem;
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
.app__layout {
  margin: var(--space-50) 0;
}

.app__sidebar {
  background: var(--ui-nav-bg);
  color: var(--ui-inverse);
  border-top-right-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
  padding: 2.5rem;
  /* box-shadow: var(--shadow); */
}

.app__sidebar-title {
  font-size: var(--fs-h5);
  font-family: var(--font-title);
  margin-bottom: var(--space-20);
}

.app__sidebar-block {
  background: rgba(255, 255, 255, 0.08);
  padding: var(--space-10);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-10);
}

.app__main {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.app__canvas,
.app__finalization {
  background: var(--ui-alt-section-bg);
  border: var(--ui-panel-border-soft);
  border-radius: var(--radius-md);
  padding: var(--space-30);
  /* box-shadow: var(--shadow); */
}

.app__canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.app__finalization-block {
  background: rgba(0, 0, 0, 0.04);
  padding: var(--space-10);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-10);
}

/* Responsive stacking */
@media (max-width: 768px) {
  .app__main {
    padding-left: 0;
  }
  .app__sidebar {
    margin-bottom: var(--space-30);
  }
}
</style>
