<template>
  <div
    class="social-post"
    :style="{ '--mockup-aspect': aspectRatio }"
    :class="[`size--${size}`, `bg--${backgroundType}`]">
    <!-- BACKGROUND LAYER STACK -->
    <div class="post-bg">
      <!-- COLOR LAYER (midnight, light, main…) -->
      <div class="post-bg__color"></div>

      <!-- PATTERN LAYER -->
      <div class="post-bg__pattern"></div>

      <!-- PHOTO LAYER -->
      <div
        v-if="usePhoto"
        class="post-bg__image"
        :style="{
          backgroundImage: `url(${photoSrc})`,
        }"></div>

      <!-- OVERLAY (darkening layer for readability) -->
      <div class="post-bg__overlay"></div>
    </div>

    <!-- CORNER SHAPES (green triangles from mockup) -->
    <div v-if="showCornerShapes" class="corner-shape square corner-shape--bl"></div>
    <div v-if="showCornerShapes" class="corner-shape rect corner-shape--br"></div>

    <!-- MAIN TEXT AREA -->
    <div class="post-content">
      <!-- LABEL -->
      <div v-if="showLabel" class="post-label" :class="[`label--${labelSize}`, `label-color--${labelColor}`]">
        <div v-if="labelIcon" class="post-label__icon">
          <i class="fa-solid fa-circle-info"></i>
        </div>
        <div class="post-label__text">{{ labelText }}</div>
      </div>

      <!-- TITLE + SUBTITLE -->
      <div class="post-title">{{ title }}</div>
      <div class="post-subtitle">{{ subtitle }}</div>

      <!-- QUOTE -->
      <div v-if="showQuote" class="post-quote">
        <div class="post-quote__icon"></div>
        <div class="post-quote__text">{{ quote }}</div>
      </div>
    </div>

    <!-- WATERMARK (bottom-right green block) -->
    <div class="post-watermark" v-if="showBrand">
      <BrandWatermark />
    </div>

    <!-- DIAGONAL SHAPES (SVG overlay) -->
    <img v-if="shapesSrc" class="post-shapes" :src="shapesSrc" alt="" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import BrandWatermark from "@/components/BrandWatermark.vue";

const props = defineProps({
  size: String,
  backgroundType: String,
  usePhoto: Boolean,
  photoSrc: String,
  showBrand: Boolean,
  showCornerShapes: Boolean,
  showLabel: Boolean,
  labelSize: String,
  labelColor: String,
  labelIcon: Boolean,
  labelText: String,
  title: String,
  subtitle: String,
  showQuote: Boolean,
  quote: String,
  shapesSrc: String,
});

const aspectRatio = computed(() => {
  switch (props.size) {
    case "square":
      return "1 / 1";
    case "portrait":
      return "1080 / 1350";
    case "story":
      return "1080 / 1920";
    case "landscape":
      return "1200 / 630";
    case "cover":
      return "1584 / 396";
    default:
      return "1080 / 1350";
  }
});
</script>

<style scoped>
/* BASE SAFE ZONE (fallback) */
.social-post {
  --safe-left: 2.5rem;
  --safe-right: 2.5rem;
  --safe-top: 2.5rem;
  --safe-bottom: 2.5rem;
}

/* -----------------------------------------------------
   STRUCTURE + TOKENS
----------------------------------------------------- */

.social-post {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: var(--mockup-aspect);
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}

.size--square {
  --safe-left: var(--safe-square-left);
  --safe-right: var(--safe-square-right);
  --safe-top: var(--safe-square-top);
  --safe-bottom: var(--safe-square-bottom);
}

.size--portrait {
  --safe-left: var(--safe-portrait-left);
  --safe-right: var(--safe-portrait-right);
  --safe-top: var(--safe-portrait-top);
  --safe-bottom: var(--safe-portrait-bottom);
}

.size--landscape {
  --safe-left: var(--safe-landscape-left);
  --safe-right: var(--safe-landscape-right);
  --safe-top: var(--safe-landscape-top);
  --safe-bottom: var(--safe-landscape-bottom);
}

.size--story {
  --safe-left: var(--safe-story-left);
  --safe-right: var(--safe-story-right);
  --safe-top: var(--safe-story-top);
  --safe-bottom: var(--safe-story-bottom);
}

/* -----------------------------------------------------
   CSS PATTERNS (css-pattern.com)
----------------------------------------------------- */

/* placeholder */
.bg--midnight-dark .post-bg__pattern {
  background: var(--secondary-700);
  opacity: 0.15;
}

.bg--midnight-light .post-bg__color {
  background: var(--secondary-500);
  opacity: 0.15;
}

.bg--main .post-bg__color {
  background: var(--color-primary);
  opacity: 0.15;
}

/* starter pack */

.bg--pattern-dots .post-bg__pattern {
  background-image: radial-gradient(var(--color-primary-light) 1px, transparent 1px);
  background-size: 1.6rem 1.6rem;
  opacity: 0.18;
}

.bg--pattern-lines .post-bg__pattern {
  background-image: repeating-linear-gradient(
    45deg,
    var(--color-primary-light) 0,
    var(--color-primary-light) 1rem,
    transparent 1rem,
    transparent 2rem
  );
  opacity: 0.12;
}

.bg--pattern-grid .post-bg__pattern {
  background-image: linear-gradient(var(--color-primary-light) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-primary-light) 1px, transparent 1px);
  background-size: 2rem 2rem;
  opacity: 0.1;
}

.bg--pattern-noise .post-bg__pattern {
  background-image: url("data:image/svg+xml,%3Csvg ... %3E");
  opacity: 0.25;
}

/* -----------------------------------------------------
   BACKGROUND LAYERS
----------------------------------------------------- */

.post-bg {
  position: absolute;
  inset: 0;
}

/* All background layers use CSS tokens */
.post-bg__color,
.post-bg__pattern,
.post-bg__image,
.post-bg__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Photo */
.post-bg__image {
  background-size: cover;
  background-position: center;
}

/* Overlay */
.post-bg__overlay {
  background: var(--color-secondary);
  opacity: 0.6;
}

/* -----------------------------------------------------
   CORNER SHAPES
----------------------------------------------------- */

.corner-shape.square {
  position: absolute;
  height: 40%;
  aspect-ratio: 1 / 1;
  clip-path: polygon(0 0, 100% 100%, 0 100%, 0 0);
  background: var(--color-primary);
  opacity: 0.2;
}

.corner-shape.rect {
  position: absolute;
  height: 30%;
  aspect-ratio: 2 / 1;
  clip-path: polygon(0 0, 100% 100%, 0 100%, 0 0);
  background: var(--color-primary);
  opacity: 0.2;
}

.corner-shape--tl {
  top: 0;
  left: 0;
  transform: scaleY(-1);
}
.corner-shape--tr {
  top: 0;
  right: 0;
  transform: scale(-1, -1);
}
.corner-shape--bl {
  bottom: 0;
  left: 0;
}
.corner-shape--br {
  bottom: 0;
  right: 0;
  transform: scaleX(-1);
}

/* -----------------------------------------------------
   MAIN CONTENT AREA
----------------------------------------------------- */

/* Stack: icon → label → title → subtitle */
.post-content {
  position: absolute;
  inset: 0; /* fill the post */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  color: var(--ui-inverse);

  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);

  max-width: none; /* no limiting */
}

/* Title + subtitle */
.post-title {
  font-family: var(--font-title);
  font-size: var(--fs-h2);
  line-height: var(--lh-heading);
  margin-bottom: var(--space-20);
}

.post-subtitle {
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body);
}

/* -----------------------------------------------------
   LABEL BLOCK
----------------------------------------------------- */

.post-label {
  display: flex;
  gap: var(--space-10);
  align-items: center;
  margin-bottom: var(--space-30);
}

.post-label__icon {
  width: 4rem;
  height: 4rem;
}

.post-label__icon i {
  font-size: 40px;
}

.post-label-icon__img {
  object-fit: contain;
}

.label--large {
  font-size: var(--fs-body-lg);
}
.label--small {
  font-size: var(--fs-body-sm);
}

/* -----------------------------------------------------
   QUOTE BLOCK
----------------------------------------------------- */

.post-quote {
  display: flex;
  gap: var(--space-20);
  margin-top: var(--space-30);
}

.post-quote__icon {
  width: 3rem;
  height: 3rem;
  background: var(--color-primary-light);
  border-radius: var(--radius-sm);
}

/* -----------------------------------------------------
   WATERMARK (bottom-right)
----------------------------------------------------- */

.post-watermark {
  position: absolute;
  right: var(--safe-right);
  bottom: var(--safe-bottom);
  width: 4rem;
  height: 4rem;
  opacity: 0.6;
}

/* -----------------------------------------------------
   STORY — HEIGHT-DOMINANT SIZING FIX
   ----------------------------------------------------- */

.size--story {
  height: 700px; /* or clamp(...) later */
  max-height: 700px;
  width: auto;
  aspect-ratio: 9 / 16;
  max-width: none;
}
</style>
