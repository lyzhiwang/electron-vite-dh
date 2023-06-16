<template>
  <!-- <Suspense><Camera /></Suspense> -->
  <div class="livePage">
    <video src="https://zwklt.oss-cn-beijing.aliyuncs.com/video/13/2023-04-20/ZQdXMPiLYREHu4vzShWy.mp4" ref="live" loop></video>
    <audio :src="soundUrl" class="sound" ref="welcome" @ended="welcomeEnd"></audio>
  </div>
</template>

<script setup>
import { ipcRenderer } from 'electron'
import { runOnce } from '../utils/voice'
const live = ref()
const welcome = ref()
const soundUrl = ref('')

onMounted(()=>{
  ipcRenderer.on('play-live',()=>{
    live.value.play()
  })
  /*ipcRenderer.on('change-volume', (_, num)=>{
    let vol = (live.value.volume + num)
    if(vol>1) vol = 1
    if(vol<0) vol = 0
    live.value.volume = vol
  })*/
  ipcRenderer.on('welcome', (_, url)=>{
    soundUrl.value = url
    live.value.volume = 0.2
    welcome.value.autoplay = true
    welcome.value.play()
  })
  // setInterval(()=>runOnce('欢迎智网网络进入直播间'), 3000)
})

function welcomeEnd(){
  welcome.value.autoplay = false
  live.value.volume = 1
}
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