<script setup>
defineProps({
  favoriteCount: {
    type: Number,
    default: 0,
  },
  showFavoritesOnly: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update-filter'])
</script>

<template>
  <div class="favorite-filter" aria-label="날씨 목록 필터">
    <button
      type="button"
      :class="{ active: !showFavoritesOnly }"
      @click="$emit('update-filter', false)"
    >
      전체 도시
    </button>
    <button
      type="button"
      :class="{ active: showFavoritesOnly }"
      @click="$emit('update-filter', true)"
    >
      ★ 즐겨찾기만 보기 ({{ favoriteCount }})
    </button>
  </div>
</template>

<style scoped>
.favorite-filter {
  display: flex;
  gap: 8px;
}

.favorite-filter button {
  flex: 1;
  padding: 9px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: #fff;
  color: #495057;
  cursor: pointer;
  font-weight: 600;
}

.favorite-filter button:hover {
  border-color: #3498db;
}

.favorite-filter button.active {
  border-color: #3498db;
  background: #3498db;
  color: #fff;
}
</style>
