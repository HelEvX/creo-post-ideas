<template>
  <div class="tone-toggle">
    <span class="tone-toggle__label" :class="{ active: tone === 'primary' }">1</span>

    <button type="button" class="tone-toggle__track" :class="tone" @click="toggle">
      <div class="tone-toggle__thumb" :class="{ active: tone === 'secondary' }"></div>
    </button>

    <span class="tone-toggle__label" :class="{ active: tone === 'secondary' }">2</span>
  </div>
</template>

<script setup>
const emit = defineEmits(["change"]);
const { tone } = defineProps({ tone: String });

function toggle() {
  emit("change", tone === "primary" ? "secondary" : "primary");
}
</script>

<style scoped>
.tone-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-10);
}

/* labels left and right */
.tone-toggle__label {
  font-size: var(--fs-caption);
  color: var(--ui-soft);
  width: 1.5rem;
  text-align: center;
}

.tone-toggle__label.active {
  font-weight: 700;
  color: var(--ui-heading);
}

/* TRACK */
.tone-toggle__track {
  position: relative;
  width: 64px;
  height: 32px;
  padding: 3px;
  border-radius: 32px;
  border: 2px solid var(--ui-panel-border);
  cursor: pointer;
  transition: background-color 0.25s ease;
}

/* COLOR STATES */
.tone-toggle__track.primary {
  background: var(--color-primary);
}

.tone-toggle__track.secondary {
  background: var(--color-secondary);
}

/* THUMB */
.tone-toggle__thumb {
  width: 24px;
  height: 24px;
  background: var(--color-on-primary);
  border-radius: 50%;
  transform: translateX(-66.67%);
  transition: transform 0.25s ease;
}

.tone-toggle__thumb.active {
  transform: translateX(66.67%);
  background: var(--color-on-secondary);
}
</style>
