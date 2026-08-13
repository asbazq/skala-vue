<script setup>
import { ref, watch } from 'vue'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'

const alertStore = useWeatherAlertStore()
const heatInput = ref(alertStore.heatThreshold)
const coldInput = ref(alertStore.coldThreshold)

watch(
  () => alertStore.heatThreshold,
  (value) => (heatInput.value = value),
)

watch(
  () => alertStore.coldThreshold,
  (value) => (coldInput.value = value),
)

const applyThresholds = () => {
  alertStore.setThresholds(coldInput.value, heatInput.value)
}
</script>

<template>
  <section class="alert-settings" aria-labelledby="alert-settings-title">
    <div class="settings-header">
      <div>
        <h3 id="alert-settings-title">🚪 나의 외출 기온 기준</h3>
        <p>{{ alertStore.thresholdSummary }}</p>
      </div>
      <button
        type="button"
        class="alert-toggle"
        :class="{ active: alertStore.alertsEnabled }"
        :aria-pressed="alertStore.alertsEnabled"
        @click="alertStore.toggleAlerts"
      >
        <i></i> 기준 표시 {{ alertStore.alertsEnabled ? 'ON' : 'OFF' }}
      </button>
    </div>

    <div class="threshold-controls">
      <label>
        이 온도 이하면 나가기 싫어요(℃)
        <input v-model.number="coldInput" type="number" :max="heatInput - 1" />
      </label>
      <label>
        이 온도 이상이면 나가기 싫어요(℃)
        <input v-model.number="heatInput" type="number" :min="coldInput + 1" />
      </label>
      <button type="button" class="apply-button" @click="applyThresholds">기준 적용</button>
    </div>

    <p v-if="coldInput >= heatInput" class="validation-message">
      아래 기준은 위 기준보다 낮아야 합니다.
    </p>
  </section>
</template>

<style scoped>
.settings-header,
.threshold-controls {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.settings-header {
  justify-content: space-between;
  margin-bottom: 14px;
}

.settings-header h3,
.settings-header p {
  margin: 0;
}

.settings-header p {
  margin-top: 4px;
  color: #6c757d;
  font-size: 13px;
}

.threshold-controls label {
  flex: 1;
  font-size: 13px;
  font-weight: bold;
}

.threshold-controls input {
  box-sizing: border-box;
  width: 100%;
  margin-top: 5px;
  padding: 9px 10px;
  border: 1px solid #293d54;
  border-radius: 7px;
  outline: 0;
  background: #0b1828;
  color: var(--text);
  color-scheme: dark;
}

.threshold-controls input:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(69, 207, 255, 0.12);
}

.alert-toggle,
.apply-button {
  min-height: 38px;
  padding: 9px 12px;
  border: 1px solid #30465d;
  border-radius: 8px;
  background: #142438;
  color: #8fa3ba;
  cursor: pointer;
  font-size: .72rem;
  font-weight: 800;
  white-space: nowrap;
  transition: border-color .18s, background .18s, color .18s, box-shadow .18s, transform .18s;
}

.alert-toggle{display:inline-flex;box-sizing:border-box;width:122px;align-items:center;justify-content:center;gap:7px}.alert-toggle i{width:7px;height:7px;border-radius:50%;background:#637589;box-shadow:0 0 0 3px #63758918}
.alert-toggle.active {
  border-color:#2d8069;
  background:#12352f;
  color:#86e8c6;
  box-shadow:0 0 0 2px #45d6aa12;
}
.alert-toggle.active i{background:#52d6a9;box-shadow:0 0 9px #52d6a9}

.apply-button {
  border-color:#45cfff;
  background:linear-gradient(135deg,#1d91bc,#45cfff);
  color:#06131f;
  box-shadow:0 7px 18px #45cfff20;
}
.alert-toggle:hover{border-color:#52708d;color:#d3e6f5}.alert-toggle.active:hover{border-color:#50d1aa;color:#b9f8e2}.apply-button:hover{box-shadow:0 9px 22px #45cfff35;transform:translateY(-1px)}.alert-toggle:active,.apply-button:active{transform:translateY(1px)}

.validation-message {
  margin: 8px 0 0;
  color: #e74c3c;
  font-size: 13px;
}

@media (max-width: 520px) {
  .threshold-controls {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
