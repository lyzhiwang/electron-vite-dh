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
                <router-link to="/project" class="viewAll">查看全部</router-link>
            </h1>
            <!-- <el-row :gutter="20"><el-col :span="8" v-for="item in 3"></el-col></el-row> -->
            <el-row class="list">
                <el-col :span="8" v-for="item in 3">
                    <ProjectCard/>
                </el-col>
            </el-row>
            <el-divider class="placeholder"/>
            <div class="bottom">
                <span>共: 11个项目</span>
                <div class="vcenter">
                    <span class="label">项目名称：</span>
                    <el-input v-model="projectName" placeholder="请先输入项目名称" />
                </div>
                <el-button type="primary" class="creatBtn" @click="createNewPro">新建项目</el-button>
            </div>
        </div>
    </div>
    <!-- 用户信息 -->
    <div class="right" :span="4">
        <div class="block userinfo">
            <div class="box nickName vcenter">
                <el-avatar class="avatar"><Avatar /></el-avatar>
                <span class="name ell">{{ user.info.username }}</span>
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
                <p class="label">系统到期时间：</p>
                <p class="val">{{ user.info.end_time }}</p>
                <p class="label">语音合成剩余次数：</p>
                <p class="val">{{ user.info.voice_number }}次</p>
                <p class="label">视频合成可用时长：</p>
                <p class="val">{{ hms }}</p>
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
    <!-- 修改密码弹窗 -->
    <el-dialog
        v-model="popup.changePwd"
        title="修改密码"
        width="677"
        destroy-on-close
        align-center
        center
    >
        <el-form ref="changePwdRef" class="pwdForm" label-width="100" status-icon scroll-to-error>
            <el-form-item prop="pldPwd" label="初始密码">
                <el-input type="password" v-model.trim="form.pldPwd" placeholder="请输入初始密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="newPwd" label="新密码">
                <el-input type="password" v-model.trim="form.newPwd" placeholder="请输入新密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="confirmPwd" label="确认密码">
                <el-input type="password" v-model.trim="form.confirmPwd" placeholder="请输入确认密码" show-password></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="changePwdSubmit(changePwdRef)">确定修改</el-button>
            <el-button @click="popup.changePwd = false">取消修改</el-button>
        </template>
    </el-dialog>
    <!-- 右侧侧滑抽屉 -->
    <el-drawer v-model="popup.drawer" title="I am the title" :with-header="false">
        <el-scrollbar wrap-class="balanceDetail">
            <p class="detailTit">语音消耗明细</p>
            <div class="item" v-for="item in 20">
                <p class="vcenter"><span class="name">智网网络测试直播4</span><span class="used">消耗10次</span></p>
                <p class="vcenter"><span class="date">2023-6-06 18:00 -21:00</span><span class="times">剩余60次</span></p>
            </div>
        </el-scrollbar>
    </el-drawer>
</div>
</template>

<script setup>
import { Edit, Avatar, Microphone, VideoPlay } from '@element-plus/icons-vue'
import { useUserStore } from '../../stores'
import { useRouter } from 'vue-router'
import { getTime } from '../../utils/helper'
import { runOnce } from '../../utils/voice'

const changePwdRef = ref()
const user = useUserStore()
const router = useRouter()
const projectName = ref('')
const detailType = ref(1) // 1 语音明细 2视频合成明细
const popup = reactive({
    drawer: false, // 右侧抽屉
    changePwd: false, // 更改密码
})
const form = reactive({
    pldPwd: '',
    newPwd: '',
    confirmPwd: '',
})
const hms = computed(()=>{
    const [h, m, s] = getTime(user.info.duration)
    return `${h}时${m}分${s}秒`
})
function opneDrawer(){
    popup.drawer = true
}
function handleCommand(command){
    switch (command) {
        case 'changePwd':
            popup.changePwd = true
            break;
        case 'exit':
            user.logOut()
            router.replace('/login')
            break;
    }
    // ElMessage(`click on item ${command}`)
}
function createNewPro(){
    if(!projectName.value) return ElMessageBox.alert('请输入项目名称')
    router.push('/creatlive?pn='+projectName.value)
    // setInterval(()=>runOnce('欢迎智网网络进入直播间'), 3000)
    // runOnce('欢迎智网网络进入直播间')
    // ipcRenderer.send('open-win', {path: 'live', width: 375, height: 670})
}
async function changePwdSubmit(formEl){
    if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (valid) {
			changePwd({oldPassword: form.oldPwd, newPassword: form.newPwd}).then(() => {
				ElMessageBox.alert(t('success2'), '', {type: 'success'})
                user.logOut()
				router.replace('/login')
			})
		} else {
			console.log('error submit!', fields)
		}
	})
}
onBeforeMount(()=>{
    user.getUserInfo()
})
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
        .viewAll{
            color: #ccc;
        }
        .list{
            margin: 0 -10px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
    }
    h1{
        font-size: 16px;
        color: #ccc;
        margin-bottom: 18px;
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
    :deep(.el-drawer__body){
        padding-left: 0;
        padding-right: 0;
    }
    .balanceDetail{
        .detailTit{
            margin-top: 40px;
            font-size: 24px;
            padding-left: 20px;
            color: #fff;
        }
        .item{
            width: 100%;
            height: 90px;
            border-bottom: 1px solid #4B4B4B;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px;
            font-size: 16px;
            color: #fff;
            .vcenter{
                justify-content: space-between;
            }
            .date{
                color: #ccc;
                font-size: 14px;
            }
        }
    }
    .pwdForm{
        display: flex;
        flex-direction: column;
        align-items: center;
        :deep(.el-form-item__content){
            width: 300px!important;
        }
    }
}
</style>