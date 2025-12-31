<template>
  <div class="info-post" postType="info">
    <PostTextBlock v-if="zone === 'safe'" :headlineText="headline" :bodyText="body" align="center" bodyAlign="left" />

    <div v-if="zone === 'safe'">
      <div class="info-block">
        <div class="info-cards">
          <!-- LEFT CARD (alt-panel surface) -->
          <div class="info-card info-card__alt-panel">
            <div class="info-row info-row__caption">
              <i class="fa-solid fa-heart post-icon"></i>
              <span>inhoud</span>
            </div>

            <div class="info-row info-row__title">
              <div>6 types</div>
            </div>

            <div class="info-row info-row__text">
              <div>Voorbeelden dienen als inspiratie.</div>
            </div>
          </div>

          <!-- RIGHT CARD (panel surface) -->
          <div class="info-card info-card__panel">
            <div class="info-row info-row__caption">
              <i class="fa-solid fa-link post-icon"></i>
              <span>achtergrond</span>
            </div>

            <div class="info-row info-row__title">
              <div>Kleuropties</div>
            </div>

            <div class="info-row info-row__text">
              <div>Gebaseerd op je logo of een stockfoto.</div>
            </div>
          </div>
        </div>

        <!-- ACCENT -->
        <div class="info-accent">
          <div class="info-accent__caption">
            <i class="fa-solid fa-link post-icon"></i>
            <span>Check het contrast</span>
          </div>

          <div class="info-accent__text">
            <div>Je vindt een stijloverzicht rechts of onderaan. Kopieer met één klik!</div>
          </div>
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
  justify-content: space-evenly;
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
  gap: clamp(0.4em, 1.6cqw, 1em);
}

.info-card {
  padding: clamp(0.4em, 1.4cqw, 1em);
  border-radius: var(--border-radius); /* client input */
  border: var(--border-card); /* client input: border width only */
  box-shadow: var(--shadow-card); /* client input: XY distance,  blur */
}

.info-row__caption {
  font-size: var(--fs-h6);
  font-weight: var(--fw-title);
  align-items: baseline;
}

/* left panel */

.info-card__alt-panel {
  background: var(--ui-alt-panel-bg);
  color: var(--text-on-alt-panel);
}

.info-card__alt-panel .info-row__text {
  color: var(--text-on-alt-panel);
}

.info-card__alt-panel .info-row__caption {
  color: var(--caption-on-alt-panel);
}

.info-card__alt-panel .info-row__title {
  color: var(--title-on-alt-panel);
}

/* right panel */

.info-card__panel {
  background: var(--ui-panel-bg);
  color: var(--text-on-panel);
}

.info-card__panel .info-row__text {
  color: var(--text-on-panel);
}

.info-card__panel .info-row__caption {
  color: var(--caption-on-panel);
}

.info-card__panel .info-row__title {
  color: var(--title-on-panel);
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

.info-accent {
  background: var(--ui-accent-bg);
  color: var(--text-on-accent);
}

.info-accent__text {
  color: var(--text-on-accent);
}

.info-accent__caption {
  display: flex;
  gap: clamp(0.2em, 0.8cqw, 0.5em);
  font-size: var(--fs-h6);
  font-weight: var(--fw-title);
  align-items: baseline;
  color: var(--caption-on-accent);
}

/* =========================================================
   ROW STRUCTURE
   ======================================================= */

.info-row {
  display: flex;
  gap: clamp(0.2em, 0.8cqw, 0.5em);
}

/* typography */
.info-row__title {
  font-size: var(--fs-h5);
  line-height: var(--lh-heading);
}

.info-row__text {
  font-size: var(--fs-body-xs);
  line-height: var(--lh-body);
}

/* icon */
.post-icon {
  font-size: var(--fs-h6);
}
</style>
