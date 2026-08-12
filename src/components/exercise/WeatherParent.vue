<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
// 1. 컴포넌트 파일명 국룰 표기법(PascalCase) 매칭 수입
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import FavoriteFilter from './FavoriteFilter.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 27, status: '바람' },
  { id: 'city_05', name: '강릉', temp: 23, status: '맑음' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 과제 1(WeatherMockup): 호버링 중인 도시
const hoverCity = ref(null)

// 과제 2(WeatherComposition): 즐겨찾기로 선택한 도시 id
const favoriteCityIds = ref([])

// 전체 도시와 즐겨찾기 도시 보기를 구분하는 필터 상태
const showFavoritesOnly = ref(false)

// 기존 핵심 비즈니스 로직(computed, watch)의 소유권은 안전하게 부모 콘텍스트가 격리 유지
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const favoriteCount = computed(() => favoriteCityIds.value.length)

// 검색 결과에 즐겨찾기 필터를 적용한 후 즐겨찾기 도시를 상단에 배치한다.
const sortedWeatherList = computed(() => {
  const visibleList = showFavoritesOnly.value
    ? filteredWeatherList.value.filter((item) => favoriteCityIds.value.includes(item.id))
    : filteredWeatherList.value

  return [...visibleList].sort((a, b) => {
    const aFavorite = favoriteCityIds.value.includes(a.id)
    const bFavorite = favoriteCityIds.value.includes(b.id)
    return Number(bFavorite) - Number(aFavorite)
  })
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watch(favoriteCityIds, () => {
  selectedCityInfo.value = `즐겨찾기 도시가 ${favoriteCount.value}개 있습니다.`
})

watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const toggleFavorite = (cityId) => {
  if (favoriteCityIds.value.includes(cityId)) {
    favoriteCityIds.value = favoriteCityIds.value.filter((id) => id !== cityId)
    return
  }

  favoriteCityIds.value = [...favoriteCityIds.value, cityId]
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <FavoriteFilter
        :favorite-count="favoriteCount"
        :show-favorites-only="showFavoritesOnly"
        @update-filter="(value) => (showFavoritesOnly = value)"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황 (즐겨찾기 {{ favoriteCount }}개)</h3>

      <WeatherCard
        v-for="item in sortedWeatherList"
        :key="item.id"
        :city-item="item"
        :is-hovered="hoverCity === item.id"
        :is-favorite="favoriteCityIds.includes(item.id)"
        @mouseenter="hoverCity = item.id"
        @mouseleave="hoverCity = null"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="showDetail"
        @toggle-favorite="toggleFavorite"
      />

      <p v-if="sortedWeatherList.length === 0" class="empty-message">
        {{
          showFavoritesOnly
            ? '☆ 조건에 맞는 즐겨찾기 도시가 없습니다.'
            : '😭 검색 결과와 일치하는 도시가 없습니다.'
        }}
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  width: min(600px, 100%);
  margin: 0 auto;
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
