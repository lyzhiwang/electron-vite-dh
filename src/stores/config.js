import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  persist: true, // 开启当前模块持久化
  state: () => ({
    account: '',
    password: '',
    remeberPwd: false,
    logo:'',
    name:""
  }),
  actions: {
    setRemeberPwd(val) {
      this.remeberPwd = val
    },
    savePwd(form) {
      this.password = form.password
      this.account = form.account
    },
    setlogo(val) {
      this.logo = val
    },
    setname(val) {
      this.name = val
    },
  }
})