<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="about-view">
    <header>
      <p>ABOUT WEATHER TRACK</p>
      <h1>서비스 소개</h1>
      <span>Vue 3와 Vue Router를 활용한 기상 관측 대시보드입니다.</span>
    </header>

    <div class="about-grid">
      <article>
        <small>WEATHER DASHBOARD</small>
        <h2>지역별 날씨 탐색</h2>
        <p>여러 도시의 현재 기온, 습도, 풍속과 예보를 확인하고 즐겨찾기와 한글 검색으로 원하는 지역을 빠르게 찾을 수 있습니다.</p>
      </article>
      <article>
        <small>TYPHOON MONITOR</small>
        <h2>태풍 경로 시각화</h2>
        <p>Leaflet 지도에서 실제 이동 경로, 기관별 예상 경로와 시간이 지날수록 넓어지는 예상 범위를 함께 비교합니다.</p>
      </article>
    </div>

    <article class="compare-description">
      <div class="compare-heading"><div><small>CITY COMPARISON</small><h2>두 도시 날씨 비교</h2></div><RouterLink to="/compare/city_01/city_03">비교 화면 열기 →</RouterLink></div>
      <p>두 도시의 기온, 습도, 풍속을 한 화면에서 비교하는 페이지입니다. 기존 날씨 대시보드에서는 여러 도시의 기본 날씨를 목록으로 확인할 수 있지만, 두 도시의 수치 차이를 확인하려면 각 정보를 번갈아 비교해야 합니다. 여행지나 외출 지역을 결정할 때 두 도시의 날씨 차이를 빠르게 확인할 수 있도록 도시 비교 화면을 추가했습니다.</p>
      <p>비교 기능은 전체 도시를 탐색하는 메인 화면과 역할이 다르므로 별도 View로 분리했습니다. 또한 비교하는 두 도시의 ID를 URL에 포함하여 새로고침 후에도 선택이 유지되고, 비교 결과를 URL로 공유할 수 있도록 했습니다.</p>
      <code>/compare/:firstCityId/:secondCityId</code>
    </article>

    <RouterLink class="home-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.about-view { color:var(--text); }.about-view>header { margin-bottom:24px; }.about-view>header p,.about-grid small,.compare-description small { margin:0 0 6px;color:var(--cyan);font-size:.65rem;font-weight:800;letter-spacing:.15em }.about-view h1 { margin:0;font-size:clamp(2.2rem,5vw,3.6rem) }.about-view>header span { display:block;margin-top:8px;color:var(--muted) }.about-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px }.about-grid article,.compare-description { padding:24px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,#101f31,#0d1928);box-shadow:0 18px 45px #02091455 }.about-grid h2,.compare-description h2 { margin:0 0 10px;font-size:1.2rem }.about-grid p,.compare-description p { margin:0;color:#9bb0c4;line-height:1.8 }.compare-description { margin-top:16px }.compare-description p+p { margin-top:12px }.compare-heading { display:flex;align-items:flex-start;justify-content:space-between;gap:16px }.compare-heading a { padding:8px 11px;border-radius:8px;background:#173148;color:#8edfff;font-size:.75rem;white-space:nowrap }.compare-description code { display:inline-block;margin-top:16px;padding:7px 10px;border-radius:6px;background:#091625;color:#68d9ff }.home-link { display:inline-block;margin-top:20px;padding:9px 13px;border-radius:8px;background:#173148;color:#8edfff }
@media(max-width:700px){.about-grid{grid-template-columns:1fr}.compare-heading{align-items:flex-start;flex-direction:column}}
</style>
