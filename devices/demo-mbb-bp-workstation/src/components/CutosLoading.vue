<script setup>
const props = defineProps(['msg'])
</script>

<template>
  <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
    <img src="@/assets/loading.gif" alt="loading" />
    <div class="text-[40px]">Loading...</div>
  </div>
</template>

<style scoped></style>
