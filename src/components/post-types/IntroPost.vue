<template>
  <div class="intro-post">
    <PostTextBlock
      v-if="zone === 'safe'"
      :captionText="caption"
      :headlineText="headline"
      :subtitleText="subtitle"
      :hours="hours"
      bodyAlign="left" />

    <div v-else class="quote-post__decor">
      <!-- space for decorative elements -->
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

const { caption, headline, subtitle, hours } = defineProps({
  caption: String,
  headline: String,
  subtitle: String,
  hours: Array,
  zone: { type: String, required: true },
});
</script>

<style>
.intro-post {
  height: 100%;
  padding: 2cqw;
}
.intro-post .post-text-block {
  height: 100%;
}

.intro-post .post-text-block__headline {
  padding: 0;
}

.intro-post .post-text-block__subtitle {
  padding-bottom: 4cqw;
}

/* list */
.opening-hours {
  height: 100%;
  /* margin: 0 auto; */
  padding: 3cqw 5cqw;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: var(--card-radius);
}

.opening-hours li {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  gap: 3cqw;
}

.opening-hours__label {
  display: flex;
  align-items: center;
  gap: 3cqw;
  font-size: var(--fs-body-sm);
  color: var(--text-on-alt-panel);
  flex: 1;
}

/* line */
.opening-hours__label::after {
  content: "";
  flex: 1;
  height: 0.15cqw;
  background-color: var(--caption-on-alt-panel);
}

.opening-hours__value {
  font-size: var(--fs-body-sm);
  font-weight: var(--fw-title);
  color: var(--title-on-alt-panel);
}
</style>
