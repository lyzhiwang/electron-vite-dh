import { defineStore } from 'pinia'
import { proJectList, aliToken, synthetizedetail } from '../api'

export const useProjectStore = defineStore('project', {
    state: () => ({
        list: [],
        liveWin: null,
        ossData: null,
        isOpen: false,
        timer:null,
    }),
    actions: {

        async getList(params) {
            try {
                const res = await proJectList(params)
                if (res && res.data) {
                    this.list = res.data;
                }
                return res
            } catch (error) {
                throw error
            }
        },
        async queryAliToken() {
            try {
                const res = await aliToken()
                if (res && res.data) {
                    this.ossData = res.data;
                }
                return true
            } catch (error) {
                throw error
            }
        },

        setLiveWin(id) {
            this.liveWin = id;
        },
        setLiveOpen(bool) {
            this.isOpen = bool
        }
    }
})