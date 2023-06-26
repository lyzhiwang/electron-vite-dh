<template>
  <!-- <Suspense><Camera /></Suspense> -->
  <div class="livePage">
    <video src="https://zwklt.oss-cn-beijing.aliyuncs.com/video/13/2023-04-20/ZQdXMPiLYREHu4vzShWy.mp4" ref="vRef" loop></video>
    <audio :src="soundUrl" class="sound" ref="welcome" @ended="welcomeEnd"></audio>
  </div>
</template>

<script setup>
import { ipcRenderer } from 'electron'
import { runOnce } from '../utils/voice'
import { useLiveStore } from '../stores'
import { closeWebsocket } from '../utils/socket'

const live = useLiveStore()
const vRef = ref()
const welcome = ref()
const soundUrl = ref('')

onMounted(()=>{
  ipcRenderer.on('play-live',()=>{
    // 开始播放
    vRef.value.play()
    live.setPlayStatus(true)
    live.openLonglink()
  })
  /*ipcRenderer.on('welcome', (_, {type, name, url})=>{
    switch (type) {
      case 1: // 欢迎
        runOnce(`欢迎${name}进入直播间`)
        break;
      case 2: // 问答
        soundUrl.value = url
        vRef.value.volume = 0.2
        welcome.value.autoplay = true
        welcome.value.play()
        break;
      default:
        break;
    }
  })*/
  /*ipcRenderer.on('change-volume', (_, num)=>{
    let vol = (vRef.value.volume + num)
    if(vol>1) vol = 1
    if(vol<0) vol = 0
    vRef.value.volume = vol
  })*/
  // setInterval(()=>runOnce('欢迎智网网络进入直播间'), 3000)
})

function welcomeEnd(){
  welcome.value.autoplay = false
  vRef.value.volume = 1
  live.setPlayStatus(false)
}
onBeforeUnmount(closeWebsocket)
</script>

<style lang="scss" scoped>
.livePage{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .sound{
    display: none;
  }
  video{
    width: 100vw;
    height: 100vh;
    // object-fit: cover;
  }
}
</style>