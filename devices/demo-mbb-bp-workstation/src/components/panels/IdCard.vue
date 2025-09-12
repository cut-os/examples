<script setup>
import { DeviceIDCardReader } from '@cutos/devices'
const deviceStatus = ref('')
let device

const show = ref(false)
let timer = null
const counter = ref(8)
const image = ref(false)
const btnEnable = ref(false)
const idCardResult = ref({})

const KEY_ENUM = ['address', 'code', 'department', 'endDate', 'name', 'nation', 'sex', 'startDate']
const KEY_ENUM_FULL = computed(() => [...KEY_ENUM, ...(image.value ? ['base64BMPData'] : [])])
const KEY_MAP = {
  address: '地址',
  base64BMPData: '照片',
  code: '身份证号码',
  department: '签发机关',
  endDate: '有效期',
  name: '姓名',
  nation: '民族',
  sex: '性别',
  startDate: '签发日期'
}

const startRead = () => {
  device.startRead(image.value, (result) => {
    if (!result.status) {
      console.log('---51', result.msg)
      return
    }
    console.log('---52', result.msg)
  })
}

watchEffect(() => {
  if (show.value) {
    counter.value = 8
    timer = setInterval(() => {
      counter.value--
      if (counter.value <= 0) {
        show.value = false
        idCardResult.value = {}
        clearInterval(timer)
        btnEnable.value = true
      }
    }, 1000)
  }
})

onMounted(() => {
  device = new DeviceIDCardReader()
  device.init((_, err) => {
    if (!err) {
      device.onData((data) => {
        if (data.type === 'read-card') {
          show.value = true
          idCardResult.value = data.values
        }
        console.log(data)
      })
      device.connect(({ status, msg }) => {
        console.log(status, msg)
        if (!status) {
          deviceStatus.value = msg
          return
        }
        deviceStatus.value = '身份证读卡器连接成功'
        btnEnable.value = true
        device.readDeviceInfo((result) => {
          if (!result.status) {
            console.log('---41', result.msg)
            return
          }
          console.log('---42', result.msg)
        })
      })
    } else {
      deviceStatus.value = err
    }
  })
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="text-[30px]">{{ deviceStatus }}</div>
    <div class="text-[24px] text-orange-500">请将身份证放置在下方读卡区</div>
    <div class="checkbox-wrapper-46">
      <input type="checkbox" id="cbx-46" class="inp-cbx" v-model="image" />
      <label for="cbx-46" class="cbx"
        ><span>
          <svg viewBox="0 0 12 10" height="10px" width="12px">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span
        ><span>获取照片（{{ image ? '是' : '否' }}）</span>
      </label>
    </div>
    <div :class="{ 'pointer-events-none opacity-50': !btnEnable }" class="mt-[30px] rounded-lg bg-emerald-500 px-[40px] py-[10px] text-[40px] text-white active:bg-emerald-700" @click="startRead">
      开始识别身份证
    </div>
  </div>
  <div v-if="show" class="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div class="w-[80%] rounded-xl bg-white px-[60px] py-6 text-[24px]">
      <div>
        <div class="flex gap-2 text-[32px]" v-for="key in KEY_ENUM_FULL">
          <div class="label shrink-0 text-right">{{ KEY_MAP[key] }}:</div>
          <div class="value flex-1">
            <div v-if="key === 'base64BMPData'">
              <img :src="idCardResult[key]" />
            </div>
            <div v-else>{{ idCardResult[key] }}</div>
          </div>
        </div>
      </div>
      <div v-if="counter > 0" class="text-center">
        <span class="text-[30px] text-orange-500">{{ counter }}</span>
        秒后关闭弹窗
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkbox-wrapper-46 input[type='checkbox'] {
  display: none;
  visibility: hidden;
}

.checkbox-wrapper-46 .cbx {
  margin: auto;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}
.checkbox-wrapper-46 .cbx span {
  display: inline-block;
  vertical-align: middle;
  transform: translate3d(0, 0, 0);
}
.checkbox-wrapper-46 .cbx span:first-child {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 3px;
  transform: scale(1);
  vertical-align: middle;
  border: 1px solid #9098a9;
  transition: all 0.2s ease;
}
.checkbox-wrapper-46 .cbx span:first-child svg {
  position: absolute;
  top: 10px;
  left: 8px;
  fill: none;
  stroke: #ffffff;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 28px;
  stroke-dashoffset: 28px;
  transition: all 0.3s ease;
  transition-delay: 0.1s;
  transform: translate3d(0, 0, 0);
}
.checkbox-wrapper-46 .cbx span:first-child:before {
  content: '';
  width: 100%;
  height: 100%;
  background: #506eec;
  display: block;
  transform: scale(0);
  opacity: 1;
  border-radius: 50%;
}
.checkbox-wrapper-46 .cbx span:last-child {
  padding-left: 8px;
  font-size: 24px;
}
.checkbox-wrapper-46 .cbx:hover span:first-child {
  border-color: #506eec;
}

.checkbox-wrapper-46 .inp-cbx:checked + .cbx span:first-child {
  background: #506eec;
  border-color: #506eec;
  animation: wave-46 0.4s ease;
}
.checkbox-wrapper-46 .inp-cbx:checked + .cbx span:first-child svg {
  stroke-dashoffset: 0;
}
.checkbox-wrapper-46 .inp-cbx:checked + .cbx span:first-child:before {
  transform: scale(3.5);
  opacity: 0;
  transition: all 0.6s ease;
}

@keyframes wave-46 {
  50% {
    transform: scale(0.9);
  }
}
</style>
