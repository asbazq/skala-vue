<script setup>
// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록 (매크로)
defineEmits(['update-query'])

// 2. 상위로부터 현재 검색 상태 값을 수신 (한글 동기화 상태 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input type="text" :value="currentQuery" @input="$emit('update-query', $event.target.value)" placeholder="검색할 도시 이름 입력" />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-inner h3 {
  margin-top: 0;
}

.search-inner input {
  box-sizing: border-box;
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  font-size: 14px;
}

.search-inner input:focus {
  border-color: #3498db;
  outline: 2px solid rgba(52, 152, 219, 0.2);
}

.search-inner p {
  margin-bottom: 0;
}
</style>
