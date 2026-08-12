<script setup>
const guides = [
  { icon:'☀️', state:'맑음', title:'자외선과 일교차 주의', description:'낮에는 자외선 차단제를 사용하고 아침저녁 기온 차에 대비해 가벼운 겉옷을 준비하세요.', color:'#fbbf24' },
  { icon:'🌧️', state:'비', title:'우산과 미끄럼 주의', description:'외출 전 강수 확률을 확인하고 미끄럽지 않은 신발과 휴대용 우산을 준비하세요.', color:'#38bdf8' },
  { icon:'☁️', state:'흐림', title:'기온 변화 대비', description:'구름이 많을 때는 체감온도가 낮아질 수 있으므로 얇은 옷을 여러 겹 착용하세요.', color:'#94a3b8' },
  { icon:'🌬️', state:'강풍', title:'돌풍과 낙하물 주의', description:'간판과 나뭇가지 주변을 피하고 야외 활동 시 기상 특보를 확인하세요.', color:'#a78bfa' },
]
</script>

<template>
  <section class="guide-view">
    <header><p>WEATHER SAFETY GUIDE</p><h1>날씨 상태별 안내</h1><span>기상 상태에 맞는 준비사항을 미리 확인하세요.</span></header>
    <div class="guide-grid"><article v-for="guide in guides" :key="guide.state"><div class="guide-icon" :style="{borderColor:guide.color,color:guide.color}">{{ guide.icon }}</div><div><small>{{ guide.state }}</small><h2>{{ guide.title }}</h2><p>{{ guide.description }}</p></div></article></div>
    <aside><div><b>태풍 발생 시</b><p>기관별 예상 경로와 예상 범위를 함께 확인하고, 최신 재난문자와 기상청 발표를 우선해 주세요.</p></div><RouterLink to="/">태풍 지도 확인 →</RouterLink></aside>
    <RouterLink class="back-link" to="/">← 날씨 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.guide-view{min-height:calc(100vh - 150px);padding:24px;border:1px solid var(--line);border-radius:18px;background:#0b1726;color:var(--text);box-shadow:0 20px 55px rgba(2,9,20,.35)}.guide-view>header{margin-bottom:24px}.guide-view>header p{margin:0 0 6px;color:var(--cyan);font-size:.65rem;font-weight:800;letter-spacing:.15em}.guide-view h1{margin:0;color:var(--text);font-size:clamp(2.2rem,5vw,3.6rem)}.guide-view>header span{display:block;margin-top:8px;color:var(--muted)}.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.guide-grid article{display:flex;gap:16px;padding:22px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(145deg,#101f31,#0d1928);color:var(--text);box-shadow:0 18px 45px #02091444}.guide-icon{display:grid;flex:0 0 52px;width:52px;height:52px;place-items:center;border:1px solid;border-radius:12px;background:#0a1726;font-size:1.7rem}.guide-grid small{color:var(--muted);font-size:.65rem}.guide-grid h2{margin:2px 0 7px;color:var(--text);font-size:1.05rem}.guide-grid p,aside p{margin:0;color:#91a6ba;line-height:1.7;font-size:.8rem}aside{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:16px;padding:20px 22px;border:1px solid #51471d;border-radius:14px;background:#292613;color:var(--text)}aside b{color:#ffe276}aside p{margin-top:4px}aside a,.back-link{padding:9px 12px;border-radius:8px;background:#173148;color:#8edfff;font-size:.75rem;white-space:nowrap}.back-link{display:inline-block;margin-top:20px}@media(max-width:700px){.guide-view{padding:18px}.guide-grid{grid-template-columns:1fr}aside{align-items:flex-start;flex-direction:column}}
</style>
