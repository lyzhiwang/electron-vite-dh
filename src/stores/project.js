import { defineStore } from 'pinia'
import { proJectList } from '../api'

export const useProjectStore = defineStore('project', {
    state: () => ({
        list: [],
        liveWin: null,
    }),
    actions: {
        async getList(params) {
            try {
                const res = await proJectList(params)
                if(res&&res.data){
                    this.list = res.data;
                }
                return res.meta
            } catch (error) {
                throw error
            }
        },
        setLiveWin(id){
            this.liveWin = id; 
        },
    }
})