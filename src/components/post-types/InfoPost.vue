<template>
  <div class="info-post" postType="info">
    <PostTextBlock v-if="zone === 'safe'" :headlineText="headline" :bodyText="body" />

    <div v-if="zone === 'safe'">
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
  display: flex;
  flex-direction: column;
}

.info-block {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  flex: 1;
  gap: clamp(0.4em, 1.6cqw, 1em);
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
  padding: clamp(0.4em, 1.4cqw, 1em) clamp(0.6em, 1.8cqw, 1.6em);
  border-radius: var(--border-radius); /* client input */
  border: var(--border-card); /* client input: border width only */
  box-shadow: var(--shadow-card); /* client input: XY distance,  blur */
}

.info-card--alt-panel {
  background: var(--ui-alt-panel-bg-derived);
  color: var(--dynamic-text);
}

.info-card--panel {
  background: var(--ui-panel-bg);
  color: var(--text-on-panel);
}

/* titles override body text */
.info-card--alt-panel .info-row--title {
  color: var(--dynamic-title);
}

.info-card--panel .info-row--title {
  color: var(--title-on-panel);
}

/* captions are shared */
.info-row--caption {
  font-size: var(--fs-body);
  font-weight: var(--fw-title);
}

.info-card--panel .info-row--caption {
  color: var(--ui-primary-bg);
}
.info-card--alt-panel .info-row--caption {
  color: var(--ui-secondary-bg);
}

/* =========================================================
   ACCENT SURFACE
   ======================================================= */

.info-accent {
  flex: 0 1 100%;
  padding: clamp(0.4em, 1.4cqw, 1em) clamp(0.6em, 1.8cqw, 1.6em);
  border-radius: var(--border-radius); /* client input */
  border: var(--border-card); /* client input: border width only */
  box-shadow: var(--shadow-card); /* client input: XY distance,  blur */
  font-size: var(--fs-body-xs);
}

.post-content--primary .info-accent {
  background: var(--ui-secondary-bg);
  color: var(--text-on-secondary);
}

.post-content--secondary .info-accent {
  background: var(--ui-primary-bg);
  color: var(--text-on-primary);
}

/* =========================================================
   ROW STRUCTURE
   ======================================================= */

.info-row {
  display: flex;
  gap: clamp(0.4em, 1.6cqw, 1em);
  padding-bottom: clamp(0.25em, 0.9cqw, 0.5em);
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
  padding: clamp(0.25em, 0.9cqw, 0.5em) 0;
}
</style>
