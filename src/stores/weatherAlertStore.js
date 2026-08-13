import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useWeatherAlertStore = defineStore('personalOutdoorTemperature', () => {
  // API의 원본 기온과 비교할 수 있도록 개인 외출 기준은 섭씨로 저장한다.
  const heatThreshold = ref(28)
  const coldThreshold = ref(5)
  const alertsEnabled = ref(true)

  const thresholdSummary = computed(() => {
    return `${coldThreshold.value}℃ 이하면 외출 주의 / ${heatThreshold.value}℃ 이상이면 외출 주의`
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
    if (celsius >= heatThreshold.value) return 'above-limit'
    if (celsius <= coldThreshold.value) return 'below-limit'
    return 'normal'
  }

  const getRiskLabel = (celsius) => {
    const riskLevel = getRiskLevel(celsius)
    if (riskLevel === 'above-limit') return '🥵 나가기엔 너무 더워요'
    if (riskLevel === 'below-limit') return '🥶 나가기엔 너무 추워요'
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
