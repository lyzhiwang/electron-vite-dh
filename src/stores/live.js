import { defineStore } from 'pinia'
import { connectWebsocket, sendDate } from '../utils/socket'
import pb from '../utils/douyin_pb'
import { runOnce } from '../utils/voice'
import { sample } from 'lodash-es'
import { voiceOrder, getTiktokWs } from '../api'
import { isBefore, isAfter, addSeconds } from 'date-fns'
// import { ipcRenderer } from 'electron'
var pako = require('pako');

export const useLiveStore = defineStore('live', {
    persist: {  // 开启当前模块持久化
        enable: true,
        storage: localStorage,
        paths: ['liveInfo'], // 部分字段存储
        ali: null,
    },
    state: () => ({
        wsObj: null,
        playIng: false, // 语音播放状态
        liveInfo: null,
        vRef: null,
        answer: null,
        expireTime: null, // 欢迎到期时间
        times: null,
        current: 0, // 当前播放的第几个视频
    }),
    actions: {
        setCurrent(i){
            this.current = i
        },
        setPlayStatus(bool){
            this.playIng = bool
        },
        setLiveInfo(info){
            this.liveInfo = info
        },
        setLiveDom(vRef, answer){
            this.vRef = vRef
            this.answer = answer
            this.current = 0
        },
        playAnserVoice(url){
            this.answer.autoplay = true
            this.answer.src = url
            // this.answer.play()
            this.vRef[this.current].volume = 0.2
        },
        async globelMessage(backdata) {
            try {
                var frameMsg = pb.PushFrame.deserializeBinary(backdata);
                var origin_bytes = pako.inflate(frameMsg.array[7]);
                var responseMsg = pb.Response.deserializeBinary(origin_bytes);
                for(let item of responseMsg.array[0]){
                    switch (item[0]) {
                        case 'WebcastChatMessage': // 评论
                            const { interactive_switch, interactive } = this.liveInfo
                            if(interactive_switch===1 && !this.playIng){ // 当前没有在播放的音频再执行
                                var chatMessage = pb.ChatMessage.deserializeBinary(item[1]);
                                const comment = chatMessage.array[2]
                                // 匹配关键字，播放答案语音
                                // if(comment.match(new RegExp(opt.keywords, 'g'))){}
                                const findObj = interactive.find(opt=>comment.match(new RegExp(opt.keywords, 'g')))
                                if(findObj){
                                    this.playIng = true
                                    // 从匹配结果的录音中随机选取一个播放
                                    this.playAnserVoice(sample(findObj.audio))
                                }
                            }
                            // console.log(`【${chatMessage.array[1][2]}】: ${chatMessage.array[2]}`)
                            // this.setMsg(`【${chatMessage.array[1][2]}】: ${chatMessage.array[2]}`)
                            break;
                        case 'WebcastMemberMessage':  // 进入直播间
                            const { project_id, welcome_switch, welcome } = this.liveInfo
                            if(welcome_switch===1 && !this.playIng){
                                const nowTime = new Date()
                                if(this.times === null || isAfter(nowTime, this.expireTime)){
                                    // 第一次进入 或者 超过时间重置记录到期时间
                                    this.expireTime = addSeconds(nowTime, welcome.time);
                                    this.times = welcome.number 
                                }
                                if(isBefore(nowTime, this.expireTime) && this.times>0){ 
                                    // 在时间内并且播放次数没消耗完
                                    this.playIng = true
                                    var enterMsg = pb.MemberMessage.deserializeBinary(item[1]);
                                    var vdom = this.vRef[this.current]
                                    vdom.volume = 0.2
                                    await runOnce(`欢迎${enterMsg.array[1][2]}进入直播间`, this.ali, welcome.timbre, ()=>{
                                        vdom.volume = 1 // 老视频声音重置
                                        this.vRef[this.current] = 1 // 新视频声音重置
                                        voiceOrder(project_id)
                                    })
                                    this.times--
                                    this.playIng = false
                                }
                            }
                            // ipcRenderer.send('welcome', {type: 1, name: enterMsg.array[1][2]})
                            // console.log(333, `【${enterMsg.array[1][2]}】 进入直播间`)
                            // this.setMsg(`【${enterMsg.array[1][2]}】 进入直播间`)
                            break;
                        // case 'WebcastGiftMessage':  // 送礼物（打赏）
                            // var giftMsg = pb.GiftMessage.deserializeBinary(item[1]);
                            // console.log(4444, `【${giftMsg.array[6][2]}】--${giftMsg.array[14][1]}`)
                            // this.setMsg(`【${giftMsg.array[6][2]}】--${giftMsg.array[14][1]}`)
                            // break;
                        default:
                            break;
                    }
                }
                if(responseMsg.array[8]){
                    const pf = new pb.PushFrame()
                    pf.setPayload =  responseMsg.array[4]
                    pf.setPayloadtype =  'ack'
                    pf.setLogid = frameMsg.array[1]
                    // 发送ping的二进制数据
                    sendDate(pf.serializeBinary());
                }
            } catch (error) {
                
            }
        },
        async getWsUrl(params){
            try {
                const res = await getTiktokWs(params)
                if(res){
                    return res.data
                }
            } catch (error) {
                throw error
            }
        },
        openLonglink(data) {
            if(!data) return
            // 打开长连接
            const { ttwid, wss_url, ali } = data
            this.ali = ali
            connectWebsocket(wss_url, null, this.globelMessage, () => {
                // 连接错误
            }, ttwid)
        },
    }
})