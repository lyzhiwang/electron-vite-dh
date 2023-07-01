<template>
  <!-- <Suspense><Camera /></Suspense> -->
  <div class="livePage">
    <video :src="vsrc" ref="vRef" @ended="videoEnd"></video>
    <audio :src="soundUrl" class="sound" ref="answer" @ended="answerEnd"></audio>
  </div>
</template>

<script setup>
import { ipcRenderer } from 'electron'
import { useLiveStore } from '../stores'
import { closeWebsocket } from '../utils/socket'
import { randomArr } from '../utils/helper'

const live = useLiveStore()
const vRef = ref()
const answer = ref()
const soundUrl = ref('')
const vsrc = ref('')
let round = 1, current = 0, videoArr = []; // 轮数和当前播放的第几个

onBeforeMount(()=>{
  // 先预加载第一段视频
  videoArr = live.liveInfo.video_list
  // 'https://zwklt.oss-cn-beijing.aliyuncs.com/video/13/2023-04-20/ZQdXMPiLYREHu4vzShWy.mp4'
  vsrc.value = videoArr[0]
})

onMounted(()=>{
  // 获取视频和音频标签的Dom
  live.setLiveDom(vRef.value, answer.value)
  // 监听播放按钮
  ipcRenderer.on('play-live',()=>{
    const { live_url } = live.liveInfo
    // 开始播放
    vRef.value.autoplay = true
    vRef.value.play()
    if(live_url){
      // 开启请求ws地址
      live.getWsUrl({live_url}).then(data=>{
        live.openLonglink(data)
      })
    }
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
})
function nextRound(){ // 播放下一轮
    videoArr = randomArr(videoArr)
    current = 0
    round++
}
function videoEnd(){
  if(current===(videoArr.length-1)){ // 下一轮 播放第一个视频
    nextRound()
  }else{ // 当前轮 播放下一个视频
    current++
  }
  vRef.value.src = videoArr[current]
  // vRef.value.play()
}
function answerEnd(){ // 回答话外音播放结束
  answer.value.autoplay = false
  vRef.value.volume = 1
  live.setPlayStatus(false)
}
onBeforeUnmount(()=>{
  live.setLiveInfo(null)
  if(live.wsObj) closeWebsocket()
})
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