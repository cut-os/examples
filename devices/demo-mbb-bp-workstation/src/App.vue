<script setup>
import Notification from '@/components/Notification.vue'
import CutosLoading from './components/CutosLoading.vue'
import CutosHome from './components/CutosHome.vue'
import CutosModal from './components/CutosModal.vue'
import Scan from './components/panels/Scan.vue'
import Bp from './components/panels/Bp.vue'
import Printer from './components/panels/Printer.vue'
import IdCard from './components/panels/IdCard.vue'
import { CoreAPI } from '@cutos/core'
import { config } from '@/utils/config'

const host = config.params.host || import.meta.env.VITE_CUTOS_BROKER_URL

console.log(host)
const notifierRef = ref(null)
const isLoading = ref(true)
const showModal = ref(false)
const version = ref('')
const active = ref('')
const activeLabel = ref('')

const contentMap = {
  bp: Bp,
  scan: Scan,
  printer: Printer,
  idCard: IdCard
}

let devPrinter
CoreAPI.init(host, (result, error) => {
  if (!error) {
    isLoading.value = false
  }
})

const openModal = (target, label) => {
  if (!contentMap[target]) {
    notifierRef?.value.notify('暂未开放')
    return
  }
  showModal.value = true
  active.value = target
  activeLabel.value = label
}
</script>
<template>
  <Notification ref="notifierRef" />
  <div class="full-screen">
    <CutosLoading v-if="isLoading" />
    <CutosHome v-else @to="openModal" />
    <CutosModal v-model="showModal" :title="activeLabel" :active="active" :components="contentMap" />
  </div>
</template>

<style scoped>
.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f9f9f9;
}
</style>
