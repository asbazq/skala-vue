<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'

const props = defineProps({
  cityId: {
    type: String,
    required: true,
  },
})

const weatherDetails = {
  city_01: { name: '서울', temp: 28, status: '맑음', humidity: 55, wind: 2.1 },
  city_02: { name: '수원', temp: 24, status: '비', humidity: 82, wind: 3.4 },
  city_03: { name: '부산', temp: 26, status: '구름', humidity: 68, wind: 4.2 },
  city_04: { name: '제주', temp: 27, status: '바람', humidity: 70, wind: 6.8 },
  city_05: { name: '강릉', temp: 23, status: '맑음', humidity: 51, wind: 2.7 },
}

const city = computed(() => weatherDetails[props.cityId])
const cityTemp = computed(() => city.value?.temp ?? 0)
const { formattedTemp } = useTemperature(cityTemp)
const alertStore = useWeatherAlertStore()
</script>

<template>
  <section class="detail-view">
    <template v-if="city">
      <h2>{{ city.name }} 상세 기상관측</h2>
      <p
        v-if="alertStore.getRiskLabel(city.temp)"
        class="risk-alert"
        :class="alertStore.getRiskLevel(city.temp)"
      >
        {{ alertStore.getRiskLabel(city.temp) }} · {{ alertStore.thresholdSummary }}
      </p>
      <dl>
        <div><dt>날씨</dt><dd>{{ city.status }}</dd></div>
        <div><dt>기온</dt><dd>{{ formattedTemp }}</dd></div>
        <div><dt>습도</dt><dd>{{ city.humidity }}%</dd></div>
        <div><dt>풍속</dt><dd>{{ city.wind }}m/s</dd></div>
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
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

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
  padding: 14px;
  border-radius: 6px;
  background: #fff;
}

dt { color: #7f8c8d; }
dd { margin: 4px 0 0; font-size: 20px; font-weight: bold; }
.back-link { display: inline-block; margin-top: 16px; }
</style>
