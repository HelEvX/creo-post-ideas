<template>
  <div class="quote-post">
    <PostTextBlock
      v-if="zone === 'safe'"
      :quoteText="quote"
      :authorName="authorName"
      :authorRole="authorRole"
      :avatar="avatar"
      align="center"
      bodyAlign="left" />
    <div v-else class="quote-post__decor">
      <div class="quote-post__decor__border"></div>
      <!-- decorative only -->
      <span class="quote-post__mark quote-open"><i class="fa-solid fa-quote-left"></i></span>
      <span class="quote-post__mark quote-close"><i class="fa-solid fa-quote-left"></i></span>
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

defineProps({
  quote: String,
  authorName: String,
  authorRole: String,
  avatar: String,
  zone: { type: String, required: true },
});
</script>

<style scoped>
.quote-post {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Scaling */

.quote-post__decor {
  position: relative;
  height: 100%;
  width: 100%;
  padding: clamp(0.8em, 4cqw, 2.5em);
}

/* Border */

.quote-post__decor__border {
  content: "";
  position: absolute;
  inset: 1em;

  border-radius: var(--card-radius);
  border: clamp(0.6em, 2cqw, 0.65em) solid;
  opacity: var(--pattern-opacity);
  pointer-events: none;
}

/* QUOTE MARKS */
.quote-post__mark {
  position: absolute;
  opacity: var(--pattern-opacity);
}
.quote-post__mark i {
  font-size: clamp(6rem, 25cqw, 20rem);
  transform: translateY(-0.15em);

  line-height: 1;
  display: block;

  overflow: hidden;
}

.quote-post__mark.quote-open {
  top: 2em;
  left: 2em;
}
.quote-post__mark.quote-close {
  bottom: 2em;
  right: 2em;
  transform: rotate(180deg);
}
</style>
