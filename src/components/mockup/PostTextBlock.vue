<template>
  <div class="post-text-block" :class="`align--${textAlign}`">
    <div v-if="titleText" class="post-text-block__title">
      {{ titleText }}
    </div>

    <!-- Captions, headlines, subtitles -->

    <div v-if="captionText" class="post-text-block__caption">
      <i v-if="captionIcon" :class="captionIcon" aria-hidden="true"></i>
      <span>{{ captionText }}</span>
    </div>

    <div v-if="headlineText" class="post-text-block__headline">
      {{ headlineText }}
    </div>

    <div v-if="subtitleText" class="post-text-block__subtitle">
      {{ subtitleText }}
    </div>

    <!-- Body text -->
    <div v-if="bodyText" class="post-text-block__body" :class="`align--${bodyAlign}`">
      {{ bodyText }}
    </div>

    <!-- Quote text -->

    <div v-if="quoteText" class="post-text-block__quote">
      {{ quoteText }}
    </div>

    <div v-if="authorName" class="post-text-block__author">
      <div v-if="avatar" class="post-text-block__avatar">
        <img :src="avatar" alt="" />
      </div>

      <div class="post-text-block__author-text" :class="`align--${bodyAlign}`">
        <div class="post-text-block__author-name">
          {{ authorName }}
        </div>

        <div v-if="authorRole" class="post-text-block__author-role">
          {{ authorRole }}
        </div>
      </div>
    </div>

    <!-- Opening hours -->
    <ul v-if="hours" class="opening-hours card alt-panel">
      <li v-for="(row, i) in hours" :key="i" bodyAlign="left">
        <span class="opening-hours__label">{{ row.label }}</span>
        <span class="opening-hours__value">{{ row.value }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  captionIcon: String,
  captionText: String,

  titleText: String,
  headlineText: String,
  subtitleText: String,

  bodyText: String,

  quoteText: String,
  authorName: String,
  authorRole: String,
  avatar: String,

  hours: Array,

  textAlign: {
    type: String,
    default: "center",
  },

  bodyAlign: String,
});
</script>

<style scoped>
/* ============================================
   BASE AUTO-LAYOUT (applies to all ratios)
=============================================== */

.post-text-block {
  display: flex;
  flex-direction: column;
}

/* alignments */

.align--center {
  text-align: center;
}

.align--left {
  text-align: left;
}

.align--right {
  text-align: right;
}

/* BASE TEXT */

.post-text-block__body {
  font-size: var(--fs-body);
  line-height: var(--lh-heading);
  color: var(--dynamic-text);
  padding: 2cqw 0;
}

.post-text-block__title {
  font-size: var(--fs-h1);
  line-height: var(--lh-display);
  color: var(--dynamic-title);
}

.post-text-block__headline {
  font-size: var(--fs-h2);
  line-height: var(--lh-display);
  color: var(--dynamic-title);
  padding-bottom: 2cqw;
}

.post-text-block__subtitle {
  font-size: var(--fs-h5);
  font-weight: var(--fw-body);
  line-height: var(--lh-heading);
  color: var(--dynamic-text);
  padding: 2cqw 0;
}

/* ============================================
   POST TYPE STYLING
=============================================== */

/* ---------- */
/* quote post */
/* ---------- */

/* Padding adjustments */

.size--landscape .post-text-block .post-text-block__quote {
  padding: 1.5cqw 0;
}

.size--story .post-text-block .post-text-block__quote,
.size--portrait .post-text-block .post-text-block__quote {
  padding: 0 6.5cqw;
}

.size--square .post-text-block .post-text-block__quote {
  padding: 0 5.5cqw;
}

/* layout */

.post-text-block__quote {
  font-size: var(--fs-h3);
  line-height: var(--lh-heading);
  color: var(--dynamic-text);
}

.post-text-block__author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5cqw;
  margin-top: 6cqw;
}

.post-text-block__avatar {
  height: 100%;
  display: flex;
  align-items: center;
}

.post-text-block__avatar img {
  width: 12cqw;
  height: auto;
  border-radius: 50%;
  object-fit: cover;
}

.post-text-block__author-name {
  font-size: var(--fs-body);
  line-height: 1;
  color: var(--dynamic-title);
}

.post-text-block__author-role {
  font-size: var(--fs-body-sm);
  line-height: var(--lh-body);
  color: var(--dynamic-soft);
}

/* ------------- */
/* headline post */
/* ------------- */

/* caption style */
.headline-post .post-text-block__caption {
  display: flex;
  gap: 2cqw;
  font-size: var(--fs-h5);
  line-height: var(--lh-heading);
  font-weight: var(--fw-title);
  color: var(--dynamic-soft);
  padding: 2cqw;
}

/* -------------- */
/* paragraph post */
/* -------------- */

/* ---------- */
/* intro post */
/* ---------- */

/* caption style */
.intro-post .post-text-block__caption,
.product-post .post-text-block__caption {
  display: flex;
  align-items: center;
  gap: 2cqw;
  font-size: var(--fs-h6);
  line-height: var(--lh-heading);
  font-weight: var(--fw-title);
  color: var(--dynamic-soft);
  padding: 0 2cqw 2cqw;
}

/* horizontal lines */
.intro-post .post-text-block__caption::before,
.intro-post .post-text-block__caption::after,
.product-post .post-text-block__caption::before,
.product-post .post-text-block__caption::after {
  content: "";
  flex: 1;
  height: 0.45cqw;
  background-color: currentColor;
}

.size--landscape .intro-post .post-text-block__caption::before,
.size--landscape .intro-post .post-text-block__caption::after,
.size--landscape .product-post .post-text-block__caption::before,
.size--landscape .product-post .post-text-block__caption::after {
  content: "";
  flex: 1;
  height: 0.3cqw;
  background-color: currentColor;
}

/* list styling in IntroPost.vue */

/* ---------- */
/* product post */
/* ---------- */

.product-card__content .post-text-block__headline {
  color: var(--title-on-panel);
}

.product-card__content .post-text-block__body {
  color: var(--text-on-panel);
  font-size: var(--fs-body);
  padding: 3cqw 1.2cqw;
}

.product-card__content .post-text-block__caption {
  color: var(--caption-on-panel);
}
</style>
