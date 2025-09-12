<template>
  <transition name="slide-up">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex flex-col bg-white shadow-lg">
      <!-- Header -->
      <header class="flex items-center justify-between border-b border-gray-200 px-10 py-4">
        <h2 class="text-[30px] font-medium">{{ title }}</h2>
        <button @click="close" class="select-none text-[30px] text-red-700 active:text-black">关闭</button>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-10">
        <!-- 动态组件优先渲染 -->
        <component v-if="active && components[active]" :is="components[active]" />
        <!-- 如果没传 active，就用 content 插槽 -->
        <slot v-else name="content"></slot>
      </main>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  active: { type: String, default: '' }, // 当前激活的内容 key
  components: { type: Object, default: () => ({}) } // 动态组件映射
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* 进入和离开动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
