<template>
    <div class="project center">
        <p class="status">已合成</p>
        <el-image src="" class="pic"/>
        <p class="title">智网网络-直播-测试</p>
        <p class="time">2023-5-30</p>
        <div class="btnGroup center">
            <el-button color="#333333" @click="router.push('/preview')">预览</el-button>
            <el-button color="#333333">互动设置</el-button>
            <el-button color="#333333">开始直播</el-button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style lang="scss" scoped>
.project{
    // width: 285px;
    height: 336px;
    background: #1a1a1a;
    position: relative;
    flex-direction: column;
    margin: 0 5px 10px;
    color: #ccc;
    .status{
        font-size: 16px;
        position: absolute;
        top: 10px;
        left: 10px;
    }
    .pic{
        width: 122px;
        height: 217px;
        background: #000000;
    }
    .title{
        margin: 9px 0;
        font-size: 20px;
        line-height: 20px;
    }
    .time{
        font-size: 16px;
        line-height: 14px;
    }
    .btnGroup{
        width: 100%;
        padding: 15px 0;
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
</style>