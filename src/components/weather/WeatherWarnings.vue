<script setup>
defineProps({ warnings:{ type:Array, default:() => [] }, compact:{ type:Boolean, default:false } })
</script>

<template>
  <section v-if="warnings.length" class="warning-panel" :class="{compact}" aria-label="현재 발효 예특보">
    <header><b>⚠ 현재 발효 예·특보</b><span>{{ warnings.length }}건</span></header>
    <div class="warning-list">
      <article v-for="warning in warnings.slice(0, compact ? 2 : 6)" :key="warning.id">
        <strong>{{ warning.icon }} {{ warning.type }} {{ warning.level }}</strong>
        <span>{{ warning.region }}</span>
        <small v-if="!compact">{{ warning.command }} · 발효 {{ warning.effectiveAt }}</small>
      </article>
      <small v-if="warnings.length > (compact ? 2 : 6)" class="more">외 {{ warnings.length - (compact ? 2 : 6) }}개 세부 구역</small>
    </div>
  </section>
</template>

<style scoped>
.warning-panel{margin:14px 0;padding:12px;border:1px solid #f6b94d;border-radius:10px;background:linear-gradient(135deg,#392b16,#171f2b);box-shadow:0 0 0 2px #f6b94d17}.warning-panel header{display:flex;justify-content:space-between;gap:10px;margin-bottom:8px;color:#ffd98c;font-size:.75rem}.warning-panel header span{padding:2px 7px;border-radius:99px;background:#6a4817}.warning-list{display:grid;gap:6px}.warning-list article{display:flex;align-items:center;gap:8px;padding:8px;border-radius:7px;background:#0c1825bb;font-size:.7rem}.warning-list strong{color:#fff0cb}.warning-list span{color:#d6c6a5}.warning-list small{margin-left:auto;color:#978d7c}.compact{margin:10px 0}.compact .warning-list article{padding:6px}.compact .warning-list span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:600px){.warning-list article{align-items:flex-start;flex-direction:column}.warning-list small{margin-left:0}}
.more{padding:3px 6px;color:#bda97c;font-size:.65rem}
</style>
