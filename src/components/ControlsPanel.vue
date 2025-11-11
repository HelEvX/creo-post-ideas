<template>
  <aside class="col-12 col-md-3 app__sidebar">
    <h3 class="app__sidebar-title">Control Panel</h3>

    <!-- Recipe Shuffle only after brand selected -->
    <div class="app__sidebar-block" v-if="brandTokens">
      <RecipeShuffle :brandTokens="brandTokens" :scales="scales" />
    </div>

    <!-- Future components (commented placeholders) -->
    <!-- <PostFormatSelector /> -->
    <!-- <ContentLayoutSelector /> -->
    <!-- <ModeToggle /> -->
  </aside>
</template>

<script>
import RecipeShuffle from "./RecipeShuffle.vue";
// Future imports:
// import PostFormatSelector from "./PostFormatSelector.vue";
// import ContentLayoutSelector from "./ContentLayoutSelector.vue";
// import ModeToggle from "./ModeToggle.vue";

export default {
  name: "ControlsPanel",
  components: {
    RecipeShuffle,
    // PostFormatSelector,
    // ContentLayoutSelector,
    // ModeToggle,
  },
  props: {
    brandTokens: Object,
    scales: Object,
  },
};
</script>

<!-- no extra styles needed — inherits App.vue layout -->
