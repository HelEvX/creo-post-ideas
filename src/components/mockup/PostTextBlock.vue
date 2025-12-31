<template>
  <div class="post-text-block" :class="`align--${align}`">
    <div v-if="titleText" class="post-text-block__title">
      {{ titleText }}
    </div>

    <div v-if="headlineText" class="post-text-block__headline">
      {{ headlineText }}
    </div>

    <div v-if="bodyText" class="post-text-block__body" :class="bodyAlign && `align--${bodyAlign}`">
      {{ bodyText }}
    </div>

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
</template>

<script setup>
defineProps({
  titleText: String,
  headlineText: String,
  bodyText: String,
  quoteText: String,

  authorName: String,
  authorRole: String,
  avatar: String,

  align: {
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
  font-size: var(--fs-body-lg);
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

/* ============================================
   POST TYPE STYLING
=============================================== */

/* per-format padding */

.size--story .post-text-block .post-text-block__quote,
.size--portrait .post-text-block .post-text-block__quote {
  padding: 0 clamp(0.6em, 6.5cqw, 1em);
}

/* quote post */

.post-text-block__quote {
  font-size: var(--fs-h3);
  line-height: var(--lh-heading);
  color: var(--dynamic-text);
  margin-bottom: clamp(0.8em, 3.2cqw, 2em);
}

.post-text-block__author {
  margin-top: clamp(0.6em, 2.5cqw, 1.6em);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.4em, 1.5cqw, 0.8em);
}

.post-text-block__avatar {
  height: 100%;
  display: flex;
  align-items: center;
}

.post-text-block__avatar img {
  width: clamp(3rem, 12cqw, 8rem);
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
  font-size: var(--fs-body-xs);
  line-height: var(--lh-body);
  color: var(--dynamic-soft);
}

/* headline post */

/* paragraph post */

/* intro post */

/* product post */
</style>
