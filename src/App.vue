<template>
<el-config-provider :message="{max: 1}">
  <router-view v-slot="{ Component }">
      <Transition>
          <component :is="Component" />
      </Transition>
  </router-view>
</el-config-provider>
</template>

<script setup>
import { ipcRenderer } from 'electron'
import { useProjectStore } from './stores'
import { endLive } from './api'

const project = useProjectStore()

ipcRenderer.on('liveClose',()=>{
  // 请求关播接口
  if(project.isOpen) endLive(project.liveWin)
  // 清空项目ID
  project.setLiveWin(null)
  project.setLiveOpen(false)
})

</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-leave-to {
  display: none;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>