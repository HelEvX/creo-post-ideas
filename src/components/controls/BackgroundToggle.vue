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
  justify-content: left;
  gap: var(--space-5);
}

/* labels left and right */
.tone-toggle__label {
  color: var(--dynamic-disabled);
  width: var(--space-20);
  text-align: center;
}

.tone-toggle__label.active {
  font-weight: 700;
  color: inherit;
}

/* TRACK */
.tone-toggle__track {
  position: relative;
  width: 40px;
  height: 20px;
  padding: 3px;
  border-radius: 20px;
  flex: 0 0 40px;
  border-color: var(--color-border-light);
  cursor: pointer;
  transition: var(--transition-default);
}

/* COLOR STATES */
.tone-toggle__track.primary {
  background: var(--ui-primary-bg);
}

.tone-toggle__track.secondary {
  background: var(--ui-secondary-bg);
}

/* thumb */
.tone-toggle__thumb {
  width: 14px;
  height: 14px;
  background: var(--text-on-primary);
  border-radius: 50%;
  transform: translateX(-66.67%);
  transition: var(--transition-default);
}

.tone-toggle__track.secondary .tone-toggle__thumb {
  background: var(--text-on-secondary);
  transform: translateX(66.67%);
}
</style>
