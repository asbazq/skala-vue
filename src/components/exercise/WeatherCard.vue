<script setup>
import { toRef } from 'vue'
import { useTemperature } from '@/composables/useTemperature'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'

// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  isHovered: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const rawTemp = toRef(() => props.cityItem.temp)
const { formattedTemp } = useTemperature(rawTemp)
const alertStore = useWeatherAlertStore()

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])
</script>

<template>
  <div
    class="weather-card"
    :class="{ 'is-hovered': isHovered }"
    tabindex="0"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
    @keydown.enter="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <div class="card-head">
      <div><small>LOCAL WEATHER</small><h4>{{ cityItem.name }}</h4><p>{{ cityItem.status }}</p></div>
      <div class="card-actions">
        <span class="weather-symbol">{{ cityItem.icon || '●' }}</span>
        <button type="button" class="btn-favorite" :class="{ active: isFavorite }" :aria-label="`${cityItem.name} 즐겨찾기 ${isFavorite ? '해제' : '추가'}`" @click.stop="emit('toggle-favorite', cityItem.id)">{{ isFavorite ? '★' : '☆' }}</button>
      </div>
    </div>
    <strong class="temperature">{{ formattedTemp }}</strong>
    <div class="summary"><span>습도 <b>{{ cityItem.humidity ?? '-' }}%</b></span><span>풍속 <b>{{ cityItem.wind ?? '-' }}m/s</b></span></div>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움</span>
    <span v-else class="badge cool">❄️ 선선함</span>
    <span
      v-if="alertStore.getRiskLabel(cityItem.temp)"
      class="risk-badge"
      :class="alertStore.getRiskLevel(cityItem.temp)"
    >
      {{ alertStore.getRiskLabel(cityItem.temp) }}
    </span>

    <button type="button" class="btn-detail" @click.stop="emit('click-detail', cityItem.id)">상세보기</button>

  </div>
</template>

<style scoped>
.weather-card {
  background: #142438;
  color: #dce9f4;
  border: 1px solid #243950;
  min-height: 162px;
  padding: 13px;
  margin: 0;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: 0.2s;
}
.card-head { display:flex; justify-content:space-between; gap:10px; }.card-head small { color:#61768c; font-size:.52rem; font-weight:800; letter-spacing:.1em; }.card-head h4 { margin:2px 0 0; font-size:.95rem; }.card-head p { margin:1px 0 0; color:#8297ad; font-size:.66rem; }.card-actions { display:flex; align-items:flex-start; gap:7px; flex:0 0 auto; }.weather-symbol { display:block; font-size:1.55rem; line-height:1.2; }.temperature { display:block; margin:10px 0; font-size:1.75rem; letter-spacing:-.05em; }.summary { display:flex; gap:6px; margin-bottom:8px; }.summary span { flex:1; display:flex; flex-direction:column; padding:6px; border-radius:6px; background:#0e1c2d; color:#71869c; font-size:.56rem; }.summary b { margin-top:1px; color:#dce9f4; font-size:.65rem; }
.weather-card.is-hovered {
  border-color: #45cfff;
  box-shadow: 0 6px 16px rgba(69, 207, 255, 0.15);
  transform: translateY(-3px);
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.risk-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}
.risk-badge.heat { background: #d63031; }
.risk-badge.cold { background: #0984e3; }
.hot {
  background-color: #ff7675;
}
.cool {
  background-color: #74b9ff;
}
.btn-favorite {
  display:grid;
  width:24px;
  height:24px;
  place-items:center;
  padding:0;
  border: 0;
  border-radius:6px;
  background: #0e1c2d;
  color: #95a5a6;
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
}
.btn-favorite.active {
  color: #f1c40f;
}
.btn-detail { position:absolute; right:42px; bottom:12px; padding:5px 8px; border:0; border-radius:5px; background:#1d3c55; color:#9ee4ff; font-size:.62rem; cursor:pointer; }
</style>
