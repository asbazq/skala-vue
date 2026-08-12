<script setup>
import UnitToggler from '@/components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <h1>⛅ 과제 5: 스토어 적용</h1>
    <hr />

    <div class="dashboard-wrapper">
      <nav class="navigation-bar" aria-label="주요 탐색">
        <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/guide" class="nav-item">💡 날씨 안내</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/compare/city_01/city_03" class="nav-item">⚖️ 도시 비교</RouterLink>
        <UnitToggler />
      </nav>

      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@import '@/assets/exercise.css';

#app {
  display: block;
  width: 100%;
  max-width: none;
  padding: 24px 16px;
}

.app-container {
  box-sizing: border-box;
  width: min(680px, 100%);
  margin: 0 auto;
  padding: 30px 40px;
}

.dashboard-wrapper {
  width: min(600px, 100%);
}

.navigation-bar {
  flex-wrap: wrap;
  gap: 8px 4px;
  width: 100%;
}

.navigation-bar .divider {
  margin: 0 8px;
}

@media (max-width: 600px) {
  #app {
    padding: 12px;
  }

  .app-container {
    padding: 22px 16px;
  }

  .navigation-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .navigation-bar .nav-item {
    width: 100%;
    text-align: center;
  }

  .navigation-bar .divider {
    display: none;
  }
}
</style>
