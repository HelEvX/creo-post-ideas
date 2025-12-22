<template>
  <div class="info-post" postType="info">
    <PostTextBlock :headlineText="headline" :bodyText="body" textAlign="left" />

    <div class="overview-block">
      <div class="overview-cards">
        <!-- LEFT CARD (section surface) -->
        <div class="overview-card overview-card--section">
          <div class="overview-row overview-row--caption">
            <i class="fa-solid fa-heart icon-preview"></i>
            <span>Kies je opmaak</span>
          </div>

          <div class="overview-row overview-row--title">
            <div>Dit is 'info'</div>
          </div>

          <div class="overview-row overview-row--text">
            <div>Kies een ander formaat om te testen.</div>
          </div>
        </div>

        <!-- RIGHT CARD (panel surface) -->
        <div class="overview-card overview-card--panel">
          <div class="overview-row overview-row--caption">
            <i class="fa-solid fa-link icon-preview"></i>
            <span>Kies je achtergrond</span>
          </div>

          <div class="overview-row overview-row--title">
            <div>Zet 'kleurrijk' aan of uit</div>
          </div>

          <div class="overview-row overview-row--text">
            <div>Kies daarna een achtergrond uit de lijst.</div>
          </div>
        </div>
      </div>

      <!-- ACCENT -->
      <div class="overview-accent">
        <p>Je vindt de verzameling stijlkenmerken in het rechterpaneel. Deze kan je met een klik kopiëren.</p>
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
  flex-direction: row;
  gap: var(--space-20);
  flex-wrap: wrap;
}

/* =========================================================
   CARD SURFACES
   ======================================================= */

.overview-cards {
  display: flex;
  flex: 60%;
  gap: var(--space-25);
}

.overview-card {
  flex: 1;
  padding: var(--space-10) var(--space-25);
  border-radius: var(--radius-card); /* client input */
  box-shadow: var(--shadow-card); /* client input */
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
  padding: var(--space-20) var(--space-30);
  border-radius: var(--radius-md);
  background: var(--dynamic-accent);
  color: var(--dynamic-text-accent);
  font-size: var(--fs-body-lg);
  font-weight: var(--fw-title);
  flex: 40%;
}
.overview-accent p {
  margin-bottom: 0;
}

/* =========================================================
   ROW STRUCTURE
   ======================================================= */

.overview-row {
  display: flex;
  gap: var(--space-10);
  padding: var(--space-5) 0;
}

/* typography */
.overview-row--title {
  font-size: var(--fs-h5);
  line-height: var(--lh-heading);
}

.overview-row--text {
  font-size: var(--fs-body);
  line-height: var(--lh-body);
}

/* icon */
.icon-preview {
  font-size: 1.8rem;
  padding: var(--space-5) 0;
}
</style>
