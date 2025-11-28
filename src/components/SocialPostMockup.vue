<template>
  <div
    class="social-post"
    :class="[
      `size--${size}`,
      `bg--${backgroundType}`,
      showCornerShapes ? 'has-shapes' : 'no-shapes',
      showBrand ? 'has-brand' : 'no-brand',
      showLabel ? 'has-label' : 'no-label',
      showQuote ? 'has-quote' : 'no-quote',
    ]">
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
import photo from "@/assets/img/stockphoto.webp";
import logoInverse from "@/assets/img/logo-inverse.svg";
import logoDefault from "@/assets/img/logo-default.svg";

defineProps({
  size: { type: String, default: "portrait" },

  /* background modes: midnight-dark | midnight-light | main | pattern-dark | pattern-light | none */
  backgroundType: { type: String, default: "midnight-dark" },

  /* controls the actual presence of the photo layer */
  usePhoto: { type: Boolean, default: true },

  /* photo asset */
  photoSrc: { type: String, default: photo },

  /* SVG diagonal shapes */
  shapesSrc: { type: String, default: "" },

  /* content */
  showBrand: { type: Boolean, default: true },
  showCornerShapes: { type: Boolean, default: true },

  showLabel: { type: Boolean, default: true },
  labelSize: { type: String, default: "large" },
  labelColor: { type: String, default: "green" },
  labelIcon: { type: Boolean, default: true },
  labelText: { type: String, default: "Label text" },

  title: { type: String, default: "Lorem ipsum dolor sit amet consectetur." },
  subtitle: {
    type: String,
    default: "Lorem ipsum dolor sit amet consectetur. Turpis.",
  },

  showQuote: { type: Boolean, default: false },
  quote: { type: String, default: "This is a quote." },
});
</script>

<style scoped>
/* -----------------------------------------------------
   STRUCTURE + TOKENS
----------------------------------------------------- */

.social-post {
  position: relative;
  width: 100%;
  overflow: hidden;

  --pad-h: var(--space-40);
  --pad-v: var(--space-75);
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
