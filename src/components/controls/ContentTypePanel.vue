<template>
  <aside class="content-type-panel">
    <div class="content-type-panel__title">Inhoud</div>

    <div class="content-type-panel__buttons">
      <button
        v-for="type in types"
        :key="type.id"
        type="button"
        :class="['content-type-panel__btn', selected === type.id ? 'btn-primary btn-active' : 'btn-inactive']"
        @click="emit('select', type.id)">
        {{ type.label }}
      </button>
    </div>

    <div class="content-type-panel__divider"></div>

    <div class="content-type-panel__title">Hoofdkleur</div>

    <BackgroundToggle :tone="tone" @change="emit('update-tone', $event)" />

    <div class="content-type-panel__divider"></div>

    <div class="content-type-panel__title">Achtergrond</div>

    <div class="content-type-panel__buttons">
      <button
        v-for="mode in modes"
        :key="mode.id"
        type="button"
        :class="['content-type-panel__btn', selectedMode === mode.id ? 'btn-primary btn-active' : 'btn-inactive']"
        @click="emit('update-mode', mode.id)">
        {{ mode.label }}
      </button>
    </div>
  </aside>
</template>

<script setup>
import BackgroundToggle from "./BackgroundToggle.vue";

const emit = defineEmits(["select", "update-tone", "update-mode"]);

const { selected, tone, selectedMode } = defineProps({
  selected: String,
  tone: String, // "primary" | "secondary"
  selectedMode: String, // "none" | "logo" | "pattern" | "image"
});

const types = [
  { id: "info", label: "Info" },
  { id: "headline", label: "Titel" },
  { id: "intro", label: "Intro" },
  { id: "quote", label: "Quote" },
  { id: "product", label: "Product" },
  { id: "paragraph", label: "Paragraaf" },
];

const modes = [
  { id: "none", label: "Geen" },
  { id: "logo", label: "Logo" },
  { id: "pattern", label: "Patroon" },
  { id: "image", label: "Afbeelding" },
];
</script>

<style scoped>
.content-type-panel {
  /* padding: 2.5rem; */
  /* margin-left: -2.5rem; */
  margin-right: 2.5rem;
}

.content-type-panel__title {
  font-size: var(--fs-body-xs);
  font-weight: 700;
  margin-bottom: var(--space-20);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ui-caption);
}

.content-type-panel__buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}

.content-type-panel__btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-10) var(--space-20);
}

.content-type-panel__divider {
  height: 1px;
  width: auto;
  background: var(--color-border-medium);
  margin: var(--space-20) var(--space-10);
}
</style>
