import { toArrayBuffer } from '../utils/helper'
const Nls = require('alibabacloud-nls')
// import { useLiveStore } from '../stores'
// const fs = require("fs")
// require('log-timestamp')(`${process.pid}`)
// APPKEY = '3nLfFsHczu6JV0nE', TOKEN = 'fc65d2814cbd4abfbbc47fcb25782cb7',
let loadIndex = 0
const URL = 'wss://nls-gateway-cn-shanghai.aliyuncs.com/ws/v1';
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs))

export async function runOnce(line, {appkey, token}, timbre, callback) {
    console.log(`speak: ${line}`)
    loadIndex++
    
    // let dumpFile = fs.createWriteStream(`${process.pid}.wav`, {flags:"w"})
    // 创建Audio
    var chunks = [];
    var size = 0;
    var audioContext = new AudioContext({
      sampleRate: 8000,
    });
    let tts = new Nls.SpeechSynthesizer({ url: URL, appkey, token })
  
    tts.on("meta", (msg)=>{
      console.log("Client recv metainfo:", msg)
    })
  
    tts.on("data", (msg)=>{
        // 存储buffer片段
        chunks.push(msg);
        size += msg.length;
        // 播放音频流
        // dumpFile.write(msg, "binary")
    })
  
    tts.on("completed", (msg)=>{
      console.log("Client recv completed:", msg)
      // 组合buffer片段为一段完整的buffer
      var buf = Buffer.concat(chunks, size);
      // buffer转ArrayBuffer再转AudioBuffer
      audioContext.decodeAudioData(toArrayBuffer(buf), function(buffer) {
          console.log("decode success");
          // 播放audioBuffer
          var bufferSource = audioContext.createBufferSource();
          bufferSource.connect(audioContext.destination);
          bufferSource.buffer = buffer;
          bufferSource.start(0);
      }, function(e) {
          console.log("decode failed" + e);
      });
    })
  
    tts.on("closed", () => {
      console.log("Client recv closed")
    })
  
    tts.on("failed", (msg)=>{
      console.log("Client recv failed:", msg)
    })
  
    let param = tts.defaultStartParams()
    param.text = line
    param.voice = timbre||"aixia"
    try {
      await tts.start(param, true, 6000)
      callback()
    } catch(error) {
      console.log("error on start:", error)
      return
    } finally {
      //dumpFile.end()
    }
    console.log("synthesis done")
    await sleep(2000)
}