<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'
import { useConfigStore } from '@/stores/configStore'
import { fetchCityWeather, fetchKmaWarnings } from '@/services/weatherApi'
import ForecastPanels from '@/components/weather/ForecastPanels.vue'
import HourlyWeatherChart from '@/components/weather/HourlyWeatherChart.vue'
import WeatherWarnings from '@/components/weather/WeatherWarnings.vue'

const props = defineProps({
  cityId: {
    type: String,
    required: true,
  },
})

const regions = {
  seoul:['서울특별시','Seoul',37.5665,126.978], busan:['부산광역시','Busan',35.1796,129.0756],
  daegu:['대구광역시','Daegu',35.8714,128.6014], incheon:['인천광역시','Incheon',37.4563,126.7052],
  gwangju:['광주광역시','Gwangju',35.1595,126.8526], daejeon:['대전광역시','Daejeon',36.3504,127.3845],
  ulsan:['울산광역시','Ulsan',35.5384,129.3114], sejong:['세종특별자치시','Sejong',36.48,127.289],
  gyeonggi:['경기도','Suwon',37.2636,127.0286], gangwon:['강원특별자치도','Chuncheon',37.8813,127.73],
  chungbuk:['충청북도','Cheongju',36.6424,127.489], chungnam:['충청남도','Hongseong',36.601,126.6608],
  jeonbuk:['전북특별자치도','Jeonju',35.8242,127.148], jeonnam:['전라남도','Muan',34.9904,126.4817],
  gyeongbuk:['경상북도','Andong',36.576,128.5058], gyeongnam:['경상남도','Changwon',35.2279,128.6811],
  jeju:['제주특별자치도','Jeju',33.4996,126.5312],
}

const city = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const loadCity = async () => {
  const region = regions[props.cityId]
  city.value = null
  errorMessage.value = ''
  if (!region) return
  loading.value = true
  try {
    const [data, warnings] = await Promise.all([
      fetchCityWeather({ id:props.cityId, local:region[0], name:region[1], coord:[region[2],region[3]] }),
      fetchKmaWarnings().catch(() => []),
    ])
    city.value = { ...data, name:region[0], english:region[1], warnings:warnings.filter(warning => warning.regionIds.includes(props.cityId)) }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}
watch(() => props.cityId, loadCity, { immediate:true })
const cityTemp = computed(() => city.value?.temp ?? 0)
const { formattedTemp } = useTemperature(cityTemp)
const alertStore = useWeatherAlertStore()
const configStore = useConfigStore()
const formatTemp = celsius => `${configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius}${configStore.unitSymbol}`
</script>

<template>
  <section class="detail-view">
    <p v-if="loading" class="loading-message">OpenWeather에서 상세 날씨를 불러오는 중입니다.</p>
    <template v-else-if="city">
      <header class="detail-header"><div><p>LOCAL WEATHER DETAILS</p><h1>{{ city.name }} <small>{{ city.english }}</small></h1></div><span>{{ city.icon }}</span></header>
      <WeatherWarnings :warnings="city.warnings" />
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
      <HourlyWeatherChart :hourly="city.hourly" />
      <ForecastPanels :weather="city" />
    </template>
    <div v-else>
      <h2>도시 정보를 찾을 수 없습니다.</h2>
      <p>{{ errorMessage || `요청한 도시 코드: ${cityId}` }}</p>
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

.risk-alert.above-limit { border:1px solid #ff858b; background:#9f2730; }.risk-alert.below-limit { border:1px solid #8bc5ff; background:#205a91; }

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
