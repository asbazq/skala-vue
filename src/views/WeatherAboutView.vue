<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="about-view">
    <header>
      <p>ABOUT 나갈까?</p>
      <h1>서비스 소개</h1>
      <span>실시간 날씨를 개인의 외출 기준으로 해석해 주는 Vue 기반 기상 대시보드입니다.</span>
    </header>

    <div class="about-grid">
      <article>
        <small>PERSONAL OUTDOOR MAP</small>
        <h2>내 기준으로 보는 전국 날씨</h2>
        <p>OpenWeather의 현재 날씨와 예보를 대한민국 17개 시·도에 연결합니다. 사용자가 정한 기온 상·하한에 따라 행정구역, 지역 카드와 예보 시간대를 외출 적정·너무 더움·너무 추움으로 구분합니다.</p>
      </article>
      <article>
        <small>TYPHOON MONITOR</small>
        <h2>선택해서 보는 태풍 경로</h2>
        <p>Leaflet 지도에서 기상청 태풍의 분석 경로, 예측 경로, 15m/s 강풍반경과 70% 예상확률반경을 표시합니다. 최근 태풍 5개 중 원하는 태풍 하나만 선택할 수도 있습니다.</p>
      </article>
    </div>

    <article class="compare-description">
      <div class="compare-heading"><div><small>WHERE SHOULD I GO?</small><h2>어디로 나갈까?</h2></div><RouterLink to="/compare/seoul/busan">비교 화면 열기 →</RouterLink></div>
      <p>두 지역의 단순 기온 차이뿐 아니라 앞으로 약 24시간 동안 개인 기온 기준을 만족하고 강수확률이 50% 미만인 시간대를 계산합니다. 외출하기 좋은 시간대 수, 추천 시간, 추천 시간의 강수확률과 최대 강수확률을 함께 보여 줍니다.</p>
      <p>외출 가능 시간대, 강수확률과 풍속을 종합해 더 나가기 좋은 지역과 추천 이유를 안내합니다. 선택한 두 지역은 새로고침 후에도 유지되어 같은 조건을 계속 확인할 수 있습니다.</p>
    </article>

    <RouterLink class="home-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.about-view { color:var(--text); }.about-view>header { margin-bottom:24px; }.about-view>header p,.about-grid small,.compare-description small { margin:0 0 6px;color:var(--cyan);font-size:.65rem;font-weight:800;letter-spacing:.15em }.about-view h1 { margin:0;font-size:clamp(2.2rem,5vw,3.6rem) }.about-view>header span { display:block;margin-top:8px;color:var(--muted) }.about-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px }.about-grid article,.compare-description { padding:24px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,#101f31,#0d1928);box-shadow:0 18px 45px #02091455 }.about-grid h2,.compare-description h2 { margin:0 0 10px;font-size:1.2rem }.about-grid p,.compare-description p { margin:0;color:#9bb0c4;line-height:1.8 }.compare-description { margin-top:16px }.compare-description p+p { margin-top:12px }.compare-heading { display:flex;align-items:flex-start;justify-content:space-between;gap:16px }.compare-heading a { padding:8px 11px;border-radius:8px;background:#173148;color:#8edfff;font-size:.75rem;white-space:nowrap }.home-link { display:inline-block;margin-top:20px;padding:9px 13px;border-radius:8px;background:#173148;color:#8edfff }
@media(max-width:700px){.about-grid{grid-template-columns:1fr}.compare-heading{align-items:flex-start;flex-direction:column}}
</style>
