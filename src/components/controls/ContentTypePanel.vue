<template>
  <aside class="content-type-panel">
    <h6>Type inhoud</h6>

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

    <label class="colored-toggle">
      <h6>Kleurrijk</h6>
      <input type="checkbox" :checked="colored" @change="emit('update-colored', $event.target.checked)" />
    </label>

    <BackgroundToggle :tone="tone" @change="emit('update-tone', $event)" />

    <div class="content-type-panel__divider"></div>

    <h6>Achtergrond</h6>

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

const emit = defineEmits(["select", "update-tone", "update-mode", "update-colored"]);

const { selected, tone, selectedMode } = defineProps({
  selected: String,
  tone: String, // "primary" | "secondary"
  colored: {
    type: Boolean,
    default: true,
  },
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
  margin-right: 2.5rem;
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
  background: var(--color-border-light);
  margin: var(--space-20) var(--space-30) var(--space-40);
}

.colored-toggle {
  display: flex;
  align-items: top;
  justify-content: center;
}

.colored-toggle input {
  height: 20px;
  flex: 0;
  margin: var(--space-10) var(--space-20) 0;
}
</style>
