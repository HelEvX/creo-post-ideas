<template>
  <aside class="col-12 col-md-3 app__sidebar">
    <!-- <h3 class="app__sidebar-title">Kleurenpalet</h3> -->

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

<style scoped>
.app__sidebar {
  background: var(--ui-nav-bg);
  color: var(--color-title);
  border-top-right-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
  border: var(--ui-panel-border-soft);
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

.app__sidebar-block {
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-10);
}
</style>
