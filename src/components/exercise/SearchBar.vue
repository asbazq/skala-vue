<script setup>
defineProps({ currentQuery: { type: String, default: '' } })
defineEmits(['update-query'])
</script>
<template><div class="search-component"><label><span>⌕</span><input type="search" :value="currentQuery" placeholder="한글 도시 이름 검색 (예: 서울)" aria-label="한글 도시 이름 검색" @input="$emit('update-query', $event.target.value)"></label><p>입력한 도시명: <strong>{{ currentQuery || '없음' }}</strong></p></div></template>
<style scoped>
.search-component { display:flex; align-items:center; gap:14px; }
.search-component label { display:flex; align-items:center; gap:9px; width:min(420px,100%); padding:0 13px; border:1px solid #293d54; border-radius:9px; background:#0b1828; transition:border-color .2s, box-shadow .2s; }
.search-component label:focus-within { border-color:var(--cyan); box-shadow:0 0 0 3px rgba(69,207,255,.12); }
.search-component label span { color:var(--cyan); font-size:1.25rem; }
.search-component input { box-sizing:border-box; width:100%; min-width:0; padding:11px 0; border:0; outline:0; appearance:none; background:transparent; color:var(--text); caret-color:var(--cyan); font-size:.82rem; }
.search-component input::placeholder { color:#60758b; opacity:1; }
.search-component input::-webkit-search-cancel-button { filter:invert(1); opacity:.55; }
.search-component p { margin:0; color:var(--muted); font-size:.75rem; }
.search-component strong { color:#bfeeff; }
@media(max-width:700px){.search-component{align-items:flex-start;flex-direction:column}.search-component label{width:100%}}
</style>
