<template>
  <!-- <Suspense><Camera /></Suspense> -->
  <div class="livePage">
    <video :src="item" :ref="el=>vRef[i]=el" @ended="videoEnd" v-for="(item,i) in live.liveInfo.video_list" v-show="live.current===i"></video>
    <audio :src="soundUrl" class="sound" ref="answer" @ended="answerEnd"></audio>
  </div>
</template>

<script setup>
import { ipcRenderer } from 'electron'
import { useLiveStore } from '../stores'
import { closeWebsocket } from '../utils/socket'
import { randomArr } from '../utils/helper'

const live = useLiveStore()
const vRef = reactive({})
const answer = ref()
const soundUrl = ref('')
// const vsrc = ref('')
let round = 1, i = 0, videoArr = []; // 轮数和当前播放的第几个

onBeforeMount(()=>{
  // 先预加载第一段视频
  videoArr = live.liveInfo.video_list.map((item, index)=>index)
  // 'https://zwklt.oss-cn-beijing.aliyuncs.com/video/13/2023-04-20/ZQdXMPiLYREHu4vzShWy.mp4'
  // vsrc.value = videoArr[0]
})

onMounted(()=>{
  // 获取视频和音频标签的Dom
  live.setLiveDom(vRef, answer.value)
  // 监听播放按钮
  ipcRenderer.on('play-live',(_, info)=>{
    live.setLiveInfo(JSON.parse(info))
    const { live_url } = live.liveInfo
    // 开始播放
    // vRef.value.autoplay = true
    vRef[0].play()
    if(live_url){
      // 开启请求ws地址
      live.getWsUrl({live_url}).then(data=>{
        live.openLonglink(data)
      })
    }
  })
})
function nextRound(){ // 播放下一轮
    if(live.liveInfo.is_random && videoArr.length>1){
      videoArr = randomArr(videoArr)
    }
    i = 0
    round++
}
function videoEnd(){
  if(i===(videoArr.length-1)){ // 下一轮 播放第一个视频
    nextRound()
  }else{ // 当前轮 播放下一个视频
    i++
  }
  // vRef.value.src = videoArr[i]
  live.setCurrent(videoArr[i])
  var vdom = vRef[live.current]
  vdom.volume = live.playIng ? 0.2 : 1
  vdom.play()
}
function answerEnd(){ // 回答话外音播放结束
  answer.value.autoplay = false
  vRef[live.current].volume = 1
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
  background-color: #49cc89;
  .sound{
    display: none;
  }
  video{
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    background-color: #49cc89;
  }
}
</style>