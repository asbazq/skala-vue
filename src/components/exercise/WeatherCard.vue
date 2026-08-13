<script setup>
import { computed, toRef } from 'vue'
import { useTemperature } from '@/composables/useTemperature'
import { useWeatherAlertStore } from '@/stores/weatherAlertStore'
import { comfortClass, comfortLabel, comfortScore } from '@/utils/outdoorComfort'

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
const outdoorScore = computed(() => comfortScore(props.cityItem, alertStore))

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['click-detail', 'toggle-favorite'])
</script>

<template>
  <div
    class="weather-card"
    :class="[alertStore.getRiskLevel(cityItem.temp), { 'is-hovered': isHovered }]"
    tabindex="0"
    @click="emit('click-detail', cityItem.id)"
    @keydown.enter="emit('click-detail', cityItem.id)"
  >
    <div class="card-head">
      <div><small>LOCAL WEATHER</small><h4>{{ cityItem.name }}</h4><p>{{ cityItem.status }}</p></div>
      <div class="card-actions">
        <span class="weather-symbol">{{ cityItem.icon || '●' }}</span>
        <button type="button" class="btn-favorite" :class="{ active: isFavorite }" :aria-label="`${cityItem.name} 즐겨찾기 ${isFavorite ? '해제' : '추가'}`" @click.stop="emit('toggle-favorite', cityItem.id)">{{ isFavorite ? '★' : '☆' }}</button>
      </div>
    </div>
    <strong class="temperature">{{ formattedTemp }}</strong>
    <div class="comfort" :class="comfortClass(outdoorScore)">
      <span>외출 쾌적도 <b>{{ comfortLabel(outdoorScore) }}</b></span>
      <strong>{{ outdoorScore }}<small>점</small></strong>
      <i><em :style="{width:`${outdoorScore}%`}"></em></i>
    </div>
    <div class="summary"><span>습도 <b>{{ cityItem.humidity ?? '-' }}%</b></span><span>풍속 <b>{{ cityItem.wind ?? '-' }}m/s</b></span></div>
    <div class="card-badges">
      <span
        v-if="alertStore.getRiskLabel(cityItem.temp)"
        class="risk-badge"
        :class="alertStore.getRiskLevel(cityItem.temp)"
      >
        <i></i>{{ alertStore.getRiskLevel(cityItem.temp) === 'above-limit' ? '내 기준보다 더워요' : '내 기준보다 추워요' }}
      </span>
      <span v-if="cityItem.warnings?.length" class="warning-badge">⚠ 예·특보 {{ cityItem.warnings.length }}건</span>
    </div>

  </div>
</template>

<style scoped>
.weather-card {
  display: flex;
  flex-direction: column;
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
.comfort{position:relative;display:grid;grid-template-columns:1fr auto;align-items:end;gap:2px 8px;margin:-2px 0 9px}.comfort>span{color:#71869c;font-size:.58rem}.comfort>span b{margin-left:3px;color:#9fdcc9}.comfort>strong{grid-row:1;font-size:.9rem}.comfort>strong small{margin-left:1px;color:#7890a7;font-size:.5rem}.comfort>i{grid-column:1/-1;height:3px;overflow:hidden;border-radius:99px;background:#25394d}.comfort>i em{display:block;height:100%;border-radius:inherit;background:#45d6aa}.comfort.moderate>span b{color:#ffd98c}.comfort.moderate>i em{background:#e8b849}.comfort.uncomfortable>span b{color:#ffadb1}.comfort.uncomfortable>i em{background:#ff6f76}
.weather-card.is-hovered {
  border-color: #45cfff;
  box-shadow: 0 10px 26px rgba(69, 207, 255, 0.28);
  transform: translateY(-5px) scale(1.015);
}
.weather-card.above-limit {
  border: 2px solid #ff5f67;
  background: linear-gradient(145deg,#35202b,#142438 55%);
  box-shadow: 0 0 0 1px #ff5f6722, 0 8px 22px #ff3c4c20;
}
.weather-card.below-limit { border:2px solid #60a5fa; background:linear-gradient(145deg,#172d49,#142438 55%); box-shadow:0 0 0 1px #60a5fa22,0 8px 22px #2788eb22; }
.weather-card.above-limit.is-hovered {
  border-color: #ff8b91;
  box-shadow: 0 0 0 3px #ff5f6733, 0 14px 30px #ff3c4c38;
}
.weather-card.below-limit.is-hovered { border-color:#93c5fd; box-shadow:0 0 0 3px #60a5fa33,0 14px 30px #2788eb38; }
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.risk-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 7px;
  border: 1px solid transparent;
  border-radius: 99px;
  font-size: .62rem;
  font-weight: 700;
}
.risk-badge i{width:5px;height:5px;border-radius:50%;background:currentColor}.risk-badge.above-limit{border-color:#ff858b55;background:#ff5f6712;color:#ffadb1}.risk-badge.below-limit{border-color:#78b8ff55;background:#60a5fa12;color:#a9d2ff}
.warning-badge{display:inline-block;padding:4px 7px;border:1px solid #f6b94d;border-radius:5px;background:#513a18;color:#ffe2a3;font-size:.64rem;font-weight:800}
.card-badges{display:flex;min-width:0;flex-wrap:wrap;gap:5px;margin-top:auto}
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
</style>
