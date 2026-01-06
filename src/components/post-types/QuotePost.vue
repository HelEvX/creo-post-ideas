<template>
  <div class="quote-post">
    <PostTextBlock
      v-if="zone === 'safe'"
      :quoteText="quote"
      :authorName="authorName"
      :authorRole="authorRole"
      :avatar="avatar"
      textAlign="center"
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

<style>
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
  padding: 4cqw;
}

/* Border */

.quote-post__decor__border {
  content: "";
  position: absolute;
  inset: 3cqw;

  border-radius: var(--card-radius);
  border: 2cqw solid;
  pointer-events: none;
}

/* QUOTE MARKS */
.quote-post__mark {
  position: absolute;
}

.quote-post__mark i {
  font-size: 25cqw;
  transform: translateY(-5cqw);

  line-height: 1;
  display: block;
  overflow: hidden;
}

.quote-post__mark.quote-open {
  top: 8cqw;
  left: 8cqw;
}
.quote-post__mark.quote-close {
  bottom: 8cqw;
  right: 8cqw;
  transform: rotate(180deg);
}
</style>
