<template>
  <div class="paragraph-post">
    <div v-if="zone === 'safe'" class="card accent">
      <div class="card__caption">
        <i class="fa-solid fa-link post-icon"></i>
        <span>Even voorstellen</span>
      </div>

      <div class="card__title">
        <div>Heb je al van ons gehoord?</div>
      </div>

      <div class="card__text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </div>
    </div>
    <div v-else class="paragraph-post__image">
      <img :src="image" alt="" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: String,
  zone: { type: String, required: true },
});
</script>

<style scoped>
.paragraph-post {
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.paragraph-post .card {
  height: auto;
  padding: 2.5cqw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.paragraph-post .card__text {
  font-size: var(--fs-body-sm);
  margin: 0;
}

.paragraph-post__image {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 15cqw 0;
}

.size--landscape .paragraph-post__image,
.size--story .paragraph-post__image {
  padding: 0;
}

.paragraph-post__image img {
  object-fit: cover;
  flex: 1;
  background: var(--caption-on-panel);
}
</style>
