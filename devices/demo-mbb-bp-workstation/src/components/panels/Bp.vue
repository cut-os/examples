<script setup>
import { DeviceBpMonitor } from '@cutos/device-bp-monitor'
import { config } from '@/utils/config'

const status = ref('')
const result = ref('')
const btnStatus = ref(0)
let deviceInstance = null

const start = () => {
  deviceInstance.start()
}
// const stop = () => {
//   deviceInstance.stop((e) => {
//     console.log(e)
//   })
// }

onMounted(() => {
  console.log(' mounted')
  deviceInstance = new DeviceBpMonitor(config.params.mode)
  deviceInstance.init((_, err) => {
    console.log(_, err)
    if (!err) {
      deviceInstance.onData((data) => {
        console.log(data)
        result.value = data
        switch (data.type) {
          case 'connect':
            btnStatus.value = 2
            break
          case 'start':
          case 'realtime':
            btnStatus.value = 1
            break
          case 'result':
          case 'stop':
          case 'error':
            btnStatus.value = 2
            break
        }
      })
    } else {
      status.value = err
    }
    deviceInstance.connect(config.params.BpPath, (ret, error) => {
      console.log(ret, error)
      if (!error) {
        status.value = '血压计已连接'
        btnStatus.value = 2
        result.value = ret
      } else {
        status.value = error
      }
    })
  })
})

onBeforeUnmount(() => {
  console.log('before unmount')
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="text-[30px]">{{ status }}</div>
    <div class="mt-10 max-w-[80%] flex-1 overflow-y-auto rounded-xl bg-emerald-50 p-[20px]">
      <div>返回结果</div>
      <pre class="text-[24px]">{{ result }}</pre>
    </div>
    <div class="mt-14 flex gap-10">
      <!--      <button class="rounded-lg bg-red-500 px-[40px] py-[10px] text-[40px] text-white active:bg-red-700" @click="stop">停止</button>-->
      <button v-if="btnStatus === 1" class="rounded-full bg-orange-400 px-[40px] py-[10px] text-[40px] text-white">测量中</button>
      <button v-else :class="{ 'opacity-50': btnStatus === 0 }" class="rounded-lg bg-emerald-500 px-[40px] py-[10px] text-[40px] text-white active:bg-emerald-700" @click="start">开始</button>
    </div>
  </div>
</template>

<style scoped></style>
