<template>
  <div class="headline-post">
    <PostTextBlock
      v-if="zone === 'safe'"
      :captionText="caption"
      :captionIcon="icon"
      :headlineText="headline"
      :subtitleText="subtitle"
      textAlign="left" />
    <div v-if="zone === 'safe'" class="arrow-wrapper">
      <div class="arrow"></div>
    </div>

    <div v-else class="post__decor">
      <div v-if="brandDecorSrc">
        <img class="brand-decor-image" :src="brandDecorSrc" alt="" />
      </div>

      <div v-else-if="brandSlug === 'creo'">
        <div class="corner-shape corner-shape--bl"></div>
        <div class="corner-shape corner-shape--br"></div>
        <div class="corner-shape corner-shape--tl"></div>
        <div class="corner-shape corner-shape--tr"></div>
      </div>

      <div v-else-if="brandSlug === 'hopsakee'">
        <div class="wavy-border wavy-border--top"></div>
        <div class="wavy-border wavy-border--bottom"></div>
      </div>

      <div v-else-if="brandSlug === 'runkstervolksfeesten'">
        <div class="ribbon ribbon--left">
          <svg class="ribbon" viewBox="0 0 408.55 275.1" aria-hidden="true">
            <path
              d="M101.04,200.01c2.62,1.03,5.46-.88,5.46-3.69v-36s3.24-96.23,118.22-53.35c1.85.69,3.82-.72,3.75-2.69l-.93-27.3c-.53-15.54,3.11-31.02,10.96-44.44,12.63-21.59,38.78-43.18,92.06-26.72,11.1,3.43,22.86,3.86,34.19,1.29,12.05-2.73,29.14-.83,41.15,24.48,12.54,27.63-18.93,77.18-104.02,43.16-1.34-.53-2.76.55-2.6,1.99,2.42,21.5,10.51,142.06-120.46,91.75-.93-.36-1.91.38-1.81,1.37,1.91,18.1,10.47,141.95-119,94.49-2.27-.83-4.79-.66-6.93.47-7.52,3.94-26.81,11.37-41.67-6.17C-8.32,237.72.11,205.43,25.5,195.07c17.44-7.12,42.8-7.89,75.54,4.94Z" />
            />
          </svg>
        </div>
        <div class="ribbon ribbon--center">
          <svg class="ribbon" viewBox="0 0 408.55 275.1" aria-hidden="true">
            <path
              d="M101.04,200.01c2.62,1.03,5.46-.88,5.46-3.69v-36s3.24-96.23,118.22-53.35c1.85.69,3.82-.72,3.75-2.69l-.93-27.3c-.53-15.54,3.11-31.02,10.96-44.44,12.63-21.59,38.78-43.18,92.06-26.72,11.1,3.43,22.86,3.86,34.19,1.29,12.05-2.73,29.14-.83,41.15,24.48,12.54,27.63-18.93,77.18-104.02,43.16-1.34-.53-2.76.55-2.6,1.99,2.42,21.5,10.51,142.06-120.46,91.75-.93-.36-1.91.38-1.81,1.37,1.91,18.1,10.47,141.95-119,94.49-2.27-.83-4.79-.66-6.93.47-7.52,3.94-26.81,11.37-41.67-6.17C-8.32,237.72.11,205.43,25.5,195.07c17.44-7.12,42.8-7.89,75.54,4.94Z" />
            />
          </svg>
        </div>
        <div class="ribbon ribbon--right">
          <svg class="ribbon" viewBox="0 0 408.55 275.1" aria-hidden="true">
            <path
              d="M101.04,200.01c2.62,1.03,5.46-.88,5.46-3.69v-36s3.24-96.23,118.22-53.35c1.85.69,3.82-.72,3.75-2.69l-.93-27.3c-.53-15.54,3.11-31.02,10.96-44.44,12.63-21.59,38.78-43.18,92.06-26.72,11.1,3.43,22.86,3.86,34.19,1.29,12.05-2.73,29.14-.83,41.15,24.48,12.54,27.63-18.93,77.18-104.02,43.16-1.34-.53-2.76.55-2.6,1.99,2.42,21.5,10.51,142.06-120.46,91.75-.93-.36-1.91.38-1.81,1.37,1.91,18.1,10.47,141.95-119,94.49-2.27-.83-4.79-.66-6.93.47-7.52,3.94-26.81,11.37-41.67-6.17C-8.32,237.72.11,205.43,25.5,195.07c17.44-7.12,42.8-7.89,75.54,4.94Z" />
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import PostTextBlock from "../mockup/PostTextBlock.vue";

const props = defineProps({
  caption: String,
  headline: String,
  subtitle: String,
  icon: String,
  zone: { type: String, required: true },
  brandSlug: { type: String, required: true },
});

const brandDecorMap = {
  caffepiu: "/images/meet-caffe-piu.webp",
  lilistea: "/images/lilistea-leaf.png",
  cashandco: "/images/graantje-links.png",
};

const brandDecorSrc = brandDecorMap[props.brandSlug] || null;

onMounted(() => {
  console.log("HeadlinePost", props.zone, props.brandSlug);
});
</script>

<style scoped>
.headline-post {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.headline-post .post-text-block {
  height: 100%;
  justify-content: center;
}

/* arrow */
.arrow-wrapper {
  position: relative;
  flex: 0 1 30%;
}
.arrow {
  position: absolute;
  left: 50%;
  top: 0;
  width: 80%;
  height: auto;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

/* shaft */
.arrow::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 0.67cqw;
  background: var(--dynamic-soft);
}

/* arrowhead */
.arrow::after {
  content: "";
  position: absolute;
  right: 0;
  width: 3cqw;
  height: 3cqw;
  border-right: 0.8cqw solid var(--dynamic-soft);
  border-bottom: 0.8cqw solid var(--dynamic-soft);
  transform: rotate(-45deg);
}

.size--landscape .arrow::before {
  height: 0.5cqw;
}

.size--landscape .arrow::after {
  width: 3cqw;
  height: 3cqw;
  border-width: 0.5cqw;
}

/* FREE ZONE positioning */

.post__decor {
  position: relative;
  height: 100%;
  width: 100%;
}

.post__decor > div {
  position: absolute;
  inset: 0;
}

/* ===================== */
/* CREO corner triangles */
/* ===================== */

.corner-shape {
  position: absolute;
  background: currentColor;
  clip-path: polygon(0 0, 100% 100%, 0 100%, 0 0);
  opacity: var(--pattern-opacity);
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

/* ------------------ */
/* per-post triangles */
/* ------------------ */

/* portrait */
.size--portrait .corner-shape--bl {
  aspect-ratio: 1 / 1;
  height: 40%;
}
.size--portrait .corner-shape--br {
  aspect-ratio: 5 / 4;
  height: 50%;
}

/* square */
.size--square .corner-shape--bl {
  aspect-ratio: 1 / 1;
  height: 40%;
}
.size--square .corner-shape--br {
  aspect-ratio: 4 / 3;
  height: 60%;
}

/* landscape */
.size--landscape .corner-shape--bl {
  aspect-ratio: 4 / 3;
  height: 60%;
}
.size--landscape .corner-shape--tl {
  aspect-ratio: 2 / 3;
  height: 70%;
}
.size--landscape .corner-shape--tr {
  aspect-ratio: 4 / 5;
  height: 60%;
}
.size--landscape .corner-shape--br {
  aspect-ratio: 1 / 1;
  height: 50%;
}

/* story */
.size--story .corner-shape--bl {
  aspect-ratio: 1 / 1;
  height: 40%;
}
.size--story .corner-shape--br {
  aspect-ratio: 4 / 3;
  height: 50%;
}

/* ================= */
/* RVF ribbon shapes */
/* ================= */

.ribbon {
  position: absolute;
  inset: 0;
  width: 80%;
  height: 80%;
  color: var(--dynamic-decor);
  pointer-events: none;
}

.ribbon path {
  fill: currentColor;
}

.ribbon--left {
  top: -20cqw;
  left: -10cqw;
}

.ribbon--center {
  top: initial;
  bottom: -40cqw;
  left: -10cqw;
}

.ribbon--right {
  top: initial;
  left: initial;
  bottom: -10cqw;
  right: -30cqw;
  transform: rotate(60deg);
}

/* ============ */
/* Wavy border */
/* ============ */

.wavy-border {
  position: absolute;
  width: 100%;
  height: 6rem;
  left: 0;

  mask: radial-gradient(67.08px at 50% 90px, #000 99%, transparent 101%) calc(50% - 60px) 0 / 120px 100% repeat-x,
    radial-gradient(67.08px at 50% -60px, transparent 99%, #000 101%) 50% 30px / 120px 100% repeat-x;

  -webkit-mask: radial-gradient(67.08px at 50% 90px, #000 99%, transparent 101%) calc(50% - 60px) 0 / 120px 100%
      repeat-x,
    radial-gradient(67.08px at 50% -60px, transparent 99%, #000 101%) 50% 30px / 120px 100% repeat-x;

  background: currentColor;
  opacity: var(--pattern-opacity);
  pointer-events: none;
}

.wavy-border--bottom {
  bottom: 0;
}

.wavy-border--top {
  height: 6rem;
  top: 0;
  transform: scaleY(-1);
}

/* =============== */
/* BRANDED IMAGES */
/* ============== */

.brand-decor-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  object-fit: contain; /* or cover */
  pointer-events: none;
}
</style>
