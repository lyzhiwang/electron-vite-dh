<template>
    <div class="project center">
        <p class="status">{{ transCode(data.status) }}</p>
        <div class="picBox"><el-image :src="data.cover" class="pic" fit="contain"/></div>
        <p class="title ell">{{ data.name }}</p>
        <p class="time">{{ data.created_at }}</p>
        <!-- <div class="btnGroup center" v-if="data.status===1">
            <el-button color="#333333" @click="router.push('/creatlive?pid='+data.id)">继续编辑</el-button>
            <el-button color="#333333" @click="delect">删除</el-button>
        </div>
        <div class="btnGroup center" v-else-if="data.status===3"> -->
        <div class="btnGroup center">
            <template v-if="!project.liveWin">
                <el-button color="#333333" @click="router.push('/creatlive?pid='+data.id)">继续编辑</el-button>
                <el-button color="#333333" @click="router.push('/livesettings?pid='+data.id+'&pagetype='+pagetype)">互动设置</el-button>
            </template>
            <el-button color="#333333" @click="router.push('/preview')">预览</el-button>
            <el-button color="#333333" @click="playLive" v-if="project.liveWin===data.id">开播</el-button>
            <el-button color="#333333" @click="openLiveWin" v-else-if="!project.liveWin">打开直播</el-button>
        </div>
        <!-- <div class="btnGroup center" v-else></div> -->
    </div>
    <!-- 直播窗口打开前的互动配置 -->
    <el-dialog
        v-if="cfgPop"
        v-model="cfgPop"
        title="评论互动"
        width="677"
        destroy-on-close
        align-center
        center
    >
        <el-form :model="form" class="cfgForm" label-width="100" label-position="left">
            <div class="selectOpton">
                <el-checkbox v-model="form.welcome_switch" :true-label="1" :false-label="0" label="欢迎加入" />
                <el-checkbox v-model="form.interactive_switch" :true-label="1" :false-label="0" label="回答问题" />
            </div>
            <el-form-item prop="live_url" label="抖音网址" v-show="form.welcome_switch||form.interactive_switch">
                <el-input v-model.trim="form.live_url" placeholder="请输入抖音直播间网址"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="savedSetup">保存设置</el-button>
            <el-button @click="cfgPop = false">取消设置</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ipcRenderer } from 'electron'
import { useRouter } from 'vue-router'
import { useProjectStore, useLiveStore } from '../stores'
import { setLiveRoom, liveRoomInfo, delProJect } from '../api'
const goRefresh = inject('reload')
const props = defineProps({
    data: {
        type: Object,
        require: true,
    },
    pagetype: {
        type: String,
        require: '1',
    },
})

const project = useProjectStore()
const live = useLiveStore()
const router = useRouter()
const cfgPop = ref(false)
const form = reactive({
    live_url: '',
    welcome_switch: 0,
    interactive_switch: 0,
})
function getLiveRoom(){
    // 保存设置信息到本地存储
    const liveInfo = { ...live.liveInfo, ...form }
    live.setLiveInfo(liveInfo)
    // 打开直播窗口
    const screen = (liveInfo.screen===1 ? {width: 375, height: 670} : {width: 1600, height: 900})
    ipcRenderer.send('open-win', {path: 'live', ...screen})
    // 设置直播的项目ID
    project.setLiveWin(props.data.id)
    cfgPop.value = false
}
async function savedSetup(){
    const wsOpen = (form.welcome_switch===1||form.interactive_switch===1);
    if(wsOpen && !form.live_url){
        return ElMessage({ type: 'warning', message: '开启“欢迎加入”或“回答问题”功能后，直播间网址不能为空' })
    }
    if(wsOpen){
        // 检查项目的互动设置是否填写
    }
    // 1.先保存直播间开启设置
    const res = await setLiveRoom({project_id: props.data.id, ...form})
    if(res){
        // 2.获取直播间信息后再打开直播窗口
        getLiveRoom()
    }
}
function openLiveWin(){
    liveRoomInfo(props.data.id).then(res=>{
        if(res && res.data){
            const { live_url, interactive_switch, welcome_switch } = res.data
            form.live_url = live_url||''
            form.interactive_switch = interactive_switch||0
            form.welcome_switch = welcome_switch||0
            cfgPop.value = true
            live.setLiveInfo(res.data)
        }
    })
}
function playLive(){
    ipcRenderer.send('play-live')
}
function delect(){
    ElMessageBox.confirm('是否删除当前项目?', 'Warning', {type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
        delProJect(props.data.id).then(res=>{
            if(res){
                ElMessage({type: 'success', message: '删除成功'})
                // 更新刷新页面
                goRefresh()
            }
        })
    })
}
function transCode(code){
    switch (code) {
        case 1:
            return '编辑中'
        case 2:
            return '合成中'
        case 3:
            return '已合成'
    }
}
</script>

<style lang="scss" scoped>
.project{
    // width: 285px;
    height: 336px;
    background: #1a1a1a;
    position: relative;
    flex-direction: column;
    margin: 0 5px 10px;
    padding: 0 10px;
    color: #ccc;
    display: flex;
    flex-wrap: wrap;
    .status{
        font-size: 16px;
        position: absolute;
        top: 10px;
        left: 10px;
    }
    .picBox{
        width: 122px;
        height: 217px;
        background-color: #000;
        display: flex;
        align-items: flex-end;
    }
    .pic{
        width: 122px;
    }
    .title{
        margin: 9px 0;
        font-size: 20px;
        line-height: 20px;
        max-width: 100%;
    }
    .time{
        font-size: 16px;
        line-height: 14px;
    }
    .btnGroup{
        width: 100%;
        padding: 15px 0;
        min-height: 60px;
    }
    button{
        min-width: 30px;
        height: 30px;
        font-size: 14px;
        color: #ccc;
    }
    .el-button+.el-button {
        margin-left: 10px;
    }
}
.cfgForm{
    display: flex;
    flex-direction: column;
    align-items: center;
    .selectOpton{
        width: 410px;
    }
    :deep(.el-form-item__content){
        width: 300px!important;
    }
}
</style>