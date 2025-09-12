<script setup>
import '../../public/js/cutos-devices-async'
import { onMounted, ref } from 'vue'
import { config } from '@/utils/config'
import { DeviceTSPLPrinter } from '@cutos/device-tspl-printer'
import { DeviceElectronicScale } from '@cutos/device-electronic-scale'
// import QRCODE from '@/assets/image/qrcode.png'

let weight = ref('0')
let prevWeightTs = Date.now()
let checkScaleTimer = null

const props = defineProps({
  statusAll: Object
})
const { statusAll } = toRefs(props)
let radialGauge
const viewportHeight = window.innerHeight || document.documentElement.clientHeight

// 计算剩余高度
onMounted(() => {
  // 初始化 RadialGauge
  radialGauge = new RadialGauge({
    animateOnInit: false,
    useMinPath: true,
    renderTo: 'radialGauge',
    value: weight.value,
    // value: 60,
    width: viewportHeight * 0.65,
    height: viewportHeight * 0.65,
    colorNumbers: 'blue',
    units: 'Kg',
    animationDuration: '10',
    animateRule: 'linear'
    // 其他配置
  }).draw()
})
let updateTimeout = null
watch(weight, (newValue) => {
  // 更新 RadialGauge 的值
  if (updateTimeout) {
    clearTimeout(updateTimeout)
  }

  updateTimeout = setTimeout(() => {
    // 更新 RadialGauge 的值
    radialGauge.value = newValue
    radialGauge.update() // 手动更新图表
  }, 25) //避免频繁更新
})

runDeviceScale()

async function runDeviceScale() {
  clearInterval(checkScaleTimer)
  let deviceScale = new DeviceElectronicScale(config.params.mode)
  await deviceScale
    .initAsync()
    .then((res) => {
      console.log(res)
      statusAll.value.scaleStatus = true
    })
    .catch((err) => {
      statusAll.value.scaleStatus = false
    })
  await deviceScale
    .connectAsync(config.params.scale)
    .then((res) => {
      console.log(res)
      clearInterval(checkScaleTimer)
      checkScaleTimer = setInterval(() => {
        // 长时间未获取到电子秤数据
        statusAll.value.scaleStatus = Date.now() - prevWeightTs < 2000
      }, 5000)
    })
    .catch((err) => {
      console.log(err)
    })
  deviceScale.onData((data) => {
    console.log(data.data.weight)
    weight.value = String(data.data.weight).slice(-6)
    prevWeightTs = Date.now()
  })
}

const devicePrint = new DeviceTSPLPrinter()
devicePrint.init((result, error) => {
  console.log(result, error)
  if (!error) {
    devicePrint.connect({ path: config.params.printer, baudRate: config.params.printerBaudRate }, (result) => {
      console.log(result)
      statusAll.value.printStatus = true
      if (!result.status) {
        return
      }
      // 首次连接打印空白页
      printBlank()
    })
    devicePrint.onStatus((msg) => {
      statusAll.value.printStatus = msg?.status === 'alive'
    })
  }
})

const printBlank = () => {
  devicePrint.setLabelSize(48, 38)
  devicePrint.setLabelGap(2)
  devicePrint.setDirection(0, 0)
  devicePrint.setClearBuff()
  devicePrint.print((result, error) => {
    console.log(result, error)
  })
}

const printData = () => {
  const mmDots = 8
  devicePrint.setLabelSize(48, 38)
  devicePrint.setLabelGap(2)
  devicePrint.setDirection(0, 0)
  devicePrint.setClearBuff()
  devicePrint.addBox(0 * mmDots, 3 * mmDots, 47 * mmDots, 32 * mmDots, 4)
  devicePrint.addText(`重量: ${weight.value} Kg`, 8 * mmDots, 8 * mmDots, { font: '0' })
  devicePrint.addText('你好，咖特思', 8 * mmDots, 28 * mmDots, { font: '0' })
  devicePrint.addQRCode('POWERED BY CUTOS', 8 * mmDots, 13 * mmDots, {
    cw: 5
  })
  devicePrint.print((result, error) => {
    console.log(result, error)
  })
}
</script>

<template>
  <header>
    <div class="params">
      <pre>{{ config.params.title }}</pre>
    </div>
    <div class="flex gap-4">
      <div class="net-status" :class="statusAll.netStatus ? 'on' : null"></div>
      <div class="printIcon" :class="statusAll.printStatus ? 'on' : null"></div>
      <div class="scale" :class="statusAll.scaleStatus ? 'on' : null"></div>
    </div>
  </header>
  <div class="absolute bottom-0 left-0 right-0 top-[80px] flex">
    <div class="flex flex-1 items-center justify-center">
      <canvas id="radialGauge" :value="weight"></canvas>
    </div>
    <div class="flex w-[460px] flex-col items-center justify-center">
      <!--      <div class="w-full p-[20px]">-->
      <!--        <div>打印预览</div>-->
      <!--        <div class="mt-[10px] rounded-md bg-emerald-50 p-[20px]">-->
      <!--          <div>重量: {{ weight }} Kg</div>-->
      <!--          <img class="my-2 w-[80px]" :src="QRCODE" alt="" />-->
      <!--          <div>你好，咖特思</div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="flex select-none items-center justify-center rounded-2xl bg-green-600 px-12 py-6 text-[30px] text-[#fff] active:bg-green-700" @click="printData()">打印</div>
    </div>
  </div>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  background-color: #ff5722;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 30px;
  z-index: 1;
}

.net-status {
  width: 40px;
  height: 40px;
  background-image: url('../assets/image/net-off.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.net-status.on {
  background-image: url('../assets/image/net-on.png');
}

.scan.on {
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url('../assets/image/scan.png');
}

.printIcon {
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url('../assets/image/printIcon-off.png');
  opacity: 60%;
}
.printIcon.on {
  background-image: url('../assets/image/printIcon.png');
  opacity: 100%;
}
.scale {
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url('../assets/image/scale-off.png');
  opacity: 60%;
}
.scale.on {
  background-image: url('../assets/image/scale.png');
  opacity: 100%;
}

.params {
  font-size: 24px;
  font-style: italic;
  font-weight: 700;
  color: rgb(255, 255, 255);
}

pre {
  display: block;
  font-family: monospace;
  unicode-bidi: isolate;
  white-space: pre;
  font-weight: 700;
  margin: 1em 0px;
}

.print {
  margin-top: 20px;
  width: 20%;
  height: 40px;
  background-color: #76cb5a;
  color: white;
  border-radius: 4px;
}
</style>
