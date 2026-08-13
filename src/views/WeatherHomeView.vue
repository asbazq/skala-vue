<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
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
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'
import { fetchAllCityWeather, fetchKmaWarnings } from '@/services/weatherApi'

const cities = ref([
  { id:'seoul', name:'Seoul', local:'서울특별시', coord:[37.5665,126.978] },
  { id:'busan', name:'Busan', local:'부산광역시', coord:[35.1796,129.0756] },
  { id:'daegu', name:'Daegu', local:'대구광역시', coord:[35.8714,128.6014] },
  { id:'incheon', name:'Incheon', local:'인천광역시', coord:[37.4563,126.7052] },
  { id:'gwangju', name:'Gwangju', local:'광주광역시', coord:[35.1595,126.8526] },
  { id:'daejeon', name:'Daejeon', local:'대전광역시', coord:[36.3504,127.3845] },
  { id:'ulsan', name:'Ulsan', local:'울산광역시', coord:[35.5384,129.3114] },
  { id:'sejong', name:'Sejong', local:'세종특별자치시', coord:[36.48,127.289] },
  { id:'gyeonggi', name:'Suwon', local:'경기도', coord:[37.2636,127.0286] },
  { id:'gangwon', name:'Chuncheon', local:'강원특별자치도', coord:[37.8813,127.73] },
  { id:'chungbuk', name:'Cheongju', local:'충청북도', coord:[36.6424,127.489] },
  { id:'chungnam', name:'Hongseong', local:'충청남도', coord:[36.601,126.6608] },
  { id:'jeonbuk', name:'Jeonju', local:'전북특별자치도', coord:[35.8242,127.148] },
  { id:'jeonnam', name:'Muan', local:'전라남도', coord:[34.9904,126.4817] },
  { id:'gyeongbuk', name:'Andong', local:'경상북도', coord:[36.576,128.5058] },
  { id:'gyeongnam', name:'Changwon', local:'경상남도', coord:[35.2279,128.6811] },
  { id:'jeju', name:'Jeju', local:'제주특별자치도', coord:[33.4996,126.5312] },
])

for (const city of cities.value) {
  Object.assign(city, { country:'South Korea', temp:0, feels:0, high:0, low:0, status:'불러오는 중', icon:'🌤️', humidity:0, wind:0, pressure:0, rain:0, hourly:[], weekly:[] })
}
const selectedId = ref('seoul')
const searchQuery = ref('')
const selectedCityInfo = ref('도시 카드를 선택하거나 상세보기를 눌러보세요.')
const hoverCity = ref(null)
const showFavoritesOnly = ref(false)
const router = useRouter()
const favoriteStore = useFavoriteStore()
const configStore = useConfigStore()
const alertStore = useWeatherAlertStore()
const selected = computed(() => cities.value.find(city => city.id === selectedId.value) ?? cities.value[0])
const selectCity = city => { selectedId.value=city.id }
const formatTemp = celsius => `${configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius}${configStore.unitSymbol}`
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return cities.value
  return cities.value.filter(city => `${city.local} ${city.name}`.toLowerCase().includes(query))
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
const showDetail = cityId => {
  router.push('/weather/' + cityId)
}
onMounted(async () => {
  selectedCityInfo.value = '최신 날씨와 기상청 예·특보를 불러오는 중입니다.'
  try {
    const weather = await fetchAllCityWeather(cities.value)
    let warnings = []
    try { warnings = await fetchKmaWarnings() } catch (warningError) { console.warn(warningError.message) }
    cities.value = weather.map(city => ({ ...city, warnings:warnings.filter(warning => warning.regionIds.includes(city.id)) }))
    selectedCityInfo.value = `OpenWeather 최신 관측과 기상청 발효 예·특보를 표시합니다. (전국 ${warnings.length}건)`
  } catch (error) {
    console.error(error)
    selectedCityInfo.value = '날씨 API 연결에 실패하여 기존 데이터를 표시합니다.'
  }
})
</script>

<template>
  <section aria-labelledby="weather-title">
    <header class="hero">
      <div><p>PERSONAL OUTDOOR WEATHER</p><h1 id="weather-title" class="wordmark">나갈까<span>?</span></h1><small>내 기준으로 확인하는 외출 날씨</small></div>
    </header>
    <details class="outdoor-settings">
      <summary>
        <span><i>🚪</i><b>나의 외출 기온 기준</b><small>{{ alertStore.coldThreshold }}℃ 이하 · {{ alertStore.heatThreshold }}℃ 이상은 피하고 싶어요</small></span>
        <em :class="{active:alertStore.alertsEnabled}">{{ alertStore.alertsEnabled ? '적용 중' : '사용 안 함' }}</em>
        <strong>기준 변경</strong>
      </summary>
      <div class="settings-content"><WeatherAlertSettings /></div>
    </details>
    <div class="city-tabs" aria-label="빠른 도시 선택"><button v-for="city in cities" :key="city.id" :class="{ active: city.id === selectedId }" @click="selectCity(city)">{{ city.local }} <b>{{ formatTemp(city.temp) }}</b></button></div>
    <div class="dashboard"><CurrentWeather :weather="selected" /><WeatherMap :city="selected" :cities="cities" /></div>
    <ForecastPanels :weather="selected" />
    <section class="regional-section" aria-labelledby="city-list-title">
      <BaseDashboardCard>
        <header class="section-heading"><div><p>LOCAL WEATHER</p><h2 id="city-list-title">지역별 날씨</h2></div><button type="button" class="favorite-filter" :class="{active:showFavoritesOnly}" @click="showFavoritesOnly=!showFavoritesOnly">★ 즐겨찾기만 <b>{{ favoriteStore.count }}</b></button></header>
        <SearchBar :current-query="searchQuery" @update-query="searchQuery=$event" />
        <p class="list-description">{{ visibleWeatherList.length }}개 지역 표시 중</p>
      </BaseDashboardCard>
      <BaseDashboardCard>
        <div v-if="visibleWeatherList.length" class="city-card-grid"><WeatherCard v-for="city in visibleWeatherList" :key="city.id" :city-item="city" :is-hovered="hoverCity===city.id" :is-favorite="favoriteStore.hasFavorite(city.id)" @mouseenter="hoverCity=city.id" @mouseleave="hoverCity=null" @click-detail="showDetail" @toggle-favorite="favoriteStore.toggleFavorite" /></div>
        <p v-else-if="searchQuery" class="empty-message">검색 결과와 일치하는 도시가 없습니다.</p><p v-else class="empty-message">즐겨찾기한 도시가 없습니다.</p>
        <div class="status-bar">
          <span>{{ selectedCityInfo }}</span>
          <details>
            <summary>쾌적도 계산 기준 보기</summary>
            <p><b>100점</b>에서 불편 요소를 차감합니다.</p>
            <ul>
              <li><strong>기온</strong> 현재 기준 {{ alertStore.coldThreshold }}℃ 이하·{{ alertStore.heatThreshold }}℃ 이상이면 24점 + 1℃당 5점 감점</li>
              <li><strong>기준 안 기온</strong> 두 기준의 중간값 {{ (alertStore.coldThreshold + alertStore.heatThreshold) / 2 }}℃에서 1℃ 멀어질 때마다 1.2점 감점</li>
              <li><strong>습도</strong> 70% 초과 시 1%p당 0.45점, 30% 미만 시 1%p당 0.3점 감점</li>
              <li><strong>비</strong> 강수확률 1%p당 0.34점 감점</li>
              <li><strong>바람</strong> 4m/s 초과분 1m/s당 3.5점 감점</li>
              <li><strong>예·특보</strong> 발효 1건당 30점 감점</li>
            </ul>
            <small>85점 이상 매우 쾌적 · 70점 이상 쾌적 · 50점 이상 보통 · 30점 이상 외출 주의 · 30점 미만 외출 비추천</small>
          </details>
        </div>
      </BaseDashboardCard>
    </section>
    <p class="data-note">날씨는 OpenWeather, 예·특보와 태풍은 기상청 API 데이터입니다. 지도는 OpenStreetMap을 사용합니다.</p>
  </section>
</template>

<style scoped>
.hero { margin-bottom:20px; }.hero p { margin: 0 0 7px; color: var(--cyan); font-size: .66rem; font-weight: 800; letter-spacing: .17em; }.hero .wordmark{margin:0;font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;font-size:clamp(2.8rem,5vw,4.25rem);font-weight:850;line-height:1;letter-spacing:-.055em}.hero .wordmark span{display:inline-block;margin-left:.03em;color:var(--cyan);font-size:.88em;font-weight:900;transform:translateY(-.04em)}.hero small { display: block; margin-top: 11px; color: var(--muted); }.outdoor-settings{margin:-4px 0 16px;border:1px solid #28506d;border-radius:12px;background:linear-gradient(135deg,#10293a,#0e1c2d);box-shadow:0 10px 28px #02091430}.outdoor-settings summary{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:12px;padding:13px 15px;list-style:none;cursor:pointer}.outdoor-settings summary::-webkit-details-marker{display:none}.outdoor-settings summary>span{display:grid;grid-template-columns:auto auto 1fr;align-items:center;gap:8px;min-width:0}.outdoor-settings summary i{font-style:normal}.outdoor-settings summary b{color:#e5f4ff;font-size:.8rem}.outdoor-settings summary small{overflow:hidden;color:#8297ad;font-size:.7rem;text-overflow:ellipsis;white-space:nowrap}.outdoor-settings summary em{box-sizing:border-box;width:62px;padding:4px 5px;border-radius:99px;background:#2b3540;color:#82909d;font-size:.59rem;font-style:normal;font-weight:800;text-align:center}.outdoor-settings summary em.active{background:#123e34;color:#7ce4bf}.outdoor-settings summary>strong{color:#8edfff;font-size:.68rem}.outdoor-settings summary>strong::after{display:inline-block;margin-left:6px;content:'⌄';transition:transform .2s}.outdoor-settings[open] summary>strong::after{transform:rotate(180deg)}.settings-content{padding:16px;border-top:1px solid #28506d80}.city-tabs { display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;margin-bottom:16px; }.city-tabs button { min-width:0;padding:8px 13px;border:1px solid #24384f;border-radius:9px;background:#0e1c2d;color:#8fa3ba;cursor:pointer;white-space:nowrap; }.city-tabs button b { margin-left: 8px; color: #e5f4ff; }.city-tabs button.active { border-color: var(--cyan); background: #102a3d; color: var(--cyan); }.dashboard { display: grid; grid-template-columns: minmax(300px, .72fr) minmax(500px, 1.45fr); gap: 16px; }.data-note { margin: 16px 0 0; color: #60758b; font-size: .68rem; text-align: right; }
.regional-section { display:flex; flex-direction:column; gap:16px; margin-top:28px; padding-top:28px; border-top:1px solid #20344a; }.feature-panel { padding:22px; border:1px solid var(--line); border-radius:16px; background:#0e1c2d; }.settings-panel { margin-top:0; }
.section-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.section-heading p{margin:0 0 4px;color:var(--cyan);font-size:.62rem;font-weight:800;letter-spacing:.13em}.section-heading h2{margin:0;font-size:1.35rem}.favorite-filter{padding:8px 11px;border:1px solid #2b4057;border-radius:8px;background:#142438;color:#8fa3ba;font-size:.72rem;cursor:pointer}.favorite-filter.active{border-color:#d5b52d;background:#332d16;color:#ffe276}.favorite-filter b{color:var(--cyan)}.list-description{margin:9px 0 0;color:var(--muted);font-size:.72rem}.city-card-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.status-bar{margin-top:12px;padding:10px 12px;border-radius:7px;background:#102b31;color:#69dcb7;font-size:.68rem}.status-bar>span{display:block}.status-bar details{margin-top:7px;padding-top:7px;border-top:1px solid #69dcb726;color:#93b8ad}.status-bar summary{width:fit-content;color:#a7ead5;font-weight:800;cursor:pointer}.status-bar details p{margin:9px 0 5px}.status-bar details p b{color:#d2fff1}.status-bar ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 18px;margin:7px 0;padding-left:18px;line-height:1.45}.status-bar li strong{color:#bdebdc}.status-bar small{display:block;margin-top:8px;color:#6f9f91}.empty-message{padding:18px;border:1px dashed #2b4057;border-radius:9px;color:var(--muted);font-size:.8rem;text-align:center}
@media(max-width:1100px){.city-tabs{grid-template-columns:repeat(5,minmax(0,1fr))}}@media (max-width: 980px) { .dashboard { grid-template-columns: 1fr; }.city-card-grid{grid-template-columns:repeat(3,minmax(0,1fr))} }@media(max-width:800px){.city-tabs{grid-template-columns:repeat(3,minmax(0,1fr))}} @media (max-width: 700px) { .hero .wordmark { font-size: 2.9rem; }.data-note { text-align: left; }.city-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.section-heading{align-items:flex-start;flex-direction:column}.status-bar ul{grid-template-columns:1fr}.outdoor-settings summary{grid-template-columns:minmax(0,1fr) auto}.outdoor-settings summary>span{grid-template-columns:auto 1fr}.outdoor-settings summary small{grid-column:1/-1;white-space:normal}.outdoor-settings summary em{display:none}.outdoor-settings summary>strong{grid-column:2;grid-row:1} } @media(max-width:520px){.city-tabs{grid-template-columns:1fr}}@media(max-width:430px){.city-card-grid{grid-template-columns:1fr}}
</style>
