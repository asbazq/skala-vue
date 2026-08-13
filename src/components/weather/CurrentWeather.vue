<script setup>
import { useConfigStore } from '@/stores/configStore'
import WeatherWarnings from '@/components/weather/WeatherWarnings.vue'
defineProps({ weather: { type: Object, required: true } })
const configStore = useConfigStore()
const formatTemp = value => `${configStore.unit === 'fahrenheit' ? Math.round((value * 9) / 5 + 32) : value}${configStore.unitSymbol}`
</script>

<template>
  <article class="panel current-card">
    <header><div><p>{{ weather.country }}</p><h2>{{ weather.local }} <small>{{ weather.name }}</small></h2></div><span>● LIVE</span></header>
    <div class="primary"><div class="weather-icon">{{ weather.icon }}</div><div><strong>{{ formatTemp(weather.temp) }}</strong><p>{{ weather.status }}</p><small>체감온도 {{ formatTemp(weather.feels) }} · 최고 {{ formatTemp(weather.high) }} / 최저 {{ formatTemp(weather.low) }}</small></div></div>
    <WeatherWarnings :warnings="weather.warnings" compact />
    <div class="details">
      <div><span>습도</span><b>{{ weather.humidity }}%</b></div><div><span>풍속</span><b>{{ weather.wind }} m/s</b></div><div><span>기압</span><b>{{ weather.pressure }} hPa</b></div><div><span>강수량</span><b>{{ weather.rain }} mm</b></div>
    </div>
  </article>
</template>

<style scoped>
.panel { border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(145deg, #101f31, #0d1928); box-shadow: 0 18px 45px #02091455; }.current-card { padding: 24px; } header { display: flex; justify-content: space-between; gap: 12px; } header p { margin: 0 0 5px; color: var(--muted); font-size: .68rem; text-transform: uppercase; } h2 { margin: 0; font-size: 1.35rem; } h2 small { color: var(--muted); font-size: .7rem; font-weight: 500; } header>span { height: fit-content; padding: 5px 8px; border-radius: 99px; background: #10302b; color: #60dfb2; font-size: .6rem; font-weight: 800; }.primary { display: flex; align-items: center; gap: 20px; padding: 30px 0; }.weather-icon { font-size: 4rem; filter: drop-shadow(0 8px 14px #45cfff55); }.primary strong { font-size: clamp(3.8rem, 6vw, 5rem); line-height: .85; letter-spacing: -.08em; }.primary p { margin: 14px 0 2px; color: #cad9e6; }.primary small { color: var(--muted); }.details { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }.details div { display: flex; flex-direction: column; gap: 4px; padding: 13px; border-radius: 10px; background: var(--panel-soft); }.details span { color: var(--muted); font-size: .68rem; }.details b { font-size: .9rem; }
</style>
