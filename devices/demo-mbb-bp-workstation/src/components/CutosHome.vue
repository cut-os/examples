<script setup>
const props = defineProps(['msg'])
const emits = defineEmits(['to'])
const menus = [
  {
    name: '血压计',
    key: 'bp'
  },
  {
    name: '打印机',
    key: 'printer'
  },
  {
    name: '扫码',
    key: 'scan'
  },
  // {
  //   name: '人脸识别',
  //   key: 'face'
  // },
  {
    name: '身份证',
    key: 'idCard'
  }
]
</script>

<template>
  <div class="grid h-full w-full grid-cols-2">
    <div class="flex items-center justify-center" v-for="{ name, key } in menus">
      <div class="main-btn" :class="`bg-${key}`" @click="emits('to', key, name)">{{ name }}</div>
    </div>
  </div>
</template>

<style scoped>
.main-btn {
  width: 280px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 40px;
  border-radius: 8px;
  box-shadow: 0 0 20px -1px rgba(0, 0, 0, 0.2);
  user-select: none;
  transition: transform 0.2s ease;
  &.bg-idCard {
    background: linear-gradient(135deg, #667eea, #764ba2);
  }
  &.bg-bp {
    background: linear-gradient(135deg, #11998e, #38ef7d);
  }
  &.bg-printer {
    background: linear-gradient(135deg, #f953c6, #b91d73);
  }
  &.bg-scan {
    background: linear-gradient(135deg, #f7971e, #ffd200);
  }
  &.bg-face {
    background: linear-gradient(135deg, #e52929, #bb1546);
  }
  &:hover {
    transform: scale(0.96);
    box-shadow: none;
  }
  &:active {
    transform: scale(0.9);
    box-shadow: none;
  }
}
</style>
