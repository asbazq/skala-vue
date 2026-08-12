import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useWeatherAlertStore = defineStore('weatherAlert', () => {
  // API의 원본 기온과 비교할 수 있도록 경고 기준은 섭씨로 저장한다.
  const heatThreshold = ref(28)
  const coldThreshold = ref(5)
  const alertsEnabled = ref(true)

  const thresholdSummary = computed(() => {
    return `한파 ${coldThreshold.value}℃ 이하 / 폭염 ${heatThreshold.value}℃ 이상`
  })

  const setHeatThreshold = (temperature) => {
    const value = Number(temperature)
    if (Number.isFinite(value) && value > coldThreshold.value) heatThreshold.value = value
  }

  const setColdThreshold = (temperature) => {
    const value = Number(temperature)
    if (Number.isFinite(value) && value < heatThreshold.value) coldThreshold.value = value
  }

  const toggleAlerts = () => {
    alertsEnabled.value = !alertsEnabled.value
  }

  const setThresholds = (coldTemperature, heatTemperature) => {
    const cold = Number(coldTemperature)
    const heat = Number(heatTemperature)
    if (!Number.isFinite(cold) || !Number.isFinite(heat) || cold >= heat) return false
    coldThreshold.value = cold
    heatThreshold.value = heat
    return true
  }

  const getRiskLevel = (celsius) => {
    if (!alertsEnabled.value) return 'normal'
    if (celsius >= heatThreshold.value) return 'heat'
    if (celsius <= coldThreshold.value) return 'cold'
    return 'normal'
  }

  const getRiskLabel = (celsius) => {
    const riskLevel = getRiskLevel(celsius)
    if (riskLevel === 'heat') return '⚠️ 폭염 경고'
    if (riskLevel === 'cold') return '❄️ 한파 경고'
    return ''
  }

  return {
    heatThreshold,
    coldThreshold,
    alertsEnabled,
    thresholdSummary,
    setHeatThreshold,
    setColdThreshold,
    toggleAlerts,
    setThresholds,
    getRiskLevel,
    getRiskLabel,
  }
})
