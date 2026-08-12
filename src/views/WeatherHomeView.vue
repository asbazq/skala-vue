<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import FavoriteFilter from '@/components/exercise/FavoriteFilter.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import WeatherAlertSettings from '@/components/exercise/WeatherAlertSettings.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'

const router = useRouter()
const favoriteStore = useFavoriteStore()

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 27, status: '바람' },
  { id: 'city_05', name: '강릉', temp: 23, status: '맑음' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const hoverCity = ref(null)
const showFavoritesOnly = ref(false)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const sortedWeatherList = computed(() => {
  const visibleList = showFavoritesOnly.value
    ? filteredWeatherList.value.filter((item) => favoriteStore.hasFavorite(item.id))
    : filteredWeatherList.value

  return [...visibleList].sort((a, b) => {
    return (
      Number(favoriteStore.hasFavorite(b.id)) - Number(favoriteStore.hasFavorite(a.id))
    )
  })
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`선택 정보가 변경되었습니다: ${newInfo}`)
})

watch(
  () => favoriteStore.cityIds,
  () => {
    selectedCityInfo.value = `즐겨찾기 도시가 ${favoriteStore.count}개 있습니다.`
  },
  { deep: true },
)

watchEffect(() => {
  console.log(`검색어 '${searchQuery.value}'의 결과는 ${filteredWeatherList.value.length}개입니다.`)
})

const showDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}
</script>

<template>
  <section aria-labelledby="weather-title">
    <h2 id="weather-title">🌦️ 날씨 대시보드</h2>

    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="searchQuery = $event" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <FavoriteFilter
        :favorite-count="favoriteStore.count"
        :show-favorites-only="showFavoritesOnly"
        @update-filter="showFavoritesOnly = $event"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <WeatherAlertSettings />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황 (즐겨찾기 {{ favoriteStore.count }}개)</h3>
      <WeatherCard
        v-for="item in sortedWeatherList"
        :key="item.id"
        :city-item="item"
        :is-hovered="hoverCity === item.id"
        :is-favorite="favoriteStore.hasFavorite(item.id)"
        @mouseenter="hoverCity = item.id"
        @mouseleave="hoverCity = null"
        @select-card="selectedCityInfo = $event"
        @click-detail="showDetail(item.id)"
        @toggle-favorite="favoriteStore.toggleFavorite"
      />

      <p v-if="sortedWeatherList.length === 0" class="empty-message">
        {{ showFavoritesOnly ? '☆ 조건에 맞는 즐겨찾기 도시가 없습니다.' : '😭 검색 결과가 없습니다.' }}
      </p>
    </BaseDashboardCard>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 16px;
}

.empty-message {
  padding: 10px 0;
  color: #e74c3c;
  text-align: center;
}

.status-bar {
  padding: 10px;
  border-radius: 6px;
  background: #e8f5e9;
  color: #2e7d32;
  font-weight: bold;
  text-align: center;
}
</style>
