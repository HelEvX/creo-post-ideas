<template>
  <div class="product-post">
    <div v-if="zone === 'safe'" class="product-card card">
      <div class="product-card__image">
        <img :src="image" alt="" />
        <span v-if="price" class="product-card__price">
          {{ price }}
        </span>
      </div>

      <div class="card product-card__content">
        <PostTextBlock
          :headlineText="name"
          :bodyText="description"
          :captionText="caption"
          textAlign="center"
          bodyAlign="center" />
      </div>
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

defineProps({
  name: String,
  description: String,
  caption: String,
  image: String,
  price: String,
  zone: { type: String, required: true },
});
</script>

<style scoped>
.product-post {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 3cqw;
}

/* CARD */
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--ui-panel-bg);
}

/* IMAGE CONTAINER */
.product-card__image {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  margin: 1.8cqw;
  border: 1.5cqw solid var(--caption-on-panel);
  border-radius: var(--card-radius);
}

.product-card__image img {
  width: 100%;
  object-fit: cover;
  background: var(--caption-on-alt-panel);
}

/* TEXT */
.product-card__content {
  flex: 1;
}

/* PRICE TAG */
.product-card__price {
  position: absolute;
  top: 1.5cqw;
  right: 1.5cqw;

  padding: 1.5cqw 2cqw;

  background: var(--caption-on-panel);
  color: var(--text-on-accent);

  font-size: var(--fs-body-sm);
  line-height: 1;
  font-weight: var(--fw-title);
  letter-spacing: 0.2cqw;
  border-radius: 999px;
}

/* adjustments for landscape */
.size--landscape .product-post {
  padding: 1.2cqw;
}
.size--landscape .product-card__image {
  margin: 1.2cqw;
  border-width: 1cqw;
}
</style>
