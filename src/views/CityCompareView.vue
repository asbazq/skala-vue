<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

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

const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, wind: 2.1 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 82, wind: 3.4 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 68, wind: 4.2 },
  { id: 'city_04', name: '제주', temp: 27, status: '바람', humidity: 70, wind: 6.8 },
  { id: 'city_05', name: '강릉', temp: 23, status: '맑음', humidity: 51, wind: 2.7 },
]

const firstCity = computed(() => weatherList.find((city) => city.id === props.firstCityId))
const secondCity = computed(() => weatherList.find((city) => city.id === props.secondCityId))
const hasValidCities = computed(() => firstCity.value && secondCity.value)

const convertTemp = (celsius) => {
  return configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
}

const formatTemp = (celsius) => `${convertTemp(celsius)}${configStore.unitSymbol}`

const temperatureMessage = computed(() => {
  if (!hasValidCities.value) return ''
  const difference = convertTemp(firstCity.value.temp) - convertTemp(secondCity.value.temp)
  if (difference === 0) return '두 도시의 기온이 같습니다.'
  const warmerCity = difference > 0 ? firstCity.value.name : secondCity.value.name
  return `${warmerCity}이 ${Math.abs(difference)}${configStore.unitSymbol} 더 높습니다.`
})

const humidityMessage = computed(() => {
  if (!hasValidCities.value) return ''
  const difference = firstCity.value.humidity - secondCity.value.humidity
  if (difference === 0) return '두 도시의 습도가 같습니다.'
  const humidCity = difference > 0 ? firstCity.value.name : secondCity.value.name
  return `${humidCity}의 습도가 ${Math.abs(difference)}%p 더 높습니다.`
})

const changeCity = (position, cityId) => {
  const firstId = position === 'first' ? cityId : props.firstCityId
  const secondId = position === 'second' ? cityId : props.secondCityId
  router.push(`/compare/${firstId}/${secondId}`)
}
</script>

<template>
  <section class="compare-view">
    <h2>⚖️ 도시 날씨 비교</h2>

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
            {{ city.name }}
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
            {{ city.name }}
          </option>
        </select>
      </label>
    </div>

    <template v-if="hasValidCities && firstCityId !== secondCityId">
      <div class="comparison-grid">
        <article v-for="city in [firstCity, secondCity]" :key="city.id" class="city-panel">
          <h3>{{ city.name }}</h3>
          <p>{{ city.status }}</p>
          <dl>
            <div><dt>기온</dt><dd>{{ formatTemp(city.temp) }}</dd></div>
            <div><dt>습도</dt><dd>{{ city.humidity }}%</dd></div>
            <div><dt>풍속</dt><dd>{{ city.wind }}m/s</dd></div>
          </dl>
          <RouterLink :to="`/weather/${city.id}`">{{ city.name }} 상세보기</RouterLink>
        </article>
      </div>

      <div class="comparison-result" aria-live="polite">
        <p>🌡️ {{ temperatureMessage }}</p>
        <p>💧 {{ humidityMessage }}</p>
      </div>
    </template>

    <div v-else class="invalid-message">
      <p>비교할 수 있는 서로 다른 도시를 선택해 주세요.</p>
      <RouterLink to="/compare/city_01/city_03">서울과 부산 비교로 초기화</RouterLink>
    </div>

    <RouterLink to="/" class="back-link">← 날씨 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.compare-view {
  width: 100%;
}

.compare-view h2 {
  margin: 0 0 16px;
  font-size: 1.5rem;
}

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
}

.selectors label {
  font-weight: bold;
}

.selectors select {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 6px;
  padding: 9px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: #fff;
}

.city-panel {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: #fff;
}

.city-panel dl {
  flex: 1;
}

.city-panel h3 {
  margin: 0;
  color: #3498db;
}

.city-panel dl div {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f1f3f5;
}

.city-panel dd {
  margin: 0;
  font-weight: bold;
}

.comparison-result,
.invalid-message {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #e8f5e9;
}

.comparison-result p {
  margin: 6px 0;
}

.back-link {
  display: inline-block;
  margin-top: 18px;
}

@media (max-width: 520px) {
  .selectors,
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}
</style>
