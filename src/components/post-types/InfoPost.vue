<template>
  <div class="info-post" postType="info">
    <PostTextBlock :headlineText="headline" :bodyText="body" textAlign="left" />

    <div class="overview-block">
      <div class="overview-cards">
        <!-- LEFT CARD (section surface) -->
        <div class="overview-card overview-card--section">
          <div class="overview-row overview-row--caption">
            <i class="fa-solid fa-heart icon-preview"></i>
            <span>Card caption</span>
          </div>

          <div class="overview-row overview-row--title">
            <div>Card title 1</div>
          </div>

          <div class="overview-row overview-row--text">
            <p>This is paragraph preview text.</p>
          </div>
        </div>

        <!-- RIGHT CARD (panel surface) -->
        <div class="overview-card overview-card--panel">
          <div class="overview-row overview-row--caption">
            <i class="fa-solid fa-link icon-preview"></i>
            <span>Card caption</span>
          </div>

          <div class="overview-row overview-row--title">
            <div>Card title 2</div>
          </div>

          <div class="overview-row overview-row--text">
            <p>This is paragraph preview text.</p>
          </div>
        </div>
      </div>

      <!-- ACCENT -->
      <div class="overview-accent">
        <p>Text on accent background</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

const { headline, body } = defineProps({
  headline: String,
  body: String,
});
</script>

<style scoped>
/* =========================================================
   LAYOUT
   ======================================================= */

.info-post {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.overview-block {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
}

.overview-cards {
  display: flex;
  gap: var(--space-25);
}

/* =========================================================
   CARD SURFACES
   ======================================================= */

.overview-card {
  flex: 1;
  padding: var(--space-10) var(--space-25);
  border-radius: var(--radius-md);
}

.overview-card--section {
  background: var(--ui-section-bg);
  color: var(--text-on-section);
}

.overview-card--panel {
  background: var(--ui-panel-bg);
  color: var(--text-on-panel);
}

/* titles override body text */
.overview-card--section .overview-row--title {
  color: var(--title-on-section);
}

.overview-card--panel .overview-row--title {
  color: var(--title-on-panel);
}

/* captions are shared */
.overview-row--caption {
  color: var(--ui-caption);
}

/* =========================================================
   ACCENT SURFACE
   ======================================================= */

.overview-accent {
  padding: var(--space-10) var(--space-25);
  border-radius: var(--radius-md);
  background: var(--dynamic-accent);
  color: var(--dynamic-text-accent);
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-title);
}

/* =========================================================
   ROW STRUCTURE
   ======================================================= */

.overview-row {
  display: flex;
  align-items: center;
  gap: var(--space-10);
  padding: var(--space-5) 0;
}

/* typography */
.overview-row--title {
  font-size: var(--fs-h4);
  line-height: var(--lh-heading);
}

.overview-row--text {
  font-size: var(--fs-body);
  line-height: var(--lh-body);
}

/* icon */
.icon-preview {
  font-size: 1.8rem;
}
</style>
