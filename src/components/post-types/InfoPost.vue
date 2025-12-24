<template>
  <div class="info-post" postType="info">
    <PostTextBlock v-if="zone === 'safe'" :headlineText="headline" :bodyText="body" />

    <div v-if="zone === 'safe'" class="info-block-flex">
      <div class="info-block">
        <div class="info-cards">
          <!-- LEFT CARD (alt-panel surface) -->
          <div class="info-card info-card--alt-panel">
            <div class="info-row info-row--caption">
              <i class="fa-solid fa-heart post-icon"></i>
              <span>inhoud</span>
            </div>

            <div class="info-row info-row--title">
              <div>Dit is 'info'</div>
            </div>

            <div class="info-row info-row--text">
              <div>Kies formaten om layouts te testen.</div>
            </div>
          </div>

          <!-- RIGHT CARD (panel surface) -->
          <div class="info-card info-card--panel">
            <div class="info-row info-row--caption">
              <i class="fa-solid fa-link post-icon"></i>
              <span>kleur</span>
            </div>

            <div class="info-row info-row--title">
              <div>Gekleurd...</div>
            </div>

            <div class="info-row info-row--text">
              <div>of niet, en allerlei achtergronden.</div>
            </div>
          </div>
        </div>

        <!-- ACCENT -->
        <div class="info-accent">
          <div>Je vindt een stijloverzicht rechts of onderaan. Kopieer met één klik!</div>
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
  zone: { type: String, required: true },
});
</script>

<style scoped>
/* =========================================================
   LAYOUT
   ======================================================= */

.info-post {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-block-flex {
  flex: 1;
  margin-bottom: 90px;
}

.info-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  flex: 1;
  gap: var(--space-10);
  padding: var(--space-10);
}

/* =========================================================
   CARD SURFACES
   ======================================================= */

.info-cards {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.info-card {
  flex: 0 1 48%;
  padding: var(--space-5) var(--space-10);
  border-radius: var(--border-radius); /* client input */
  border: var(--border-card); /* client input: border width only */
  box-shadow: var(--shadow-card); /* client input: XY distance,  blur */
}

.info-card--alt-panel {
  background: var(--ui-alt-panel-bg);
  color: var(--text-on-alt-panel); /* = dynamic text */
  opacity: var(--opacity-alt-panel);
}

.info-card--panel {
  background: var(--ui-panel-bg);
  color: var(--text-on-panel);
  opacity: var(--opacity-panel);
}

/* titles override body text */
.info-card--alt-panel .info-row--title {
  color: var(--title-on-alt-panel);
}

.info-card--panel .info-row--title {
  color: var(--title-on-panel);
}

/* captions are shared */
.info-row--caption {
  font-size: var(--fs-body-sm);
  font-weight: var(--fw-title);
}

.info-card--panel .info-row--caption {
  color: var(--dynamic-caption);
}
.info-card--alt-panel .info-row--caption {
  color: var(--dynamic-alt-caption);
}

/* =========================================================
   ACCENT SURFACE
   ======================================================= */

.info-accent {
  flex: 0 1 100%;
  padding: var(--space-10);
  border-radius: var(--border-radius); /* client input */
  border: var(--border-card); /* client input: border width only */
  box-shadow: var(--shadow-card); /* client input: XY distance,  blur */
  background: var(--dynamic-accent);
  color: var(--dynamic-text-accent);
  font-size: var(--fs-body-sm);
}

/* =========================================================
   ROW STRUCTURE
   ======================================================= */

.info-row {
  display: flex;
  gap: var(--space-10);
  padding-bottom: var(--space-5);
}

/* typography */
.info-row--title {
  font-size: var(--fs-h5);
  line-height: var(--lh-heading);
}

.info-row--text {
  font-size: var(--fs-body-xs);
  line-height: var(--lh-body);
}

/* icon */
.post-icon {
  font-size: var(--fs-body-sm);
  padding: var(--space-5) 0;
}
</style>
