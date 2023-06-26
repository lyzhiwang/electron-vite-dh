<template>
    <div class="project center">
        <p class="status">{{ transCode(data.status) }}</p>
        <div class="picBox"><el-image :src="data.cover" class="pic" fit="contain"/></div>
        <p class="title ell">{{ data.name }}</p>
        <p class="time">{{ data.created_at }}</p>
        <div class="btnGroup center" v-if="data.status===1">
            <el-button color="#333333" @click="router.push('/creatlive?pid='+data.id)">继续编辑</el-button>
            <el-button color="#333333">删除</el-button>
        </div>
        <div class="btnGroup center" v-else-if="data.status===3">
            <el-button color="#333333" @click="router.push('/preview')">预览</el-button>
            <el-button color="#333333">互动设置</el-button>
            <el-button color="#333333" @click="playLive" v-if="project.liveWin===data.id">开播</el-button>
            <el-button color="#333333" @click="openLiveWin" v-else-if="!project.liveWin">打开直播</el-button>
        </div>
        <div class="btnGroup center" v-else></div>
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
            <el-checkbox-group v-model="checkedArr" class="selectOpton">
                <el-checkbox label="1">欢迎加入</el-checkbox>
                <el-checkbox label="2">回答问题</el-checkbox>
            </el-checkbox-group>
            <el-form-item prop="url" label="抖音网址">
                <el-input v-model.trim="form.url" placeholder="请输入抖音直播间网址"></el-input>
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
import { useProjectStore } from '../stores'

const props = defineProps({
    data: {
        type: Object,
        require: true,
    },
})

const project = useProjectStore()
const router = useRouter()
const cfgPop = ref(false)
const checkedArr = ref(['1', '2'])
const form = reactive({
    url: '',
})

function savedSetup(){
    // 打开直播窗口
    ipcRenderer.send('open-win', {path: 'live', width: 375, height: 670})
    // 设置直播的项目ID
    project.setLiveWin(props.data.id)
    cfgPop.value = false
}
function openLiveWin(){
    cfgPop.value = true
}
function playLive(){
    ipcRenderer.send('play-live')
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
    padding: 0 5px;
    color: #ccc;
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
        min-width: 65px;
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
        width: 400px;
    }
    :deep(.el-form-item__content){
        width: 300px!important;
    }
}
</style>