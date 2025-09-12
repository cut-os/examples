<script setup>
const scanResult = ref('')
let lastKeyTime = 0
const scannerRef = ref(null)

const replace = (str) => {
  return str
    .replace(/Shift|Control|Alt|Enter|Space|NumLock|CapsLock/g, '') // 删除干扰字符
    .replace(/[^\x00-\x7F]/g, '') // 删除非 ASCII 字符
    .trim() // 去空格
}

const handleScan = (e) => {
  // 阻止默认行为，避免意外输入
  e.preventDefault()
  console.log(e.key)
  // 扫码枪通常以Enter结束
  if (e.key === 'Enter') {
    // scanResult.value = unicodeToChinese(scanResult.value)
    return
  }

  // 判断是否为扫码枪输入（快速连续输入）
  let now = Date.now()
  if (now - lastKeyTime < 100) {
    scanResult.value += e.key
  } else {
    scanResult.value = e.key // 新扫码开始
  }
  lastKeyTime = now
}

const focus = () => {
  scannerRef?.value.focus()
}

onMounted(() => {
  document.addEventListener('keypress', handleScan)
  // document.addEventListener('click', focus)
})

onBeforeUnmount(() => {
  document.removeEventListener('keypress', handleScan)
  // document.removeEventListener('click', focus)
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="text-[30px]">扫码</div>
    <div class="mt-10 w-1/2 rounded-xl bg-emerald-50 p-[20px]">
      <div>扫码结果</div>
      <div class="break-all text-[20px]">{{ scanResult }}</div>
    </div>
  </div>
  <!--  <input :ref="scannerRef" style="opacity: 0; position: absolute; left: -9999px" autofocus @input="handleScan" />-->
</template>

<style scoped></style>
