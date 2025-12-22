<template>
  <aside class="col-12 col-xxl-3 col-3xl-3 app__sidebar">
    <!-- Recipe Shuffle only after brand selected: -->
    <div class="app__sidebar-block" v-if="brandTokens">
      <RecipeShuffle :brandTokens="brandTokens" :scales="scales" :bgContext="mockupBgContext" />
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

    mockupBgContext: {
      type: Object,
      default: () => ({
        type: "color",
        tone: "primary",
        bgVars: ["--ui-section-bg"],
      }),
    },
  },
};
</script>
