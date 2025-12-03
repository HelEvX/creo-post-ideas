<template>
  <aside class="col-12 col-md-3 app__sidebar">
    <!-- Recipe Shuffle only after brand selected -->
    <div class="app__sidebar-block" v-if="brandTokens">
      <RecipeShuffle :brandTokens="brandTokens" :scales="scales" />
    </div>
  </aside>
</template>

<script>
import RecipeShuffle from "./RecipeShuffle.vue";

export default {
  name: "ControlsPanel",
  components: {
    RecipeShuffle,
  },
  props: {
    brandTokens: Object,
    scales: Object,
  },
};
</script>

<style scoped>
.app__sidebar,
.app__sidebar-block {
  padding-top: var(--space-25);
  padding-bottom: var(--space-25);
}

.app__sidebar {
  background: var(--color-overlay-accent);
  color: var(--color-title);
  border-top-right-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
}

.app__sidebar-block {
  background: var(--color-overlay-soft);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-10);
  padding: var(--space-10);
}
</style>
