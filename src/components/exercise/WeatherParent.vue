<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'

const props = defineProps({ weatherList: { type: Array, required: true } })
const emit = defineEmits(['select-city', 'click-detail'])
const favoriteStore = useFavoriteStore()

// 지역별 날씨 영역의 모든 반응형 데이터는 부모 컴포넌트가 소유한다.
const searchQuery = ref('')
const selectedCityInfo = ref('도시 카드를 선택해 상세 날씨를 확인하세요.')
const hoverCity = ref(null)
const showFavoritesOnly = ref(false)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.weatherList
  return props.weatherList.filter(city => `${city.local} ${city.name}`.toLowerCase().includes(query))
})
const visibleWeatherList = computed(() => {
  const list = showFavoritesOnly.value
    ? filteredWeatherList.value.filter(city => favoriteStore.hasFavorite(city.id))
    : filteredWeatherList.value
  return list.map(city => ({ ...city, name: city.local }))
})

watch(selectedCityInfo, newInfo => console.log(`상태바 문구 변경: ${newInfo}`))
watchEffect(() => console.log(`현재 도시 검색어: '${searchQuery.value}'`))

const selectCard = city => {
  const original = props.weatherList.find(item => item.id === city.id)
  selectedCityInfo.value = `${city.name} 날씨를 선택했습니다.`
  if (original) emit('select-city', original)
}
const showDetail = city => {
  emit('click-detail', city.id)
}
</script>

<template>
  <section class="weather-parent" aria-labelledby="city-list-title">
    <BaseDashboardCard>
      <header class="section-heading">
        <div><p>LOCAL WEATHER</p><h2 id="city-list-title">지역별 날씨</h2></div>
        <button type="button" class="favorite-filter" :class="{ active: showFavoritesOnly }" :aria-pressed="showFavoritesOnly" @click="showFavoritesOnly = !showFavoritesOnly">★ 즐겨찾기만 <b>{{ favoriteStore.count }}</b></button>
      </header>
      <SearchBar :current-query="searchQuery" @update-query="searchQuery = $event" />
      <p class="list-description">도시 카드를 선택하면 상세 기상 정보로 이동합니다. {{ visibleWeatherList.length }}개 지역 표시 중</p>
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div v-if="visibleWeatherList.length" class="city-card-grid">
        <WeatherCard v-for="city in visibleWeatherList" :key="city.id" :city-item="city" :is-hovered="hoverCity === city.id" :is-favorite="favoriteStore.hasFavorite(city.id)" @mouseenter="hoverCity = city.id" @mouseleave="hoverCity = null" @select-card="selectCard(city)" @click-detail="showDetail(city)" @toggle-favorite="favoriteStore.toggleFavorite" />
      </div>
      <p v-else-if="searchQuery" class="empty-message">검색 결과와 일치하는 도시가 없습니다.</p>
      <p v-else class="empty-message">즐겨찾기한 도시가 없습니다.</p>
      <div class="status-bar" aria-live="polite">{{ selectedCityInfo }}</div>
    </BaseDashboardCard>
  </section>
</template>

<style scoped>
.weather-parent { display:flex; flex-direction:column; gap:10px; }.section-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }.section-heading p { margin:0 0 4px; color:var(--cyan); font-size:.62rem; font-weight:800; letter-spacing:.13em; }.section-heading h2 { margin:0; font-size:1.35rem; }.favorite-filter { padding:8px 11px; border:1px solid #2b4057; border-radius:8px; background:#142438; color:#8fa3ba; font-size:.72rem; cursor:pointer; }.favorite-filter b { margin-left:4px; color:var(--cyan); }.favorite-filter.active { border-color:#d5b52d; background:#332d16; color:#ffe276; }.list-description { margin:9px 0 0; color:var(--muted); font-size:.72rem; }.city-card-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:9px; }.status-bar { margin-top:12px; padding:8px 10px; border-radius:7px; background:#102b31; color:#69dcb7; font-size:.68rem; }.empty-message { padding:18px; border:1px dashed #2b4057; border-radius:9px; color:var(--muted); font-size:.8rem; text-align:center; }
@media(max-width:980px){.city-card-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:700px){.city-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.section-heading{align-items:flex-start;flex-direction:column}}@media(max-width:430px){.city-card-grid{grid-template-columns:1fr}}
</style>
