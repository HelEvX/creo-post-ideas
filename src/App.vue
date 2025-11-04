<template>
  <div id="app">
    <!-- NAV -->
    <header class="site-nav">
      <div class="container">
        <div class="row align-center between">
          <div class="col-6 col-md-4">
            <a class="brand" href="#">Creo Websolutions</a>
          </div>
          <div class="col-6 col-md-8 right">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>

    <!-- HERO (wide, overhang 1700px) -->
    <section class="hero hero--wide">
      <div class="container-wide">
        <div class="row center">
          <div class="col-12">
            <h1 class="hero-title">Visualize Your Brand’s Social Style</h1>
            <p class="hero-subtitle">
              Preview your posts using your site’s look & feel.
            </p>
          </div>
        </div>
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
                This tool helps ensure visual consistency between your website
                and social channels by applying your theme across interface
                elements and mockups.
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
            <form
              class="review-form text-block-900"
              @submit.prevent="submitReview">
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

export default {
  components: { ThemeSwitcher },
  methods: {
    submitReview() {
      alert("Thank you for your feedback!");
    },
  },
};
</script>

<style>
/* ----------------------------------------------------
   BASE LAYOUT
   ---------------------------------------------------- */
html {
  font-size: 62.5%;
} /* 10px = 1rem baseline */

body {
  margin: 0;
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
}

/* ----------------------------------------------------
   CONTAINERS
   ---------------------------------------------------- */
.container,
.container-wide {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 2.5rem; /* 25px side padding */
  padding-right: 2.5rem;
  box-sizing: border-box;
}
.container {
  max-width: 165rem;
} /* 1650px content area */
.container-wide {
  max-width: 170rem;
} /* for hero overhang */

/* ----------------------------------------------------
   GRID (12 columns, 50px gutters)
   ---------------------------------------------------- */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -2.5rem; /* half gutter */
  margin-right: -2.5rem;
}
.row.center {
  justify-content: center;
}
.row.between {
  justify-content: space-between;
}
.align-center {
  align-items: center;
}
.right {
  text-align: right;
}

[class^="col-"],
[class*=" col-"] {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  box-sizing: border-box;
  width: 100%;
}

/* Column widths */
.col-12 {
  width: 100%;
}
.col-11 {
  width: 91.6667%;
}
.col-10 {
  width: 83.3333%;
}
.col-9 {
  width: 75%;
}
.col-8 {
  width: 66.6667%;
}
.col-7 {
  width: 58.3333%;
}
.col-6 {
  width: 50%;
}
.col-5 {
  width: 41.6667%;
}
.col-4 {
  width: 33.3333%;
}
.col-3 {
  width: 25%;
}
.col-2 {
  width: 16.6667%;
}
.col-1 {
  width: 8.3333%;
}

/* Responsive columns */
@media (min-width: 768px) {
  .col-md-12 {
    width: 100%;
  }
  .col-md-11 {
    width: 91.6667%;
  }
  .col-md-10 {
    width: 83.3333%;
  }
  .col-md-9 {
    width: 75%;
  }
  .col-md-8 {
    width: 66.6667%;
  }
  .col-md-7 {
    width: 58.3333%;
  }
  .col-md-6 {
    width: 50%;
  }
  .col-md-5 {
    width: 41.6667%;
  }
  .col-md-4 {
    width: 33.3333%;
  }
  .col-md-3 {
    width: 25%;
  }
  .col-md-2 {
    width: 16.6667%;
  }
  .col-md-1 {
    width: 8.3333%;
  }
}

/* ----------------------------------------------------
   NAVIGATION
   ---------------------------------------------------- */
.site-nav {
  background: var(--color-footer-bg);
  color: var(--color-inverse-text);
  padding: var(--space-20) 0;
}
.brand {
  font-family: var(--font-title);
  font-weight: 700;
  font-size: var(--fs-h4);
  text-decoration: none;
  color: var(--color-inverse-text);
}

/* ----------------------------------------------------
   HERO
   ---------------------------------------------------- */
.hero {
  background: var(--color-primary);
  color: var(--color-inverse-text);
  padding: var(--space-100) 0; /* 100px */
}
.hero-title {
  font-family: var(--font-title);
  font-size: var(--fs-hero);
  line-height: var(--lh-display);
  margin: 0 0 var(--space-20);
}
.hero-subtitle {
  font-family: var(--font-body);
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body);
  opacity: 0.9;
  margin: 0;
}

/* ----------------------------------------------------
   SECTIONS
   ---------------------------------------------------- */
.section {
  padding: var(--space-75) 0;
  background: var(--color-background);
  color: var(--color-text);
}
.section.alt {
  background: var(--color-footer-bg);
  color: var(--color-inverse-text);
}
.section h2 {
  font-family: var(--font-title);
  font-size: var(--fs-h2);
  line-height: var(--lh-display);
  margin: 0 0 var(--space-30);
}

/* 900px max for body content */
.text-block-900 {
  max-width: 90rem;
  margin: 0 auto;
}

/* ----------------------------------------------------
   GALLERY
   ---------------------------------------------------- */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  margin-bottom: var(--space-50);
}
.section.alt .card {
  background: var(--neutral-0);
  color: var(--secondary-800);
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
}
.review-form input,
.review-form textarea {
  width: 100%;
  padding: 1.2rem 1.6rem;
  border: 0.1rem solid var(--color-primary);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
  box-sizing: border-box;
}
.btn-primary {
  display: inline-block;
  border: none;
  background: var(--color-primary);
  color: var(--color-inverse-text);
  padding: 1.2rem 2.4rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.2s ease-in-out;
}
.btn-primary:hover {
  background: var(--color-accent);
}

/* ----------------------------------------------------
   FOOTER
   ---------------------------------------------------- */
.site-footer {
  background: var(--color-footer-bg);
  color: var(--color-inverse-text);
  padding: var(--space-30) 0;
}
.site-footer p {
  margin: 0;
}
.footer-link {
  color: var(--color-inverse-text);
  text-decoration: none;
  border-bottom: 0.2rem solid rgba(255, 255, 255, 0.25);
}
.footer-link:hover {
  border-bottom-color: var(--color-inverse-text);
}
</style>
