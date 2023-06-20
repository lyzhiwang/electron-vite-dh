<template>
<div class="createPage">
    <div class="fixedHead vcenter">
        <el-input v-model="projectName" placeholder="素材名称" class="partName"/>
        <el-button link class="save" @click="saveToDrafts"><el-icon class="cgxIcon"><Collection /></el-icon>保存到草稿箱</el-button>
        <el-button color="#333" class="">横板</el-button>
        <el-button color="#333" class="">竖版</el-button>
        <el-button type="primary" round class="CreateLive" @click="createLive">创建直播</el-button>
    </div>
    <div class="leftArea">
        <p class="h3">选择形象</p>
        <ul class="pList">
            <li v-for="item in 5"><el-image src="" class="person"/></li>
        </ul>
    </div>
    <div class="rightArea">
        <!-- {{ projectName }} -->
        <div class="topCon">
            <el-image src="" class="dpview"/>
        </div>
        <div class="botCon">
            <div class="btnGroup vcenter">
                <el-icon class="btnIcon"><CopyDocument /></el-icon>
                <el-icon class="btnIcon"><DeleteFilled /></el-icon>
                <el-upload
                    class="upload-voice center"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :limit="3"
                    :on-exceed="handleExceed"
                    :on-success="voiceSuccess"
                >
                    <el-button color="#333" class="upload">
                        <el-icon class="insertIcon"><CirclePlusFilled /></el-icon>
                        上传录音
                    </el-button>
                </el-upload>
            </div>
            <el-scrollbar class="scrollview">
                <ul class="partList">
                    <li :class="['item',{'act': item===act}]" v-for="item in 3"><el-image class="img" src=""/></li>
                    <li class="item center create">
                        <el-icon class="insertIcon"><DocumentAdd /></el-icon>
                        <p>新建素材</p>
                    </li>
                </ul>
            </el-scrollbar>
        </div>
    </div>
    <!-- 创建直播确认弹窗 -->
    <el-dialog
        v-model="crtCfmPop"
        title="是否创建直播"
        width="567"
        destroy-on-close
        align-center
        center
    >
        <p style="text-align: center">预计消耗合成时长1分钟（以实际合成时长为准），预计创建等待时间4分钟，确认后开始创建</p>
        <template #footer>
            <el-button type="primary" @click="changePwdSubmit(changePwdRef)">确定创建</el-button>
            <el-button @click="crtCfmPop = false">取消创建</el-button>
        </template>
    </el-dialog>
</div>
</template>

<script setup>
import { CopyDocument, DeleteFilled, CirclePlusFilled, DocumentAdd, Collection } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const projectName = ref('')
const act = ref(1)
const crtCfmPop = ref(false)
const form = reactive({

})
onBeforeMount(()=>{
    console.log(111, route.query.pn)
    projectName.value = route.query.pn
})
function saveToDrafts(){
    ElMessage({ type: 'success', message: '已保存' })
}
function handleExceed(){
    // 超出上传限制时的钩子函数
}
function voiceSuccess(){

}
function createLive(){
    crtCfmPop.value = true
}
</script>

<style lang="scss" scoped>
.createPage{
    display: flex;
    color: #fff;
    .fixedHead{
        width: 1250px;
        height: 56px;
        position: fixed;
        top: 0;
        left: 190px;
        z-index: 1;
        padding: 0 40px;
        justify-content: center;
        .partName{
            width: 101px;
            background: #1a1a1a!important;
        }
        .cgxIcon{
            font-size: 18px;
            margin-right: 5px;
        }
        .CreateLive{
            position: absolute;
            top: 50%;
            right: 40px;
            transform: translateY(-50%);
        }
        .save{
            margin: 0 35px;
        }
    }
    .leftArea{
        width: 295px;
        height: 824px;
        background: #282828;
        padding: 14px 20px;
        margin-right: 11px;
        .h3{
            font-size: 14px;
        }
        .pList{
            display: flex;
            flex-wrap: wrap;
            margin: 20px -5px 0;
        }
        .person{
            display: block;
            width: 122px;
            height: 217px;
            background: #1e1e1e;
            margin: 5px;
        }
    }
    .rightArea{
        width: 905px;
        .topCon{
            height: 607px;
            background: #282828;
            padding: 20px;
            margin-bottom: 10px;
        }
        .botCon{
            min-height: 206px;
            background: #282828;
            .btnGroup{
                height: 54px;
                border-bottom: 1px solid #4b4b4b;
                padding: 0 20px;
            }
            .btnIcon{
                font-size: 23px;
                color: #ccc;
                cursor: pointer;
                width: 50px;
                height: 30px;
            }
            .upload-voice{
                margin-left: 20px;
            }
            .insertIcon{
                font-size: 18px;
                color: #ccc;
                margin-right: 4px;
            }
        }
        .dpview{
            width: 865px;
            height: 567px;
        }
    }
    .scrollview{
        padding: 0 20px;
    }
    .partList{
        display: flex;
        list-style: none;
        padding: 20px 0;
        box-sizing: border-box;
        .item{
            min-width: 192px;
            width: 192px;
            height: 108px;
            margin: 0 5px;
            background: #000;
            border-radius: 5px;
            --el-fill-color-light: #000;
            cursor: pointer;
            &.create{
                background: #333;
                color: #ccc;
            }
            &.act{
                overflow: hidden;
                border: 1px solid #ccc;
            }
        }
        .img{
            width: 100%;
            height: 100%;
        }
    }
}
</style>