import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', () => {
  const cityIds = ref([])
  const count = computed(() => cityIds.value.length)

  const hasFavorite = (cityId) => cityIds.value.includes(cityId)

  const toggleFavorite = (cityId) => {
    cityIds.value = hasFavorite(cityId)
      ? cityIds.value.filter((id) => id !== cityId)
      : [...cityIds.value, cityId]
  }

  return { cityIds, count, hasFavorite, toggleFavorite }
})
