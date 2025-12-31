<template>
  <div class="paragraph-post">
    <div v-if="zone === 'safe'" class="card panel">
      <div class="card__caption">
        <i class="fa-solid fa-link post-icon"></i>
        <span>Even voorstellen</span>
      </div>

      <div class="card__title">
        <div>Heb je al van ons gehoord?</div>
      </div>

      <div class="card__text">
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  zone: { type: String, required: true },
});
</script>

<style></style>
