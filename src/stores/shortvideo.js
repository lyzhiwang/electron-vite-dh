import { defineStore } from 'pinia'
import { getGenerateVideo, aliToken } from '../api'

export const shortvideoStore = defineStore('shortvideo', {
  state: () => ({
    list: [],
    liveWin: null,
    ossData: null,
    isOpen: false,
    fontarr: [
      { id: 1, font: 'zk-kuaile-font', string: '快乐' },
      { id: 2, font: 'zk-kuhei-font', string: '酷黑' },
      { id: 3, font: 'zk-gaoduanhei-font', string: '高端黑' },
      { id: 4, font: 'zk-huangyou-font', string: '黄油' },
      { id: 5, font: 'xinqingnian-changgui', string: '新青年-常规' }
    ],
    fontPostion: [
      { value: 'TopLeft', title: '上-文字左对齐' },
      { value: 'TopCenter', title: '上-文字居中' },
      { value: 'TopRight', title: '上-文字右对齐' },
      { value: 'CenterLeft', title: '中-文字左对齐' },
      { value: 'CenterCenter', title: '中-文字居中' },
      { value: 'CenterRight', title: '中-文字右对齐' },
      { value: 'BottomLeft', title: '下-文字左对齐' },
      { value: 'BottomCenter', title: '下-文字居中' },
      { value: 'BottomRight', title: '下-文字右对齐' }
    ],
    fontStyle: [
      {
        OutlineColour: '#3A2300',
        BackColour: '#3A2300',
        FontColor: '#FFD164',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#3A2300',
        BackColour: '#3A2300',
        FontColor: '#f18919',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#3A2300',
        BackColour: '#3A2300',
        FontColor: '#FF0000',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#3A2300',
        BackColour: '#3A2300',
        FontColor: '#ffffff',
        Outline: 4,
        Shadow: 2
      },

      {
        OutlineColour: '#FFD164',
        BackColour: '#3A2300',
        FontColor: '#ffffff',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#f18919',
        BackColour: '#3A2300',
        FontColor: '#ffffff',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#FF0000',
        BackColour: '#3A2300',
        FontColor: '#ffffff',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#ffffff',
        BackColour: '#3A2300',
        FontColor: '#3A2300',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#ffffff',
        BackColour: '#3A2300',
        FontColor: '#f65757',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#ffffff',
        BackColour: '#3A2300',
        FontColor: '#32aca2',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#ffffff',
        BackColour: '#3A2300',
        FontColor: '#3257ac',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#ffffff',
        BackColour: '#3A2300',
        FontColor: '#02aae9',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#ffffff',
        BackColour: '#3A2300',
        FontColor: '#ef845c',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#ffffff',
        BackColour: '#3A2300',
        FontColor: '#039936',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#ffffff',
        BackColour: '#3A2300',
        FontColor: '#af4284',
        Outline: 4,
        Shadow: 2
      },
      {
        OutlineColour: '#000000',
        BackColour: '#3A2300',
        FontColor: '#ffde00',
        Outline: 4,
        Shadow: 2
      }
    ],
    subtitle_style: [
      {
        OutlineColour: '#FFD164',
        BackColour: '#3A2300',
        FontColor: '#FF0000',
        Outline: 4,
        Shadow: 3
      },
      {
        OutlineColour: '#333333',
        BackColour: '#DB0007',
        FontColor: '#FFF20D',
        Outline: 4,
        Shadow: 1
      },
      {
        OutlineColour: '#FFFFFF',
        BackColour: '#FF0000',
        FontColor: '#0067F9',
        Outline: 4,
        Shadow: 3
      },
      {
        OutlineColour: '#8C1D00',
        BackColour: '#333333',
        FontColor: '#ffffff',
        Outline: 4,
        Shadow: 1
      },

      {
        OutlineColour: '#000000',
        BackColour: '#3A2300',
        FontColor: '#FFD164',
        Outline: 4,
        Shadow: 1
      },
      {
        OutlineColour: '#000000',
        BackColour: '#1c7de0',
        FontColor: '#ffffff',
        Outline: 4,
        Shadow: 1
      },
      {
        OutlineColour: '#000000',
        BackColour: '#3A2300',
        FontColor: '#ffde00',
        Outline: 4,
        Shadow: 1
      }
    ]
  }),
  actions: {
    async getList(params) {
      try {
        const res = await getGenerateVideo(params)
        if (res && res.data) {
          this.list = res.data;
        }
        return res.meta
      } catch (error) {
        throw error
      }
    },
    // async queryAliToken() {
    //     try {
    //         const res = await aliToken()
    //         if (res && res.data) {
    //             this.ossData = res.data;
    //         }
    //         return true
    //     } catch (error) {
    //         throw error
    //     }
    // },
    setLiveWin(id) {
      this.liveWin = id;
    },
    setLiveOpen(bool) {
      this.isOpen = bool
    }
  }
})