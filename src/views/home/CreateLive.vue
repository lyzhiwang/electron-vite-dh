<template>
<div class="createPage">
    <div class="fixedHead vcenter">
        <el-input v-model.trim="form.footages[partAct].name" placeholder="素材名称" class="partName" v-if="form.footages[partAct]"/>
        <el-input v-model.trim="part.name" placeholder="素材名称" class="partName" v-else/>
        <el-button link class="save" @click="saveToTemp"><el-icon class="cgxIcon"><Collection /></el-icon>保存到草稿箱</el-button>
        <button :class="['banBtn',{'act': part.screen==1}]" @click="setHs(1)">竖版</button>
        <button :class="['banBtn',{'act': part.screen==2}]" @click="setHs(2)">横板</button>
        <el-button type="primary" round class="CreateLive" @click="startCfmCrate">创建直播</el-button>
    </div>
    <div class="leftArea">
        <p class="h3">选择形象</p>
        <ul class="pList">
            <el-image 
                v-for="item in dpList" 
                :key="item.id" 
                :src="item.image" 
                :class="['person',{'checked': part.human_id==item.human_id }]" 
                loading="lazy" 
                @click="selectHuman(item.human_id, item.image)"
            />
        </ul>
    </div>
    <div class="rightArea">
        <div class="topCon center">
            <div class="dpBox">
                <el-image :src="currentImg" :class="part.screen==1?'vertical':'horizontal'" fit="contain"/>
            </div>
        </div>
        <div class="botCon">
            <!-- 操作片段区 -->
            <div class="btnGroup vcenter">
                <el-tooltip
                    effect="dark"
                    content="复制选中素材"
                    placement="top"
                >
                    <el-icon class="btnIcon" @click="copyPart"><CopyDocument /></el-icon>
                </el-tooltip>
                <el-tooltip
                    effect="dark"
                    content="删除选中素材"
                    placement="top"
                >
                    <el-icon class="btnIcon" @click="delePart"><DeleteFilled /></el-icon>
                </el-tooltip>
                <!-- <el-upload
                    class="upload-voice center"
                    action="https://zwshuziren.oss-cn-beijing.aliyuncs.com"
                    data=""
                    :limit="1"
                    :before-upload="beforeUpload"
                    :on-exceed="handleExceed"
                    :on-success="voiceSuccess"
                >
                </el-upload> -->
                <Upload 
                    :beforeUpload="beforeUpload" 
                    :uploadSuccess="uploadSuccess"
                    :showFileList="false" 
                    class="upload-voice center"
                >
                    <el-button color="#333" class="upload">
                        <el-icon class="insertIcon"><CirclePlusFilled /></el-icon>
                        <span v-if="form.footages[partAct]&&form.footages[partAct].audio_id">修改录音</span>
                        <span v-else>上传录音</span>
                    </el-button>
                </Upload>
            </div>
            <!-- 片段列表区 -->
            <el-scrollbar class="scrollview">
                <ul class="partList">
                    <li 
                        :class="['item',{'act': i===partAct}]" 
                        v-for="(item, i) in form.footages"
                        :key="i"
                        @click="selectPart(i)"
                    >
                        <el-image class="img center" :src="item.image" loading="lazy" fit="contain">
                            <template #error>
                                <el-icon class="errorIcon"><Picture /></el-icon>
                            </template>
                        </el-image>
                        <div class="status center" v-if="i===partAct">编辑中</div>
                    </li>
                    <li class="item center create" @click="createPart">
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
        <!-- 预计创建等待时间4分钟， -->
        <p style="text-align: center">预计消耗合成时长{{usedTime}}秒（以实际合成时长为准），确认后开始创建</p>
        <template #footer>
            <el-button type="primary" @click="createLive">确定创建</el-button>
            <el-button @click="crtCfmPop = false">取消创建</el-button>
        </template>
    </el-dialog>
</div>
</template>

<script setup>
import { CopyDocument, DeleteFilled, CirclePlusFilled, DocumentAdd, Collection, Picture } from '@element-plus/icons-vue'
import { humanList, createProJect, updateProJect, projectDetail, compositeVideo, videoNeedTime } from '../../api'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { clone, remove } from 'lodash-es'

const route = useRoute()
const router = useRouter()
const partAct = ref(null) // 选中的片段下标
const crtCfmPop = ref(false)
const usedTime = ref('') // 生成视频预计消耗时长
const dpList = ref([]) 
const form = reactive({
    name: '', // 项目名称
    footages: [], // 片段集合
})
const part = reactive({
    name: '',
    image: '',
    human_id: null,
    audio_id: null,
    screen: 1,
})
const currentImg = computed(()=>form.footages[partAct.value]&&form.footages[partAct.value].image)
let project_id = null // 项目ID
onBeforeMount(()=>{
    const { pn, pid} = route.query
    if(pid){ // 编辑
        project_id = pid // 同步项目ID
        Promise.all([
            new Promise((resolve, reject) => {
                projectDetail(pid).then(res=>resolve(res.data)).catch(()=>resolve(null))
            }),
            getHumanList(),
        ]).then(res=>{
            const data = res[0]
            if(data){
                const { name, footages } = data
                form.name = name
                form.footages = footages.map(item=>{
                    const findObj = dpList.value.find(dp=>dp.human_id===item.human_id)
                    if(findObj){
                        item.image = findObj.image
                    }
                    return item
                })
                const first = form.footages[0]
                if(first){
                    partAct.value = 0
                    part.screen = first.screen
                }
            }
        })
    }else{ // 新建
        form.name = pn
        getHumanList()
    }
})
// onBeforeRouteLeave(async()=>{ // 离开页面前保存草稿箱
//     const flag = await saveToTemp()
//     if (!flag) return false
// })
async function getHumanList(){
    const res = await humanList()
    if(res && res.data){
        dpList.value = res.data
        return res.data
    }
    return false
}
function partInit(){
    part.name = ''
    part.image = ''
    part.human_id = null
    part.audio_id = null
}
function setHs(num){ // 设置横竖屏
    part.screen = num
    if(form.footages.length > 0){
        form.footages = form.footages.map(item=>{
            return {...item, screen: num}
        })
    }
}
function selectHuman(id, image){ // 选择数字人
    part.human_id = id
    part.image = image
    if(form.footages.length>0 && partAct.value!==null){
        form.footages[partAct.value].human_id = id
        form.footages[partAct.value].image = image
    }
}
function selectPart(i){ // 选择片段
    partAct.value = i
    // 重置选择的数字人
    partInit()
}
function createPart(){ // 创建片段
    if(part.human_id){
        const temp = clone(toRaw(part))
        form.footages.push(temp)
    }else{
        form.footages.push({
            name: '',
            image: '',
            human_id: null,
            audio_id: null,
            screen: part.screen,
        })
    }
}
function copyPart(){ // 复制片段
    if(partAct.value === null) return ElMessage({ type: 'warning', message: '复制前请先选择一个素材' })
    const targetPart = clone(form.footages[partAct.value])
    form.footages.push(targetPart)
}
function delePart(){ // 删除片段
    if(partAct.value === null) return ElMessage({ type: 'warning', message: '删除前请先选择一个素材' })
    remove(form.footages,(item, index) => index==partAct.value)
    partAct.value = null // 重置
    partInit()
}
function beforeUpload(){
    if(partAct.value === null){
        ElMessage({ type: 'warning', message: '请先选择一个素材,再上传录音！' })
        return false
    }
}
function handleExceed(){
    // 超出上传限制时的钩子函数
}
function uploadSuccess(res, file){
    console.log(333, res)
    const audio_id = res.data.id
    // 上传成功设置音频ID
    part.audio_id = audio_id
    if(form.footages.length>0 && partAct.value!==null){
        form.footages[partAct.value].audio_id = audio_id
    }
    ElMessage({ type: 'success', message: '上传录音成功！' })
}
function startCfmCrate(){ // 1.先获取音频时长
    const footages = form.footages.map(item=>item.audio_id)
    videoNeedTime({footages}).then(res=>{
        if(res&&res.data){
            usedTime.value = res.data.duration
            crtCfmPop.value = true
        }
    })
}
async function saveToTemp(){ // 2.保存到草稿箱
    try {
        const res = (project_id === null) ? await createProJect(form) : await updateProJect(project_id, form)
        if(res && res.data){
            if(project_id === null)  project_id = res.data.id;
            ElMessage({ type: 'success', message: '保存到草稿箱成功' })
        }
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
async function createLive(){
    try {
        // 2.保存到草稿箱
        await saveToTemp();
        // 3.根据项目ID生成视频
        const res = await compositeVideo({project_id});
        if(res && res.data){
            ElMessage({ type: 'success', message: '创建直播成功！' })
            router.back()
        }
    } catch (error) {
        console.log(error)
    }
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
        .banBtn{
            width: 60px;
            height: 28px;
            background: #333;
            border-radius: 4px;
            margin: 0 10px;
            font-size: 14px;
            &.act{
                background: #666!important;
            }
        }
    }
    .leftArea{
        width: 295px;
        min-height: 824px;
        background: #282828;
        padding: 14px 20px;
        margin-right: 11px;
        .h3{
            font-size: 14px;
        }
        .pList{
            // display: flex;
            // flex-wrap: wrap;
            margin: 20px -5px 0;
            column-width: 122px;
            column-count: auto;
            column-gap: 10px;
        }
        .person{
            display: block;
            background: #1e1e1e;
            margin-bottom: 10px;
            cursor: pointer;
            // width: 122px;
            // height: 217px;
            // margin: 10px 5px;
            &.checked{
                border: 1px solid #1182fb;
                border-radius: 4px;
            }
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
        .dpBox{
            background-color: #1e1e1e;
            height: 567px;
            display: flex;
            align-items: flex-end;
            .horizontal{
                width: 865px;
                height: 567px;
            }
            .vertical{
                width: 325px;
            }
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
            position: relative;
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
            display: flex!important;
        }
        .status{
            width: 188px;
            height: 40px;
            background-color: rgba(0,0,0,0.50);
            position: absolute;
            bottom: 0;
            left: 0;
            font-size: 14px;
        }
        .errorIcon{
            font-size: 20px;
            color: #fff;
        }
    }
}
</style>