<template>
  <div class="app-main-shell">
    <!-- Top format selector row -->
    <div class="format-selector-bar">
      <button type="button" class="format-selector-bar__btn">
        <span class="format-selector-bar__icon">▢</span>
        <span>Square</span>
      </button>

      <button type="button" class="format-selector-bar__btn">
        <span class="format-selector-bar__icon">▭</span>
        <span>Landscape</span>
      </button>

      <button type="button" class="format-selector-bar__btn format-selector-bar__btn active">
        <span class="format-selector-bar__icon">▯</span>
        <span>Portrait</span>
      </button>

      <button type="button" class="format-selector-bar__btn">
        <span class="format-selector-bar__icon">▭</span>
        <span>Story</span>
      </button>

      <button type="button" class="format-selector-bar__btn">
        <span class="format-selector-bar__icon">▭</span>
        <span>Banner</span>
      </button>
    </div>

    <!-- Main preview area -->
    <div class="main-preview-grid">
      <!-- Inner sidebar -->
      <ContentTypePanel class="main-preview-grid__sidebar" @select="onContentTypeSelect" />

      <!-- Mockup / post preview -->
      <section class="main-preview-grid__mockup">
        <!-- <header class="main-preview-grid__header">
          <span class="main-preview-grid__label">Main preview area</span>
        </header> -->

        <div class="post-preview">
          <div class="post-preview__frame">
            <div class="post-preview__company">
              <div class="post-preview__logo-mark"></div>
              <div class="post-preview__logo-text">BUSINESS MARKETING</div>
            </div>

            <div class="post-preview__hero">
              <div class="post-preview__badge">LET'S CONNECT</div>
            </div>

            <div class="post-preview__body">
              <h3 class="post-preview__title">
                Solving our Biggest
                <br />
                <span class="post-preview__title--accent"> Operational Bottleneck </span>
              </h3>

              <p class="post-preview__text">
                Operational bottlenecks don't just slow you down, they directly impact your bottom line.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Notes zone -->
      <aside class="main-preview-grid__notes">
        <!-- <header class="main-preview-grid__header main-preview-grid__header--right">
          <span class="main-preview-grid__label">Notes zone</span>
        </header> -->

        <div class="notes-panel">
          <div class="notes-panel__callout">
            <p class="notes-panel__text">
              Lorem ipsum dolor sit amet consectetur. Natoque nunc velit dignissim etiam elit facilisi aliquam vitae
              aliquam in risus mauris.
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import ContentTypePanel from "./ContentTypePanel.vue";

defineProps({
  brandTokens: { type: Object, default: null },
  scales: { type: Object, default: null },
});

// function onContentTypeSelect(type) {
// placeholder for future logic
// console.log("content type selected:", type, props.brandTokens);
// }
</script>

<style scoped>
.app__main {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  gap: 2.5rem;
}

.format-selector-bar {
  display: flex;
  justify-content: center;
  gap: 1.6rem;
  margin-bottom: 2.4rem;
  padding: var(--space-5) 0;
  background: var(--ui-alt-section-bg);
  border: var(--ui-panel-border-soft);
  border-radius: var(--radius-md);
  /* box-shadow: var(--shadow); */
}

.format-selector-bar__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.8rem 1.2rem;
  background-color: var(---ui-alt-section-bg);
  color: var(--ui-text);
}

.format-selector-bar__btn.active {
  background-color: var(--color-primary-light);
  color: var(--ui-inverse);
}

.format-selector-bar__icon {
  font-size: 1.4rem;
}

.main-preview-grid {
  display: flex;
}

/* Mockup */

.main-preview-grid__mockup {
  background: var(--white);
  border-radius: var(--radius-md);
  /* border: var(--ui-panel-border-soft); */
  padding: 2rem;
  flex: 1 0 auto;
}

/* .main-preview-grid__header {
  display: flex;
  justify-content: center;
  margin-bottom: 1.6rem;
} */

.main-preview-grid__label {
  font-size: var(--fs-h5);
  color: var(--ui-muted);
}

.post-preview {
  display: flex;
  justify-content: center;
}

.post-preview__frame {
  aspect-ratio: 9/16;
  background: var(--color-surface);
  width: 50%;
  height: auto;
  padding: 5%;
  display: flex;
  flex-direction: column;
  position: relative;
  /* box-shadow: var(--shadow); */
}

.post-preview__company {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: var(--fs-h5);
  font-weight: var(--fw-title);
}

.post-preview__logo-mark {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.6rem;
  background: var(--color-primary);
}

.post-preview__hero {
  margin: 1.6rem 0;
  display: flex;
  justify-content: center;
}

.post-preview__badge {
  border-radius: 999px;
  padding: 0.4rem 1.2rem;
  border: 1px solid var(--color-primary);
  font-size: var(--fs-h5);
}

.post-preview__body {
  margin-top: auto;
}

.post-preview__title {
  font-family: var(--font-title);
  font-size: 2.2rem;
  line-height: 1.2;
  margin-bottom: 1.2rem;
}

.post-preview__title--accent {
  color: var(--ui-accent);
}

.post-preview__text {
  font-size: var(--fs-body-sm);
  color: var(--ui-soft);
}

/* Notes */

.main-preview-grid__notes {
  background: var(--ui-panel-bg);
  border-radius: var(--radius-md);
  border: var(--ui-panel-border-soft);
  padding: 2rem;
  flex: 0 1 20%;
}

.notes-panel__callout {
  border-radius: var(--radius-md);
  border: var(--ui-panel-border);
  padding: 1.2rem 1.6rem;
  background: var(--ui-section-bg);
  /* box-shadow: var(--shadow); */
}

.notes-panel__text {
  font-size: var(--fs-body-sm);
  margin: 0;
}
</style>
