<template>
  <div class="createPage">
    <div class="fixedHead vcenter">
      <!-- <el-input v-if="form.footages[partAct]" v-model.trim="form.footages[partAct].name" placeholder="素材名称" class="partName" />
      <el-input v-else v-model.trim="part.name" placeholder="素材名称" class="partName" /> -->
      <el-button link class="save" @click="saveToTemp">
        <el-icon class="cgxIcon">
          <Collection />
        </el-icon>
        保存到草稿箱
      </el-button>
      <button :class="['banBtn', { act: form.wideorvertical === 1 }]" @click="setHs(1)">
        竖版
      </button>
      <button :class="['banBtn', { act: form.wideorvertical === 2 }]" @click="setHs(2)">
        横板
      </button>
      <el-button type="primary" round class="CreateLive" @click="startCfmCrate">
        创建短视频
      </el-button>
    </div>
    
    <!-- 选择形象 -->
    <div v-if="pagetype==='1'" class="leftArea">
      <p class="h3">选择形象</p>
      <div class="leftArea_box">
        <ul class="pList">
          <el-image
            v-for="item in dpList"
            :key="item.id"
            :src="item.image"
            :class="['person', { checked: form.human_id == item.human_id }]"
            loading="lazy"
            @click="selectHuman(item.human_id, item.image)"
          />
        </ul>
      </div>
    </div>

    <!-- 选择背景 -->
    <div v-if="pagetype==='2'" class="leftArea">
      <p class="h3">选择背景</p>
      <div class="leftArea_box">
        <el-button plain type="info" class="upload_btn" @click="uploadinfo">
          <el-icon><Upload /></el-icon>
          上传图片或视频
        </el-button>
        <div class="bgcolorList">
          <div v-for="(item,index) in bgcolorList" :key="index" :class="['bgcolorList_item',{ checked: form.bgcolor === item }]" :style="'background-color:'+item" @click="selectbg(1,item)"  />
          <div :class="['bgcolorList_item','bgcolorList_item_color',{ checked: form.bgcolor === colorselection }]">
            <el-color-picker v-model="colorselection" @change="selectbgcolor" />
          </div>
        </div>
        <ul class="pList">
          <li v-for="item in bgList" :key="item.id">
            <el-image
              v-if="item.screen === form.wideorvertical"
              :src="item.bg.path"
              :class="['person', { checked: form.bg_id == item.id }]"
              loading="lazy"
              @click="selectbg(2,item)"
            />
          </li>
        </ul>
      </div>
    </div>

    <!-- 选择花字 -->
    <div v-if="pagetype==='3'" class="leftArea">
      <p class="h3">选择花字</p>
      <ul class="pList">
        <el-image
          v-for="item in signatureList"
          :key="item.id"
          :src="item.image"
          :class="['person', { checked: part.human_id == item.human_id }]"
          loading="lazy"
          @click="selectsignature(item)"
        />
      </ul>
    </div>

    <div class="rightArea">
      <div class="topCon center">
        <div class="dpBox" :style="form.bgcolor?'background-color:'+form.bgcolor:''">
          <el-image v-if="form.bg_path"
            :src="form.bg_path"
            :class="['img_box_bg',form.wideorvertical === 1 ? 'vertical' : 'horizontal']"
            fit="fill"
          />
          <el-image
            :src="HumanData.image"
            :class="['img_box',form.wideorvertical === 1 ? 'vertical' : 'horizontal']"
            fit="contain"
          />
        </div>
      </div>

      <div class="botCon">
        <!-- 操作片段区 -->
        <div class="btnGroup vcenter">
          <!-- <el-tooltip effect="dark" content="复制选中素材" placement="top">
            <el-icon class="btnIcon" @click="copyPart">
                <CopyDocument/>
            </el-icon>
          </el-tooltip> -->
          <!-- <el-tooltip effect="dark" content="删除选中素材" placement="top">
            <el-icon class="btnIcon" @click="delePart">
                <DeleteFilled/>
            </el-icon>
          </el-tooltip> -->
          <!-- <Upload
            :beforeUpload="beforeUpload"
            :uploadSuccess="uploadSuccess"
            :showFileList="false"
            accept=".mp3,.wav"
            class="upload-voice center"
          >
            <el-button color="#333" class="upload">
              <el-icon class="insertIcon">
                <CirclePlusFilled />
              </el-icon>
              <span v-if="form.footages[partAct] && form.footages[partAct].audio_id">
                修改录音
              </span>
              <span v-else>上传录音</span>
            </el-button>
          </Upload> -->
          <!-- <el-switch
            class="roundOpt"
            v-if="form.footages.length > 2"
            v-model="form.is_random"
            style="--el-switch-off-color: #4c4d4f"
            active-text="随机播放"
            :active-value="1"
            :inactive-value="0"
          /> -->
        </div>
        <!-- 片段列表区 -->
        <!-- <el-scrollbar class="scrollview">
          <ul class="partList">
            <li :class="['item', { act: i === partAct }]" v-for="(item, i) in form.footages" :key="i" @click="selectPart(i)">
              <el-image class="img center" :src="item.image" loading="lazy" fit="contain" >
                <template #error>
                  <el-icon class="errorIcon"><Picture /></el-icon>
                </template>
              </el-image>
              <div class="status center" v-if="i === partAct">
                编辑中
              </div>
            </li>
            <li class="item center create" @click="createPart">
              <el-icon class="insertIcon">
                <DocumentAdd />
              </el-icon>
              <p>新建素材</p>
            </li>
          </ul>
        </el-scrollbar> -->
      </div>
    </div>

    <!-- 创建短视频确认弹窗 -->
    <el-dialog v-model="crtCfmPop" title="是否创建短视频" width="567" destroy-on-close align-center center>
      <!-- 预计创建等待时间4分钟， -->
      <p style="text-align: center">
        预计消耗合成时长{{ hms }}（以实际合成时长为准），确认后开始创建
      </p>

      <template #footer>
        <el-button type="primary" @click="createLive">确定创建</el-button>
        <el-button @click="crtCfmPop = false">取消创建</el-button>
      </template>
    </el-dialog>


    <FileManager :showFileList="false" accept=".mp3,.wav" @closeupload="closeuploadinfo" />

  </div>
</template>

<script setup>
import {
  CopyDocument,
  DeleteFilled,
  CirclePlusFilled,
  DocumentAdd,
  Collection,
  Picture,
  Upload
} from '@element-plus/icons-vue';
import {
  humanList,
  // createProJect,
  // updateProJect,
  // projectDetail,
  // compositeVideo,
  // videoNeedTime,
  // 
  shortvideoBackgroundList
} from '../../api';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { clone, remove, uniqBy } from 'lodash-es';
import { useProjectStore,shortvideoStore } from '../../stores';
import { getTime } from '../../utils/helper';

const route = useRoute();
const router = useRouter();
// const project = useProjectStore(); //仓库 直播
const shortvideo = shortvideoStore(); //仓库 短视频
const partAct = ref(null); // 选中的片段下标
const crtCfmPop = ref(false); //是否显示创建弹窗
const usedTime = ref(''); // 生成视频预计消耗时长
const dpList = ref([]); // 数字人形象列表
const bgList = ref([]); // 背景图列表
const bgcolorList = ref([
  '#fa436a',
  '#e54d42',
  '#f37b1d',
  '#fbbd08',
  '#8dc63f',
  '#39b54a',
  '#1cbbb4',
  '#0081ff',
  '#6739b6',
  '#9c26b0',
  '#e03997',
]); // 背景颜色列表
const signatureList = ref([]); // 花字列表
const pagetype = ref('1'); // 页面类型1：数字人  2：背景  3：花字
const colorselection = ref('#409EFF'); // 颜色选择器
const form = reactive({
  id:'',
  name: '', // 短视频名称
  wideorvertical:1,// 1：宽屏  2：竖屏
  human_id:'',//数字人id
  bg_id:'', // 背景id
  bg_path:"",
  signature_id:'', // 花字id
  bgcolor:'', // 背景色纯色
  // footages: [], // 片段集合
  // is_random: 0,
});
const HumanData = ref({}); // 选中数字人
const isVisible =  ref(false); // 是否显示上传文档弹窗弹窗
// const part = reactive({
//   name: '',
//   image: '',
//   human_id: null,
//   audio_id: null,
//   screen: 1,
// });
// const currentImg = computed(
//   () => form.footages[partAct.value] && form.footages[partAct.value].image
// );

// 对时间显示进行处理
const hms = computed(() => {
  if (usedTime.value) {
    const [h, m, s] = getTime(usedTime);
    return `${h}时${m}分${s}秒`;
  } else {
    return `${'0'}时${'4'}分${'16'}秒`;
  }
});

// let shortvideo_id = null; // 短视频 ID

// 
onBeforeMount(() => {
  // const { pn, pid } = route.query;
  // if (pid) {
  //   // 编辑
  //   project_id = pid; // 同步项目ID
  //   Promise.all([
  //     new Promise((resolve, reject) => {
  //       projectDetail(pid)
  //         .then((res) => resolve(res.data))
  //         .catch(() => resolve(null));
  //     }),
  //     getHumanList(),
  //   ]).then((res) => {
  //     const data = res[0];
  //     if (data) {
  //       const { name, footages, is_random } = data;
  //       form.name = name;
  //       form.is_random = Number(is_random);
  //       form.footages = footages.map((item) => {
  //         const findObj = dpList.value.find(
  //           (dp) => dp.human_id === item.human_id
  //         );
  //         if (findObj) {
  //           item.image = findObj.image;
  //         }
  //         return item;
  //       });
  //       const first = form.footages[0];
  //       if (first) {
  //         partAct.value = 0;
  //         part.screen = first.screen;
  //       }
  //     }
  //   });
  // } else {
  //   // 新建
  //   form.name = pn;
  //   getHumanList().then((data) => {
  //     // 新建的时候创建一个默认的片段并选中
  //     if (data && data.length > 0) {
  //       const { human_id, image } = data[0];
  //       selectHuman(human_id, image);
  //     }
  //     // createPart();
  //     // selectPart(0);
  //   });
  //   getShortvideoBackgroundList().then(res =>{
  //     console.log('获取背景图列表')
  //     console.log(rees)
  //   })
  // }
  // project.queryAliToken();
  const { pt } = route.query;
  console.log('页面状态')
  console.log(pt)
  pagetype.value = pt
  getHumanList().then((data) => {
    console.log('数字人')
    console.log(data)
    // 新建的时候创建一个默认的片段并选中
    if (data && data.length > 0) {
      const { human_id, image } = data[0];
      // selectHuman(human_id, image);
      form.human_id = human_id
      HumanData.value = data[0]
    }
    // createPart();
    // selectPart(0);
  });
  if (pt === '2'){
    getShortvideoBackgroundList().then(data =>{
      console.log('获取背景图列表')
      console.log(data)
      const { id, image } = data[0];
      form.bg_id = id
    })
  } else if (pt === '3'){
    // getShortvideoBackgroundList().then(res =>{
    //   console.log('获取背景图列表')
    //   console.log(res)
    // })
  }

  
});

// 离开页面前保存草稿箱
// onBeforeRouteLeave(async()=>{ 
//     const flag = await saveToTemp()
//     if (!flag) return false
// })

function uploadinfo(){
  this.isVisible.value = true
}

function closeuploadinfo(){
  this.isVisible.value = false
}

// 获取数字人列表
async function getHumanList() {
  const res = await humanList();
  if (res && res.data) {
    dpList.value = res.data;
    return res.data;
  }
  return false;
}

// 获取背景图列表
async function getShortvideoBackgroundList() {
  const res = await shortvideoBackgroundList();
  if (res && res.data) {
    bgList.value = res.data;
    return res.data;
  }
  return false;
}

// 选择数字人
function selectHuman(id, image) {
  form.human_id = id
  // part.human_id = id;
  // part.image = image;
  // if (form.footages.length > 0 && partAct.value !== null) {
  //   form.footages[partAct.value].human_id = id;
  //   form.footages[partAct.value].image = image;
  // }
}

// 选择背景图
function selectbg(type,item) {
  // console.log('选择背景图')
  // console.log(type,item)
  if(type===1){
    form.bgcolor = item
    form.bg_id = -1
    form.bg_path = ''
  } else {
    form.bg_id = item.id
    form.bg_path = item.bg.path
    form.bgcolor = ''
  }
  // if (form.footages.length > 0 && partAct.value !== null) {
  //   form.footages[partAct.value].human_id = id;
  //   form.footages[partAct.value].image = image;
  // }
}

// 取色器选颜色
function selectbgcolor(e){
  // console.log('eeeeeeee')
  // console.log(e)
  if(e){
    form.bg_id = -1
    form.bg_path = ''
    form.bgcolor = e
  }
}

// 选择花字
function selectsignature(item) {
    form.bg_id = item.id
  
  // if (form.footages.length > 0 && partAct.value !== null) {
  //   form.footages[partAct.value].human_id = id;
  //   form.footages[partAct.value].image = image;
  // }
}

// 获取花字列表
async function getSignatureList() {
  // const res = await humanList();
  // if (res && res.data) {
  //   dpList.value = res.data;
  //   return res.data;
  // }
  // return false;
}

// 初始化短视频基础数据
function partInit() {
  part.name = '';
  part.image = '';
  part.human_id = null;
  part.audio_id = null;
}

// 设置横竖屏
function setHs(num) {
  form.wideorvertical = num;

  // 背景初始化
  form.bg_id = -1
  form.bg_path = ''
  form.bgcolor = ''
  // if (form.footages.length > 0) {
  //   form.footages = form.footages.map((item) => {
  //     return { ...item, screen: num };
  //   });
  // }
}



// // 选择片段
// function selectPart(i) {
//   partAct.value = i;
//   // 重置选择的数字人
//   partInit();
// }

// // 创建片段
// function createPart() {
//   if (part.human_id) {
//     const temp = clone(toRaw(part));
//     form.footages.push(temp);
//   } else {
//     form.footages.push({
//       name: '',
//       image: '',
//       human_id: null,
//       audio_id: null,
//       screen: part.screen,
//     });
//   }
// }

// // 复制片段 
// function copyPart() {
//   if (partAct.value === null)
//     return ElMessage({ type: 'warning', message: '复制前请先选择一个素材' });
//   const targetPart = clone(form.footages[partAct.value]);
//   form.footages.push(targetPart);
// }

// // 删除片段
// function delePart() {
//   if (partAct.value === null)
//     return ElMessage({ type: 'warning', message: '删除前请先选择一个素材' });
//   remove(form.footages, (item, index) => index == partAct.value);
//   partAct.value = null; // 重置
//   partInit();
// }

// 
function beforeUpload() {
  if (partAct.value === null) {
    ElMessage({ type: 'warning', message: '请先选择一个素材,再上传录音！' });
    return false;
  }
}

// 
function handleExceed() {
  // 超出上传限制时的钩子函数
}

// 
// function uploadSuccess(res, file) {
//   console.log(333, res);
//   const audio_id = res.data.id;
//   // 上传成功设置音频ID
//   part.audio_id = audio_id;
//   if (form.footages.length > 0 && partAct.value !== null) {
//     form.footages[partAct.value].audio_id = audio_id;
//   }
//   ElMessage({ type: 'success', message: '上传录音成功！' });
// }

// 
async function startCfmCrate() {
  // 1.先保存到草稿箱
  const flag = await saveToTemp();
  // const footages = form.footages.map(item=>item.audio_id)
  // 2.获取音频时长
  // if (flag) {
  //   await videoNeedTime({ project_id }).then((res) => {
  //     if (res && res.data) {
  //       usedTime.value = res.data.duration;
  //       crtCfmPop.value = true;
  //     }
  //   });
  // }
}

// 保存到草稿箱
async function saveToTemp() {
  // try {
  //   // 先去重片段中的重复数据
  //   const data1 = form.footages.map((item) => {
  //     item.key = `${item.human_id}-${item.audio_id}`;
  //     return item;
  //   });
  //   form.footages = uniqBy(data1, 'key');
  //   // 再组合form发出请求
  //   const res =
  //     project_id === null
  //       ? await createProJect(form)
  //       : await updateProJect(project_id, form);
  //   if (res && res.data) {
  //     if (project_id === null) project_id = res.data.id;
  //     ElMessage({ type: 'success', message: '保存到草稿箱成功' });
  //   }
  //   return true;
  // } catch (error) {
  //   console.log(error);
  //   return false;
  // }
}

// 
async function createLive() {
  // try {
  //   // await saveToTemp();
  //   // 3.根据项目ID生成视频
  //   const res = await compositeVideo(project_id);
  //   if (res && res.data) {
  //     ElMessage({ type: 'success', message: '创建直播成功！' });
  //     router.back();
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
}
</script>

<style lang="scss" scoped>
.createPage {
  border: 1px solid red;
  display: flex;
  color: #fff;
  position: relative;
  .fixedHead {
    border: 1px solid red;
    width: 1250px;
    height: 56px;
    position: fixed;
    top: 0;
    left: 190px;
    z-index: 1;
    padding: 0 40px;
    justify-content: center;
    .partName {
      width: 101px;
      background: #1a1a1a !important;
    }
    .cgxIcon {
      font-size: 18px;
      margin-right: 5px;
    }
    .CreateLive {
      position: absolute;
      top: 50%;
      right: 40px;
      transform: translateY(-50%);
    }
    .save {
      margin: 0 35px;
    }
    .banBtn {
      width: 60px;
      height: 28px;
      background: #333;
      border-radius: 4px;
      margin: 0 10px;
      font-size: 14px;
      cursor: pointer;
      &.act {
        background: #666 !important;
      }
    }
  }

  //   
  .leftArea {
    // border: 1px solid red;
    width: 300px;
    // min-height: 824px;
    height: 824px;
    overflow: hidden;
    background: #282828;
    // padding: 14px 15px;
    margin-right: 11px;
    // scroll-behavior: smooth;
    // overflow-y: scroll;
    .h3 {
      font-size: 14px;
      padding: 15px 12px 0px 12px;
    }
    .leftArea_box{
      height: 820px;
      width: 100%;
      scroll-behavior: smooth;
      overflow-y: scroll;
      // border: 1px solid red;
      padding: 0px 15px 40px 15px;

      .pList {
        // margin: 20px -5px 0;
        margin: 14px -5px 0;
        column-width: 100px;
        column-count: auto;
        column-gap: 10px;
        .person {
          display: block;
          background: #1e1e1e;
          margin-bottom: 10px;
          cursor: pointer;
          border: 1px solid rgb(0,0,0,0);
          &.checked {
            // border: 1px solid #1182fb;
            border: 1px solid #f10808;
            border-radius: 4px;
          }
        }
      }

      .upload_btn{
        width: 270px;
        margin-top: 10px;
      }

      .bgcolorList{
        // margin-top: 6px;
        width: 270px;
        // border: 1px solid red;
        display: flex;
        flex-wrap: wrap;
        padding-left: 4px;
        // justify-content: space-between;
        .bgcolorList_item{
          margin-top: 10px;
          margin-right: 10px;
          width: 34px;
          height: 34px;
          border: 1px solid #999999;
          border-radius: 5px;
          // border: 1px solid rgb(0,0,0,0);
          // background-color: #d2e4f7;
          cursor: pointer;
          &.checked {
            border: 1px solid #f10808;
            border-radius: 4px;
          }
        }
        .bgcolorList_item_color{
          padding: 0;
          overflow: hidden;
        }
      }
    }

    .leftArea_box::-webkit-scrollbar {
      width: 4px;
    }
    .leftArea_box::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(0,0,0,0);
    }
    .leftArea::-webkit-scrollbar-track {
        border-radius: 0;
        background: rgba(0,0,0,0);
    }
  }

  // .leftArea::-webkit-scrollbar {
  //   width: 4px;
  // }
  // .leftArea::-webkit-scrollbar-thumb {
  //     border-radius: 10px;
  //     background: rgba(0,0,0,0);
  // }
  // .leftArea::-webkit-scrollbar-track {
  //     border-radius: 0;
  //     background: rgba(0,0,0,0);
  // }

  .rightArea {
    width: 905px;
    border: 1px solid blue;
    .topCon {
      border: 1px solid rgb(0, 255, 76);
      height: 607px;
      background: #282828;
      padding: 20px;
      margin-bottom: 10px;
      .dpBox {
        border: 1px solid rgb(208, 255, 0);
        background-color: #1e1e1e;
        height: 567px;
        display: flex;
        align-items: flex-end;
        position: relative;
        .img_box{
          position: relative;
          z-index: 3;
          height: 530px;
        }
        .img_box_bg{
          position: absolute;
          z-index: 2;
        }
        .horizontal {
          width: 865px;
          height: 567px;
        }
        .vertical {
          width: 325px;
        }
      }
    }
    .botCon {
      min-height: 206px;
      background: #282828;
      .btnGroup {
        height: 54px;
        border-bottom: 1px solid #4b4b4b;
        padding: 0 20px;
      }
      .btnIcon {
        font-size: 23px;
        color: #ccc;
        cursor: pointer;
        width: 50px;
        height: 30px;
      }
      .upload-voice {
        margin-left: 20px;
      }
      .insertIcon {
        font-size: 18px;
        color: #ccc;
        margin-right: 4px;
      }
    }

  }
  .scrollview {
    padding: 0 20px;
  }
  .partList {
    display: flex;
    list-style: none;
    padding: 20px 0;
    box-sizing: border-box;
    .item {
      position: relative;
      min-width: 192px;
      width: 192px;
      height: 108px;
      margin: 0 5px;
      background: #000;
      border-radius: 5px;
      --el-fill-color-light: #000;
      cursor: pointer;
      &.create {
        background: #333;
        color: #ccc;
      }
      &.act {
        overflow: hidden;
        border: 1px solid #ccc;
      }
    }
    .img {
      width: 100%;
      height: 100%;
      display: flex !important;
    }
    .status {
      width: 188px;
      height: 40px;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 14px;
    }
    .errorIcon {
      font-size: 20px;
      color: #fff;
    }
  }
  .roundOpt {
    margin-left: 10px;
  }
}
</style>
