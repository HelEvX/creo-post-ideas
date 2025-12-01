<!--
  Based on "Instagram Profile Layout" by georgewpark
  Source: https://github.com/georgewpark/Instagram-Profile-Layout
-->

<template>
  <div id="instagram-preview">
    <!-- HEADER -->
    <div class="ig-wrapper">
      <div class="ig-header">
        <!-- LEFT COLUMN -->
        <div class="ig-avatar-col">
          <div class="ig-avatar">
            <img :src="avatarSrc" alt="avatar" />
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="ig-head-col">
          <div class="ig-username-row">
            <h1 class="ig-username">{{ ig.username }}</h1>
            <div class="ig-btn secondary">Edit profile</div>
            <div class="ig-btn secondary">View archive</div>
            <div class="ig-btn icon-btn">
              <i class="fa-solid fa-gear"></i>
            </div>
          </div>

          <ul class="ig-stats">
            <li>
              <span class="num">{{ ig.posts }}</span> posts
            </li>
            <li>
              <span class="num">{{ ig.followers }}</span> followers
            </li>
            <li>
              <span class="num">{{ ig.following }}</span> following
            </li>
          </ul>

          <div class="ig-bio">
            <div class="ig-line ig-title">{{ ig.title }}</div>
            <div class="ig-line">
              <span class="ig-pill">{{ ig.threads }}</span>
            </div>
            <div class="ig-line ig-grey">{{ ig.businessType }}</div>
            <div class="ig-line" v-html="ig.description.replace(/\n/g, '<br>')"></div>
            <div class="ig-line ig-grey">{{ ig.address }}</div>
            <div class="ig-line">
              <a :href="ig.url" class="ig-link" target="_blank" rel="noopener">
                {{ ig.url.replace("https://", "").replace("http://", "") }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HIGHLIGHTS -->
    <div class="ig-highlights">
      <div v-for="(h, i) in ig.highlights" :key="i" class="ig-highlight">
        <div class="ig-highlight-img">
          <!-- inner circle with background color per highlight -->
          <div class="ig-highlight-circle" :style="{ backgroundColor: h.bg }">
            <!-- same SVG for all, recolored -->
            <div class="ig-highlight-icon" :style="highlightIconStyle(ig.highlightIcon)"></div>
          </div>
        </div>
        <div class="ig-highlight-label">{{ h.label }}</div>
      </div>
    </div>

    <!-- TABS -->
    <div class="ig-tabs">
      <div class="ig-tab">
        <div class="ig-tab-inner active">
          <i class="fa-solid fa-table-cells"></i>
        </div>
      </div>

      <div class="ig-tab">
        <div class="ig-tab-inner">
          <i class="fa-solid fa-clapperboard"></i>
        </div>
      </div>

      <div class="ig-tab">
        <div class="ig-tab-inner">
          <i class="fa-solid fa-user-tag"></i>
        </div>
      </div>
    </div>

    <!-- GALLERY -->
    <section class="ig-gallery">
      <div v-for="(img, i) in images" :key="i" class="ig-tile">
        <div class="ig-pattern" :class="img"></div>
      </div>
    </section>

    <div class="loader"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  ig: {
    type: Object,
    default: () => ({
      highlightIcon: "brand.svg", // DEFAULT SVG so Vue NEVER breaks
      avatar: "",
      username: "",
      posts: 0,
      followers: 0,
      following: 0,
      title: "",
      threads: "",
      businessType: "",
      description: "",
      address: "",
      url: "",
      highlights: [],
    }),
  },

  images: { type: Array, default: () => [] },

  highlightFg: { type: String, default: "#d3d3d3" },
});

// avatar (unchanged)
const avatarSrc = computed(() => {
  const raw = props.ig.avatar || "";
  if (raw.startsWith("http")) return raw;
  return new URL(`../assets/avatars/${raw}`, import.meta.url).href;
});

// mask-style SVG recoloring
function highlightIconStyle(file) {
  if (!file) return {};
  const url = new URL(`../assets/highlights/${file}`, import.meta.url).href;
  return {
    WebkitMaskImage: `url(${url})`,
    maskImage: `url(${url})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    backgroundColor: props.highlightFg,
  };
}
</script>

<style>
@import url("https://use.typekit.net/xls1ldz.css");

:root {
  --ig-tile-bg: #ffffff;
  --ig-tile-fg: #333333;
}

/* OUTER FRAME */
#instagram-preview {
  font-family: "segoe-ui", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 18px;
  color: #000;
  background: var(--white);
  max-width: 975px;
  margin: 0 auto;
  padding: 3rem 2rem 0;
}

/* INNER WRAPPER */
.ig-wrapper {
  width: 935px;
  margin: 0 auto;
  padding: 40px 20px;
  box-sizing: border-box;
}

/* HEADER */
.ig-header {
  display: flex;
  align-items: center;
}

/* LEFT COLUMN — 1/3 */
.ig-avatar-col {
  flex: 0 0 33.333%;
  display: flex;
  justify-content: center;
  margin-right: 28px;
}

/* Avatar */
.ig-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: rgb(245, 245, 245);
  border: 1px solid rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.ig-avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* RIGHT COLUMN — 2/3 */
.ig-head-col {
  flex: 0 0 calc(66.666% - 28px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* USERNAME + BUTTONS */
.ig-username-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ig-username {
  all: unset;
  display: block;
  font-size: 20px;
  font-weight: 400;
  line-height: 25px;
}

/* BUTTONS */
.ig-btn {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
}

.ig-btn.secondary {
  background: #efefef;
  color: rgb(12, 16, 20);
}

.ig-btn.icon-btn {
  width: 32px;
  height: 32px;
}

/* STATS */
.ig-stats {
  display: flex;
  gap: 30px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.ig-stats li {
  display: flex;
  gap: 4px;
  font-size: 16px;
  line-height: 20px;
}

.ig-stats .num {
  font-weight: 600;
}

/* BIO */
.ig-bio {
  display: flex;
  flex-direction: column;
}

.ig-grey {
  color: #737373;
}

.ig-pill {
  display: inline-block;
  background: #efefef;
  padding: 4px 10px;
  font-weight: 600;
  border-radius: 99px;
  margin: 6px 0;
}

.ig-link {
  color: #00376b;
  font-weight: 600;
  text-decoration: none;
}
.ig-link:hover {
  color: #00376b;
  text-decoration: underline;
}

/* ------------------------------------------------------------
   TABS (Posts / Reels / Tagged)
------------------------------------------------------------ */
.ig-tabs {
  display: flex;
  justify-content: center;
  gap: 4px;
  border-bottom: 1px solid #dbdbdb;
  margin-top: 24px;
}

.ig-tab {
  height: 44px;
  max-width: 193px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ig-tab-inner {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
  color: #737373;
  position: relative;
}

.ig-tab-inner.active {
  color: #000;
}

.ig-tab-inner.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #000;
}

.ig-tab-inner i {
  font-size: 24px;
  line-height: 1;
}

/* ------------------------------------------------------------
   HIGHLIGHTS (circular icons with labels)
------------------------------------------------------------ */

.ig-highlights {
  display: flex;
  justify-content: space-between;
  padding: 20px 0 10px;
  overflow-x: auto;
  scrollbar-width: none;
}
.ig-highlights::-webkit-scrollbar {
  display: none;
}

/* SINGLE HIGHLIGHT */
.ig-highlight {
  width: 125px;
  flex: 0 0 125px;
  text-align: center;
}

/* CIRCLE IMAGE */
.ig-highlight-img {
  width: 92px;
  height: 92px;
  margin: 0 auto 6px;
  border-radius: 50%;
  border: 1px solid #dbdbdb;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* inner circle */
.ig-highlight-circle {
  width: 77px;
  height: 77px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* SVG mask recoloring */
.ig-highlight-icon {
  width: 36px;
  height: 36px;
}

/* LABEL */
.ig-highlight-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
}

/* ------------------------------------------------------------
   GALLERY
------------------------------------------------------------ */

.ig-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
}

.ig-tile {
  aspect-ratio: 3 / 4;
  position: relative;
  overflow: hidden;
}

.ig-tile img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ig-pattern {
  width: 100%;
  height: 100%;
}

/* ------------------------------------------------------------
   CSSPATTERNS.COM PATTERNS
------------------------------------------------------------ */

/* 1. GEOMETRIC FLOWERS
   Source: https://css-pattern.com/geometric-flowers/ */

.pattern-geometric-flowers {
  --s: 64px; /* control the size*/
  --c1: var(--color-primary);
  --c2: var(--color-primary-dark);
  --c3: var(--color-secondary);
  --c4: var(--color-surface);

  background: radial-gradient(var(--c1) 24%, #0000 25%),
    radial-gradient(var(--c2) 30%, #0000 32%) calc(var(--s) / 2) calc(var(--s) / 2),
    repeating-conic-gradient(from 30deg, var(--c3) 0 30deg, var(--c4) 0 25%);
  background-size: var(--s) var(--s);
}

/* 2. DISTORTED MESH
   Source: https://css-pattern.com/distorted-mesh/ */

.pattern-distorted-mesh {
  --s: 140px; /* control the size*/
  --c1: var(--color-primary);
  --c2: var(--color-primary-dark);

  --_g: #0000 52%, var(--c1) 54% 57%, #0000 59%;
  background: radial-gradient(farthest-side at -33.33% 50%, var(--_g)) 0 calc(var(--s) / 2),
    radial-gradient(farthest-side at 50% 133.33%, var(--_g)) calc(var(--s) / 2) 0,
    radial-gradient(farthest-side at 133.33% 50%, var(--_g)), radial-gradient(farthest-side at 50% -33.33%, var(--_g)),
    var(--c2);
  background-size: calc(var(--s) / 4.667) var(--s), var(--s) calc(var(--s) / 4.667);
}

/* 3. RHOMBUS & STRIPES
   Source: https://css-pattern.com/rhombus-stripes/*/
.pattern-rhombus-stripes {
  --s: 64px; /* control the size*/
  --c1: var(--color-primary);
  --c2: var(--color-secondary);

  background: conic-gradient(from -45deg, var(--c1) 90deg, #0000 0 180deg, var(--c2) 0 270deg, #0000 0) 0
      calc(var(--s) / 2) / var(--s) var(--s),
    conic-gradient(from 135deg at 50% 0, var(--c1) 90deg, var(--c2) 0) 0 0 / calc(2 * var(--s)) var(--s);
}

/* 4. NESTED DIAMOND
   Source: https://css-pattern.com/nested-diamond/ */
.pattern-nested-diamond {
  --s: 100px; /* control the size*/
  --c1: var(--color-primary);
  --c2: var(--color-secondary);
  --c3: var(--color-surface);

  --_g: #0000, var(--c1) 1deg 30deg, var(--c2) 31deg 89deg, var(--c1) 90deg 119deg, #0000 120deg;
  background: conic-gradient(from -60deg at 50% 28.86%, var(--_g)), conic-gradient(from 30deg at 71.14% 50%, var(--_g)),
    conic-gradient(from 120deg at 50% 71.14%, var(--_g)), conic-gradient(from 210deg at 28.86% 50%, var(--_g)) var(--c3);
  background-size: var(--s) var(--s);
}

/* 5. WAVY
   Source: https://css-pattern.com/3d-wavy/ */
.pattern-wavy {
  --s: 100px; /* control the size*/
  --c1: var(--color-primary-light);
  --c2: var(--color-primary-dark);

  --_g: var(--c2) 6% 14%, var(--c1) 16% 24%, var(--c2) 26% 34%, var(--c1) 36% 44%, var(--c2) 46% 54%, var(--c1) 56% 64%,
    var(--c2) 66% 74%, var(--c1) 76% 84%, var(--c2) 86% 94%;
  background: radial-gradient(100% 100% at 100% 0, var(--c1) 4%, var(--_g), #0008 96%, #0000),
    radial-gradient(100% 100% at 0 100%, #0000, #0008 4%, var(--_g), var(--c1) 96%) var(--c1);
  background-size: var(--s) var(--s);
}

/* 6. FOLDED ZIGZAG
   Source: https://css-pattern.com/folded-zig-zag/ */
.pattern-folded-zigzag {
  --s: 84px; /* control the size*/
  --c1: var(--color-surface);
  --c2: var(--color-secondary-dark);
  --c3: var(--color-primary-dark);

  --a: from -30deg at;
  background: linear-gradient(#0000 50%, #0004 0), conic-gradient(var(--a) 90%, var(--c1) 240deg, #0000 0),
    conic-gradient(var(--a) 75%, var(--c2) 240deg, #0000 0), conic-gradient(var(--a) 25%, #0000 240deg, var(--c1) 0),
    conic-gradient(var(--a) 40%, var(--c1) 240deg, var(--c3) 0);
  background-size: calc(1.5 * var(--s)) var(--s);
}

/* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

/* LOADER */
#instagram-preview .loader {
  width: 20px;
  height: 20px;
  border: 4px solid #999;
  border-bottom-color: transparent;
  border-radius: 50%;
  margin: 40px auto;
  animation: ig-loader-spin 500ms linear infinite;
}

@keyframes ig-loader-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
