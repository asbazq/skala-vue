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
        <h3 id="alert-settings-title">🚨 기온 경고 설정</h3>
        <p>{{ alertStore.thresholdSummary }}</p>
      </div>
      <button
        type="button"
        class="alert-toggle"
        :class="{ active: alertStore.alertsEnabled }"
        :aria-pressed="alertStore.alertsEnabled"
        @click="alertStore.toggleAlerts"
      >
        알림 {{ alertStore.alertsEnabled ? 'ON' : 'OFF' }}
      </button>
    </div>

    <div class="threshold-controls">
      <label>
        한파 기준(℃)
        <input v-model.number="coldInput" type="number" :max="heatInput - 1" />
      </label>
      <label>
        폭염 기준(℃)
        <input v-model.number="heatInput" type="number" :min="coldInput + 1" />
      </label>
      <button type="button" class="apply-button" @click="applyThresholds">기준 적용</button>
    </div>

    <p v-if="coldInput >= heatInput" class="validation-message">
      한파 기준은 폭염 기준보다 낮아야 합니다.
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
  padding: 7px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.alert-toggle,
.apply-button {
  padding: 8px 10px;
  border: 0;
  border-radius: 4px;
  background: #95a5a6;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
}

.alert-toggle.active {
  background: #e74c3c;
}

.apply-button {
  background: #3498db;
}

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
