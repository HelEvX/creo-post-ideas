<template>
  <div class="post-text-block" :class="`align--${textAlign}`">
    <div v-if="titleText" class="post-text-block__title">
      {{ titleText }}
    </div>

    <div v-if="captionText" class="post-text-block__caption">
      {{ captionText }}
    </div>

    <div v-if="headlineText" class="post-text-block__headline">
      {{ headlineText }}
    </div>

    <div v-if="subtitleText" class="post-text-block__subtitle">
      {{ subtitleText }}
    </div>

    <div v-if="bodyText" class="post-text-block__body" :class="bodyAlign && `align--${bodyAlign}`">
      {{ bodyText }}
    </div>

    <div class="post-text-block__quote-post">
      <div v-if="quoteText" class="post-text-block__quote">
        {{ quoteText }}
      </div>

      <div v-if="authorName" class="post-text-block__author">
        <div v-if="avatar" class="post-text-block__avatar">
          <img :src="avatar" alt="" />
        </div>

        <div class="post-text-block__author-text" :class="bodyAlign && `align--${bodyAlign}`">
          <div class="post-text-block__author-name">
            {{ authorName }}
          </div>

          <div v-if="authorRole" class="post-text-block__author-role">
            {{ authorRole }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titleText: String,
  headlineText: String,
  subtitleText: String,
  captionText: String,
  bodyText: String,
  quoteText: String,

  authorName: String,
  authorRole: String,
  avatar: String,

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
}

.post-text-block__title {
  font-size: var(--fs-h1);
  line-height: var(--lh-display);
  color: var(--dynamic-title);
}

.post-text-block__headline {
  font-size: var(--fs-h2);
  line-height: var(--lh-heading);
  color: var(--dynamic-title);
}

.post-text-block__subtitle {
  font-size: var(--fs-h5);
  font-weight: var(--fw-body);
  line-height: var(--lh-heading);
  color: var(--ui-accent-bg);
}

.post-text-block__caption {
  display: flex;
  align-items: center;
  gap: 2cqw;
  font-size: var(--fs-h6);
  line-height: var(--lh-heading);
  font-weight: var(--fw-title);
  color: var(--dynamic-soft);
  padding: 0 2cqw;
}

/* horizontal lines */
.post-text-block__caption::before,
.post-text-block__caption::after {
  content: "";
  flex: 1;
  height: 0.45cqw;
  background-color: currentColor;
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

.post-text-block__quote-post {
  display: flex;
  flex-direction: column;
  gap: calc(var(--card-gap) * 4);
}

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

/* -------------- */
/* paragraph post */
/* -------------- */

/* ---------- */
/* intro post */
/* ---------- */

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
