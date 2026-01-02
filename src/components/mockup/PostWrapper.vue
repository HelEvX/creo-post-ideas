<template>
  <div class="post-wrapper" :class="`size--${size}`" :style="{ aspectRatio: aspectMap[size] }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  size: { type: String, required: true },
});

const aspectMap = {
  square: "1 / 1",
  portrait: "4 / 5",
  story: "9 / 16",
  landscape: "16 / 9",
};
</script>

<style>
.post-wrapper {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  border-radius: 0.2em; /* hard-coded */
  overflow: hidden;
  box-shadow: var(--ui-shadow-sm);
  container-type: inline-size;
}

/* ======================================================
   MOCKUP TYPOGRAPHY — container-scaled
   ====================================================== */

.post-wrapper {
  --fs-h1: calc(10cqw * var(--mockup-font-compensation));
  --fs-h2: calc(7.5cqw * var(--mockup-font-compensation));
  --fs-h3: calc(6.5cqw * var(--mockup-font-compensation));
  --fs-h4: calc(5cqw * var(--mockup-font-compensation));
  --fs-h5: calc(4cqw * var(--mockup-font-compensation));
  --fs-h6: calc(3cqw * var(--mockup-font-compensation));

  --fs-body-lg: calc(4cqw * var(--mockup-font-compensation));
  --fs-body: calc(3.5cqw * var(--mockup-font-compensation));
  --fs-body-sm: calc(2.8cqw * var(--mockup-font-compensation));
  --fs-body-xs: calc(2cqw * var(--mockup-font-compensation));

  --lh-body: 1.5;
  --lh-heading: 1.2;
  --lh-display: 1;
}

/* ======================================================
   PER-FORMAT TYPO SCALE
   ====================================================== */

.size--landscape.post-wrapper {
  --mockup-font-compensation: 0.6;
}
.size--square.post-wrapper {
  --mockup-font-compensation: 1;
}
.size--portrait.post-wrapper {
  --mockup-font-compensation: 1.1;
}
.size--story.post-wrapper {
  --mockup-font-compensation: 1.2;
}

/* ======================================================
   WIDTH RULES
   ====================================================== */

.size--landscape.post-wrapper {
  width: 100%;
}
.size--square.post-wrapper,
.size--portrait.post-wrapper,
.size--story.post-wrapper {
  width: min(100%, calc(100vh * (1080 / 1920)));
}

/* ======================================================
   GENERAL STYLES
   ====================================================== */

/* --------------
   CARD STRUCTURE
   -------------- */

.cards {
  display: flex;
  gap: var(--card-gap);
  flex: 1;
}

.card {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--card-gap);
  padding: var(--card-padding);

  border-radius: var(--card-radius); /* client input */
  border: var(--border-card); /* client input: border width only */
  box-shadow: var(--shadow-card); /* client input: XY distance,  blur */
}

/* padding adjustments */

.size--landscape .cards {
  gap: 0.8cqw;
}

.size--landscape .card {
  padding: 1cqw;
  gap: 0.5cqw;
}

.size--square .card {
  padding: 1.5cqw;
  gap: 0.5cqw;
}

/* ------------
   CARD SURFACES
   ------------ */

.panel {
  background: var(--ui-panel-bg);
}

.alt-panel {
  background: var(--ui-alt-panel-bg);
}

.accent {
  background: var(--ui-accent-bg);
}

/* ---------------
   CARD TEXT ROLES
   --------------- */

.card__caption {
  display: flex;
  gap: 0.25em;
  align-items: baseline;

  font-size: var(--fs-h6);
  font-weight: var(--fw-title);
}

.card__title {
  font-size: var(--fs-h5);
  font-weight: var(--fw-title);
  line-height: var(--lh-heading);
}

.card__text {
  font-size: var(--fs-body);
  line-height: var(--lh-body);
}

/* ---------------
   COLOR BINDINGS
   --------------- */

/* title */
.panel .card__title {
  color: var(--title-on-panel);
}
.alt-panel .card__title {
  color: var(--title-on-alt-panel);
}

/* text */
.panel .card__text {
  color: var(--text-on-panel);
}
.alt-accent .card__text {
  color: var(--text-on-alt-panel);
}
.accent .card__text {
  color: var(--text-on-accent);
}

/* captions */
.panel .card__caption {
  color: var(--caption-on-panel);
}
.alt-panel .card__caption {
  color: var(--caption-on-alt-panel);
}
.accent .card__caption {
  color: var(--caption-on-accent);
}
</style>
