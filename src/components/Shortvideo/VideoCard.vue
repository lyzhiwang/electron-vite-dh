<template>
  <div class="project center">
    <p class="status vcenter">
      <span>{{ transCode(data.status) }}</span>
      <el-icon class="is-loading" v-if="data.status < 5"><Loading /></el-icon>
    </p>
    <div class="picBox">
      <el-image :src="data.image" class="pic" fit="contain" />
    </div>
    <p class="title ell">{{ data.name }}</p>
    <p class="time">{{ data.created_at }}</p>

    <!-- v-if="data.status === 5" -->
    <div class="btnGroup center" v-if="data.status === 5" >
      <el-button color="#333333" @click="router.push('/videoshow?url=' + data.video_path)">
        预览
      </el-button>
      <el-button color="#333333" @click="getVideoArrayBuffer(data.video_path,data.name)" >
        下载
      </el-button>
    </div>

    <div class="btnGroup center" v-else />
  </div>
</template>

<script setup>
import { ipcRenderer } from 'electron';
import { useRouter } from 'vue-router';
import { Loading } from '@element-plus/icons-vue';
import { useProjectStore, useLiveStore } from '../../stores';
import { setLiveRoom, liveRoomInfo, delProJect, startLive } from '../../api/index';
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

const router = useRouter();

// 删除
function delect() {
  ElMessageBox.confirm('是否删除短视频?', 'Warning', {
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
// 下载视频到本地
function getVideoArrayBuffer(url, name) {
  var xhr = new XMLHttpRequest()
  // let qweurl = 'https://zwklt.oss-cn-beijing.aliyuncs.com/video/13/2023-08-28/T3cSN5hAlQrjOHDvm8oP.mp4'
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer' // 返回类型blob
  xhr.onload = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const blob = this.response
      console.log(blob)
      // 转换一个blob链接
      // 注: URL.createObjectURL() 静态方法会创建一个 DOMString(DOMString 是一个UTF-16字符串)，
      // 其中包含一个表示参数中给出的对象的URL。这个URL的生命周期和创建它的窗口中的document绑定
      const downLoadUrl = window.URL.createObjectURL(new Blob([blob], {
        type: 'video/mp4'
      }))
      // 视频的type是video/mp4，图片是image/jpeg
      // 01.创建a标签
      const a = document.createElement('a')
      // 02.给a标签的属性download设定名称
      a.download = name
      // 03.设置下载的文件名
      a.href = downLoadUrl
      // 04.对a标签做一个隐藏处理
      a.style.display = 'none'
      // 05.向文档中添加a标签
      document.body.appendChild(a)
      // 06.启动点击事件
      a.click()
      // 07.下载完毕删除此标签
      a.remove()
    }
  }
  xhr.send()
}

// 状态
function transCode(code) {
  switch (code) {
    case 1:
      return '合成中';
    case 2:
      return '合成中';
    case 3:
      return '合成中';
    case 4:
      return '合成中';
    case 5:
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
</style>
