<script setup>
import UnitToggler from '@/components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="나갈까 홈">
        <span class="brand-symbol">◉</span>
        <span class="brand-name">나갈까<b>?</b></span>
      </RouterLink>
      <nav aria-label="주요 메뉴">
        <RouterLink to="/">대시보드</RouterLink>
        <RouterLink to="/compare/seoul/busan">도시 비교</RouterLink>
        <RouterLink to="/guide">이용 안내</RouterLink>
        <RouterLink to="/about">서비스 소개</RouterLink>
      </nav>
      <div class="header-tools"><UnitToggler /><span class="update-state"><i></i> LIVE DATA</span></div>
    </header>
    <main><RouterView /></main>
  </div>
</template>

<style scoped>
.app-shell { min-height: 100vh; }
.site-header { position: sticky; top: 0; z-index: 1000; height: 70px; padding: 0 max(20px, calc((100vw - 1320px) / 2)); display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid #23364b; background: rgba(7, 17, 31, .9); backdrop-filter: blur(18px); }
.brand { display: flex; align-items: center; gap: 10px; color: #edf8ff; white-space: nowrap; }
.brand-name{font-family:Pretendard,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;font-size:1.05rem;font-weight:800;letter-spacing:-.045em}.brand-name b{display:inline-block;margin-left:1px;color:#45cfff;font-size:1.08em;font-weight:900;transform:translateY(-1px)}.brand-symbol { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 8px; background: #45cfff; color: #07111f; }
nav { display: flex; gap: 6px; } nav a { padding: 8px 12px; border-radius: 8px; color: #8ba0b7; font-size: .84rem; font-weight: 600; } nav a:hover, nav a.router-link-exact-active { background: #17283b; color: #f2f8fc; }
.update-state { display: flex; align-items: center; gap: 7px; color: #68deb4; font-size: .65rem; font-weight: 800; }.update-state i { width: 7px; height: 7px; border-radius: 50%; background: #52d6a9; box-shadow: 0 0 10px #52d6a9; }
.header-tools { display: flex; align-items: center; gap: 12px; }
main { width: min(1320px, calc(100% - 40px)); margin: 0 auto; padding: 30px 0 50px; }
@media (max-width: 700px) { .site-header { padding: 0 14px; } nav { display: none; } main { width: calc(100% - 24px); padding-top: 20px; } }
</style>
