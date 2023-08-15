<template>
  <div class="project center">
    <p class="status vcenter">
      <span>{{ transCode(data.status) }}</span>
      <el-icon class="is-loading" v-if="data.status == 2">
        <Loading />
      </el-icon>
    </p>
    <div class="picBox">
      <el-image :src="data.cover" class="pic" fit="contain" />
    </div>
    <p class="title ell">{{ data.name }}</p>
    <p class="time">{{ data.created_at }}</p>
    <div class="btnGroup center" v-if="data.status === 1">
      <el-button
        color="#333333"
        @click="router.push('/creatlive?pid=' + data.id)"
      >
        继续编辑
      </el-button>
      <el-button color="#333333" @click="delect"> 删除 </el-button>
    </div>
    <div class="btnGroup center" v-else-if="data.status === 3">
      <!-- <div class="btnGroup center"> -->
      <template v-if="!project.liveWin">
        <el-button
          color="#333333"
          @click="router.push('/creatlive?pid=' + data.id)"
        >
          继续编辑
        </el-button>
        <el-button
          color="#333333"
          @click="
            router.push(
              '/livesettings?pid=' + data.id + '&pagetype=' + pagetype
            )
          "
        >
          互动设置
        </el-button>
      </template>
      <el-button
        color="#333333"
        @click="router.push('/preview?pid=' + data.id)"
      >
        预览
      </el-button>
      <el-button
        color="#333333"
        @click="cfgPop = true"
        v-if="project.liveWin === data.id"
      >
        开播
      </el-button>
      <el-button
        color="#333333"
        @click="openLiveWin"
        v-else-if="!project.liveWin"
      >
        打开直播
      </el-button>
    </div>
    <!-- <div class="btnGroup center" v-else></div> -->

    <div v-else class="demo-progress">
      <el-progress :percentage="(Number(data.already/data.total).toFixed(2)*100)?(Number(data.already/data.total).toFixed(2)*100):1" :stroke-width="10" striped-flow striped :show-text="false" />
      <div class="progress_text">{{(Number(data.already/data.total).toFixed(2)*100)?(Number(data.already/data.total).toFixed(2)*100):1}}%</div>
    </div>
  </div>

  <!-- 直播窗口打开前的互动配置 -->
  <el-dialog
    v-if="cfgPop"
    v-model="cfgPop"
    title="评论互动"
    width="677"
    destroy-on-close
    align-center
    center
  >
    <el-form
      :model="form"
      class="cfgForm"
      label-width="100"
      label-position="left"
    >
      <div class="selectOpton">
        <el-checkbox
          v-model="form.welcome_switch"
          :true-label="1"
          :false-label="0"
          label="欢迎加入"
        />
        <el-checkbox
          v-model="form.interactive_switch"
          :true-label="1"
          :false-label="0"
          label="回答问题"
        />
      </div>
      <!-- <el-form-item prop="live_url" label="抖音网址" v-show="form.welcome_switch||form.interactive_switch">
                <el-input v-model.trim="form.live_url" placeholder="请输入抖音直播间网址"></el-input>
            </el-form-item> -->
      <el-form-item
        prop="live_url_code"
        label="抖音直播间账号"
        v-show="form.welcome_switch || form.interactive_switch"
      >
        <el-input
          v-model.trim="form.live_url_code"
          placeholder="请输入抖音直播间账号"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="savedSetup">保存设置</el-button>
      <el-button @click="cfgPop = false">取消设置</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`);
import { ipcRenderer } from 'electron';
import { useRouter } from 'vue-router';
import { Loading } from '@element-plus/icons-vue';
import { useProjectStore, useLiveStore } from '../stores';
import { setLiveRoom, liveRoomInfo, delProJect, startLive } from '../api';
const goRefresh = inject('reload');
const props = defineProps({
  data: {
    type: Object,
    require: true,
  },
  pagetype: {
    type: String,
    require: '1',
  },
});

const project = useProjectStore();
const live = useLiveStore();
const router = useRouter();
const cfgPop = ref(false);
const form = reactive({
  live_url: '',
  live_url_code: '',
  welcome_switch: 0,
  interactive_switch: 0,
});
/*function getLiveRoom(){
    // 保存设置信息到本地存储
    const liveInfo = { ...live.liveInfo, ...form }
    live.setLiveInfo(liveInfo)
    // 打开直播窗口
    const screen = (liveInfo.screen===1 ? {width: 375, height: 670} : {width: 1600, height: 900})
    ipcRenderer.send('open-win', {path: 'live', ...screen})
    // 设置直播的项目ID
    project.setLiveWin(props.data.id)
    cfgPop.value = false
}*/
async function savedSetup() {
  const wsOpen = form.welcome_switch === 1 || form.interactive_switch === 1;
  // if(wsOpen && !form.live_url){
  //     return ElMessage({ type: 'warning', message: '开启“欢迎加入”或“回答问题”功能后，直播间网址不能为空' })
  // }
  if (wsOpen && !form.live_url_code) {
    return ElMessage({
      type: 'warning',
      message: '开启“欢迎加入”或“回答问题”功能后，直播间ID不能为空',
    });
  }
  // const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  // if(wsOpen && !reg.test(form.live_url)){
  //     return ElMessage({ type: 'warning', message: '请填写正确的直播间地址' })
  // }
  // https://live.douyin.com/752389399803
  const reg = /[-A-Za-z0-9+&@#/%=~_|]/g;
  if (wsOpen && !reg.test(form.live_url_code)) {
    return ElMessage({ type: 'warning', message: '请填写正确的直播间ID' });
  }

  if (form.welcome_switch === 0 && form.interactive_switch === 0) {
    form.live_url = '';
  }
  // 1.先保存直播间开启设置
  const patams1 = {
    live_url: 'https://live.douyin.com/' + form.live_url_code,
    welcome_switch: form.welcome_switch,
    interactive_switch: form.interactive_switch,
    project_id: props.data.id,
  };
  // const res = await setLiveRoom({ project_id: props.data.id, patams1 });
  const res = await setLiveRoom(patams1);
  if (res) {
    // 2. 保存成功后开播
    const patams2 = {
      live_url: 'https://live.douyin.com/' + form.live_url_code,
      welcome_switch: form.welcome_switch,
      interactive_switch: form.interactive_switch,
    };

    // const liveInfo = { ...live.liveInfo, ...form }
    const liveInfo = { ...live.liveInfo, patams2 };
    live.setLiveInfo(liveInfo);
    playLive(props.data.id);
    cfgPop.value = false;
  }
}
function openLiveWin() {
  liveRoomInfo(props.data.id).then((res) => {
    console.log('1111111111');
    console.log(res);
    if (res && res.data) {
      const { live_url, interactive_switch, welcome_switch } = res.data;
      form.live_url = live_url || '';
      form.interactive_switch = interactive_switch || 0;
      form.welcome_switch = welcome_switch || 0;
      // cfgPop.value = true
      live.setLiveInfo(res.data);
      // 打开直播窗口
      const screen =
        live.liveInfo.screen === 1
          ? { width: 375, height: 670 }
          : { width: 1600, height: 900 };
      ipcRenderer.send('open-win', { path: 'live', ...screen });
      // 设置直播的项目ID
      project.setLiveWin(props.data.id);
    }
  });
}
function playLive(id) {
  // 记录开播
  startLive(id).then((res) => {
    if (res) {
      project.setLiveOpen(true);
    }
  });
  ipcRenderer.send('play-live', JSON.stringify(live.liveInfo));
}
function delect() {
  ElMessageBox.confirm('是否删除当前项目?', 'Warning', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    delProJect(props.data.id).then((res) => {
      if (res) {
        ElMessage({ type: 'success', message: '删除成功' });
        // 更新刷新页面
        goRefresh();
      }
    });
  });
}
function transCode(code) {
  switch (code) {
    case 1:
      return '编辑中';
    case 2:
      return '合成中';
    case 3:
      return '已合成';
  }
}
</script>

<style lang="scss" scoped>
.project {
  // width: 285px;
  height: 336px;
  background: #1a1a1a;
  position: relative;
  flex-direction: column;
  margin: 0 5px 10px;
  padding: 0 10px;
  color: #ccc;
  display: flex;
  flex-wrap: wrap;
  .status {
    font-size: 16px;
    position: absolute;
    top: 10px;
    left: 10px;
    .is-loading {
      margin-left: 3px;
      font-size: 20px;
    }
  }
  .picBox {
    width: 122px;
    height: 217px;
    background-color: #000;
    display: flex;
    align-items: flex-end;
  }
  .pic {
    width: 122px;
  }
  .title {
    margin: 12px 0;
    font-size: 20px;
    line-height: 20px;
    max-width: 100%;
  }
  .time {
    font-size: 16px;
    line-height: 14px;
  }
  .btnGroup {
    width: 100%;
    padding: 15px 0;
    min-height: 60px;
    // border: 1px solid red;
  }
  button {
    min-width: 30px;
    height: 30px;
    font-size: 14px;
    color: #ccc;
  }
  .el-button + .el-button {
    margin-left: 10px;
  }
}
.cfgForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  .selectOpton {
    width: 410px;
  }
  :deep(.el-form-item__content) {
    width: 300px !important;
  }
}

.demo-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  .el-progress--line {
    // margin-top: 12px;
    width: 230px
  }
  .progress_text{
    font-size: 14px;
    padding-top: 2px;
    margin-left: 8px;
  }
}
</style>
