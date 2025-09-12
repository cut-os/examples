<script setup>
import HelloCutos from './components/HelloCutos.vue'
import {CoreAPI} from '@cutos/core'
import {ref} from "vue";

const host = import.meta.env.VITE_CUTOS_BROKER_URL
let statusAll = ref({netStatus: true, scanStatus: false, printStatus: false, scaleStatus: false});

lwaStart()

async function lwaStart() {
  try {
    await CoreAPI.initAsync(host)
    CoreAPI.getNotification().register(({event, msg}) => {
      console.log(event)
      switch (event) {
        case 'networkConnection':
          statusAll.value.netStatus = msg;
          break;
      }
    })
  } catch (e) {
    console.log(e)
  }
}
</script>
<template>
  <div class="full-screen">
    <HelloCutos :statusAll="statusAll"/>
  </div>
</template>

<style scoped>
.full-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
