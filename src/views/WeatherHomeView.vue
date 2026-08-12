<script setup>
import { computed, ref } from 'vue'
import CurrentWeather from '@/components/weather/CurrentWeather.vue'
import ForecastPanels from '@/components/weather/ForecastPanels.vue'
import WeatherMap from '@/components/weather/WeatherMap.vue'

const cities = [
  { id:'seoul', name:'Seoul', local:'서울', country:'South Korea', temp:28, feels:30, high:31, low:24, status:'Partly Cloudy', icon:'⛅', humidity:68, wind:3.2, pressure:1007, rain:12, coord:[37.5665,126.978], hourly:[['NOW','⛅',28],['15:00','☀️',30],['18:00','🌤️',27],['21:00','🌙',25],['00:00','☁️',24]], weekly:[['MON','☀️',31,24],['TUE','🌧️',28,23],['WED','🌤️',30,24],['THU','☀️',32,25],['FRI','🌧️',27,23],['SAT','⛅',30,24]] },
  { id:'suwon', name:'Suwon', local:'수원', country:'South Korea', temp:24, feels:25, high:27, low:21, status:'Rain', icon:'🌧️', humidity:82, wind:2.9, pressure:1008, rain:46, coord:[37.2636,127.0286], hourly:[['NOW','🌧️',24],['15:00','🌧️',25],['18:00','🌦️',24],['21:00','☁️',23],['00:00','☁️',22]], weekly:[['MON','🌧️',27,21],['TUE','🌦️',26,20],['WED','🌤️',29,21],['THU','☀️',30,22],['FRI','🌧️',26,20],['SAT','⛅',28,21]] },
  { id:'busan', name:'Busan', local:'부산', country:'South Korea', temp:26, feels:27, high:29, low:23, status:'Cloudy', icon:'☁️', humidity:73, wind:4.8, pressure:1010, rain:34, coord:[35.1796,129.0756], hourly:[['NOW','☁️',26],['15:00','☁️',27],['18:00','🌦️',26],['21:00','🌙',24],['00:00','🌙',23]], weekly:[['MON','🌤️',29,24],['TUE','🌧️',27,22],['WED','☁️',28,23],['THU','🌤️',30,24],['FRI','☀️',31,25],['SAT','🌦️',29,24]] },
  { id:'jeju', name:'Jeju', local:'제주', country:'South Korea', temp:27, feels:29, high:30, low:24, status:'Windy', icon:'🌬️', humidity:70, wind:6.8, pressure:1005, rain:18, coord:[33.4996,126.5312], hourly:[['NOW','🌬️',27],['15:00','🌤️',29],['18:00','🌬️',28],['21:00','🌙',26],['00:00','🌙',25]], weekly:[['MON','🌤️',30,24],['TUE','🌧️',28,23],['WED','☀️',31,25],['THU','🌬️',29,24],['FRI','🌤️',30,24],['SAT','☀️',32,25]] },
  { id:'tokyo', name:'Tokyo', local:'도쿄', country:'Japan', temp:31, feels:34, high:33, low:26, status:'Sunny', icon:'☀️', humidity:61, wind:2.6, pressure:1009, rain:4, coord:[35.6762,139.6503], hourly:[['NOW','☀️',31],['15:00','☀️',33],['18:00','🌤️',30],['21:00','🌙',28],['00:00','🌙',27]], weekly:[['MON','☀️',33,26],['TUE','🌤️',32,25],['WED','🌧️',29,24],['THU','☀️',34,26],['FRI','☀️',33,25],['SAT','🌤️',31,24]] },
]

for (const city of cities) {
  city.hourly = city.hourly.map(([time, icon, temp]) => ({ time, icon, temp }))
  city.weekly = city.weekly.map(([day, icon, high, low]) => ({ day, icon, high, low }))
}
const query = ref('')
const selectedId = ref('seoul')
const selected = computed(() => cities.find(city => city.id === selectedId.value) ?? cities[0])
const results = computed(() => { const value=query.value.trim().toLowerCase(); return value ? cities.filter(city => `${city.local} ${city.name}`.toLowerCase().includes(value)) : [] })
const selectCity = city => { selectedId.value=city.id; query.value='' }
</script>

<template>
  <section aria-labelledby="weather-title">
    <header class="hero">
      <div><p>LIVE WEATHER INTELLIGENCE</p><h1 id="weather-title">Weather <span>Track</span></h1><small>날씨와 태풍의 움직임을 한 화면에서 확인하세요.</small></div>
      <div class="search-area">
        <label><span>⌕</span><input v-model="query" type="search" placeholder="도시를 검색하세요 (서울, Busan...)" aria-label="도시 검색"></label>
        <div v-if="query" class="search-results"><button v-for="city in results" :key="city.id" @click="selectCity(city)"><b>{{ city.local }}</b><span>{{ city.name }}, {{ city.country }}</span></button><p v-if="!results.length">검색 결과가 없습니다.</p></div>
      </div>
    </header>
    <div class="city-tabs" aria-label="빠른 도시 선택"><button v-for="city in cities" :key="city.id" :class="{ active: city.id === selectedId }" @click="selectCity(city)">{{ city.local }} <b>{{ city.temp }}°</b></button></div>
    <div class="dashboard"><CurrentWeather :weather="selected" /><WeatherMap :city="selected" /></div>
    <ForecastPanels :weather="selected" />
    <p class="data-note">날씨와 태풍 정보는 화면 시연을 위한 샘플 데이터입니다. 지도는 OpenStreetMap을 사용합니다.</p>
  </section>
</template>

<style scoped>
.hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 30px; margin-bottom: 20px; }.hero p { margin: 0 0 7px; color: var(--cyan); font-size: .66rem; font-weight: 800; letter-spacing: .17em; }.hero h1 { margin: 0; font-size: clamp(2.6rem, 5vw, 4rem); line-height: .95; letter-spacing: -.06em; }.hero h1 span { color: var(--cyan); }.hero small { display: block; margin-top: 11px; color: var(--muted); }.search-area { position: relative; z-index: 600; width: min(430px, 100%); }.search-area label { display: flex; align-items: center; gap: 11px; padding: 13px 16px; border: 1px solid #293d54; border-radius: 11px; background: #101f31; box-shadow: 0 15px 40px #02091488; }.search-area label span { color: var(--cyan); font-size: 1.45rem; }.search-area input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--text); }.search-area input::placeholder { color: #71869c; }.search-results { position: absolute; top: calc(100% + 8px); width: 100%; padding: 7px; border: 1px solid #293d54; border-radius: 11px; background: #101f31; box-shadow: 0 18px 45px #020914; }.search-results button { display: flex; width: 100%; justify-content: space-between; padding: 11px; border: 0; border-radius: 8px; background: transparent; color: var(--text); cursor: pointer; }.search-results button:hover { background: #192b40; }.search-results button span, .search-results p { color: var(--muted); }.search-results p { margin: 0; padding: 10px; }.city-tabs { display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; }.city-tabs button { padding: 8px 13px; border: 1px solid #24384f; border-radius: 9px; background: #0e1c2d; color: #8fa3ba; cursor: pointer; white-space: nowrap; }.city-tabs button b { margin-left: 8px; color: #e5f4ff; }.city-tabs button.active { border-color: var(--cyan); background: #102a3d; color: var(--cyan); }.dashboard { display: grid; grid-template-columns: minmax(300px, .72fr) minmax(500px, 1.45fr); gap: 16px; }.data-note { margin: 16px 0 0; color: #60758b; font-size: .68rem; text-align: right; }
@media (max-width: 980px) { .hero { align-items: stretch; flex-direction: column; }.search-area { width: 100%; }.dashboard { grid-template-columns: 1fr; } } @media (max-width: 600px) { .hero h1 { font-size: 2.7rem; }.data-note { text-align: left; } }
</style>
