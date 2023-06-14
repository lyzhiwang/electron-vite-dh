<template>
<div class="homePage">
    <div class="left" :span="20">
        <!-- 轮播图 -->
        <el-carousel class="swiperContainer">
            <el-carousel-item v-for="item in 4" :key="item">
                <h3 class="swiperItem" text="2xl">{{ item }}</h3>
            </el-carousel-item>
        </el-carousel>
        <!-- 项目 -->
        <div class="block RecentProject">
            <h1 class="between">
                <span>最近项目</span>
                <span>查看全部</span>
            </h1>
            <el-row :gutter="20">
                <el-col :span="8" v-for="item in 3">
                    <div class="project center">
                        <p class="status">已合成</p>
                        <el-image src="" class="pic"/>
                        <p class="title">智网网络-直播-测试</p>
                        <p class="time">2023-5-30</p>
                        <div class="btnGroup center">
                            <el-button color="#333333">预览</el-button>
                            <el-button color="#333333">互动设置</el-button>
                            <el-button color="#333333">开始直播</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-divider class="placeholder"/>
            <div class="bottom">
                <span>共: 11个项目</span>
                <div class="vcenter">
                    <span class="label">项目名称：</span>
                    <el-input v-model="projectName" placeholder="请先输入项目名称" />
                </div>
                <el-button type="primary" class="creatBtn">新建项目</el-button>
            </div>
        </div>
    </div>
    <div class="right" :span="4">
        <div class="block userinfo">
            <div class="box nickName vcenter">
                <el-avatar class="avatar"><Avatar /></el-avatar>
                <span class="name ell">用户名</span>
                <el-dropdown  @command="handleCommand">
                    <el-icon class="editName"><Edit /></el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
                            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
           <div class="box limitBox">
                <p class="label">系统到期时长：</p>
                <p class="val">132小时52分10秒</p>
                <p class="label">语音合成剩余次数：</p>
                <p class="val">66次</p>
                <p class="label">视频合成可用时长：</p>
                <p class="val">132小时52分10秒</p>
           </div>
           <div class="viewDetail">
                <el-button color="#191919" class="detailBtn" @click="opneDrawer">
                    <el-icon class="btnIcon"><Microphone /></el-icon>
                    语音消耗明细
                </el-button>
                <el-button color="#191919" class="detailBtn" @click="opneDrawer">
                    <el-icon class="btnIcon"><VideoPlay /></el-icon>
                    视频消耗明细
                </el-button>
           </div>
        </div>
        <div class="block codeBox center">
            <el-image src="" class="qrcode"/>
            <p>投诉反馈</p>
            <p>添加客服微信进行咨询</p>
        </div>
    </div>
    <!-- 右侧侧滑抽屉 -->
    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
        
    </el-drawer>
</div>
</template>

<script setup>
import { Edit, Avatar, Microphone, VideoPlay } from '@element-plus/icons-vue'
const projectName = ref('')
const drawer = ref(false)
function opneDrawer(){
    drawer.value = true
}
function handleCommand(command){
    ElMessage(`click on item ${command}`)
}
</script>

<style lang="scss" scoped>
.homePage{
    display: flex;
    color: #cccccc;
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
    .swiperContainer{
        height: 289px;
        .swiperItem{
            width: 100%;
            height: 100%;
            background-color: #ccc;
        }
    }
    .RecentProject{
        padding: 20px;
        min-height: 524px;
        margin-top: 11px;
    }
    h1{
        font-size: 16px;
        color: #ccc;
        margin-bottom: 18px;
    }
    .project{
        // width: 285px;
        height: 336px;
        background: #1a1a1a;
        position: relative;
        flex-direction: column;
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
    .userinfo{
        height: 492px;
        .avatar{
            width: 50px;
            height: 50px;
            margin-right: 10px;
        }
        .box{
            padding: 20px 22px 20px 30px;
            border-bottom: 1px solid #666;
        }
        .nickName{
            height: 90px;
            font-size: 20px;
            .name{
                flex: 1;
            }
            .editName{
                font-size: 24px;
            }
        }
        .limitBox{
            .label{
                font-size: 16px;
                line-height: 17px;
                margin-top: 6px;
            }
            .val{
                font-size: 20px;
                line-height: 20px;
                margin: 10px 0 26px;
                &:last-child{
                    margin: 10px 0 6px;
                }
            }
        }
        .viewDetail{
            padding: 2px 31px;
            .detailBtn{
                display: block;
                width: 155px;
                height: 40px;
                margin-left: 0;
                margin-top: 25px;
                margin-bottom: 25px;
            }
            .btnIcon{
                font-size: 22px;
                margin-right: 10px;
            }
        }
    }
    .codeBox{
        flex-direction: column;
        margin-top: 10px;
        height: 322px;
        color: #fff;
        font-size: 18px;
        .qrcode{
            width: 162px;
            height: 162px;
            margin-bottom: 20px;
        }
    }
    .bottom{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 20px;
        .label{
            min-width: 100px;
        }
        .creatBtn{
            width: 135px;
            height: 40px;
            font-weight: bold;
            font-size: 20px;
        }
    }
    :deep(.el-input){
        .el-input__wrapper{
            background: #1a1a1a;
            // box-shadow: none;
        }
    }
    .placeholder{
        border-top-color: #999;
    }
}
</style>