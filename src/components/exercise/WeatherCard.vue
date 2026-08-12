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
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ formattedTemp }}</p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움</span>
    <span v-else class="badge cool">❄️ 선선함</span>
    <span
      v-if="alertStore.getRiskLabel(cityItem.temp)"
      class="risk-badge"
      :class="alertStore.getRiskLevel(cityItem.temp)"
    >
      {{ alertStore.getRiskLabel(cityItem.temp) }}
    </span>

    <button class="btn-detail" @click.stop="emit('click-detail', cityItem.name, cityItem.status)">상세보기</button>
    <button
      type="button"
      class="btn-favorite"
      :class="{ active: isFavorite }"
      :aria-label="`${cityItem.name} 즐겨찾기 ${isFavorite ? '해제' : '추가'}`"
      @click.stop="emit('toggle-favorite', cityItem.id)"
    >
      {{ isFavorite ? '★' : '☆' }}
    </button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: 0.2s;
}
.weather-card.is-hovered {
  border-color: #3498db;
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.2);
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
.btn-detail {
  position: absolute;
  right: 52px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}
.btn-favorite {
  position: absolute;
  top: 15px;
  right: 12px;
  border: 0;
  background: transparent;
  color: #95a5a6;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}
.btn-favorite.active {
  color: #f1c40f;
}
</style>
