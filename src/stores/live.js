import { defineStore } from 'pinia'
import { connectWebsocket, sendDate, closeWebsocket } from '../utils/socket'
import pb from '../utils/douyin_pb'
import { runOnce } from '../utils/voice'
import { random } from 'lodash-es'
// import { ipcRenderer } from 'electron'
var pako = require('pako');

export const useLiveStore = defineStore('live', {
  state: () => ({
    msg: [],
    wsObj: null,
    playIng: false, // 语音播放状态
  }),
  actions: {
    setMsg(m){
        this.msg.push(m)
    },
    setPlayStatus(bool){
        this.playIng = bool
    },
    async globelMessage(backdata) {
        try {
            var frameMsg = pb.PushFrame.deserializeBinary(backdata);
            var origin_bytes = pako.inflate(frameMsg.array[7]);
            var responseMsg = pb.Response.deserializeBinary(origin_bytes);
            for(let item of responseMsg.array[0]){
                switch (item[0]) {
                    case 'WebcastChatMessage': // 评论
                        if(!this.playIng){ // 当前没有在播放的音频再执行
                            var chatMessage = pb.ChatMessage.deserializeBinary(item[1]);
                            const comment = chatMessage.array[2]
                            // 匹配关键字，播放答案语音
                            if(comment.match(new RegExp('无敌|今天', 'g'))){
                                // 从匹配结果的录音中随机选取一个播放
                                random(5)
                            }
                        }
                        // console.log(`【${chatMessage.array[1][2]}】: ${chatMessage.array[2]}`)
                        // this.setMsg(`【${chatMessage.array[1][2]}】: ${chatMessage.array[2]}`)
                        break;
                    case 'WebcastMemberMessage':  // 进入直播间
                        var enterMsg = pb.MemberMessage.deserializeBinary(item[1]);
                        this.playIng = true
                        await runOnce(`欢迎${enterMsg.array[1][2]}进入直播间`)
                        this.playIng = false
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
    openLonglink(data) {
        // 打开长连接
        const ws = "wss://webcast3-ws-web-hl.douyin.com/webcast/im/push/v2/?app_name=douyin_web&version_code=180800&webcast_sdk_version=1.3.0&update_version_code=1.3.0&compress=gzip&internal_ext=internal_src:dim|wss_push_room_id:7241469180820605700|wss_push_did:7198322870077752832|dim_log_id:20230606154940E7B5984EF028E67F2847|fetch_time:1686037780865|seq:1|wss_info:0-1686037780865-0-0|wrds_kvs:WebcastRoomStatsMessage-1686037774949341618_WebcastRoomRankMessage-1686037708977605361&cursor=t-1686037780865_r-1_d-1_u-1_h-1&host=https://live.douyin.com&aid=6383&live_id=1&did_rule=3&debug=false&maxCacheMessageNumber=20&endpoint=live_pc&support_wrds=1&im_path=/webcast/im/fetch/&user_unique_id=7198322870077752832&device_platform=web&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=en-US&browser_platform=Win32&browser_name=Mozilla&browser_version=5.0%20(Windows%20NT%2010.0;%20Win64;%20x64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/113.0.0.0%20Safari/537.36&browser_online=true&tz_name=Asia/Shanghai&identity=audience&room_id=7241469180820605700&heartbeatDuration=0&signature=WQP754aPkjU3DvVD"
        connectWebsocket(ws, null, this.globelMessage, () => {
            // 连接错误
        })
    },
  }
})