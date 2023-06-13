<template>
<div class="homePage">
    <div class="left" :span="20">
        <!-- 轮播图 -->
        <el-carousel height="289px">
            <el-carousel-item v-for="item in 4" :key="item">
                <h3 class="small justify-center" text="2xl">{{ item }}</h3>
            </el-carousel-item>
        </el-carousel>
        <!-- 项目 -->
        <div class="block RecentProject">
            <p>最近项目</p>
            <el-col class="project" :span="20">
                <p class="status">已合成</p>
                <img src=""/>
                <p class="title">智网网络-直播-测试</p>
                <p class="time">2023-5-30</p>
                <button>预览</button>
                <button>互动设置</button>
                <button>开始直播</button>
            </el-col>
        </div>
    </div>
    <div class="right" :span="4"></div>
</div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.homePage{
    .left{
        width: 935px;
        margin-right: 10px;
    }
    .right{
        width: 265px;
    }
    .block{
        background: #282828;
    }
    .RecentProject{
        min-height: 524px;
    }
    .project{
        width: 285px;
        height: 336px;
        background: #1a1a1a;
        color: #cccccc;
        padding: 20px;
        .status{
            font-size: 16px;
        }
    }
}
</style>