<script setup>
const guides = [
  { icon:'🚪', state:'STEP 1', title:'내 외출 기온 기준 설정', description:'대시보드 아래에서 “이 온도 이하면/이상이면 나가기 싫어요” 값을 정하세요. 기준을 벗어난 지역과 시간대가 파란색 또는 빨간색으로 표시됩니다.', color:'#45d6aa' },
  { icon:'🗺️', state:'STEP 2', title:'외출 기준 지도 확인', description:'17개 시·도의 행정구역 색으로 외출 적합 여부를 확인하세요. 지역 버튼을 누르면 지도가 해당 위치로 이동하며, 영역과 마커를 클릭하면 상세 날씨가 열립니다.', color:'#38bdf8' },
  { icon:'🕒', state:'STEP 3', title:'24시간과 일별 예보 확인', description:'현재부터 약 24시간을 3시간 간격 8개 시간대로 확인하세요. 개인 기준을 벗어난 카드에는 상태별 테두리가 표시되며 상세보기에서는 추세 그래프도 제공합니다.', color:'#a78bfa' },
  { icon:'🚶', state:'STEP 4', title:'어디로 나갈까? 비교', description:'두 지역을 고르면 개인 기온 기준과 강수확률을 이용해 외출하기 좋은 시간대 수, 추천 시간과 더 나가기 좋은 지역을 안내합니다.', color:'#fbbf24' },
]
</script>

<template>
  <section class="guide-view">
    <header><p>HOW TO USE 나갈까?</p><h1>이용 안내</h1><span>나만의 외출 기준으로 지역과 시간을 빠르게 결정해 보세요.</span></header>
    <div class="guide-grid"><article v-for="guide in guides" :key="guide.state"><div class="guide-icon" :style="{borderColor:guide.color,color:guide.color}">{{ guide.icon }}</div><div><small>{{ guide.state }}</small><h2>{{ guide.title }}</h2><p>{{ guide.description }}</p></div></article></div>
    <aside><div><b>태풍 경로는 선택형 지도입니다</b><p>지도 오른쪽의 ‘태풍 경로’를 누르면 기상청 최근 태풍 5개를 확인할 수 있습니다. 태풍 번호를 선택하면 한 경로만 볼 수 있으며, 태풍 정보는 공식 기상청 발표를 우선해 주세요.</p></div><RouterLink to="/">지도 확인 →</RouterLink></aside>
    <RouterLink class="back-link" to="/">← 날씨 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.guide-view{min-height:calc(100vh - 150px);padding:24px;border:1px solid var(--line);border-radius:18px;background:#0b1726;color:var(--text);box-shadow:0 20px 55px rgba(2,9,20,.35)}.guide-view>header{margin-bottom:24px}.guide-view>header p{margin:0 0 6px;color:var(--cyan);font-size:.65rem;font-weight:800;letter-spacing:.15em}.guide-view h1{margin:0;color:var(--text);font-size:clamp(2.2rem,5vw,3.6rem)}.guide-view>header span{display:block;margin-top:8px;color:var(--muted)}.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.guide-grid article{display:flex;gap:16px;padding:22px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,#101f31,#0d1928);color:var(--text);box-shadow:0 18px 45px #02091444}.guide-icon{display:grid;flex:0 0 52px;width:52px;height:52px;place-items:center;border:1px solid;border-radius:12px;background:#0a1726;font-size:1.7rem}.guide-grid small{color:var(--muted);font-size:.65rem}.guide-grid h2{margin:2px 0 7px;color:var(--text);font-size:1.05rem}.guide-grid p,aside p{margin:0;color:#91a6ba;line-height:1.7;font-size:.8rem}aside{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:16px;padding:20px 22px;border:1px solid #51471d;border-radius:14px;background:#292613;color:var(--text)}aside b{color:#ffe276}aside p{margin-top:4px}aside a,.back-link{padding:9px 12px;border-radius:8px;background:#173148;color:#8edfff;font-size:.75rem;white-space:nowrap}.back-link{display:inline-block;margin-top:20px}@media(max-width:700px){.guide-view{padding:18px}.guide-grid{grid-template-columns:1fr}aside{align-items:flex-start;flex-direction:column}}
</style>
