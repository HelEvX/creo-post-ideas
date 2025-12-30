<template>
  <div class="quote-post">
    <PostTextBlock v-if="zone === 'safe'" :quoteText="quote" :authorText="author" />

    <div v-else class="quote-post__decor">
      <div class="quote-post__decor__border"></div>
      <!-- decorative only -->
      <span class="quote-post__mark quote-open"><i class="fa-solid fa-quote-left"></i></span>
      <span class="quote-post__mark quote-close"><i class="fa-solid fa-quote-right"></i></span>
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

defineProps({
  quote: String,
  author: String,
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

.quote-post__decor {
  height: 92%;
  width: 92%;
  margin: 0 auto;
}

.quote-post__decor__border {
  height: 100%;
  width: 100%;
  border-radius: var(--border-radius);
  border: 5px;
  border-style: solid;
  opacity: var(--pattern-opacity);
}

/* QUOTE MARKS */
.quote-post__mark {
  position: absolute;
  opacity: var(--pattern-opacity);
  padding: var(--space-10);
}
.quote-post__mark i {
  font-size: 15rem;
}

.quote-post__mark.quote-open {
  top: 8%;
  left: 8%;
}
.quote-post__mark.quote-close {
  bottom: 8%;
  right: 8%;
}
</style>
