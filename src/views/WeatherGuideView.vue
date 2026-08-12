<template>
  <section class="guide-view">
    <h2>💡 날씨 상태별 안내</h2>
    <ul>
      <li><strong>맑음:</strong> 일교차와 자외선에 유의하세요.</li>
      <li><strong>비:</strong> 우산과 미끄럼 방지 신발을 준비하세요.</li>
      <li><strong>구름:</strong> 기온 변화에 대비해 가벼운 겉옷을 챙기세요.</li>
      <li><strong>바람:</strong> 강한 돌풍과 날리는 물건을 주의하세요.</li>
    </ul>
    <RouterLink to="/">← 날씨 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.guide-view { padding: 20px; border-radius: 8px; background: #f8f9fa; }
.guide-view li { margin-bottom: 12px; line-height: 1.6; }
</style>
