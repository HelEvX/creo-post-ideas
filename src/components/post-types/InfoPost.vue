<template>
  <div class="info-post" postType="info">
    <PostTextBlock :headlineText="headline" :bodyText="body" textAlign="left" />

    <div class="overview-block">
      <!-- MAIN BACKGROUND -->

      <div class="overview-cards">
        <div class="overview-section main-bg">
          <div class="overview-row fg--accent">
            <i class="fa-solid fa-square-full icon-preview"></i>
            <span class="label">Icon</span>
          </div>

          <div class="overview-row fg--heading">
            <div class="title-preview">Card title 1</div>
          </div>

          <div class="overview-row fg--caption">
            <div class="caption-preview">Card caption text 1</div>
          </div>

          <div class="overview-row fg--text">
            <p class="paragraph-preview">This is paragraph preview text.</p>
          </div>

          <div class="overview-row fg--text-soft">
            <p class="footer-preview">Terms & conditions</p>
          </div>
        </div>

        <!-- CARD BACKGROUND -->
        <div class="overview-section card-bg">
          <div class="overview-row fg--accent">
            <i class="fa-solid fa-square-full icon-preview"></i>
            <span class="label">Icon</span>
          </div>

          <div class="overview-row fg--heading">
            <div class="title-preview">Card Title 2</div>
          </div>

          <div class="overview-row fg--caption">
            <div class="caption-preview">Card caption text 2</div>
          </div>

          <div class="overview-row fg--text">
            <p class="paragraph-preview">This is paragraph preview text.</p>
          </div>

          <div class="overview-row fg--text-soft">
            <p class="footer-preview">Terms & conditions</p>
          </div>
        </div>
      </div>

      <!-- ACCENT BACKGROUND -->
      <div class="overview-section accent-bg">
        <div class="fg--text-inverse">
          <p class="accent-preview">Text on accent background</p>
        </div>
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
   OVERVIEW BLOCK CONTAINER
   ======================================================= */
.info-post {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.overview-block {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
}

/* Logical grouping */
.overview-section {
  padding: var(--space-10) var(--space-25);
  border-radius: var(--radius-md);
}

.overview-cards {
  display: flex;
  flex-direction: row;
  gap: var(--space-25);
  justify-content: space-between;
}

/* =========================================================
   INDIVIDUAL ROWS
   ======================================================= */
.overview-row {
  display: flex;
  align-items: center;
  gap: var(--space-10);
  padding: var(--space-5) 0;
}

/* mimic real sizes */
.title-preview {
  font-size: var(--fs-h4);
  line-height: var(--lh-heading);
  margin: 0;
  padding: 0;
}

.caption-preview {
  font-size: var(--fs-body-sm);
}

.paragraph-preview {
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  margin: 0;
}

.footer-preview {
  font-size: var(--fs-body-sm);
  margin: 0;
}

.accent-preview {
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-title);
  margin: var(--space-10) 0;
}

/* icon */
.icon-preview {
  font-size: 1.8rem;
}

/* =========================================================
   BACKGROUND COLOR MAPPINGS
   ======================================================= */

/* LEFT card 'REG' */
.main-bg {
  background: var(--ui-section-bg);
  flex: 1;
}

/* RIGHT card 'ALT' */
.card-bg {
  background: var(--ui-panel-bg);
  flex: 1;
}

/* BOTTOM card 'ACCENT' */
.accent-bg {
  background: var(--ui-accent);
}

/* =========================================================
   FOREGROUND COLOR MAPPINGS
   ======================================================= */

/* titles */
.main-bg .fg--heading {
  color: var(--mockup-title);
}

.card-bg .fg--heading {
  color: var(--mockup-title-on-card);
}

/* other text */
.fg--text {
  color: var(--dynamic-text);
}
.fg--text-soft {
  color: var(--text-soft-on-panel);
}

/* still need fixing */
.fg--caption {
  color: var(--ui-caption);
}
.fg--accent {
  color: var(--ui-accent);
}
.fg--text-inverse {
  color: var(--color-text-inverse);
}
</style>
