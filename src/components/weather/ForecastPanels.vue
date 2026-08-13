<script setup>
import { useConfigStore } from '@/stores/configStore'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'
defineProps({ weather: { type: Object, required: true } })
const configStore = useConfigStore()
const alertStore = useWeatherAlertStore()
const formatTemp = value => `${configStore.unit === 'fahrenheit' ? Math.round((value * 9) / 5 + 32) : value}${configStore.unitSymbol}`
const dailyLimitClass = item => ({
  'above-limit': alertStore.alertsEnabled && item.high >= alertStore.heatThreshold,
  'below-limit': alertStore.alertsEnabled && item.low <= alertStore.coldThreshold,
})
</script>

<template>
  <div class="forecasts">
    <article class="panel"><header><div><p>24 HOURS · 3-HOUR INTERVALS</p><h2>오늘부터 24시간 날씨</h2></div><span>{{ weather.local }} · {{ alertStore.thresholdSummary }}</span></header><div class="items hourly"><div v-for="(item, index) in weather.hourly" :key="`${item.day}-${item.time}-${index}`" :class="[alertStore.getRiskLevel(item.temp),{ current:index===0 }]"><small>{{ item.day }} · {{ item.time }}</small><i>{{ item.icon }}</i><b>{{ formatTemp(item.temp) }}</b><em>{{ item.status }}</em><span>습도 {{ item.humidity }}% · 강수 {{ item.rainChance }}%</span><strong v-if="alertStore.getRiskLabel(item.temp)" class="personal-limit">{{ alertStore.getRiskLabel(item.temp) }}</strong></div></div></article>
    <article class="panel"><header><div><p>5-DAY OUTLOOK</p><h2>일별 예보</h2></div><span>{{ alertStore.thresholdSummary }}</span></header><div class="items weekly"><div v-for="item in weather.weekly" :key="item.day" :class="dailyLimitClass(item)"><small>{{ item.day }}</small><i>{{ item.icon }}</i><b>{{ formatTemp(item.high) }} <em>{{ formatTemp(item.low) }}</em></b><strong v-if="alertStore.alertsEnabled && item.high >= alertStore.heatThreshold" class="personal-limit">🥵 나가기엔 너무 더워요</strong><strong v-if="alertStore.alertsEnabled && item.low <= alertStore.coldThreshold" class="personal-limit">🥶 나가기엔 너무 추워요</strong></div></div></article>
  </div>
</template>

<style scoped>
.forecasts { display:grid; grid-template-columns:minmax(0,1fr); gap:16px; width:100%; margin-top:16px; }.panel { box-sizing:border-box; min-width:0; max-width:100%; padding:20px; overflow:hidden; border:1px solid var(--line); border-radius:16px; background:linear-gradient(145deg,#101f31,#0d1928); box-shadow:0 18px 45px #02091455; } header { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px 16px; margin-bottom:17px; } header>div { min-width:0; } header p { margin:0 0 4px; overflow-wrap:anywhere; color:var(--cyan); font-size:.65rem;font-weight:800;letter-spacing:.12em}h2{margin:0;font-size:1.15rem}header>span{max-width:55%;color:var(--muted);font-size:.7rem;text-align:right}.items{display:grid;gap:7px}.hourly{grid-template-columns:repeat(8,minmax(0,1fr));width:100%}.hourly>div.current{padding-top:24px;background:#102b3d}.hourly>div.current::before{position:absolute;top:6px;left:50%;padding:2px 6px;border-radius:99px;background:var(--cyan);color:#071321;font-size:.52rem;font-weight:900;content:'현재';transform:translateX(-50%)}.items>div.above-limit{border:2px solid #ff5f67;background:linear-gradient(145deg,#35202b,var(--panel-soft));box-shadow:0 0 14px #ff3c4c20}.items>div.below-limit{border:2px solid #60a5fa;background:linear-gradient(145deg,#172d49,var(--panel-soft));box-shadow:0 0 14px #2788eb24}.weekly{grid-template-columns:repeat(auto-fit,minmax(120px,1fr))}.items div{position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;min-width:0;padding:12px 5px;border-radius:9px;background:var(--panel-soft)}.items small{color:var(--muted);font-size:.62rem;text-align:center}.items i{font-size:1.35rem;font-style:normal}.items b{font-size:.8rem}.items em{overflow:hidden;max-width:100%;color:var(--muted);font-size:.65rem;font-style:normal;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.hourly .current em{color:#bfefff}.items div>span{color:#70869c;font-size:.56rem;white-space:nowrap}.personal-limit{min-height:24px;color:#ffd1d1;font-size:.56rem;line-height:1.2;text-align:center}.below-limit .personal-limit{color:#cbe6ff}
@media (max-width:950px) { .hourly { grid-template-columns:repeat(4,minmax(0,1fr)); } }
@media (max-width:600px) { .panel { padding:15px; }.hourly,.weekly { grid-template-columns:repeat(2,minmax(0,1fr)); } }
</style>
