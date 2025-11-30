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
    <div v-if="showCornerShapes" class="corner-shape corner-shape--tl"></div>
    <div v-if="showCornerShapes" class="corner-shape corner-shape--br"></div>

    <!-- MAIN TEXT AREA -->
    <div class="post-content">
      <!-- LABEL -->
      <div v-if="showLabel" class="post-label" :class="[`label--${labelSize}`, `label-color--${labelColor}`]">
        <div v-if="labelIcon" class="post-label__icon">
          <img class="post-label-icon__img" :src="logoDefault" alt="" />
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
      <img class="post-watermark__img" :src="logoInverse" alt="" />
    </div>

    <!-- DIAGONAL SHAPES (SVG overlay) -->
    <img v-if="shapesSrc" class="post-shapes" :src="shapesSrc" alt="" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import logoDefault from "@/assets/img/logo-default.svg";
import logoInverse from "@/assets/img/logo-inverse.svg";

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
/* -----------------------------------------------------
   STRUCTURE + TOKENS
----------------------------------------------------- */

.social-post {
  position: relative;
  aspect-ratio: var(--mockup-aspect);
  width: 54rem;
  --pad-h: var(--space-40);
  --pad-v: var(--space-50);
}

/* Stack: icon → label → title → subtitle */
.post-content {
  position: absolute;
  left: var(--space-40); /* 40px consistent margin left */
  bottom: var(--space-75); /* 75px spacing matches agency style */
  max-width: 70%;
  color: var(--ui-inverse);
}

.post-icon {
  margin-bottom: var(--space-30);
}

.post-label {
  margin-bottom: var(--space-30);
}

.post-title {
  margin-bottom: var(--space-20);
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

/* hand picked */

.bg--triangles-grid .post-bg__pattern {
  --s: 200px; /* control the size*/
  --c1: #dc9d37;
  --c2: #fed450;
  --c3: #125c65;
  --c4: #bc4a33;
  --c5: #ffffff;

  --_g: var(--c1) 25%, var(--c2) 0 50%, #0000 0;
  --_l1: var(--c5) 0 1px, #0000 0 calc(25% - 1px), var(--c5) 0 25%;
  --_l2: var(--c5) 0 1px, #0000 0 calc(50% - 1px), var(--c5) 0 50%;
  background: repeating-linear-gradient(45deg, var(--_l1)), repeating-linear-gradient(-45deg, var(--_l1)),
    repeating-linear-gradient(0deg, var(--_l2)), repeating-linear-gradient(90deg, var(--_l2)),
    conic-gradient(from 135deg at 25% 75%, var(--_g)), conic-gradient(from 225deg at 25% 25%, var(--_g)),
    conic-gradient(from 45deg at 75% 75%, var(--_g)), conic-gradient(from -45deg at 75% 25%, var(--_g)),
    repeating-conic-gradient(var(--c3) 0 45deg, var(--c4) 0 90deg);
  background-size: var(--s) var(--s);
}

/* -----------------------------------------------------
   ASPECT RATIOS (5 IG formats)
----------------------------------------------------- */

.size--square {
  aspect-ratio: 1 / 1;
}
.size--portrait {
  aspect-ratio: 1080 / 1350;
}
.size--story {
  aspect-ratio: 1080 / 1920;
}
.size--landscape {
  aspect-ratio: 1200 / 630;
}
.size--cover {
  aspect-ratio: 1584 / 396;
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
  background: rgba(0, 0, 0, 0.35);
}

/* -----------------------------------------------------
   CORNER SHAPES
----------------------------------------------------- */

.corner-shape {
  position: absolute;
  width: 20%;
  height: 20%;
  background: var(--color-primary);
}

.corner-shape--tl {
  top: 0;
  left: 0;
}
.corner-shape--br {
  bottom: 0;
  right: 0;
}

/* -----------------------------------------------------
   MAIN CONTENT AREA
----------------------------------------------------- */

.post-content {
  position: absolute;
  left: var(--pad-h);
  bottom: calc(var(--pad-v) * 1.8);
  max-width: 70%;
  color: var(--ui-inverse);
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
  display: inline-block;
  right: var(--pad-h);
  bottom: var(--pad-v);
}

.post-watermark__img {
  width: 6rem;
  height: 6rem;
  object-fit: contain;
  opacity: 0.5;
}

/* -----------------------------------------------------
   DIAGONAL SHAPES OVERLAY
----------------------------------------------------- */

.post-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
