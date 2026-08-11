<script setup>
import { ref } from 'vue'

// API 대신 사용하는 임의의 날씨 데이터
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 27, status: '바람' },
  { id: 'city_05', name: '강릉', temp: 23, status: '맑음' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 한글 IME 입력 중 v-model이 늦게 갱신되는 상황을 피하기 위해 직접 반영한다.
const updateSearchQuery = (event) => {
  searchQuery.value = event.target.value
}

const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 날씨 카드 호버링
const hoverCity = ref(null)
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        placeholder="검색할 도시 이름 입력"
        aria-label="검색할 도시 이름"
        @input="updateSearchQuery"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <!--호버링 시  hoverCity에 해당 카드 id를 저장-->
      <!--hoverCity 값과 해당 카드 id가 같다면 class is-hoverd 활성화-->
      <article
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        :class="{ 'is-hovered': hoverCity === item.id }"
        @mouseenter="hoverCity = item.id"
        @mouseleave="hoverCity = null"
        tabindex="0"
        @click="selectCity(item.name)"
        @keydown.enter="selectCity(item.name)"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 28" class="badge hot">🔥 더움 (28도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (28도 미만)</span>

        <button type="button" class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </article>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style>
.weather-card {
  transition: 0.2s;
}

/* is-hoverd class가 활성화되면 아래 css가 적용되어 강조 표시 */
.weather-card.is-hovered {
  border-color: #3498db;
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.2);
  transform: translateY(-3px);
}
</style>
