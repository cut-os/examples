<script setup>
import { DeviceReceiptPrinter } from '@cutos/device-receipt-printer'
import { config } from '@/utils/config'
import dayjs from 'dayjs'

const status = ref('')
let device

const print = () => {
  device.setAlign('center')
  device.printQrcode('hello cutos')
  device.feed(1)
  device.print(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  device.feed(1)
  device.print('脉搏：60 次/分')
  device.print('舒张压：60 mmHg')
  device.print('收缩压：101 mmHg')
  device.print('血压：')
  device.print('测量结果')
  device.feed(10)
}
onMounted(() => {
  console.log(' mounted')
  device = new DeviceReceiptPrinter(null)
  device.init((_, err) => {
    if (!err) {
      device.connect(config.params.printerPath, (result, error) => {
        console.log(result, error)
        if (!error) {
          console.log('Connect', result)
        }
      })
    } else {
      status.value = err
    }
  })
})

onBeforeUnmount(() => {
  console.log('before unmount')
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="text-[30px]">{{ status }}</div>
    <div class="print-btn" @click="print">打印</div>
  </div>
</template>

<style scoped>
.print-btn {
  width: 300px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  background-color: #6c5ce7;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  border-radius: 5px;
  transition: all ease 0.1s;
  box-shadow: 0px 5px 0px 0px #a29bfe;
  &:active {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px 0px #a29bfe;
  }
}
</style>
