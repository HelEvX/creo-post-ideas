<template>
  <div class="post-text-block">
    <div class="post-text-block__headline">
      {{ headlineText }}
    </div>
    <div class="post-text-block__body">
      {{ bodyText }}
    </div>
    <div class="post-text-block__quote">
      {{ quoteText }}
    </div>
    <div class="post-text-block__author">
      {{ authorText }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  headlineText: String,
  bodyText: String,
  quoteText: String,
  authorText: String,
  textAlign: {
    type: String,
    default: "left",
  },
});
</script>

<style scoped>
/* ============================================
   BASE AUTO-LAYOUT (applies to all ratios)
=============================================== */

.post-text-block {
  padding-bottom: clamp(0.4em, 1.5cqw, 2.5em);
  text-align: center;
}

.post-text-block__headline {
  font-size: var(--fs-h1);
  line-height: var(--lh-display);
  color: var(--dynamic-title);
}

.post-text-block__body {
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  color: var(--dynamic-text);
}

.post-text-block__quote {
  font-size: var(--fs-h3);
  line-height: var(--lh-display);
  color: var(--dynamic-text);
}

.post-text-block__author {
  font-size: var(--fs-body);
  line-height: var(--lh-heading);
  color: var(--dynamic-title);
}
</style>
