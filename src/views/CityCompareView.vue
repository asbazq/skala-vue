<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'
import { fetchCityWeather, fetchKmaWarnings } from '@/services/weatherApi'
import { analyzeOutdoorSlots, comfortClass, comfortLabel } from '@/utils/outdoorComfort'

const props = defineProps({
  firstCityId: {
    type: String,
    required: true,
  },
  secondCityId: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const configStore = useConfigStore()
const alertStore = useWeatherAlertStore()

const weatherList = [
  ['seoul','서울특별시','Seoul',37.5665,126.978], ['busan','부산광역시','Busan',35.1796,129.0756],
  ['daegu','대구광역시','Daegu',35.8714,128.6014], ['incheon','인천광역시','Incheon',37.4563,126.7052],
  ['gwangju','광주광역시','Gwangju',35.1595,126.8526], ['daejeon','대전광역시','Daejeon',36.3504,127.3845],
  ['ulsan','울산광역시','Ulsan',35.5384,129.3114], ['sejong','세종특별자치시','Sejong',36.48,127.289],
  ['gyeonggi','경기도','Suwon',37.2636,127.0286], ['gangwon','강원특별자치도','Chuncheon',37.8813,127.73],
  ['chungbuk','충청북도','Cheongju',36.6424,127.489], ['chungnam','충청남도','Hongseong',36.601,126.6608],
  ['jeonbuk','전북특별자치도','Jeonju',35.8242,127.148], ['jeonnam','전라남도','Muan',34.9904,126.4817],
  ['gyeongbuk','경상북도','Andong',36.576,128.5058], ['gyeongnam','경상남도','Changwon',35.2279,128.6811],
  ['jeju','제주특별자치도','Jeju',33.4996,126.5312],
].map(([id, local, name, lat, lon]) => ({ id, local, name, coord:[lat,lon] }))

const firstCity = ref(null)
const secondCity = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const selectedDate = ref('')
const loadComparison = async () => {
  const first = weatherList.find(city => city.id === props.firstCityId)
  const second = weatherList.find(city => city.id === props.secondCityId)
  firstCity.value = null
  secondCity.value = null
  errorMessage.value = ''
  if (!first || !second || first.id === second.id) return
  loading.value = true
  try {
    const [firstWeather, secondWeather, warnings] = await Promise.all([
      fetchCityWeather(first), fetchCityWeather(second), fetchKmaWarnings().catch(() => []),
    ])
    firstCity.value = { ...firstWeather, warnings:warnings.filter(warning => warning.regionIds.includes(first.id)) }
    secondCity.value = { ...secondWeather, warnings:warnings.filter(warning => warning.regionIds.includes(second.id)) }
    if (!availableDates.value.some(date => date.value === selectedDate.value)) selectedDate.value = availableDates.value[0]?.value || ''
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}
const hasValidCities = computed(() => firstCity.value && secondCity.value)
const availableDates = computed(() => {
  if (!hasValidCities.value) return []
  const secondDates = new Set(secondCity.value.forecastSlots.map(item => item.date))
  return [...new Map(firstCity.value.forecastSlots
    .filter(item => secondDates.has(item.date))
    .map(item => [item.date, { value:item.date, label:item.dateLabel }])).values()]
})
watch(() => [props.firstCityId, props.secondCityId], loadComparison, { immediate:true })

const convertTemp = (celsius) => {
  return configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
}

const formatTemp = (celsius) => `${convertTemp(celsius)}${configStore.unitSymbol}`

const temperatureMessage = computed(() => {
  if (!hasValidCities.value) return ''
  const difference = convertTemp(firstCity.value.temp) - convertTemp(secondCity.value.temp)
  if (difference === 0) return '두 도시의 기온이 같습니다.'
  const warmerCity = difference > 0 ? firstCity.value.local : secondCity.value.local
  return `${warmerCity}이 ${Math.abs(difference)}${configStore.unitSymbol} 더 높습니다.`
})

const humidityMessage = computed(() => {
  if (!hasValidCities.value) return ''
  const difference = firstCity.value.humidity - secondCity.value.humidity
  if (difference === 0) return '두 도시의 습도가 같습니다.'
  const humidCity = difference > 0 ? firstCity.value.local : secondCity.value.local
  return `${humidCity}의 습도가 ${Math.abs(difference)}%p 더 높습니다.`
})
const analyzeOutdoor = city => city
  ? analyzeOutdoorSlots(city, city.forecastSlots.filter(item => item.date === selectedDate.value), alertStore)
  : null
const firstAnalysis = computed(() => analyzeOutdoor(firstCity.value))
const secondAnalysis = computed(() => analyzeOutdoor(secondCity.value))
const recommendation = computed(() => {
  if (!firstAnalysis.value || !secondAnalysis.value) return null
  if (firstAnalysis.value.score === secondAnalysis.value.score) return { city:null, reason:'두 지역의 외출 조건이 비슷합니다.' }
  const firstWins = firstAnalysis.value.score > secondAnalysis.value.score
  const city = firstWins ? firstCity.value : secondCity.value
  const analysis = firstWins ? firstAnalysis.value : secondAnalysis.value
  const best = analysis.best
  const warningReason = analysis.warningCount ? ` 현재 예·특보 ${analysis.warningCount}건은 반드시 확인하세요.` : ' 현재 발효된 지역 예·특보도 없습니다.'
  return { city, reason:`${best?.time || '-'}에 쾌적도 ${best?.score || 0}점으로 가장 좋아요. 기온 ${formatTemp(best?.temp || 0)}, 비 ${best?.rainChance || 0}%입니다.${warningReason}` }
})
const analysisFor = city => city.id === firstCity.value?.id ? firstAnalysis.value : secondAnalysis.value

const changeCity = (position, cityId) => {
  const firstId = position === 'first' ? cityId : props.firstCityId
  const secondId = position === 'second' ? cityId : props.secondCityId
  router.push(`/compare/${firstId}/${secondId}`)
}
</script>

<template>
<section class="compare-view">
    <header class="page-heading"><p>WHERE SHOULD I GO?</p><h1>어디로 나갈까?</h1><span>날짜를 고르면 기온·습도·비·바람·특보를 종합해 더 쾌적한 약속 장소와 시간을 추천합니다.</span></header>

    <div class="selectors">
      <label>
        기준 도시
        <select :value="firstCityId" @change="changeCity('first', $event.target.value)">
          <option
            v-for="city in weatherList"
            :key="city.id"
            :value="city.id"
            :disabled="city.id === secondCityId"
          >
            {{ city.local }}
          </option>
        </select>
      </label>

      <label>
        비교 도시
        <select :value="secondCityId" @change="changeCity('second', $event.target.value)">
          <option
            v-for="city in weatherList"
            :key="city.id"
            :value="city.id"
            :disabled="city.id === firstCityId"
          >
            {{ city.local }}
          </option>
        </select>
      </label>
    </div>

    <div v-if="availableDates.length" class="date-tabs" aria-label="비교 날짜 선택">
      <button v-for="date in availableDates" :key="date.value" type="button" :class="{active:selectedDate===date.value}" @click="selectedDate=date.value">{{ date.label }}</button>
    </div>

    <p v-if="loading" class="comparison-result">OpenWeather 최신 데이터를 불러오는 중입니다.</p>
    <template v-else-if="hasValidCities && firstCityId !== secondCityId">
      <div class="comparison-grid">
        <article v-for="city in [firstCity, secondCity]" :key="city.id" class="city-panel">
          <h3>{{ city.local }}</h3>
          <p>{{ city.status }}</p>
          <div class="score-summary" :class="comfortClass(analysisFor(city).score)"><span>선택 날짜 평균 쾌적도<b>{{ comfortLabel(analysisFor(city).score) }}</b></span><strong>{{ analysisFor(city).score }}<small>점</small></strong></div>
          <div class="recommended-times"><b>추천 시간 TOP 3</b><div><span v-for="slot in analysisFor(city).recommendations" :key="slot.time"><strong>{{ slot.time }}</strong><small>{{ slot.score }}점 · {{ formatTemp(slot.temp) }} · 비 {{ slot.rainChance }}%</small></span></div></div>
          <dl>
            <div class="outdoor-count"><dt>외출하기 좋은 시간대</dt><dd>{{ analysisFor(city).suitableCount }}개</dd></div>
            <div class="warning-count"><dt>발효 중 예·특보</dt><dd>{{ analysisFor(city).warningCount }}건</dd></div>
            <div><dt>가장 좋은 시간</dt><dd>{{ analysisFor(city).best?.time || '-' }}</dd></div>
            <div><dt>추천 시간 강수</dt><dd>{{ analysisFor(city).best?.rainChance || 0 }}%</dd></div>
            <div><dt>최대 강수확률</dt><dd>{{ analysisFor(city).maxRain }}%</dd></div>
            <div><dt>기온</dt><dd>{{ formatTemp(city.temp) }}</dd></div>
            <div><dt>습도</dt><dd>{{ city.humidity }}%</dd></div>
            <div><dt>풍속</dt><dd>{{ city.wind }}m/s</dd></div>
            <div><dt>체감온도</dt><dd>{{ formatTemp(city.feels) }}</dd></div>
            <div><dt>기압</dt><dd>{{ city.pressure }}hPa</dd></div>
            <div><dt>강수량</dt><dd>{{ city.rain }}mm</dd></div>
          </dl>
          <RouterLink :to="`/weather/${city.id}`">{{ city.local }} 상세보기</RouterLink>
        </article>
      </div>

      <div class="comparison-result" aria-live="polite">
        <h2>{{ recommendation.city ? `추천: ${recommendation.city.local}` : '추천 결과' }}</h2>
        <p>🚶 {{ recommendation.reason }}</p>
        <p>🌡️ {{ temperatureMessage }}</p>
        <p>💧 {{ humidityMessage }}</p>
      </div>
    </template>

    <div v-else class="invalid-message">
      <p>{{ errorMessage || '비교할 수 있는 서로 다른 지역을 선택해 주세요.' }}</p>
      <RouterLink to="/compare/seoul/busan">서울과 부산 비교로 초기화</RouterLink>
    </div>

    <RouterLink to="/" class="back-link">← 날씨 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.compare-view {
  width: 100%;
  color: var(--text);
}

.page-heading{margin-bottom:24px}.page-heading p{margin:0 0 6px;color:var(--cyan);font-size:.65rem;font-weight:800;letter-spacing:.15em}.page-heading h1{margin:0;font-size:clamp(2.2rem,5vw,3.6rem)}.page-heading span{display:block;margin-top:8px;color:var(--muted)}

.selectors,
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.comparison-grid {
  align-items: stretch;
}

.selectors {
  margin-bottom: 16px;
  padding:20px;
  border:1px solid var(--line);
  border-radius:14px;
  background:#0e1c2d;
}
.date-tabs{display:flex;gap:7px;margin:-4px 0 16px;overflow-x:auto;padding:4px 0}.date-tabs button{flex:1 0 110px;padding:9px 11px;border:1px solid #293d54;border-radius:8px;background:#0e1c2d;color:#8fa3ba;cursor:pointer}.date-tabs button.active{border-color:var(--cyan);background:#123247;color:#c7f2ff;box-shadow:0 0 0 2px #45cfff15}

.selectors label {
  font-weight: bold;
  color:#9eb1c5;
  font-size:.75rem;
}

.selectors select {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 6px;
  padding: 9px;
  border: 1px solid #293d54;
  border-radius: 8px;
  outline:0;
  background: #0b1828;
  color:var(--text);
  color-scheme:dark;
}
.selectors select:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(69,207,255,.12)}

.city-panel {
  display: flex;
  min-height: 250px;
  flex-direction: column;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: linear-gradient(145deg,#101f31,#0d1928);
  box-shadow:0 18px 45px #02091444;
}

.city-panel dl {
  flex: 1;
  margin: 14px 0 18px;
}

.city-panel h3 {
  margin: 0;
  color: var(--cyan);
  font-size:1.35rem;
}

.city-panel dl div {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #22364b;
}
.city-panel dl .outdoor-count{margin:0 -6px;padding:10px 6px;border-radius:7px;background:#102f33}.city-panel dl .outdoor-count dt{color:#70dcb9}.city-panel dl .outdoor-count dd{color:#9af0d3}
.city-panel dl .warning-count{margin:5px -6px 0;padding:10px 6px;border-radius:7px;background:#392b16}.city-panel dl .warning-count dt,.city-panel dl .warning-count dd{color:#ffd98c}
.city-panel>p{margin:5px 0 0;color:var(--muted)}.city-panel dt{color:#71869c}.city-panel a{display:inline-flex;align-items:center;width:fit-content;margin-top:auto;padding:8px 11px;border:1px solid #28506d;border-radius:7px;background:#173148;color:#8edfff;font-size:.72rem}
.score-summary{display:flex;align-items:center;justify-content:space-between;margin:14px 0 10px;padding:13px;border:1px solid #2e6657;border-radius:10px;background:#102f33}.score-summary span{display:flex;flex-direction:column;color:#769b91;font-size:.62rem}.score-summary span b{margin-top:3px;color:#9af0d3;font-size:.82rem}.score-summary>strong{color:#9af0d3;font-size:1.7rem}.score-summary>strong small{font-size:.6rem}.score-summary.moderate{border-color:#66572e;background:#332d18}.score-summary.moderate span b,.score-summary.moderate>strong{color:#ffe09a}.score-summary.uncomfortable{border-color:#69393c;background:#351e27}.score-summary.uncomfortable span b,.score-summary.uncomfortable>strong{color:#ffadb1}.recommended-times{padding:11px;border:1px solid #22364b;border-radius:9px;background:#0b1828}.recommended-times>b{color:#8edfff;font-size:.68rem}.recommended-times>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px}.recommended-times span{display:flex;min-width:0;flex-direction:column;gap:2px;padding:7px;border-radius:6px;background:#132439}.recommended-times span strong{font-size:.72rem}.recommended-times span small{overflow:hidden;color:#7f95aa;font-size:.55rem;text-overflow:ellipsis;white-space:nowrap}

.city-panel dd {
  margin: 0;
  font-weight: bold;
}

.comparison-result,
.invalid-message {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  border:1px solid #1e5146;
  background: #102b31;
  color:#75dfbd;
}

.comparison-result p {
  margin: 6px 0;
}
.comparison-result h2{margin:0 0 9px;color:#baf5df;font-size:1.25rem}

.back-link {
  display: inline-block;
  margin-top: 18px;
  padding:9px 12px;
  border-radius:8px;
  background:#173148;
  color:#8edfff;
}

@media (max-width: 520px) {
  .selectors,
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}
</style>
