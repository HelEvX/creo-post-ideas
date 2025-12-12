<template>
  <div class="info-post" postType="info">
    <PostTextBlock :headlineText="headline" :bodyText="body" textAlign="left" />

    <div class="overview-block">
      <!-- MAIN BACKGROUND -->
      <div class="overview-section main-bg">
        <div class="overview-title">Main Background</div>

        <div class="overview-row fg--accent">
          <i class="fa-solid fa-square-full icon-preview"></i>
          <span class="label">Icon</span>
        </div>

        <div class="overview-row fg--heading">
          <h2 class="title-preview">Title preview</h2>
        </div>

        <div class="overview-row fg--caption">
          <div class="caption-preview">Caption preview</div>
        </div>

        <div class="overview-row fg--text">
          <p class="paragraph-preview">This is paragraph preview text.</p>
        </div>

        <div class="overview-row fg--text-soft">
          <p class="footer-preview">Footer / metadata preview</p>
        </div>
      </div>

      <!-- CARD BACKGROUND -->
      <div class="overview-section card-bg">
        <div class="overview-title">Card Background</div>

        <div class="overview-row fg--accent">
          <i class="fa-solid fa-square-full icon-preview"></i>
          <span class="label">Icon</span>
        </div>

        <div class="overview-row fg--heading">
          <h3 class="title-preview">Card Title</h3>
        </div>

        <div class="overview-row fg--caption">
          <div class="caption-preview">Card caption text</div>
        </div>

        <div class="overview-row fg--text">
          <p class="paragraph-preview">Card paragraph preview text.</p>
        </div>
      </div>

      <!-- ACCENT BACKGROUND -->
      <div class="overview-section accent-bg">
        <div class="overview-title">Accent Background</div>

        <div class="overview-row fg--text-inverse">
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
.overview-block {
  margin-top: var(--space-30);
  display: flex;
  flex-direction: column;
  gap: var(--space-30);
  width: 100%;
}

/* Logical grouping */
.overview-section {
  padding: var(--space-20);
  border-radius: var(--radius-md);
  background: var(--ui-section-bg); /* default main background */
}

/* card background version */
.card-bg {
  background: var(--ui-panel-bg);
}

/* accent background version */
.accent-bg {
  background: var(--ui-accent);
}

/* Group label */
.overview-title {
  font-size: var(--fs-body-sm);
  opacity: 0.7;
  margin-bottom: var(--space-10);
  font-weight: var(--fw-title);
  text-transform: uppercase;
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
  opacity: 0.85;
}

.paragraph-preview {
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  margin: 0;
}

.footer-preview {
  font-size: var(--fs-body-sm);
  opacity: 0.6;
  margin: 0;
}

.accent-preview {
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-title);
}

/* icon */
.icon-preview {
  font-size: 1.8rem;
}

/* FG color mappings — matches contrastPairs exactly */
.fg--accent {
  color: var(--ui-accent);
}
.fg--heading {
  color: var(--ui-heading);
}
.fg--caption {
  color: var(--ui-caption);
}
.fg--text {
  color: var(--dynamic-text);
}
.fg--text-soft {
  color: var(--color-text-soft);
}
.fg--text-inverse {
  color: var(--color-text-inverse);
}

/* backgrounds */
.main-bg {
  background: var(--ui-section-bg);
}
.card-bg {
  background: var(--ui-panel-bg);
}
.accent-bg {
  background: var(--ui-accent);
}
</style>
