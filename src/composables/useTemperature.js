import { computed, toValue } from 'vue'
import { useConfigStore } from '@/stores/configStore'

export const useTemperature = (celsiusSource) => {
  const configStore = useConfigStore()

  const displayTemp = computed(() => {
    const celsius = Number(toValue(celsiusSource))
    return configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
  })

  const formattedTemp = computed(() => `${displayTemp.value}${configStore.unitSymbol}`)

  return { displayTemp, formattedTemp }
}
