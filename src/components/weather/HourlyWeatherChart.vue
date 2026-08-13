<script setup>
import { computed } from 'vue'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'

const props = defineProps({ hourly: { type:Array, required:true } })
const alertStore = useWeatherAlertStore()
const width = 800
const height = 250
const padding = { top:24, right:25, bottom:42, left:45 }
const temperatures = computed(() => props.hourly.map(item => item.temp))
const minTemp = computed(() => Math.min(...temperatures.value) - 1)
const maxTemp = computed(() => Math.max(...temperatures.value) + 1)
const x = index => padding.left + index * ((width - padding.left - padding.right) / Math.max(1, props.hourly.length - 1))
const y = value => padding.top + (maxTemp.value - value) * ((height - padding.top - padding.bottom) / Math.max(1, maxTemp.value - minTemp.value))
const linePath = computed(() => props.hourly.map((item, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(item.temp)}`).join(' '))
const areaPath = computed(() => `${linePath.value} L ${x(props.hourly.length - 1)} ${height - padding.bottom} L ${x(0)} ${height - padding.bottom} Z`)
const thresholdY = value => Math.min(height-padding.bottom, Math.max(padding.top, y(value)))
</script>

<template>
  <article class="chart-panel">
    <header><div><p>24-HOUR TREND</p><h2>24시간 기온·강수 추세</h2></div><span>기온 °C · 강수확률 %</span></header>
    <div class="chart-scroll">
      <svg :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="24시간 기온과 강수확률 그래프">
        <defs><linearGradient id="temperature-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#45cfff" stop-opacity=".3"/><stop offset="1" stop-color="#45cfff" stop-opacity="0"/></linearGradient></defs>
        <line v-for="tick in 4" :key="tick" :x1="padding.left" :x2="width-padding.right" :y1="padding.top+(tick-1)*(height-padding.top-padding.bottom)/3" :y2="padding.top+(tick-1)*(height-padding.top-padding.bottom)/3" class="grid-line" />
        <template v-if="alertStore.alertsEnabled">
          <line :x1="padding.left" :x2="width-padding.right" :y1="thresholdY(alertStore.heatThreshold)" :y2="thresholdY(alertStore.heatThreshold)" class="threshold-line upper" />
          <text :x="padding.left+5" :y="thresholdY(alertStore.heatThreshold)-5" class="threshold-label upper">외출 상한 {{ alertStore.heatThreshold }}°</text>
          <line :x1="padding.left" :x2="width-padding.right" :y1="thresholdY(alertStore.coldThreshold)" :y2="thresholdY(alertStore.coldThreshold)" class="threshold-line lower" />
          <text :x="padding.left+5" :y="thresholdY(alertStore.coldThreshold)-5" class="threshold-label lower">외출 하한 {{ alertStore.coldThreshold }}°</text>
        </template>
        <rect v-for="(item,index) in hourly" :key="`rain-${index}`" :x="x(index)-10" :y="height-padding.bottom-item.rainChance*.65" width="20" :height="item.rainChance*.65" class="rain-bar"><title>{{ item.day }} {{ item.time }} 강수확률 {{ item.rainChance }}%</title></rect>
        <path :d="areaPath" fill="url(#temperature-area)" />
        <path :d="linePath" class="temperature-line" />
        <g v-for="(item,index) in hourly" :key="`${item.day}-${item.time}`">
          <circle :cx="x(index)" :cy="y(item.temp)" r="5" class="temperature-point"><title>{{ item.day }} {{ item.time }} · {{ item.temp }}°C · 강수 {{ item.rainChance }}%</title></circle>
          <text :x="x(index)" :y="y(item.temp)-11" text-anchor="middle" class="value-label">{{ item.temp }}°</text>
          <text :x="x(index)" :y="height-20" text-anchor="middle" class="time-label">{{ item.time.replace('현재 ', '') }}</text>
        </g>
      </svg>
    </div>
    <div class="legend"><span><i class="line-key"></i>기온</span><span><i class="bar-key"></i>강수확률</span></div>
  </article>
</template>

<style scoped>
.chart-panel{margin-top:16px;padding:20px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,#101f31,#0d1928);box-shadow:0 18px 45px #02091455}.chart-panel header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}.chart-panel header p{margin:0 0 4px;color:var(--cyan);font-size:.65rem;font-weight:800;letter-spacing:.13em}.chart-panel h2{margin:0;font-size:1.15rem}.chart-panel header span{color:var(--muted);font-size:.68rem}.chart-scroll{overflow-x:auto}svg{display:block;width:100%;min-width:680px}.grid-line{stroke:#2a3d52;stroke-width:1}.threshold-line{stroke-width:1.5;stroke-dasharray:6 5}.threshold-line.upper{stroke:#ff7675}.threshold-line.lower{stroke:#74b9ff}.threshold-label{font-size:11px;font-weight:700}.threshold-label.upper{fill:#ff9c9a}.threshold-label.lower{fill:#9bd2ff}.rain-bar{fill:#4c78a8;opacity:.38}.temperature-line{fill:none;stroke:#45cfff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.temperature-point{fill:#071321;stroke:#8ce6ff;stroke-width:3}.value-label,.time-label{fill:#dce9f4;font-size:12px}.time-label{fill:#8196ab}.legend{display:flex;gap:16px;justify-content:flex-end;color:var(--muted);font-size:.65rem}.legend span{display:flex;align-items:center;gap:6px}.legend i{display:inline-block}.line-key{width:18px;height:3px;background:#45cfff}.bar-key{width:10px;height:10px;background:#4c78a866}
</style>
