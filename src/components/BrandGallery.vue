<template>
  <div class="brand-gallery">
    <div class="col-12 col-md-1"></div>
    <!-- Color playground -->
    <section class="col-12 col-md-4 brand-gallery__section">
      <header class="brand-gallery__header">
        <h3 class="brand-gallery__title">Color playground</h3>
        <p>Click the tiles to copy the color to your clipboard.</p>
      </header>

      <div class="brand-gallery__toggle">
        <span>Light mode</span>
        <button type="button" class="brand-gallery__toggle-switch">
          <span class="brand-gallery__toggle-knob"></span>
        </button>
        <span>Dark mode</span>
      </div>

      <div class="brand-gallery__content">
        <!-- Swatches -->
        <section class="brand-gallery__section--swatches">
          <div>
            <div class="brand-gallery__swatch-group">
              <div class="brand-gallery__swatch brand-gallery__swatch--light-1">
                <span>Aa</span><br />
                Aa
              </div>
              <div class="brand-gallery__swatch brand-gallery__swatch--light-2">
                <span>Aa</span><br />
                Aa
              </div>
              <div class="brand-gallery__swatch brand-gallery__swatch--light-3">
                <span>Aa</span><br />
                Aa
              </div>
              <div class="brand-gallery__swatch brand-gallery__swatch--light-4">
                <span>Aa</span><br />
                Aa
              </div>
              <div class="brand-gallery__swatch brand-gallery__swatch--light-5">
                <span>Aa</span><br />
                Aa
              </div>
            </div>
            <p class="brand-gallery__label">Text colors</p>
          </div>

          <div>
            <div class="brand-gallery__swatch-group">
              <div class="brand-gallery__swatch brand-gallery__swatch--dark-1">
                <span>Aa</span><br />
                Aa
              </div>
              <div class="brand-gallery__swatch brand-gallery__swatch--dark-2">
                <span>Aa</span><br />
                Aa
              </div>
              <div class="brand-gallery__swatch brand-gallery__swatch--dark-3">
                <span>Aa</span><br />
                Aa
              </div>
              <div class="brand-gallery__swatch brand-gallery__swatch--dark-4">
                <span>Aa</span><br />
                Aa
              </div>
              <div class="brand-gallery__swatch brand-gallery__swatch--dark-5">
                <span>Aa</span><br />
                Aa
              </div>
            </div>
            <p class="brand-gallery__label">Background colors</p>
          </div>
        </section>
      </div>
    </section>
    <!-- Type playground -->
    <section class="col-12 col-md-6 brand-gallery__section brand-gallery__section--playground">
      <div class="brand-gallery__playground-header">
        <h3 class="brand-gallery__title">Type playground</h3>
      </div>

      <div class="brand-gallery__playground">
        <h1 class="brand-gallery__playground-title">Type anything!</h1>
        <p class="brand-gallery__playground-body">
          Click the colors on the left to see the effect in this box. We can write more info about this section here
          because it's more useful than lorem ipsum and works just as well.
        </p>
      </div>

      <!-- Fonts -->
      <div>
        <div class="brand-gallery__font-samples">
          <h2>Your title font is called <span>[Font Name]</span></h2>
          <button>Get it here</button>
        </div>

        <div class="brand-gallery__font-samples">
          <p>Your body font is called <span>[Font Name]</span></p>
          <button>Get it here</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
defineProps({
  brandTokens: { type: Object, default: null },
  scales: { type: Object, default: null },
});
</script>

<style scoped>
.brand-gallery {
  display: flex;
  flex-direction: row;
}

.brand-gallery__header {
  margin-bottom: 1.6rem;
}

.brand-gallery__title {
  font-size: var(--fs-h5);
  margin: 0;
}

.brand-gallery__content {
  display: flex;
  gap: var(--space-50);
}

.brand-gallery__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}

.brand-gallery__swatch-group {
  display: flex;
  gap: var(--space-10);
}

.brand-gallery__swatch {
  width: 8rem;
  height: auto;
  border-radius: var(--radius-md);
  border: var(--ui-panel-border-soft);
  background: var(--ui-border-subtle);
  text-align: center;
}

.brand-gallery__swatch span {
  font-size: var(--fs-h2);
}

/* COLORS */
.brand-gallery__swatch--light-1 {
  background: var(--ui-section-bg);
  color: var(--ui-text);
}
.brand-gallery__swatch--light-2 {
  background: var(--ui-alt-section-bg);
  color: var(--ui-text);
}
.brand-gallery__swatch--light-3 {
  background: var(--ui-panel-bg);
  color: var(--ui-text);
}
.brand-gallery__swatch--light-4 {
  background: var(--ui-section-bg);
  color: var(--ui-heading);
}
.brand-gallery__swatch--light-5 {
  background: var(--ui-alt-section-bg);
  color: var(--ui-heading);
}

.brand-gallery__swatch--dark-1 {
  color: var(--ui-section-bg);
  background: var(--ui-caption);
}
.brand-gallery__swatch--dark-2 {
  color: var(--ui-section-bg);
  background: var(--ui-accent);
}
.brand-gallery__swatch--dark-3 {
  color: var(--ui-section-bg);
  background: var(--ui-link);
}
.brand-gallery__swatch--dark-4 {
  color: var(--ui-section-bg);
  background: var(--ui-soft);
}
.brand-gallery__swatch--dark-5 {
  background: var(--ui-alt-panel-bg);
  color: var(--ui-text);
}

.brand-gallery__label {
  font-size: var(--fs-caption);
}

.brand-gallery__font-samples {
  padding: var(--space-10);
}

.brand-gallery__playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-10);
}

.brand-gallery__playground-title {
  font-size: var(--fs-h4);
}

.brand-gallery__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-size: var(--fs-caption);
}

.brand-gallery__toggle-switch {
  position: relative;
  width: var(--space-30);
  height: auto;
  border-radius: 999px;
  border: var(--ui-panel-border-soft);
  background: var(--color-surface);
  box-shadow: inset 0 1px 1px var(--color-shadow);
}

.brand-gallery__toggle-knob {
  position: absolute;
  aspect-ratio: 1 / 1;
  top: 2px;
  left: 2px;
  width: 1.5rem;
  height: auto;
  border-radius: 50%;
  background: var(--color-primary);
}

.brand-gallery__playground {
  padding: 1.6rem 2rem;
  background: var(--ui-section-bg);
  color: var(--ui-text);
  border-radius: var(--radius-md);
  border: var(--ui-panel-border-soft);
  font-size: var(--fs-body-sm);
}
</style>
