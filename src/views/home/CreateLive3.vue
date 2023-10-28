<template>
  <div class="createPage">
    <div class="fixedHead vcenter">
      <el-input v-model.trim="form.footages[partAct].name"  placeholder="素材名称" class="partName" v-if="form.footages[partAct]" />
      <el-input v-model.trim="part.name" placeholder="素材名称" class="partName" v-else />
      <el-button link class="save" @click="saveToTemp">
        <el-icon class="cgxIcon">
          <Collection />
        </el-icon>
        保存到草稿箱
      </el-button>
      <el-button type="primary" round class="CreateLive" @click="startCfmCrate">
        创建直播
      </el-button>
    </div>

    <div class="content">
      <div class="content_left">

      </div>


      <div class="">
        <div class="">
          <div class="">
            <div class=""></div>
            <div class=""></div>
            <div class=""></div>
            <div class=""></div>
          </div>
          <div class=""></div>
          <div class=""></div>
        </div>
        <div class=""></div>
        <div class=""></div>
        <div class=""></div>
      </div>
    </div>

    <!-- 创建直播确认弹窗 -->
    <!-- <el-dialog v-model="crtCfmPop" title="是否创建直播" width="567" destroy-on-close align-center center>
      <p style="text-align: center">
        预计消耗合成时长{{ hms }}（以实际合成时长为准），确认后开始创建
      </p>
      <template #footer>
        <el-button type="primary" @click="createLive"> 确定创建 </el-button>
        <el-button @click="crtCfmPop = false"> 取消创建 </el-button>
      </template>
    </el-dialog> -->
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
} from '@element-plus/icons-vue';
import {
  humanList,
  createProJect,
  updateProJect,
  projectDetail,
  compositeVideo,
  videoNeedTime,
} from '../../api';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { clone, remove, uniqBy } from 'lodash-es';
import { useProjectStore } from '../../stores';
import { getTime_two } from '../../utils/helper';

const route = useRoute();
const router = useRouter();
const project = useProjectStore();
const partAct = ref(null); // 选中的片段下标
const crtCfmPop = ref(false);
const usedTime = ref(''); // 生成视频预计消耗时长
const dpList = ref([]);

// 
const form = reactive({
  name: '', // 项目名称
  footages: [], // 片段集合
  is_random: 0,
});

// 
const part = reactive({
  name: '',
  image: '',
  human_id: null,
  audio_id: null,
  screen: 1,
});

// 
const currentImg = computed(
  () => form.footages[partAct.value] && form.footages[partAct.value].image
);

// 时间格式化
const hms = computed(() => {
  if (usedTime.value === 0 || usedTime.value === '0') {
    return `0秒`;
  } else {
    const [h, m, s] = getTime_two(usedTime.value);
    if (h !== '00') {
      return `${h}时${m}分${s}秒`;
    } else if (m !== '00') {
      return `${m}分${s}秒`;
    } else {
      return `${s}秒`;
    }
  }
});

let project_id = null; // 项目ID
onBeforeMount(() => {
  const { pn, pid } = route.query;
  if (pid) {
    // 编辑
    project_id = pid; // 同步项目ID
    Promise.all([
      new Promise((resolve, reject) => {
        projectDetail(pid)
          .then((res) => resolve(res.data))
          .catch(() => resolve(null));
      }),
      getHumanList(),
    ]).then((res) => {
      const data = res[0];
      if (data) {
        const { name, footages, is_random } = data;
        form.name = name;
        form.is_random = Number(is_random);
        form.footages = footages.map((item) => {
          const findObj = dpList.value.find(
            (dp) => dp.human_id === item.human_id
          );
          if (findObj) {
            item.image = findObj.image;
          }
          return item;
        });
        const first = form.footages[0];
        if (first) {
          partAct.value = 0;
          part.screen = first.screen;
        }
      }
    });
  } else {
    // 新建
    form.name = pn;
    getHumanList().then((data) => {
      // console.log('zzzzzzzzzzzzzzzzzzz');
      // 新建的时候创建一个默认的片段并选中
      if (data && data.length > 0) {
        const { human_id, image } = data[0];
        selectHuman(human_id, image);
        // createPart(human_id)
        const temp = clone(toRaw(part));
        form.footages.push(temp);
      }
      // createPart()
      selectPart(0);
    });
  }
  project.queryAliToken();
});

// 离开页面前保存草稿箱
onBeforeRouteLeave(async () => {
  // const flag = await saveToTemp()
  // if (!flag) return false
});

// 获取数字人列表
async function getHumanList() {
  const res = await humanList();
  if (res && res.data) {
    dpList.value = res.data;
    return res.data;
  }
  return false;
}

// 初始化 选中数字人  展示  待废弃
function partInit() {
  part.name = '';
  part.image = '';
  part.human_id = null;
  part.audio_id = null;
}

// 设置横竖屏  待废弃
function setHs(num) {
  part.screen = num;
  if (form.footages.length > 0) {
    form.footages = form.footages.map((item) => {
      return { ...item, screen: num };
    });
  }
}

// 选择数字人
function selectHuman(id, image) {
  // console.log('qqqqqqqqqq')
  // console.log(id)
  // console.log(image)
  part.human_id = id;
  part.image = image;
  if (form.footages.length > 0 && partAct.value !== null) {
    form.footages[partAct.value].human_id = id;
    form.footages[partAct.value].image = image;
  }
}

// 选择片段
function selectPart(i) {
  // 选择片段
  partAct.value = i;
  // 重置选择的数字人
  partInit();
}

// 创建片段
function createPart() {
  // console.log()
  // if(part.human_id){
  //     const temp = clone(toRaw(part))
  //     form.footages.push(temp)
  // }else{
  //     form.footages.push({
  //         name: '',
  //         image: '',
  //         human_id: null,
  //         audio_id: null,
  //         screen: part.screen,
  //     })
  // }
  form.footages.push({
    name: '',
    image: dpList.value[0].image,
    human_id: dpList.value[0].human_id,
    audio_id: null,
    screen: part.screen,
  });
}

// 复制片段
function copyPart() {
  if (partAct.value === null)
    return ElMessage({ type: 'warning', message: '复制前请先选择一个素材' });
  const targetPart = clone(form.footages[partAct.value]);
  form.footages.push(targetPart);
}

// 删除片段
function delePart() {
  if (partAct.value === null)
    return ElMessage({ type: 'warning', message: '删除前请先选择一个素材' });
  remove(form.footages, (item, index) => index == partAct.value);
  partAct.value = null; // 重置
  partInit();
}

//
function beforeUpload() {
  if (partAct.value === null) {
    ElMessage({ type: 'warning', message: '请先选择一个素材,再上传录音！' });
    return false;
  }
}

function handleExceed() {
  // 超出上传限制时的钩子函数
}

//
function uploadSuccess(res, file) {
  console.log(333, res);
  const audio_id = res.data.id;
  // 上传成功设置音频ID
  part.audio_id = audio_id;
  if (form.footages.length > 0 && partAct.value !== null) {
    form.footages[partAct.value].audio_id = audio_id;
  }
  ElMessage({ type: 'success', message: '上传录音成功！' });
}

// 1.先保存到草稿箱
async function startCfmCrate() {
  const flag = await saveToTemp();
  // const footages = form.footages.map(item=>item.audio_id)
  // 2.获取音频时长
  if (flag) {
    await videoNeedTime({ project_id }).then((res) => {
      if (res && res.data) {
        usedTime.value = res.data.duration;
        crtCfmPop.value = true;
      }
    });
  }
}

// 保存到草稿箱
async function saveToTemp() {
  try {
    // 先去重片段中的重复数据
    const data1 = form.footages.map((item) => {
      item.key = `${item.human_id}-${item.audio_id}`;
      return item;
    });
    form.footages = uniqBy(data1, 'key');
    // 再组合form发出请求
    const res =
      project_id === null
        ? await createProJect(form)
        : await updateProJect(project_id, form);
    if (res && res.data) {
      if (project_id === null) project_id = res.data.id;
      ElMessage({ type: 'success', message: '保存到草稿箱成功' });
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// 3.根据项目ID生成视频
async function createLive() {
  try {
    // await saveToTemp();
    const res = await compositeVideo(project_id);
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    setTimeout(() => {
      crtCfmPop.value = false;
      loading.close();
    }, 6000);
    if (res && res.code === 0 && res.data) {
      crtCfmPop.value = false;
      loading.close();
      ElMessage({ type: 'success', message: '创建直播成功！' });
      router.back();
    } else {
      crtCfmPop.value = false;
      loading.close();
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style lang="scss" scoped>
.createPage {
  display: flex;
  color: #fff;
  .fixedHead {
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
  }
}
</style>
