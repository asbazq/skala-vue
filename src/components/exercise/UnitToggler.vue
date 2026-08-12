<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>
<template>
  <button
    class="unit-toggle"
    type="button"
    :aria-label="`현재 ${configStore.unitSymbol}, 온도 단위 변경`"
    @click="configStore.toggleUnit"
  >
    <span class="label">온도</span>
    <span :class="{ active: configStore.unit === 'celsius' }">℃</span>
    <i></i>
    <span :class="{ active: configStore.unit === 'fahrenheit' }">℉</span>
  </button>
</template>

<style scoped>
.unit-toggle {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #263a50;
  border-radius: 8px;
  background: #142438;
  color: #71869c;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.unit-toggle:hover { border-color: #3a566f; background: #172b40; }
.unit-toggle .label { color: #91a6ba; font-size: 0.62rem; font-weight: 600; }
.unit-toggle span:not(.label) { font-size: 0.72rem; font-weight: 800; }
.unit-toggle span.active { color: var(--cyan); text-shadow: 0 0 10px rgba(69, 207, 255, 0.42); }
.unit-toggle i { width: 1px; height: 12px; background: #34495f; }
@media (max-width: 480px) { .unit-toggle .label { display: none; } }
</style>
