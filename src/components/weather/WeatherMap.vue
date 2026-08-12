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
import { typhoonData } from '@/data/typhoonMockData'
import { useTyphoonStore } from '@/stores/typhoonStore'
import { useConfigStore } from '@/stores/configStore'
const props = defineProps({ city: { type: Object, required: true } })
const zoom = ref(4)
const center = computed(() => props.city.coord)
const typhoonStore = useTyphoonStore()
const configStore = useConfigStore()
const formattedCityTemp = computed(() => {
  const value = configStore.unit === 'fahrenheit' ? Math.round((props.city.temp * 9) / 5 + 32) : props.city.temp
  return `${value}${configStore.unitSymbol}`
})
const models = [{ key:'KMA', name:'한국 기상청', color:'#38bdf8' },{ key:'JMA', name:'일본 기상청', color:'#a78bfa' },{ key:'JTWC', name:'미 합동태풍경보센터', color:'#fb923c' }]
const activeModels = computed(() => models.filter(model => typhoonStore.isAgencyVisible(model.key)))
</script>

<template>
  <article class="map-card">
    <header><div><p>TYPHOON MONITOR · {{ typhoonStore.visibleAgencyCount }} MODELS</p><h2>태풍 예상 경로</h2></div><div class="models"><label title="실제 이동 경로"><input :checked="typhoonStore.showPastTrack" type="checkbox" @change="typhoonStore.togglePastTrack"><i class="past-dot"></i>이동 경로</label><label class="range-control" title="태풍이 위치할 가능성이 있는 범위"><input :checked="typhoonStore.showForecastRange" type="checkbox" @change="typhoonStore.toggleForecastRange"><i></i>예상 범위</label><label v-for="model in models" :key="model.key" :title="model.name"><input :checked="typhoonStore.isAgencyVisible(model.key)" type="checkbox" @change="typhoonStore.toggleAgency(model.key)"><i :style="{background:model.color}"></i>{{ model.key }}</label></div></header>
    <div class="map-wrap">
      <LMap v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&amp;copy; OpenStreetMap contributors" />
        <LMarker :lat-lng="city.coord"><LTooltip>{{ city.local }} · {{ formattedCityTemp }}</LTooltip></LMarker>
        <LPolygon v-if="typhoonStore.showForecastRange" :lat-lngs="typhoonData.probabilityCone" color="#d4b72e" fill-color="#ffe866" :weight="2" :opacity=".85" :fill-opacity=".26" />
        <LCircle v-for="area in typhoonStore.showForecastRange ? typhoonData.forecastRanges : []" :key="area.hour" :lat-lng="area.coord" :radius="area.radiusKm * 1000" color="#c7aa21" fill-color="#ffe866" :weight="1.5" :opacity=".9" :fill-opacity=".18"><LPopup><b>{{ area.hour }}시간 예상 범위</b><br>예측 시각 {{ area.forecastAt }}<br>중심 {{ area.coord[0] }}, {{ area.coord[1] }}<br>예상 반경 {{ area.radiusKm }}km</LPopup></LCircle>
        <LPolyline v-if="typhoonStore.showPastTrack" :lat-lngs="typhoonData.pastTrack.map(point => point.coord)" color="#64748b" :weight="3" dash-array="7 8" />
        <LCircleMarker v-for="point in typhoonStore.showPastTrack ? typhoonData.pastTrack : [typhoonData.pastTrack.at(-1)]" :key="point.time" :lat-lng="point.coord" :radius="point === typhoonData.pastTrack.at(-1) ? 9 : 5" color="#fff" fill-color="#ef476f" :fill-opacity="1"><LPopup><b>{{ point === typhoonData.pastTrack.at(-1) ? typhoonData.name : '과거 태풍 위치' }}</b><br>{{ point.time }}<br>중심 {{ point.coord[0] }}, {{ point.coord[1] }}<br>풍속 {{ point.wind }}m/s · {{ point.pressure }}hPa</LPopup></LCircleMarker>
        <template v-for="model in activeModels" :key="model.key"><LPolyline :lat-lngs="typhoonData.agencyTracks[model.key]" :color="model.color" :weight="4" /><LCircleMarker :lat-lng="typhoonData.agencyTracks[model.key].at(-1)" :radius="6" :color="model.color" :fill-color="model.color" :fill-opacity="1"><LTooltip>{{ model.key }} 예상 위치</LTooltip></LCircleMarker></template>
      </LMap>
      <div class="storm-info"><b>TY-09</b><span>북북동 18 km/h 이동 중</span></div>
      <div v-if="typhoonStore.showForecastRange" class="range-legend"><i></i><span>태풍 중심이 위치할 가능성이 있는 범위</span></div>
    </div>
  </article>
</template>

<style scoped>
.map-card { padding: 20px; border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(145deg, #101f31, #0d1928); box-shadow: 0 18px 45px #02091455; } header { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 14px; } header p { margin: 0 0 4px; color: var(--cyan); font-size: .65rem; font-weight: 800; letter-spacing: .15em; } h2 { margin: 0; font-size: 1.15rem; }.models { display: flex; flex-wrap: wrap; gap: 5px; }.models label { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 7px; background: var(--panel-soft); color: #9eb1c5; font-size: .66rem; cursor: pointer; }.models input { position: absolute; opacity: 0; }.models i { width: 7px; height: 7px; border-radius: 50%; }.models .range-control i { background: #ffe866; box-shadow: 0 0 0 2px #9c861d; }.models .past-dot { background: #64748b; }.models label:has(input:not(:checked)) { opacity: .4; }.map-wrap { position: relative; height: 350px; overflow: hidden; border-radius: 12px; background: #0b1826; }.leaflet-container { height: 100%; background: #0b1826; }.storm-info { position: absolute; z-index: 500; left: 12px; bottom: 12px; display: flex; flex-direction: column; padding: 9px 12px; border: 1px solid #ffffff22; border-radius: 8px; background: #071321e8; pointer-events: none; }.storm-info b { color: #fb7185; font-size: .72rem; }.storm-info span { color: #b5c5d5; font-size: .65rem; }.range-legend { position: absolute; z-index: 500; right: 12px; bottom: 12px; display: flex; align-items: center; gap: 7px; max-width: 230px; padding: 8px 10px; border: 1px solid #ffffff22; border-radius: 8px; background: #071321e8; color: #cbd6df; font-size: .62rem; pointer-events: none; }.range-legend i { flex: 0 0 auto; width: 17px; height: 9px; border: 1px solid #d4b72e; background: #ffe86666; }
@media (max-width: 600px) { header { align-items: flex-start; flex-direction: column; }.map-wrap { height: 330px; } }
</style>
