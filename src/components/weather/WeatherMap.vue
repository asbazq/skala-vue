<script setup>
import { computed, ref } from 'vue'
import {
  LCircle,
  LCircleMarker,
  LGeoJson,
  LMap,
  LMarker,
  LPolyline,
  LPopup,
  LTileLayer,
  LTooltip,
} from '@vue-leaflet/vue-leaflet'
import { feature } from 'topojson-client'
import provinceTopology from '@/data/maps/skorea-provinces-topo.json'
import 'leaflet/dist/leaflet.css'
import { fetchKmaTyphoons } from '@/services/weatherApi'
import { useTyphoonStore } from '@/stores/typhoonStore'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'
import { comfortLabel, comfortScore } from '@/utils/outdoorComfort'
const props = defineProps({
  city: { type:Object, required:true },
  cities: { type:Array, default:() => [] },
})
const mapMode = ref('outdoor')
const stormColors = ['#38bdf8', '#fb7185', '#a78bfa', '#fbbf24', '#34d399']
const typhoons = ref([])
const expandedStormId = ref(null)
const selectedStormId = ref(null)
const typhoonSource = ref('KMA 확인 중')
const typhoonsLoaded = ref(false)
const zoom = ref(6)
const center = computed(() => mapMode.value === 'outdoor' ? props.city.coord : [29, 135])
const typhoonStore = useTyphoonStore()
const configStore = useConfigStore()
const alertStore = useWeatherAlertStore()
const formatTemp = value => `${configStore.unit === 'fahrenheit' ? Math.round((value * 9) / 5 + 32) : value}${configStore.unitSymbol}`
const outdoorColor = city => {
  const level = alertStore.getRiskLevel(city.temp)
  if (level === 'above-limit') return '#ff5f67'
  if (level === 'below-limit') return '#60a5fa'
  return '#45d6aa'
}
const outdoorLabel = city => alertStore.getRiskLabel(city.temp) || '외출하기 좋은 기온이에요'
const outdoorScore = city => comfortScore(city, alertStore)
const outdoorLayerKey = computed(() => `${alertStore.alertsEnabled}-${alertStore.coldThreshold}-${alertStore.heatThreshold}-${props.cities.map(city => `${city.temp}:${city.warnings?.length || 0}`).join(',')}`)
const currentProvinceName = name => ({ 강원도:'강원특별자치도', 전라북도:'전북특별자치도' })[name] || name
const provinceGeoJson = computed(() => {
  const object = provinceTopology.objects[Object.keys(provinceTopology.objects)[0]]
  const geoJson = feature(provinceTopology, object)
  return {
    ...geoJson,
    features: geoJson.features.map(boundary => ({
      ...boundary,
      properties: { ...boundary.properties, name:currentProvinceName(boundary.properties.name), weather:props.cities.find(city => city.local === currentProvinceName(boundary.properties.name)) },
    })),
  }
})
const provinceStyle = boundary => {
  const city = boundary.properties.weather
  const level = city ? alertStore.getRiskLevel(city.temp) : 'normal'
  const hasWarning = Boolean(city?.warnings?.length)
  const borderColor = hasWarning ? '#f6b94d' : level === 'above-limit' ? '#ff8b91' : level === 'below-limit' ? '#8bc5ff' : '#e8f4ff'
  return { color:borderColor, weight:city?.id === props.city.id ? 3.5 : hasWarning ? 3 : level === 'normal' ? 1.4 : 2.4, dashArray:hasWarning ? '7 5' : null, opacity:.95, fillColor:city ? outdoorColor(city) : '#64748b', fillOpacity:city?.id === props.city.id ? .7 : .48 }
}
const provinceOptions = computed(() => ({
  onEachFeature(boundary, layer) {
    const city = boundary.properties.weather
    if (!city) return
    const warningText = city.warnings?.length ? `<br><b style="color:#f6b94d">⚠ ${city.warnings.map(item => `${item.type} ${item.level}`).join(' · ')}</b>` : ''
    const score = outdoorScore(city)
    layer.bindTooltip(`${city.local} ${formatTemp(city.temp)} · 쾌적도 ${score}점${city.warnings?.length ? ` · 예·특보 ${city.warnings.length}건` : ''}`, { sticky:true })
    layer.bindPopup(`<strong>${city.local}</strong><br>${city.icon} ${city.status} · ${formatTemp(city.temp)}<br>체감 ${formatTemp(city.feels)} · 습도 ${city.humidity}%<br>풍속 ${city.wind}m/s · 강수 ${city.rain}mm<br><b>외출 쾌적도 ${score}점 · ${comfortLabel(score)}</b><br>${outdoorLabel(city)}${warningText}`)
    layer.on({
      mouseover(event) {
        const target = event.target
        target.setStyle({ color:outdoorColor(city), weight:5, fillOpacity:.72 })
        target.bringToFront()
      },
      mouseout(event) {
        event.target.setStyle(provinceStyle(boundary))
      },
    })
  },
}))
const toggleStormInfo = (stormId) => {
  const isSelected = selectedStormId.value === stormId
  selectedStormId.value = isSelected ? null : stormId
  expandedStormId.value = isSelected ? null : stormId
}
const visibleTyphoons = computed(() => selectedStormId.value ? typhoons.value.filter(storm => storm.id === selectedStormId.value) : typhoons.value)
const loadTyphoons = async () => {
  if (typhoonsLoaded.value) return
  try {
    const data = await fetchKmaTyphoons(5)
    typhoons.value = data.map((storm, index) => ({ ...storm, color: stormColors[index] }))
    typhoonSource.value = `KMA 최신 ${data.length}개`
    typhoonsLoaded.value = true
  } catch (error) {
    typhoonSource.value = 'KMA 연결 실패'
    console.warn(error.message)
  }
}
const changeMapMode = mode => {
  mapMode.value = mode
  zoom.value = mode === 'outdoor' ? 6 : 4
  if (mode === 'typhoon') loadTyphoons()
}
</script>

<template>
  <article class="map-card">
    <header>
      <div>
        <p>{{ mapMode === 'outdoor' ? 'PERSONAL OUTDOOR MAP' : `TYPHOON MONITOR · ${typhoonSource}` }}</p>
        <h2>{{ mapMode === 'outdoor' ? '내 외출 기준 지도' : '최근 태풍 5개 경로' }}</h2>
      </div>
      <div v-if="mapMode==='typhoon'" class="models">
        <label title="실제 이동 경로"
          ><input
            :checked="typhoonStore.showPastTrack"
            type="checkbox"
            @change="typhoonStore.togglePastTrack"
          /><i class="past-dot"></i>이동 경로</label
        ><label class="range-control" title="강풍반경과 예상확률반경"
          ><input
            :checked="typhoonStore.showForecastRange"
            type="checkbox"
            @change="typhoonStore.toggleForecastRange"
          /><i></i>영향·예상 범위</label
        >
      </div>
      <div class="map-modes"><button type="button" :class="{active:mapMode==='outdoor'}" @click="changeMapMode('outdoor')">내 외출 기준</button><button type="button" :class="{active:mapMode==='typhoon'}" @click="changeMapMode('typhoon')">태풍 경로</button></div>
    </header>
    <div class="map-wrap">
      <LMap v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; OpenStreetMap contributors"
        />
        <template v-if="mapMode==='outdoor'">
          <LGeoJson :key="outdoorLayerKey" :geojson="provinceGeoJson" :options="provinceOptions" :options-style="provinceStyle" />
          <LMarker :key="`marker-${city.id}`" :lat-lng="city.coord"><LTooltip direction="top" :offset="[0,-10]">{{ city.local }} · {{ formatTemp(city.temp) }}</LTooltip><LPopup><b>{{ city.local }} 관측 위치</b><br>{{ city.icon }} {{ city.status }} · {{ formatTemp(city.temp) }}<br>체감 {{ formatTemp(city.feels) }} · 습도 {{ city.humidity }}%<br>풍속 {{ city.wind }}m/s · 강수 {{ city.rain }}mm<br><strong>{{ outdoorLabel(city) }}</strong></LPopup></LMarker>
        </template>
        <template v-for="storm in mapMode==='typhoon' ? visibleTyphoons : []" :key="storm.id">
          <LCircle
            v-if="typhoonStore.showForecastRange && storm.current.windRadiusKm"
            :lat-lng="storm.current.coord"
            :radius="storm.current.windRadiusKm * 1000"
            :color="storm.color"
            :fill-color="storm.color"
            :weight="2"
            :fill-opacity="0.08"
            ><LPopup
              ><b>{{ storm.name }} 강풍반경</b><br />15m/s 이상 ·
              {{ storm.current.windRadiusKm }}km<br />{{ storm.current.observedAt }} UTC</LPopup
            ></LCircle
          >
          <LCircle
            v-for="area in typhoonStore.showForecastRange ? storm.forecastRanges : []"
            :key="`${storm.id}-${area.hour}`"
            :lat-lng="area.coord"
            :radius="area.radiusKm * 1000"
            :color="storm.color"
            :fill-color="storm.color"
            :weight="1"
            :fill-opacity="0.12"
          />
          <LPolyline
            v-if="typhoonStore.showPastTrack"
            :lat-lngs="storm.pastTrack.map((point) => point.coord)"
            :color="storm.color"
            :weight="3"
            :opacity="0.82"
          />
          <LCircleMarker
            v-if="storm.pastTrack.length"
            :lat-lng="storm.pastTrack.at(-1).coord"
            :radius="7"
            color="#fff"
            :fill-color="storm.color"
            :fill-opacity="1"
            ><LPopup
              ><b>{{ storm.name }}</b
              ><br />{{ storm.movement }}</LPopup
            ></LCircleMarker
          >
          <LPolyline
            v-if="storm.agencyTracks.KMA.length > 1"
            :lat-lngs="storm.agencyTracks.KMA"
            :color="storm.color"
            :weight="3"
            dash-array="6 7"
          />
        </template>
      </LMap>
      <div v-if="mapMode==='typhoon'" class="storm-info" aria-label="최근 태풍 정보">
        <button
          v-for="storm in typhoons"
          :key="storm.id"
          type="button"
          :class="{ expanded: expandedStormId === storm.id, selected: selectedStormId === storm.id }"
          :aria-expanded="expandedStormId === storm.id"
          @click="toggleStormInfo(storm.id)"
        >
          <i :style="{ background: storm.color }"></i><b>{{ storm.id.replace('KMA-', 'TY-') }}</b
          ><span
            ><strong>{{ storm.name }}</strong
            >{{ storm.movement }}</span
          >
        </button>
      </div>
      <div v-if="mapMode==='outdoor'" class="outdoor-legend"><span><i class="good"></i>외출 적정</span><span><i class="hot"></i>너무 더움</span><span><i class="cold"></i>너무 추움</span><span><i class="warning"></i>예·특보</span></div>
      <div v-else-if="typhoonStore.showForecastRange" class="range-legend">
        <i></i
        ><span
          >실선: 15m/s 강풍반경 · 옅은 원: 70% 예상확률반경<br />기상청 미제공 값은 표시하지
          않음</span
        >
      </div>
    </div>
  </article>
</template>

<style scoped>
.map-card {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: linear-gradient(145deg, #101f31, #0d1928);
  box-shadow: 0 18px 45px #02091455;
}
header {
  display: grid;
  grid-template-columns: minmax(185px,auto) minmax(0,1fr) auto;
  align-items: center;
  gap: 15px;
  margin-bottom: 14px;
}
header p {
  margin: 0 0 4px;
  color: var(--cyan);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.15em;
}
h2 {
  margin: 0;
  font-size: 1.15rem;
}
.map-modes{display:flex;grid-column:3;justify-self:end;gap:5px}.map-modes button{padding:7px 10px;border:1px solid #2b4057;border-radius:8px;background:#102033;color:#8297ad;font-size:.68rem;font-weight:700;cursor:pointer}.map-modes button.active{border-color:var(--cyan);background:#123247;color:#bceeff;box-shadow:0 0 0 2px #45cfff18}
.models {
  display: flex;
  grid-column: 2;
  justify-self: start;
  flex-wrap: wrap;
  gap: 5px;
}
.models label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 7px;
  background: var(--panel-soft);
  color: #9eb1c5;
  font-size: 0.66rem;
  cursor: pointer;
}
.models input {
  position: absolute;
  opacity: 0;
}
.models i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.models .range-control i {
  background: #ffe866;
  box-shadow: 0 0 0 2px #9c861d;
}
.models .past-dot {
  background: #64748b;
}
.models label:has(input:not(:checked)) {
  opacity: 0.4;
}
.map-wrap {
  position: relative;
  height: 410px;
  overflow: hidden;
  border-radius: 12px;
  background: #0b1826;
}
.leaflet-container {
  height: 100%;
  background: #0b1826;
}
:deep(.leaflet-interactive:focus) {
  outline: none;
}
:deep(.leaflet-interactive) {
  -webkit-tap-highlight-color: transparent;
}
.storm-info {
  position: absolute;
  z-index: 500;
  left: 12px;
  bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 5px;
  max-width: calc(100% - 24px);
  pointer-events: none;
}
.storm-info button {
  display: grid;
  grid-template-columns: 8px auto;
  align-items: center;
  gap: 6px;
  min-height: 29px;
  padding: 6px 8px;
  border: 1px solid #ffffff24;
  border-radius: 99px;
  background: #071321e8;
  color: #e5f4ff;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 3px 12px #0005;
}
.storm-info i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.storm-info b {
  font-size: 0.65rem;
  white-space: nowrap;
}
.storm-info span {
  display: none;
  max-width: 310px;
  color: #9eb1c5;
  font-size: 0.61rem;
  line-height: 1.35;
  text-align: left;
}
.storm-info span strong {
  display: block;
  margin-bottom: 2px;
  color: #e5f4ff;
  font-size: 0.7rem;
}
.storm-info button:hover,
.storm-info button:focus-visible,
.storm-info button.expanded {
  grid-template-columns: 8px auto 1fr;
  border-radius: 9px;
}
.storm-info button.selected{border-color:#fff8;background:#102438f5;box-shadow:0 0 0 2px #ffffff20,0 5px 18px #0008}.storm-info:has(button.selected) button:not(.selected){opacity:.55}
.storm-info button:hover span,
.storm-info button:focus-visible span,
.storm-info button.expanded span {
  display: block;
}
.range-legend {
  position: absolute;
  z-index: 500;
  right: 12px;
  top: 12px;
  bottom: auto;
  display: flex;
  align-items: center;
  gap: 7px;
  max-width: 230px;
  padding: 8px 10px;
  border: 1px solid #ffffff22;
  border-radius: 8px;
  background: #071321e8;
  color: #cbd6df;
  font-size: 0.62rem;
  pointer-events: none;
}
.range-legend i {
  flex: 0 0 auto;
  width: 17px;
  height: 9px;
  border: 1px solid #d4b72e;
  background: #ffe86666;
}
.outdoor-legend{position:absolute;z-index:500;right:12px;bottom:12px;display:flex;flex-wrap:wrap;gap:9px;padding:8px 10px;border:1px solid #ffffff22;border-radius:8px;background:#071321e8;color:#cbd6df;font-size:.62rem;pointer-events:none}.outdoor-legend span{display:flex;align-items:center;gap:5px}.outdoor-legend i{width:9px;height:9px;border:1px solid #fff;border-radius:50%}.outdoor-legend .good{background:#45d6aa}.outdoor-legend .hot{background:#ff5f67}.outdoor-legend .cold{background:#60a5fa}
.outdoor-legend .warning{border:2px dashed #f6b94d;background:#513a18}
@media (max-width: 600px) {
  header {
    grid-template-columns: minmax(0,1fr) auto;
    align-items: flex-start;
  }
  .map-modes{grid-column:2;grid-row:1}.models{grid-column:1 / -1;grid-row:2}
  .map-modes button{padding:6px 8px;font-size:.61rem}
  .map-wrap {
    height: 330px;
  }
}
</style>
