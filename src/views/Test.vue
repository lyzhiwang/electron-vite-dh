<template>
<div class="homePage">
    首页
    <RouterLink to="/login">登录</RouterLink>
    <button @click="openNewWin">打开新窗口</button>
    <button @click="playLive">开播</button>
    <!-- <button @click="changeVolume(0.2)">调整音量+</button>
    <button @click="changeVolume(-0.2)">调整音量-</button> -->
    <button @click="playWelcome">插播声音</button>
    <p v-for="item in live.msg">{{ item }}</p>
</div>
</template>

<script setup>
import { ipcRenderer } from 'electron'
import { useLiveStore } from '../stores'
// import _webSocket from '../utils/js_websocket'

const live = useLiveStore()
// const welcome = ref()
// const soundUrl = ref('')
function openNewWin(){
  ipcRenderer.send('open-win', {path: 'live', width: 375, height: 670})
}
function playLive(){
  ipcRenderer.send('play-live')
}
// function changeVolume(num){
//   ipcRenderer.send('change-volume', num)
// }
onMounted(()=>{
  // _webSocket()
  live.openLonglink()
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
})
function playWelcome(){
  ipcRenderer.send('welcome', 'https://card-life.zwwltkl.com/text2audio.mp3')
  // soundUrl.value = 'https://card-life.zwwltkl.com/text2audio.mp3'
  // welcome.value.autoplay = true
}
</script>

<style lang="scss" scoped>
</style>