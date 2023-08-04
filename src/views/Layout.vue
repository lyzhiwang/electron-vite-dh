<template>
<el-container class="layout">
    <el-header class="header">
        <!-- <div class="logo center"></div> -->
        <!-- <div> -->
            <el-image :src="config.logo" class="config_logo"/>
        <!-- </div> -->
    </el-header>
    <el-container>
        <el-aside class="leftNav">
            <!-- active-text-color="#ffd04b" -->
            <el-menu
                router
                :default-active="activeIndex"
                background-color="transparent"
                class="el-menu-vertical-demo"
                text-color="#ccc"
                @select="handleSelect"
            >
                <el-menu-item index="/home" route="/home">
                    <el-icon><icon-menu /></el-icon>
                    <span>首页</span>
                </el-menu-item>
                <!-- <el-menu-item index="/livesettings" route="/livesettings">
                    <el-icon><Setting/></el-icon>
                    <span>设置</span>
                </el-menu-item> -->
            </el-menu>
        </el-aside>
        <!-- 视图容器 -->
        <el-scrollbar wrap-class="scrollView">
            <el-main class="content">
                <router-view v-slot="{ Component }" v-if="isRouterAlive">
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
import { useRoute } from 'vue-router'
import { useConfigStore } from '../stores'
import { Menu as IconMenu, Setting } from '@element-plus/icons-vue'

const route = useRoute()
// const router = useRouter()
const activeIndex = ref('/')
const config = useConfigStore()
const isRouterAlive = ref(true)
const handleSelect = (path) => {
//   activeIndex.value = route.matched[1].path
}
const reload = ()=> {
    isRouterAlive.value = false
    nextTick(()=>{
        isRouterAlive.value = true
    })
}
provide('reload', reload)
onBeforeMount(()=>{
  activeIndex.value = route.matched[1].path
})
</script>

<style lang="scss" scoped>
.layout{
    width: 1440px;
    height: 100vh;
    background-color: #191919;
    overflow: hidden;
    .header{
        height: 56px;
        background-color: #282828;
        padding: 0;
        .logo{
            width: 180px;
            height: 100%;
            font-size: 27px;
            color: #fff;
            background: url('../assets/images/logo.png') center no-repeat;
            background-size: contain;
            margin-left: 10px;
            // border: 2px solid #949494;
        }
        .config_logo{
            width: 180px;
            height: 100%;
            margin-left: 10px;
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
    .v-enter-active,
    .v-leave-active {
    transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
    opacity: 0;
    }
    .v-leave-to {
    display: none;
    }
    .bounce-enter-active {
    animation: bounce-in 0.5s;
    }
    .bounce-leave-active {
    animation: bounce-in 0.5s reverse;
    }
}
</style>