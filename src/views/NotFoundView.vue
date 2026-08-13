<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found" aria-labelledby="not-found-title">
    <div class="weather-visual" aria-hidden="true">
      <div class="radar-ring ring-one"></div>
      <div class="radar-ring ring-two"></div>
      <div class="radar-ring ring-three"></div>
      <div class="radar-sweep"></div>
      <span class="lost-point">?</span>
    </div>

    <div class="not-found-content">
      <p class="eyebrow">LOCATION NOT FOUND · 404</p>
      <h1 id="not-found-title">이 지역의 날씨를<br><span>찾을 수 없어요.</span></h1>
      <p class="description">주소가 바뀌었거나 존재하지 않는 페이지입니다.<br>대시보드에서 원하는 지역의 외출 날씨를 다시 확인해 보세요.</p>

      <div class="actions">
        <RouterLink class="primary-action" to="/">대시보드로 돌아가기</RouterLink>
        <RouterLink class="secondary-action" to="/compare/seoul/busan">도시 비교하기</RouterLink>
      </div>

      <div class="status"><i></i><span>날씨·예특보 데이터 서비스는 정상 작동 중입니다.</span></div>
    </div>
  </section>
</template>

<style scoped>
.not-found{position:relative;display:grid;min-height:calc(100vh - 150px);grid-template-columns:minmax(280px,.8fr) minmax(360px,1.2fr);align-items:center;gap:clamp(35px,7vw,90px);overflow:hidden;padding:clamp(28px,6vw,72px);border:1px solid var(--line);border-radius:20px;background:radial-gradient(circle at 18% 50%,#12374c 0,#0d2235 27%,transparent 52%),linear-gradient(145deg,#101f31,#091522);box-shadow:0 24px 65px #02091466}.not-found::before{position:absolute;inset:0;background-image:linear-gradient(#45cfff08 1px,transparent 1px),linear-gradient(90deg,#45cfff08 1px,transparent 1px);background-size:34px 34px;content:'';mask-image:linear-gradient(90deg,#000,transparent 75%);pointer-events:none}.weather-visual{position:relative;width:min(32vw,330px);aspect-ratio:1;justify-self:center;border:1px solid #45cfff44;border-radius:50%;background:#071521aa;box-shadow:inset 0 0 45px #45cfff12,0 0 60px #45cfff10}.radar-ring{position:absolute;inset:50%;border:1px solid #45cfff38;border-radius:50%;transform:translate(-50%,-50%)}.ring-one{width:34%;height:34%}.ring-two{width:66%;height:66%}.ring-three{width:100%;height:100%}.weather-visual::before,.weather-visual::after{position:absolute;background:#45cfff25;content:''}.weather-visual::before{top:50%;left:0;width:100%;height:1px}.weather-visual::after{top:0;left:50%;width:1px;height:100%}.radar-sweep{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 78%,#45cfff30 96%,#45cfff 100%);animation:sweep 7s linear infinite;clip-path:circle(50%)}.lost-point{position:absolute;top:31%;left:57%;display:grid;width:56px;height:56px;place-items:center;border:1px solid #ffcf68;border-radius:50%;background:#3c3018;color:#ffe39e;font-size:1.6rem;font-weight:900;box-shadow:0 0 0 8px #fbbf2413,0 0 25px #fbbf2438}.not-found-content{position:relative;z-index:1}.eyebrow{margin:0 0 12px;color:var(--cyan);font-size:.68rem;font-weight:800;letter-spacing:.16em}.not-found h1{margin:0;color:#edf8ff;font-size:clamp(2.5rem,5.4vw,5rem);line-height:1.02;letter-spacing:-.065em}.not-found h1 span{color:var(--cyan)}.description{margin:22px 0 0;color:#91a6ba;font-size:clamp(.82rem,1.3vw,.95rem);line-height:1.8}.actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:28px}.actions a{padding:11px 15px;border-radius:9px;font-size:.78rem;font-weight:800}.primary-action{background:var(--cyan);color:#07111f;box-shadow:0 8px 24px #45cfff25}.secondary-action{border:1px solid #2b4961;background:#14283b;color:#a8ddf0}.status{display:flex;align-items:center;gap:8px;margin-top:25px;color:#6f879d;font-size:.68rem}.status i{width:7px;height:7px;border-radius:50%;background:#52d6a9;box-shadow:0 0 10px #52d6a9}@keyframes sweep{to{transform:rotate(360deg)}}@media(max-width:760px){.not-found{grid-template-columns:1fr;text-align:center}.weather-visual{width:min(62vw,250px)}.actions,.status{justify-content:center}}@media(prefers-reduced-motion:reduce){.radar-sweep{animation:none}}
</style>
