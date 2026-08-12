<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import CurrentWeather from '@/components/weather/CurrentWeather.vue'
import ForecastPanels from '@/components/weather/ForecastPanels.vue'
import WeatherMap from '@/components/weather/WeatherMap.vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import WeatherAlertSettings from '@/components/exercise/WeatherAlertSettings.vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useConfigStore } from '@/stores/configStore'

const cities = [
  { id:'seoul', name:'Seoul', local:'서울', country:'South Korea', temp:28, feels:30, high:31, low:24, status:'Partly Cloudy', icon:'⛅', humidity:68, wind:3.2, pressure:1007, rain:12, coord:[37.5665,126.978], hourly:[['NOW','⛅',28],['15:00','☀️',30],['18:00','🌤️',27],['21:00','🌙',25],['00:00','☁️',24]], weekly:[['MON','☀️',31,24],['TUE','🌧️',28,23],['WED','🌤️',30,24],['THU','☀️',32,25],['FRI','🌧️',27,23],['SAT','⛅',30,24]] },
  { id:'suwon', name:'Suwon', local:'수원', country:'South Korea', temp:24, feels:25, high:27, low:21, status:'Rain', icon:'🌧️', humidity:82, wind:2.9, pressure:1008, rain:46, coord:[37.2636,127.0286], hourly:[['NOW','🌧️',24],['15:00','🌧️',25],['18:00','🌦️',24],['21:00','☁️',23],['00:00','☁️',22]], weekly:[['MON','🌧️',27,21],['TUE','🌦️',26,20],['WED','🌤️',29,21],['THU','☀️',30,22],['FRI','🌧️',26,20],['SAT','⛅',28,21]] },
  { id:'busan', name:'Busan', local:'부산', country:'South Korea', temp:26, feels:27, high:29, low:23, status:'Cloudy', icon:'☁️', humidity:73, wind:4.8, pressure:1010, rain:34, coord:[35.1796,129.0756], hourly:[['NOW','☁️',26],['15:00','☁️',27],['18:00','🌦️',26],['21:00','🌙',24],['00:00','🌙',23]], weekly:[['MON','🌤️',29,24],['TUE','🌧️',27,22],['WED','☁️',28,23],['THU','🌤️',30,24],['FRI','☀️',31,25],['SAT','🌦️',29,24]] },
  { id:'jeju', name:'Jeju', local:'제주', country:'South Korea', temp:27, feels:29, high:30, low:24, status:'Windy', icon:'🌬️', humidity:70, wind:6.8, pressure:1005, rain:18, coord:[33.4996,126.5312], hourly:[['NOW','🌬️',27],['15:00','🌤️',29],['18:00','🌬️',28],['21:00','🌙',26],['00:00','🌙',25]], weekly:[['MON','🌤️',30,24],['TUE','🌧️',28,23],['WED','☀️',31,25],['THU','🌬️',29,24],['FRI','🌤️',30,24],['SAT','☀️',32,25]] },
  { id:'gangneung', name:'Gangneung', local:'강릉', country:'South Korea', temp:23, feels:23, high:27, low:20, status:'Clear', icon:'☀️', humidity:51, wind:2.7, pressure:1012, rain:2, coord:[37.7519,128.8761], hourly:[['NOW','☀️',23],['15:00','☀️',27],['18:00','🌤️',25],['21:00','🌙',22],['00:00','🌙',20]], weekly:[['MON','☀️',27,20],['TUE','🌤️',28,21],['WED','🌧️',25,19],['THU','☀️',29,21],['FRI','☀️',28,20],['SAT','🌤️',27,20]] },
]

for (const city of cities) {
  city.hourly = city.hourly.map(([time, icon, temp]) => ({ time, icon, temp }))
  city.weekly = city.weekly.map(([day, icon, high, low]) => ({ day, icon, high, low }))
}
const selectedId = ref('seoul')
const searchQuery = ref('')
const selectedCityInfo = ref('도시 카드를 선택하거나 상세보기를 눌러보세요.')
const hoverCity = ref(null)
const showFavoritesOnly = ref(false)
const router = useRouter()
const favoriteStore = useFavoriteStore()
const configStore = useConfigStore()
const selected = computed(() => cities.find(city => city.id === selectedId.value) ?? cities[0])
const selectCity = city => { selectedId.value=city.id }
const formatTemp = celsius => `${configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius}${configStore.unitSymbol}`
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return cities
  return cities.filter(city => `${city.local} ${city.name}`.toLowerCase().includes(query))
})
const visibleWeatherList = computed(() => {
  const list = showFavoritesOnly.value ? filteredWeatherList.value.filter(city => favoriteStore.hasFavorite(city.id)) : filteredWeatherList.value
  return [...list]
    .sort((firstCity, secondCity) => {
      return Number(favoriteStore.hasFavorite(secondCity.id)) - Number(favoriteStore.hasFavorite(firstCity.id))
    })
    .map(city => ({ ...city, name:city.local }))
})
watch(selectedCityInfo, info => console.log(`상태바 문구 변경: ${info}`))
watchEffect(() => console.log(`현재 도시 검색어: '${searchQuery.value}'`))
const selectWeatherCard = city => {
  const original = cities.find(item => item.id === city.id)
  if (original) selectCity(original)
  selectedCityInfo.value = `${city.name} 날씨를 선택했습니다.`
}
const showDetail = cityId => {
  const routeIds = { seoul:'city_01', suwon:'city_02', busan:'city_03', jeju:'city_04', gangneung:'city_05' }
  router.push('/weather/' + routeIds[cityId])
}
</script>

<template>
  <section aria-labelledby="weather-title">
    <header class="hero">
      <div><p>LIVE WEATHER INTELLIGENCE</p><h1 id="weather-title">Weather <span>Track</span></h1><small>날씨와 태풍의 움직임을 한 화면에서 확인하세요.</small></div>
    </header>
    <div class="city-tabs" aria-label="빠른 도시 선택"><button v-for="city in cities" :key="city.id" :class="{ active: city.id === selectedId }" @click="selectCity(city)">{{ city.local }} <b>{{ formatTemp(city.temp) }}</b></button></div>
    <div class="dashboard"><CurrentWeather :weather="selected" /><WeatherMap :city="selected" /></div>
    <ForecastPanels :weather="selected" />
    <section class="regional-section" aria-labelledby="city-list-title">
      <BaseDashboardCard>
        <header class="section-heading"><div><p>LOCAL WEATHER</p><h2 id="city-list-title">지역별 날씨</h2></div><button type="button" class="favorite-filter" :class="{active:showFavoritesOnly}" @click="showFavoritesOnly=!showFavoritesOnly">★ 즐겨찾기만 <b>{{ favoriteStore.count }}</b></button></header>
        <SearchBar :current-query="searchQuery" @update-query="searchQuery=$event" />
        <p class="list-description">{{ visibleWeatherList.length }}개 지역 표시 중</p>
      </BaseDashboardCard>
      <BaseDashboardCard>
        <div v-if="visibleWeatherList.length" class="city-card-grid"><WeatherCard v-for="city in visibleWeatherList" :key="city.id" :city-item="city" :is-hovered="hoverCity===city.id" :is-favorite="favoriteStore.hasFavorite(city.id)" @mouseenter="hoverCity=city.id" @mouseleave="hoverCity=null" @select-card="selectWeatherCard(city)" @click-detail="showDetail(city.id)" @toggle-favorite="favoriteStore.toggleFavorite" /></div>
        <p v-else-if="searchQuery" class="empty-message">검색 결과와 일치하는 도시가 없습니다.</p><p v-else class="empty-message">즐겨찾기한 도시가 없습니다.</p>
        <div class="status-bar">{{ selectedCityInfo }}</div>
      </BaseDashboardCard>
      <article class="feature-panel settings-panel"><WeatherAlertSettings /></article>
    </section>
    <p class="data-note">날씨와 태풍 정보는 화면 시연을 위한 샘플 데이터입니다. 지도는 OpenStreetMap을 사용합니다.</p>
  </section>
</template>

<style scoped>
.hero { margin-bottom:20px; }.hero p { margin: 0 0 7px; color: var(--cyan); font-size: .66rem; font-weight: 800; letter-spacing: .17em; }.hero h1 { margin: 0; font-size: clamp(2.6rem, 5vw, 4rem); line-height: .95; letter-spacing: -.06em; }.hero h1 span { color: var(--cyan); }.hero small { display: block; margin-top: 11px; color: var(--muted); }.city-tabs { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; }.city-tabs button { padding: 8px 13px; border: 1px solid #24384f; border-radius: 9px; background: #0e1c2d; color: #8fa3ba; cursor: pointer; white-space: nowrap; }.city-tabs button b { margin-left: 8px; color: #e5f4ff; }.city-tabs button.active { border-color: var(--cyan); background: #102a3d; color: var(--cyan); }.dashboard { display: grid; grid-template-columns: minmax(300px, .72fr) minmax(500px, 1.45fr); gap: 16px; }.data-note { margin: 16px 0 0; color: #60758b; font-size: .68rem; text-align: right; }
.regional-section { display:flex; flex-direction:column; gap:16px; margin-top:28px; padding-top:28px; border-top:1px solid #20344a; }.feature-panel { padding:22px; border:1px solid var(--line); border-radius:16px; background:#0e1c2d; }.settings-panel { margin-top:0; }
.section-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.section-heading p{margin:0 0 4px;color:var(--cyan);font-size:.62rem;font-weight:800;letter-spacing:.13em}.section-heading h2{margin:0;font-size:1.35rem}.favorite-filter{padding:8px 11px;border:1px solid #2b4057;border-radius:8px;background:#142438;color:#8fa3ba;font-size:.72rem;cursor:pointer}.favorite-filter.active{border-color:#d5b52d;background:#332d16;color:#ffe276}.favorite-filter b{color:var(--cyan)}.list-description{margin:9px 0 0;color:var(--muted);font-size:.72rem}.city-card-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.status-bar{margin-top:12px;padding:8px 10px;border-radius:7px;background:#102b31;color:#69dcb7;font-size:.68rem}.empty-message{padding:18px;border:1px dashed #2b4057;border-radius:9px;color:var(--muted);font-size:.8rem;text-align:center}
@media (max-width: 980px) { .dashboard { grid-template-columns: 1fr; }.city-card-grid{grid-template-columns:repeat(3,minmax(0,1fr))} } @media (max-width: 700px) { .hero h1 { font-size: 2.7rem; }.data-note { text-align: left; }.city-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.section-heading{align-items:flex-start;flex-direction:column} } @media(max-width:430px){.city-card-grid{grid-template-columns:1fr}}
</style>
