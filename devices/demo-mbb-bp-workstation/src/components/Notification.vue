<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-50 space-y-2">
      <TransitionGroup name="fade" tag="div">
        <div v-for="item in list" :key="item.id" class="min-w-[200px] rounded-lg bg-gray-800 px-4 py-2 text-white shadow-lg">
          {{ item.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive } from 'vue'

let id = 0
const list = reactive([])

// 导出方法，方便全局调用
function notify(message, duration = 3000) {
  const item = { id: id++, message }
  list.push(item)
  setTimeout(() => {
    const index = list.findIndex((i) => i.id === item.id)
    if (index !== -1) list.splice(index, 1)
  }, duration)
}

defineExpose({ notify })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
