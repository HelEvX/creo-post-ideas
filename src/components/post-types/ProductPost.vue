<template>
  <div class="product-post">
    <div v-if="zone === 'safe'" class="product-card">
      <div class="product-card__image">
        <img :src="image" alt="" />
        <span v-if="price" class="product-card__price">
          {{ price }}
        </span>
      </div>

      <div class="product-card__content">
        <PostTextBlock :headlineText="name" :bodyText="description" align="center" bodyAlign="center" />
      </div>
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

defineProps({
  name: String,
  description: String,
  image: String,
  price: String,
  zone: { type: String, required: true },
});
</script>

<style scoped>
.product-post {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* CARD */
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  background: var(--ui-panel-bg);
  border-radius: var(--card-radius);
  border: var(--border-card);
  box-shadow: var(--shadow-card);

  overflow: hidden;
}

/* IMAGE CONTAINER */
.product-card__image {
  position: relative;
  background: var(--ui-primary-bg);

  margin: clamp(0.4em, 2cqw, 1em);

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  border: 0.3em solid var(--color-primary);
}

.product-card__image img {
  max-width: 100%;
  object-fit: contain;
  display: block;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card__image {
  flex: 0 0 auto;
}

.product-card__content {
  flex: 1 1 auto;
}

/* TEXT */
.product-card__content {
  padding: clamp(0.8em, 3.2cqw, 2em);
}

/* PRICE TAG */
.product-card__price {
  position: absolute;
  top: clamp(0.2em, 1.5cqw, 0.8em);
  right: clamp(0.2em, 1.5cqw, 0.8em);

  padding: clamp(0.2em, 0.8cqw, 0.6em) clamp(0.4em, 1.5cqw, 1em);

  background: var(--ui-accent-bg);
  color: var(--text-on-accent);

  font-size: var(--fs-body-xs);
  line-height: 1;
  font-weight: var(--fw-body);
  letter-spacing: 0.1em;
  border-radius: 999px;
}
</style>
