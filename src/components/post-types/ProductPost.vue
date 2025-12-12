<template>
  <div class="product-post">
    <div v-if="image" class="product-post__image">
      <img :src="image" alt="" />
    </div>

    <PostTextBlock :headlineText="name" :bodyText="description" textAlign="left" />

    <div v-if="price" class="product-post__price">
      {{ price }}
    </div>
  </div>
</template>

<script setup>
import PostTextBlock from "../mockup/PostTextBlock.vue";

const { name, description, image, price } = defineProps({
  name: String,
  description: String,
  image: String,
  price: String,
});
</script>

<style>
.product-post {
  color: inherit;
}
</style>
