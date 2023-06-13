<template>
<el-container class="layout">
    <el-header class="header">
        <div class="logo center">智星AI数字人</div>
    </el-header>
    <el-container>
        <el-aside class="leftNav">
            <el-menu
                router
                :default-active="activeIndex"
                active-text-color="#ffd04b"
                background-color="transparent"
                class="el-menu-vertical-demo"
                text-color="#ccc"
                @select="handleSelect"
            >
                <el-menu-item index="/" route="/">
                    <el-icon><icon-menu /></el-icon>
                    <span>首页</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-icon><document /></el-icon>
                    <span>直播配置</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon><setting /></el-icon>
                    <span>直播间</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <!-- 视图容器 -->
        <el-scrollbar wrap-class="scrollView">
            <el-main class="content">
                <router-view v-slot="{ Component }">
                    <Transition>
                        <component :is="Component" />
                    </Transition>
                </router-view>
            </el-main>
        </el-scrollbar>
    </el-container>
</el-container>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { Document,  Menu as IconMenu, Setting } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const activeIndex = ref('/')
const handleSelect = (path) => {
//   activeIndex.value = route.matched[1].path
}
onBeforeMount(()=>{
  activeIndex.value = route.matched[1].path
})
</script>

<style lang="scss" scoped>
.layout{
    width: 100vw;
    height: 100vh;
    background-color: #191919;
    overflow: hidden;
    .header{
        height: 56px;
        background-color: #282828;
        padding: 0;
        .logo{
            width: 190px;
            height: 100%;
            border: 2px solid #949494;
            font-size: 27px;
            color: #fff;
        }
    }
    .leftNav{
        width: 190px;
        background-color: #282828;
    }
    :deep(.el-menu){
        border-right: 0;
    }
    :deep(.el-scrollbar){
        flex-grow: 1;
        .scrollView {
            height: calc(100vh - 56px);
        }
    }
}
</style>