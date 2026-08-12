<script setup>
import { computed, ref } from 'vue'
import {
  LCircle,
  LCircleMarker,
  LMap,
  LMarker,
  LPolygon,
  LPolyline,
  LPopup,
  LTileLayer,
  LTooltip,
} from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
const props = defineProps({ city: { type: Object, required: true } })
const zoom = ref(4)
const center = computed(() => props.city.coord)
const showProbability = ref(true)
const models = ref([{ key:'KMA', name:'한국 기상청', color:'#38bdf8', enabled:true },{ key:'JMA', name:'일본 기상청', color:'#a78bfa', enabled:true },{ key:'JTWC', name:'미 합동태풍경보센터', color:'#fb923c', enabled:true }])
const history = [{coord:[21.9,126.1],time:'08-11 12:00',wind:30,pressure:985},{coord:[23.2,127.2],time:'08-12 00:00',wind:34,pressure:980},{coord:[24.5,128.5],time:'08-12 12:00',wind:38,pressure:975},{coord:[25.8,129.8],time:'08-13 12:00',wind:42,pressure:970}]
const paths = { KMA:[[25.8,129.8],[27.3,130.5],[29.2,131.1],[31.6,131.8],[34,132.3]], JMA:[[25.8,129.8],[27.5,130.1],[29.4,129.9],[31.5,130.2],[33.6,130.8]], JTWC:[[25.8,129.8],[27.1,131.1],[28.8,132.5],[30.8,134.1],[33.1,135.4]] }
const probabilityCone = [
  [25.65, 129.55], [27.1, 129.65], [28.8, 129.35], [31.1, 128.65], [34.1, 128.5],
  [35.8, 132.5], [34.6, 135.8], [31.8, 135.2], [29.2, 133.4], [27.2, 131.4],
]
const forecastAreas = [
  { coord: [27.3, 130.5], radius: 55000, time: '08-14 00:00', label: '12시간 예상 범위' },
  { coord: [29.2, 131.1], radius: 105000, time: '08-14 12:00', label: '24시간 예상 범위' },
  { coord: [31.6, 131.8], radius: 165000, time: '08-15 12:00', label: '48시간 예상 범위' },
  { coord: [34, 132.3], radius: 245000, time: '08-16 12:00', label: '72시간 예상 범위' },
]
</script>

<template>
  <article class="map-card">
    <header><div><p>TYPHOON MONITOR</p><h2>태풍 예상 경로</h2></div><div class="models"><label class="range-control" title="태풍이 위치할 가능성이 있는 범위"><input v-model="showProbability" type="checkbox"><i></i>예상 범위</label><label v-for="model in models" :key="model.key" :title="model.name"><input v-model="model.enabled" type="checkbox"><i :style="{background:model.color}"></i>{{ model.key }}</label></div></header>
    <div class="map-wrap">
      <LMap v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&amp;copy; OpenStreetMap contributors" />
        <LMarker :lat-lng="city.coord"><LTooltip>{{ city.local }} · {{ city.temp }}°</LTooltip></LMarker>
        <LPolygon v-if="showProbability" :lat-lngs="probabilityCone" color="#d4b72e" fill-color="#ffe866" :weight="2" :opacity=".85" :fill-opacity=".26" />
        <LCircle v-for="area in showProbability ? forecastAreas : []" :key="area.time" :lat-lng="area.coord" :radius="area.radius" color="#c7aa21" fill-color="#ffe866" :weight="1.5" :opacity=".9" :fill-opacity=".18"><LPopup><b>{{ area.label }}</b><br>{{ area.time }}<br>중심에서 약 {{ Math.round(area.radius / 1000) }}km</LPopup></LCircle>
        <LPolyline :lat-lngs="history.map(point => point.coord)" color="#64748b" :weight="3" dash-array="7 8" />
        <LCircleMarker v-for="point in history" :key="point.time" :lat-lng="point.coord" :radius="point === history.at(-1) ? 9 : 5" color="#fff" fill-color="#ef476f" :fill-opacity="1"><LPopup><b>{{ point === history.at(-1) ? '현재 태풍 위치' : '과거 태풍 위치' }}</b><br>{{ point.time }}<br>풍속 {{ point.wind }}m/s · {{ point.pressure }}hPa</LPopup></LCircleMarker>
        <template v-for="model in models" :key="model.key"><LPolyline v-if="model.enabled" :lat-lngs="paths[model.key]" :color="model.color" :weight="4" /><LCircleMarker v-if="model.enabled" :lat-lng="paths[model.key].at(-1)" :radius="6" :color="model.color" :fill-color="model.color" :fill-opacity="1"><LTooltip>{{ model.key }} 예상 위치</LTooltip></LCircleMarker></template>
      </LMap>
      <div class="storm-info"><b>TY-09</b><span>북북동 18 km/h 이동 중</span></div>
      <div v-if="showProbability" class="range-legend"><i></i><span>태풍 중심이 위치할 가능성이 있는 범위</span></div>
    </div>
  </article>
</template>

<style scoped>
.map-card { padding: 20px; border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(145deg, #101f31, #0d1928); box-shadow: 0 18px 45px #02091455; } header { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 14px; } header p { margin: 0 0 4px; color: var(--cyan); font-size: .65rem; font-weight: 800; letter-spacing: .15em; } h2 { margin: 0; font-size: 1.15rem; }.models { display: flex; flex-wrap: wrap; gap: 5px; }.models label { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 7px; background: var(--panel-soft); color: #9eb1c5; font-size: .66rem; cursor: pointer; }.models input { position: absolute; opacity: 0; }.models i { width: 7px; height: 7px; border-radius: 50%; }.models .range-control i { background: #ffe866; box-shadow: 0 0 0 2px #9c861d; }.models label:has(input:not(:checked)) { opacity: .4; }.map-wrap { position: relative; height: 350px; overflow: hidden; border-radius: 12px; background: #0b1826; }.leaflet-container { height: 100%; background: #0b1826; }.storm-info { position: absolute; z-index: 500; left: 12px; bottom: 12px; display: flex; flex-direction: column; padding: 9px 12px; border: 1px solid #ffffff22; border-radius: 8px; background: #071321e8; pointer-events: none; }.storm-info b { color: #fb7185; font-size: .72rem; }.storm-info span { color: #b5c5d5; font-size: .65rem; }.range-legend { position: absolute; z-index: 500; right: 12px; bottom: 12px; display: flex; align-items: center; gap: 7px; max-width: 230px; padding: 8px 10px; border: 1px solid #ffffff22; border-radius: 8px; background: #071321e8; color: #cbd6df; font-size: .62rem; pointer-events: none; }.range-legend i { flex: 0 0 auto; width: 17px; height: 9px; border: 1px solid #d4b72e; background: #ffe86666; }
@media (max-width: 600px) { header { align-items: flex-start; flex-direction: column; }.map-wrap { height: 330px; } }
</style>
