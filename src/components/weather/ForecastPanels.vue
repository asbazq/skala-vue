<script setup>
defineProps({ weather: { type: Object, required: true } })
</script>

<template>
  <div class="forecasts">
    <article class="panel"><header><div><p>HOURLY</p><h2>오늘의 날씨</h2></div><span>{{ weather.local }}</span></header><div class="items hourly"><div v-for="item in weather.hourly" :key="item.time"><small>{{ item.time }}</small><i>{{ item.icon }}</i><b>{{ item.temp }}°</b></div></div></article>
    <article class="panel"><header><div><p>6-DAY OUTLOOK</p><h2>주간 예보</h2></div></header><div class="items weekly"><div v-for="item in weather.weekly" :key="item.day"><small>{{ item.day }}</small><i>{{ item.icon }}</i><b>{{ item.high }}° <em>{{ item.low }}°</em></b></div></div></article>
  </div>
</template>

<style scoped>
.forecasts { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }.panel { padding: 20px; overflow: hidden; border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(145deg, #101f31, #0d1928); box-shadow: 0 18px 45px #02091455; } header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 17px; } header p { margin: 0 0 4px; color: var(--cyan); font-size: .65rem; font-weight: 800; letter-spacing: .15em; } h2 { margin: 0; font-size: 1.15rem; } header>span { color: var(--muted); font-size: .75rem; }.items { display: grid; gap: 7px; }.hourly { grid-template-columns: repeat(5, 1fr); }.weekly { grid-template-columns: repeat(6, 1fr); }.items div { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 72px; padding: 12px 5px; border-radius: 9px; background: var(--panel-soft); }.items small { color: var(--muted); font-size: .64rem; }.items i { font-size: 1.35rem; font-style: normal; }.items b { font-size: .8rem; }.items em { color: var(--muted); font-style: normal; font-weight: 500; }
@media (max-width: 950px) { .forecasts { grid-template-columns: 1fr; } } @media (max-width: 600px) { .items { overflow-x: auto; }.hourly { grid-template-columns: repeat(5, 82px); }.weekly { grid-template-columns: repeat(6, 82px); } }
</style>
