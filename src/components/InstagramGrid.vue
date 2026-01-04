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
            <div class="ig-btn-row">
              <div class="ig-btn secondary">Edit profile</div>
              <div class="ig-btn secondary">View archive</div>
              <div class="ig-btn icon-btn">
                <i class="fa-solid fa-gear"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="ig-bio-wrapper">
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
              <span class="ig-pill"
                ><i class="fa-brands fa-threads"></i> <span>{{ ig.threads }}</span></span
              >
            </div>
            <div class="ig-line ig-grey">{{ ig.businessType }}</div>
            <div class="ig-line" v-html="ig.description.replace(/\n/g, '<br>')"></div>
            <div class="ig-line ig-tag">{{ ig.tags }}</div>
            <div class="ig-line ig-grey">{{ ig.address }}</div>
            <div class="ig-line">
              <a :href="ig.url" class="ig-link" target="_blank" rel="noopener">
                {{ ig.url.replace("https://", "").replace("http://", "") }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- HIGHLIGHTS -->
      <div class="ig-highlights">
        <div v-for="(h, i) in ig.highlights" :key="i" class="ig-highlight">
          <div class="ig-highlight-img">
            <!-- inner circle with background color per highlight -->
            <div
              class="ig-highlight-circle"
              :style="{
                backgroundColor: `var(${highlightPairs[i].bg})`,
              }">
              <!-- same SVG for all, recolored -->
              <div class="ig-highlight-icon" :style="highlightIconStyle(derivedHighlightIcon, i)"></div>
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

      <!-- GRID: old version with brand-color patterns -->
      <!-- <section class="ig-grid">
        <div v-for="(img, i) in images" :key="i" class="ig-tile">
          <div class="ig-pattern" :class="img"></div>
        </div>
      </section> -->

      <!-- GRID: using mockups -->
      <section class="ig-grid">
        <div v-for="(tile, i) in mockupTiles" :key="i" class="ig-tile">
          <InstagramMockupTile :config="tile" :brandLogo="tile.brandLogo" />
        </div>
      </section>

      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

import InstagramMockupTile from "@/components/InstagramMockupTile.vue";
import stockImage from "@/assets/img/stockphoto.webp";

const highlightPairs = [
  { bg: "--ui-primary-bg", fg: "--text-on-primary" },
  { bg: "--ui-alt-section-bg", fg: "--text-on-alt-section" },
  { bg: "--ui-secondary-bg", fg: "--text-on-secondary" },
  { bg: "--ui-alt-panel-bg", fg: "--color-tertiary" },
  { bg: "--ui-panel-bg", fg: "--caption-on-panel" },
  { bg: "--ui-footer-bg", fg: "--text-soft-on-footer" },
  { bg: "--ui-nav-bg", fg: "--text-on-nav" },
];

const props = defineProps({
  brandTokens: Object,

  ig: {
    type: Object,
    default: () => ({
      highlightIcon: "creo-small.svg", // DEFAULT SVG
      avatar: "",
      username: "",
      posts: 0,
      followers: 0,
      following: 0,
      title: "",
      threads: "",
      businessType: "",
      description: "",
      tags: "",
      address: "",
      url: "",
      highlights: [],
    }),
  },

  images: { type: Array, default: () => [] },
});

// bg logo

const clientLogoUrl = computed(() => {
  const slug = props.brandTokens?.slug;
  return slug ? `/logo-bg/${slug}.svg` : null;
});

// avatar
const avatarSrc = computed(() => {
  const raw = props.ig.avatar || "";
  if (raw.startsWith("http")) return raw;
  return new URL(`../assets/avatars/${raw}`, import.meta.url).href;
});

// mask-style SVG recoloring
function highlightIconStyle(file, i) {
  if (!file) return {};

  const url = String(file).startsWith("/") ? String(file) : `/highlights/${file}`;

  return {
    WebkitMaskImage: `url(${url})`,
    maskImage: `url(${url})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    backgroundColor: `var(${highlightPairs[i].fg})`,
  };
}

// highlight icon

const derivedHighlightIcon = computed(() => {
  const slug = props.brandTokens?.slug;
  if (slug) return `${slug}-small.svg`; // filename only
  return props.ig?.highlightIcon || null; // fallback to JSON default
});

// MOCKUP GRID
// turn useColoredBackground OFF when text is on a neutral colored card

const mockupTiles = computed(() => [
  {
    postType: "info",
    backgroundClass: "bg--plain-neutral",
    backgroundTone: "neutral",
    useColoredBackground: false,
  },
  {
    postType: "headline",
    backgroundClass: "bg--image bg--plain-secondary",
    backgroundTone: "secondary",
    useColoredBackground: true,
    usePhoto: true,
    photoSrc: stockImage,
  },
  {
    postType: "paragraph",
    backgroundClass: "bg--logo bg--plain-primary",
    backgroundTone: "neutral",
    useColoredBackground: false,
    brandLogo: clientLogoUrl.value,
  },
  {
    postType: "quote",
    backgroundClass: "bg--plain-secondary",
    backgroundTone: "secondary",
    useColoredBackground: true,
  },
  {
    postType: "product",
    backgroundClass: "bg--pattern pattern-distorted-mesh",
    backgroundTone: "neutral",
    useColoredBackground: false,
  },

  {
    postType: "intro",
    backgroundClass: "bg--logo bg--plain-secondary",
    backgroundTone: "secondary",
    useColoredBackground: true,
    brandLogo: clientLogoUrl.value,
  },
]);
</script>

<style>
@import url("https://use.typekit.net/xls1ldz.css");
@import "@/assets/patterns.css";

/* FONTS & COLORS like Instagram */
#instagram-preview {
  font-family: "segoe-ui", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: var(--fs-body-lg);
  color: #000;
  background: var(--color-background);
}

/* WRAPPER */
.ig-wrapper {
  margin: 0 auto;
  padding: var(--space-25) 0;
  width: 100%;
  max-width: 992px;
}

/* HEADER */
.ig-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
  margin-bottom: 2rem;
}

/* LEFT COLUMN — 1/3 */
.ig-avatar-col {
  flex: 0 0 33.333%;
  height: 0;
  overflow: visible;
  display: flex;
  justify-content: center;
}

/* Avatar */
.ig-avatar {
  width: 165px;
  height: 165px;
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
  justify-content: center;
  gap: 16px;
}

/* USERNAME + BUTTONS */
.ig-username-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ig-username {
  all: unset;
  display: block;
  font-size: var(--fs-h5);
  font-weight: 400;
  line-height: 25px;
}

/* BUTTONS */

.ig-btn-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
}

.ig-btn {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  font-weight: 600;
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
}

.ig-btn.secondary {
  background: #efefef;
  color: #0c1014;
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
  margin: 2rem 0;
  list-style: none;
}

.ig-stats li {
  display: flex;
  gap: 4px;
  font-size: var(--fs-body);
  line-height: 20px;
  color: #6a717a;
}

.ig-stats .num {
  font-weight: 600;
  color: #0c1014;
}

/* BIO */
.ig-bio-wrapper {
  flex: 0 0 calc(66.666% - 28px);
}

.ig-bio {
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
}

.ig-grey {
  color: #737373;
}

.ig-line {
  display: flex;
  flex-direction: row;
}

.ig-pill {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  background: #efefef;
  padding: 4px 10px;
  border-radius: 99px;
  margin: 6px 0;
}

.ig-pill i {
  font-size: var(--fs-body-lg);
}

.ig-pill span {
  font-size: 12px;
  margin: 0;
}

.ig-title {
  font-weight: 600;
}

.ig-tag {
  color: #4150f7 !important;
  font-weight: 300;
  text-decoration: none;
}

.ig-link {
  color: #00376b !important;
  font-weight: 600;
  text-decoration: none;
}
.ig-link:hover {
  color: #00376b !important;
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
  color: #0c1014;
}

.ig-tab-inner.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #0c1014;
}

.ig-tab-inner i {
  font-size: var(--fs-h4);
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
  overflow: hidden;
}

/* SVG mask recoloring */
.ig-highlight-icon {
  width: 80px;
  height: 80px;
}

/* LABEL */
.ig-highlight-label {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

/* ------------------------------------------------------------
   GALLERY
------------------------------------------------------------ */

.ig-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
}

.ig-tile {
  aspect-ratio: 3 / 4;
  position: relative;
  overflow: hidden;
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

/* ------------------------------------------------------------
   RESPONSIVE
------------------------------------------------------------ */

@media (max-width: 767px) {
  .ig-header {
    justify-content: left;
    margin: 0;
  }
  .ig-btn {
    font-size: 0.8em;
    padding: 0 8px;
  }
  .ig-username {
    flex: 1 0 100%;
  }
  .ig-avatar-col {
    height: auto;
    flex: 0 0 auto;
    padding: 0 20px;
  }
  .ig-avatar {
    height: 92px;
    width: 92px;
  }
  .ig-stats {
    display: none;
  }
  .ig-bio-wrapper {
    flex: 1;
    padding: 20px;
  }
  .ig-highlight {
    width: 90px;
    flex: 0 0 90px;
  }
  .ig-highlight-img {
    width: 69px;
    height: 69px;
  }
  .ig-highlight-circle {
    width: 57.75px;
    height: 57.75px;
  }
  .ig-highlight-icon {
    width: 60px;
    height: 60px;
  }
}
</style>
