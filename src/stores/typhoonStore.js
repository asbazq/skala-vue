import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useTyphoonStore = defineStore('typhoon', () => {
  const showPastTrack = ref(true)
  const showKma = ref(true)
  const showJma = ref(true)
  const showJtwc = ref(true)
  const showForecastRange = ref(true)
  const agencyVisibility = { KMA: showKma, JMA: showJma, JTWC: showJtwc }
  const visibleAgencyCount = computed(() => Object.values(agencyVisibility).filter(item => item.value).length)
  const isAgencyVisible = agency => agencyVisibility[agency]?.value ?? false
  const toggleAgency = agency => { if (agencyVisibility[agency]) agencyVisibility[agency].value = !agencyVisibility[agency].value }
  const togglePastTrack = () => { showPastTrack.value = !showPastTrack.value }
  const toggleForecastRange = () => { showForecastRange.value = !showForecastRange.value }
  return { showPastTrack, showKma, showJma, showJtwc, showForecastRange, visibleAgencyCount, isAgencyVisible, toggleAgency, togglePastTrack, toggleForecastRange }
})
