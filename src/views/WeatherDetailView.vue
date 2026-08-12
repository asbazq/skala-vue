<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  cityId: {
    type: String,
    required: true,
  },
})

const weatherDetails = {
  city_01: { name:'서울', english:'Seoul', icon:'⛅', temp:28, feels:30, high:31, low:24, status:'구름 조금', humidity:68, wind:3.2, pressure:1007, rain:12 },
  city_02: { name:'수원', english:'Suwon', icon:'🌧️', temp:24, feels:25, high:27, low:21, status:'비', humidity:82, wind:2.9, pressure:1008, rain:46 },
  city_03: { name:'부산', english:'Busan', icon:'☁️', temp:26, feels:27, high:29, low:23, status:'흐림', humidity:73, wind:4.8, pressure:1010, rain:34 },
  city_04: { name:'제주', english:'Jeju', icon:'🌬️', temp:27, feels:29, high:30, low:24, status:'강풍', humidity:70, wind:6.8, pressure:1005, rain:18 },
  city_05: { name:'강릉', english:'Gangneung', icon:'☀️', temp:23, feels:23, high:27, low:20, status:'맑음', humidity:51, wind:2.7, pressure:1012, rain:2 },
}

const city = ref(null)
const selectCityFromMockData = () => {
  city.value = weatherDetails[props.cityId] ?? null
}
onMounted(selectCityFromMockData)
watch(() => props.cityId, selectCityFromMockData)
const cityTemp = computed(() => city.value?.temp ?? 0)
const { formattedTemp } = useTemperature(cityTemp)
const alertStore = useWeatherAlertStore()
const configStore = useConfigStore()
const formatTemp = celsius => `${configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius}${configStore.unitSymbol}`
</script>

<template>
  <section class="detail-view">
    <template v-if="city">
      <header class="detail-header"><div><p>LOCAL WEATHER DETAILS</p><h1>{{ city.name }} <small>{{ city.english }}</small></h1></div><span>{{ city.icon }}</span></header>
      <p
        v-if="alertStore.getRiskLabel(city.temp)"
        class="risk-alert"
        :class="alertStore.getRiskLevel(city.temp)"
      >
        {{ alertStore.getRiskLabel(city.temp) }} · {{ alertStore.thresholdSummary }}
      </p>
      <section class="temperature-summary"><strong>{{ formattedTemp }}</strong><div><b>{{ city.status }}</b><span>체감 {{ formatTemp(city.feels) }} · 최고 {{ formatTemp(city.high) }} / 최저 {{ formatTemp(city.low) }}</span></div></section>
      <dl>
        <div><dt>습도</dt><dd>{{ city.humidity }}%</dd><small>상대 습도</small></div>
        <div><dt>풍속</dt><dd>{{ city.wind }}m/s</dd><small>지상 관측 풍속</small></div>
        <div><dt>기압</dt><dd>{{ city.pressure }}hPa</dd><small>해면 기압</small></div>
        <div><dt>강수량</dt><dd>{{ city.rain }}mm</dd><small>오늘 누적 강수</small></div>
      </dl>
    </template>
    <div v-else>
      <h2>도시 정보를 찾을 수 없습니다.</h2>
      <p>요청한 도시 코드: {{ cityId }}</p>
    </div>
    <RouterLink to="/" class="back-link">← 날씨 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.detail-view {
  padding: clamp(22px,4vw,40px);
  border: 1px solid var(--line);
  border-radius: 16px;
  background: linear-gradient(145deg,#101f31,#0d1928);
  color: var(--text);
}
.detail-header { display:flex; align-items:center; justify-content:space-between; gap:20px; padding-bottom:24px; border-bottom:1px solid var(--line); }.detail-header p { margin:0 0 5px; color:var(--cyan); font-size:.65rem; font-weight:800; letter-spacing:.15em; }.detail-header h1 { margin:0; font-size:clamp(2rem,5vw,3.5rem); }.detail-header h1 small { color:var(--muted); font-size:.8rem; }.detail-header>span { font-size:4rem; }.temperature-summary { display:flex; align-items:center; gap:24px; padding:32px 0; }.temperature-summary>strong { font-size:clamp(4rem,9vw,7rem); line-height:.8; letter-spacing:-.08em; }.temperature-summary div { display:flex; flex-direction:column; gap:5px; }.temperature-summary b { font-size:1.2rem; }.temperature-summary span { color:var(--muted); font-size:.8rem; }

.risk-alert {
  padding: 10px 12px;
  border-radius: 6px;
  color: #fff;
  font-weight: bold;
}

.risk-alert.heat { background: #d63031; }
.risk-alert.cold { background: #0984e3; }

dl {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

dl div {
  padding: 18px;
  border:1px solid #21364c;
  border-radius: 10px;
  background: var(--panel-soft);
}

dt { color: var(--muted); font-size:.72rem; }
dd { margin: 4px 0 0; color:var(--text); font-size: 22px; font-weight: bold; }
dl small { color:#657a90; font-size:.65rem; }.back-link { display: inline-block; margin-top: 24px; padding:9px 13px; border-radius:8px; background:#173148; color:#8edfff; }
@media(max-width:600px){.temperature-summary{align-items:flex-start;flex-direction:column}.detail-header>span{font-size:3rem}dl{grid-template-columns:1fr}}
</style>
