<template>
  <div class="info-post" postType="info">
    <PostTextBlock v-if="zone === 'safe'" :titleText="title" :bodyText="body" align="center" bodyAlign="left" />

    <div v-if="zone === 'safe'" class="info-block">
      <div class="cards">
        <!-- LEFT CARD (alt-panel surface) -->
        <div class="card alt-panel">
          <div class="card__caption">
            <i class="fa-solid fa-heart post-icon"></i>
            <span>inhoud</span>
          </div>

          <div class="card__title">
            <div>6 types</div>
          </div>

          <div class="card__text">
            <div>Voorbeelden dienen als inspiratie.</div>
          </div>
        </div>

        <!-- RIGHT CARD (panel surface) -->
        <div class="card panel">
          <div class="card__caption">
            <i class="fa-solid fa-link post-icon"></i>
            <span>achtergrond</span>
          </div>

          <div class="card__title">
            <div>Kleuropties</div>
          </div>

          <div class="card__text">
            <div>Gebaseerd op je logo of een stockfoto.</div>
          </div>
        </div>
      </div>

      <!-- ACCENT -->
      <div class="card accent">
        <div class="accent card__caption">
          <i class="fa-solid fa-link post-icon"></i>
          <span>Check het contrast</span>
        </div>

        <div class="accent card__text">
          <div>Je vindt een stijloverzicht rechts of onderaan. Kopieer met één klik!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

const { title, body } = defineProps({
  title: String,
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
  gap: 0.5em;
  margin-top: clamp(0.6em, 2cqw, 0.8em);
}
</style>
