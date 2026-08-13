<template>
  <section class="base-dashboard-card">
    <slot />
  </section>
</template>

<style scoped>
.base-dashboard-card {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: linear-gradient(145deg, #101f31, #0d1928);
  color: var(--text);
  box-shadow: 0 18px 45px rgba(2, 9, 20, 0.33);
}
</style>
