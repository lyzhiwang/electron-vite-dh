import { defineStore } from 'pinia'
import { proJectList } from '../api'

export const useProjectStore = defineStore('project', {
    state: () => ({
        list: [],
    }),
    actions: {
        async getList(params) {
            try {
                const res = await proJectList(params)
                if(res&&res.data){
                    this.list = res.data;
                }
                return res
            } catch (error) {
                throw error
            }
        },
    }
})