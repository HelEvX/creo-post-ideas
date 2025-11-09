<template>
  <div id="app">
    <!-- NAV -->
    <header class="site-nav">
      <div class="container">
        <div class="row align-center between">
          <div class="col-6 col-md-4">
            <div class="logo">
              <img src="../src/assets/img/Logo__wordmark.svg" alt="Creo beeldmerk" />
              <!-- <a class="logo" href="#">Creo Websolutions</a> -->
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- HERO (wide, overhang 1700px) -->
    <section class="hero hero--wide">
      <div class="col-6 col-md-11 right">
        <ThemeSwitcher />
      </div>
      <div class="container-wide">
        <div class="row center">
          <div class="col-12">
            <h1 class="hero-title">Visualize Your Brand's Social Style</h1>
            <p class="hero-subtitle">Preview your posts using your site's look & feel.</p>
          </div>
        </div>
      </div>

      <div>
        <!-- === START: App Layout (Three-region) === -->
        <div class="app__layout container">
          <div class="row">
            <!-- SIDEBAR -->
            <aside class="col-12 col-md-3 app__sidebar">
              <h3 class="app__sidebar-title">Control Panel</h3>
              <div class="app__sidebar-block">Theme Switcher</div>
              <div class="app__sidebar-block">Post Format Selector</div>
              <div class="app__sidebar-block">Smart Shuffle Button</div>
            </aside>

            <!-- MAIN COLUMN -->
            <main class="col-12 col-md-9 app__main">
              <!-- CANVAS -->
              <section class="app__canvas">
                <div class="mockup-wrapper text-center">
                  <div>Main Mockup Area</div>
                  <!-- example component usage -->
                  <RecipeShuffle />
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
        <!-- === END: App Layout === -->
      </div>
    </section>

    <!-- ABOUT (purpose of tool) -->
    <section class="section section-about">
      <div class="container">
        <div class="row center">
          <!-- blog text width (900px max) -->
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

    <!-- GALLERY -->
    <section class="section section-gallery alt">
      <div class="container">
        <div class="row">
          <div class="col-12"><h2>Example previews</h2></div>

          <!-- 3-up (4+4+4) -->
          <div class="col-12 col-md-4">
            <div class="card">
              <img src="https://via.placeholder.com/600x400" alt="Preview 1" />
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="card">
              <img src="https://via.placeholder.com/600x400" alt="Preview 2" />
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="card">
              <img src="https://via.placeholder.com/600x400" alt="Preview 3" />
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
              <button type="submit" class="btn-primary">Send review</button>
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
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import RecipeShuffle from "./components/RecipeShuffle.vue";

export default {
  name: "App",
  components: {
    ThemeSwitcher,
    RecipeShuffle,
  },
  methods: {
    submitReview() {
      alert("Thank you for your feedback!");
    },
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
  color: var(--ui-text-on-nav);
  padding: var(--space-20) 0;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.site-nav a:hover {
  color: var(--ui-nav-hover);
}
.site-footer {
  background: var(--ui-footer-bg);
  color: var(--ui-text-on-footer);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Logo svg color */
.logo a {
  font-family: var(--font-title);
  font-weight: 700;
  font-size: var(--fs-h4);
  color: var(--ui-text-on-nav);
}
.logo img {
  height: 6rem;
}

/* ----------------------------------------------------
   HERO
   ---------------------------------------------------- */
.hero {
  background: var(--ui-hero-bg);
  color: var(--ui-hero-text);
  padding: var(--space-100) 0;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.hero-title {
  font-family: var(--font-title);
  font-size: var(--fs-hero);
  line-height: var(--lh-display);
  margin: 0 0 var(--space-20);
  color: var(--ui-hero-text);
}
.hero-subtitle {
  font-family: var(--font-body);
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body);
  opacity: 0.9;
  margin: 0;
  color: var(--ui-hero-text);
}

/* ----------------------------------------------------
   SECTIONS
   ---------------------------------------------------- */
.section {
  padding: var(--space-75) 0;
  background: var(--ui-section-bg);
  color: var(--ui-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}
.section.alt {
  background: var(--ui-alt-section-bg);
  color: var(--ui-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}
.section h2 {
  font-family: var(--font-title);
  font-size: var(--fs-h2);
  line-height: var(--lh-display);
  margin: 0 0 var(--space-30);
  color: var(--ui-heading);
}

.text-block-900 {
  max-width: 90rem;
  margin: 0 auto;
}

/* Section titles */
.section h2,
.section h3,
.section h4 {
  color: var(--ui-heading);
}

/* Links appearing on dark backgrounds (footer, hero, nav, etc.) */
.section.alt a,
.site-footer a,
.hero a,
.site-nav a {
  color: var(--color-primary-light);
}

.section.alt a:hover,
.site-footer a:hover,
.hero a:hover,
.site-nav a:hover {
  color: var(--color-primary-lighter);
}

/* ----------------------------------------------------
   GALLERY
   ---------------------------------------------------- */
.card {
  background: var(--ui-panel-bg);
  color: var(--ui-panel-text);
  border: 0.1rem solid var(--ui-panel-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--color-shadow);
  border: 0.1rem solid var(--ui-panel-border);
  margin-bottom: var(--space-50);
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
.section.alt .card {
  background: var(--ui-background);
  color: var(--ui-heading);
}
.card img {
  display: block;
  width: 100%;
  height: auto;
}

/* ----------------------------------------------------
   FORM
   ---------------------------------------------------- */
.review-form .form-row {
  margin-bottom: var(--space-20);
}
.review-form label {
  display: block;
  margin-bottom: var(--space-10);
  font-weight: 600;
  color: var(--ui-heading);
}
.review-form input,
.review-form textarea {
  width: 100%;
  padding: 1.2rem 1.6rem;
  border: 0.1rem solid var(--ui-accent);
  border-radius: var(--radius-md);
  background: var(--ui-background);
  color: var(--ui-text);
  font-family: var(--font-body);
  box-sizing: border-box;
}
.btn-primary {
  display: inline-block;
  border: none;
  background: var(--ui-accent);
  color: var(--ui-inverse-text);
  padding: 1.2rem 2.4rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.2s ease-in-out;
}
.btn-primary:hover {
  background: var(--ui-accent-hover);
}

/* ----------------------------------------------------
   APP LAYOUT WITHIN HERO
   ---------------------------------------------------- */
.app__layout {
  margin-top: var(--space-50);
  margin-bottom: var(--space-75);
}

.app__sidebar {
  background: var(--ui-nav-bg);
  color: var(--color-inverse-text);
  border-radius: var(--radius-md);
  padding: var(--space-20);
  /* box-shadow: var(--color-shadow); */
}

.app__sidebar-title {
  font-size: var(--fs-h5);
  font-family: var(--font-title);
  margin-bottom: var(--space-20);
  color: var(--color-inverse-text);
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
  gap: var(--space-30);
  padding-left: var(--space-20);
}

.app__canvas {
  background: var(--color-surface);
  color: var(--ui-text);
  border: 0.1rem solid var(--neutral-200);
  border-radius: var(--radius-md);
  padding: var(--space-30);
  /* box-shadow: var(--color-shadow); */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.app__finalization {
  background: var(--color-surface);
  color: var(--ui-text);
  border: 0.1rem solid var(--neutral-200);
  border-radius: var(--radius-md);
  padding: var(--space-30);
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
