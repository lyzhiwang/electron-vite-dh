<template>
<div class="homePage">
    <div class="left" :span="20">
        <!-- 轮播图 -->
        <el-carousel class="swiperContainer">
            <el-carousel-item v-for="item in banner" :key="item.id">
                <el-image :src="item.image.path" class="swiperItem" fit="cover"/>
            </el-carousel-item>
        </el-carousel>
        <!-- 项目 -->
        <div class="block RecentProject">
            <h1 class="between">
                <div class="vcenter">
                    <span>最近项目</span>
                    <el-icon class="refresh" @click="getThreeProject"><RefreshRight /></el-icon>
                </div>
                <router-link to="/project" class="viewAll">查看全部</router-link>
            </h1>
            <el-row class="list">
                <el-col :span="8" v-for="item in proList" :key="item.id" >
                    <ProjectCard :data="item" pagetype="1" :key="item.id"/>
                </el-col>
                <el-empty description="暂无数据" v-if="proList.length==0" class="noData"/>
            </el-row>
            <el-divider class="placeholder"/>
            <div class="bottom">
                <span>共: {{ listTotal }}个项目</span>
                <div class="vcenter">
                    <span class="label">项目名称：</span>
                    <el-input v-model.trim="projectName" placeholder="请先输入项目名称" />
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
                <!-- <p class="label">语音合成剩余次数：</p>
                <p class="val">{{ user.info.voice_number }}次</p> -->
                <p class="label">视频合成可用时长：</p>
                <p class="val">{{ hms }}</p>
           </div>
           <div class="viewDetail">
                <!-- <el-button color="#191919" class="detailBtn" @click="opneDrawer(1)">
                    <el-icon class="btnIcon"><Microphone /></el-icon>
                    语音消耗明细
                </el-button> -->
                <el-button color="#191919" class="detailBtn" @click="opneDrawer(2)">
                    <el-icon class="btnIcon"><VideoPlay /></el-icon>
                    视频消耗明细
                </el-button>
           </div>
        </div>
        <div class="block codeBox center">
            <el-image :src="sys.qrcode" class="qrcode"/>
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
        <el-form :model="form" :rules="rules" ref="changePwdRef" class="pwdForm" label-width="100" status-icon scroll-to-error>
            <el-form-item prop="oldPwd" label="初始密码">
                <el-input type="password" v-model.trim="form.oldPwd" placeholder="请输入初始密码" show-password></el-input>
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
    <el-drawer v-model="popup.drawer" title="I am the title" :with-header="false" destroy-on-close>
        <VoiceDetail v-if="popup.detailType===1"/>
        <VideoDetail v-else />
    </el-drawer>
</div>
</template>

<script setup>
import { Edit, Avatar, Microphone, VideoPlay, RefreshRight } from '@element-plus/icons-vue'
import { useUserStore, useProjectStore } from '../../stores'
import { useRouter } from 'vue-router'
import { getTime } from '../../utils/helper'
import { changePwd, getBanner, sysInfo } from '../../api'
// import { runOnce } from '../../utils/voice'
import { useConfigStore } from '../../stores'

const changePwdRef = ref()
const user = useUserStore()
const projct = useProjectStore()
const config = useConfigStore()
const router = useRouter()
const projectName = ref('')
const listTotal = ref(0) // 项目总个数
const banner = ref([])
const sys = ref({  //系统设置
    logo: '',
    name: '',
    qrcode: '',
})
const popup = reactive({
    drawer: false, // 右侧抽屉
    changePwd: false, // 更改密码
    detailType: 1, // 1语音 2视频 
})
const form = reactive({
    oldPwd: '',
    newPwd: '',
    confirmPwd: '',
})
const noTypePwd = '请输入您的密码'
const trigger = ['blur', 'change']
const validatePass = (rule, value, callback) => {
    if (value === form.oldPwd) {
        callback(new Error('您填写的新旧密码一样'))
    } else {
        callback()
    }
}
const validateCfmPass = (rule, value, callback) => {
    if (value !== form.newPwd) {
        callback(new Error('您填写的确认密码和新密码不一致'))
    } else {
        callback()
    }
}
const rules = reactive({
	oldPwd: [{ required: true, message: noTypePwd, trigger }],
    newPwd: [
        { required: true, message: noTypePwd, trigger },
        { validator: validatePass, trigger },
    ],
    confirmPwd: [
        { required: true, message: noTypePwd, trigger },
        { validator: validateCfmPass, trigger: 'blur' },
    ],
})
const hms = computed(()=>{
    const [h, m, s] = getTime(user.info.duration)
    return `${h}时${m}分${s}秒`
})
const proList = computed(()=>projct.list.slice(0, 3))

const qwelist = ref([])
const ids = ref([])
var timer = null


function opneDrawer(type){
    popup.drawer = true
    popup.detailType = type
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
			changePwd({old_password: form.oldPwd, password: form.newPwd, password_confirmation: form.confirmPwd }).then(() => {
				ElMessageBox.alert('更改密码成功！', '', {type: 'success'})
                user.logOut()
				router.replace('/login')
			})
		} else {
			console.log('error submit!', fields)
		}
	})
}
function getThreeProject(){
    projct.getList({page: 1, size: 3}).then(res=>{
        // if(res)  listTotal.value = res.total
        if(res){
            listTotal.value = res.meta.total
            qwelist.value = res.data.filter(item => item.status==2);
            qwelist.value.forEach(item => {
                ids.value.push(item.id)
            })   
            if(ids.value.length>0){
                getsynthetizedetail(ids.value)
                timer = setInterval(() => {
                    getsynthetizedetail(ids.value)
                }, 10000);
                setTimeout(() => {  
                    clearInterval(timer);   
                }, 300000);
            }
        }
    })
}

function getsynthetizedetail(ids){
    synthetizedetail({ids:ids}).then(res=>{
        for (var i = 0; i < res.data.length; i++){
            projct.list.forEach(item => {
                if(item.id === res.data[i].id){
                    item.already = res.data[i].already
                    item.total = res.data[i].total
                }
            })
        }
    })
}

// 定义一个清除延时器的函数
function clearTimers() {
  // 获取所有具有 setTimeout 或 setInterval 方法的元素
  var timers = document.querySelectorAll('[data-timer]');
  // 循环遍历所有元素并清除它们的延时器
  for (var i = 0; i < timers.length; i++) {
    var timer = timers[i];
    // 清除 setTimeout 延时器
    // if (timer.dataset.timer !== undefined) {
    //   clearTimeout(timer.dataset.timer);
    // }
    // 清除 setInterval 延时器
    if (timer.dataset.interval !== undefined) {
      clearInterval(timer.dataset.interval);
    }
  }
}

onBeforeMount(()=>{
    user.getUserInfo()
    getThreeProject()
    Promise.all([
        new Promise(resolve => getBanner().then(res=>resolve(res.data)).catch(()=>resolve(null))),
        new Promise(resolve => sysInfo().then(res=>resolve(res.data)).catch(()=>resolve(null))),
    ]).then( data => {
        const [ b, s ] = data
        banner.value = b
        sys.value = s
        config.setlogo(s.logo)
        config.setname(s.name)
    })
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
        .refresh{
            font-size: 20px;
            margin-left: 10px;
            cursor: pointer;
        }
        .viewAll{
            color: #ccc;
        }
        .list{
            margin: 0 -10px;
            display: flex;
            flex-wrap: wrap;
            // justify-content: space-between;
        }
        .noData{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
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