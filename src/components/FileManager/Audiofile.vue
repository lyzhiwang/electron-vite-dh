<template>
  <div class="fileindex">
    <!-- 650px -->
    <el-dialog
      v-model="props.isvisible"
      title="文件管理"
      width="50%"
      @close="closedialog"
    >
      <div class="file_content">
        <template v-if="list && list.length">
          <div
            v-for="(item, index) in list"
            :key="index"
            :class="['img-box', select.index === index ? 'img-box-border' : '']"
            @dblclick="changeItem(item, index)"
            @touchend="changeItem(item, index)"
            @mouseover="mouserOver(item, index)"
          >
            <!-- <img :src="item.path" /> -->
            <div class="img-info">
              <!-- <p :title="item.name" class="name">{{ item.name }}</p>
              <p>
                <span>{{ item.size }}</span>
                <span>{{ item.created_at }}</span>
              </p> -->

              <div>{{ item.name }}</div>
              <!-- <div>{{ item.size  }}</div> -->
              <div>{{ item.created_at }}</div>
            </div>
          </div>
        </template>
        <!-- 空 -->
        <template v-else>
          <span class="empty_box">暂无数据</span>
        </template>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div class="eluploadsty">
            <el-upload
              action="https://zwshuziren.oss-cn-beijing.aliyuncs.com"
              :show-file-list="false"
              :http-request="ossUpload"
              :on-success="uploadSuccess"
              :before-upload="beforeAvatarUpload"
              :accept="'img'"
            >
              <el-button type="primary" class="el-icon-upload">
                本地上传
              </el-button>
            </el-upload>
          </div>
          <div class="eluploadsty">
            <el-button type="primary" plain @click="nextPage">
              下一页
            </el-button>
          </div>
          <div class="eluploadsty">
            <el-button type="primary" plain @click="lastPage">
              上一页
            </el-button>
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import OSS from 'ali-oss';
import { format } from 'date-fns';
import { sampleSize } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { useProjectStore } from '../../stores';
import { UploadIndex } from '../../api';

const { ossData } = storeToRefs(useProjectStore());

const props = defineProps({
  // 1: 'img', // 图片
  // 2: 'video', // 完整视频
  // 3: 'video', // 素材视频
  // 4: 'audio', // 配音
  // 5: 'audio', // BGM
  // 6: 'img', // 图片 自定义海报
  // 8: 'text', // 字幕
  // 9: 'img', // 图片 视频素材图片
  // 10: 'video', // 片头
  // 11: 'audio', // 背景音乐库
  // 12: 'img',
  // 13: 'audio' // 配音和字幕
  type: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number || String,
    default: 8,
  },
  isvisible: {
    type: Boolean,
    require: false,
  },
});
const list = ref([
  // {
  //   created_at: "2023-07-31 11:01:40",
  //   id: 59,
  //   name: "jinyuanai.png",
  //   path: "https://static.douyintuoke.cn/2023-07-31/FtEUTo4sWsbTRpGUK5kiAxLk56j3.png",
  //   size: "0.05MB",
  //   storage: 2,
  //   suffix: ".png",
  //   type: 2,
  // },
]); // 背景图列表
const total = ref(0); // 背景图列表
const page = ref(1); // 背景图列表
const current_page = ref(1);
const last_page = ref(1);

// const isdialogVisible = ref(false); // 是否显示弹窗
const select = reactive({
  item: {},
  index: -1,
});

onMounted(() => {
  getList();
});

const emit = defineEmits(['close', 'change']);
// 关闭
function closedialog(val) {
  emit('close');
}

//
function mouserOver(item, index) {
  select.item = item;
  select.index = index;
}
//
function changeItem(item, index) {
  select.item = item;
  select.index = index;
  emit('change', item);
  if (item && item.id && item.path && item.name) toggleDialog();
}
//
function toggleDialog() {
  if (props.isvisible) {
    // 每次打开初始化数据
    page.value = 1;
    select.item = {};
    select.index = -1;
  }
}

// 获取列表
function getList() {
  const params = {
    page: page.value,
    type: props.type,
    size: props.pageSize,
  };
  UploadIndex(params).then((res) => {
    list.value = res.data;
    total.value = res.meta.total;
    current_page.value = res.meta.current_page;
    last_page.value = res.meta.last_page;
  });
}
// 翻页
function lastPage() {
  if (page.value === 1) {
    ElMessage({ type: 'info', message: '当前页面为第一页' });
  } else {
    page.value = page.value - 1;
    getList();
  }
}
// 下一页
function nextPage() {
  if (current_page.value === last_page.value) {
    ElMessage({ type: 'info', message: '当前页面为最后一页' });
  } else {
    page.value = page.value + 1;
    getList();
  }

  // const can = Math.ceil(total.value / pageSize.value);
  // if (can <= page.value) {
  //   ElMessage({ type: 'info', message: '当前页面为最后一页' });
  // } else {
  //   page.value = page.value + 1;
  //   getList();
  // }
}

// 上传音频
function uploadSuccess(res, file) {
  console.log('上传音频结果', res);
  if (res.code === 0) {
    page.value = 1;
    getList();
    ElMessage({ type: 'success', message: '上传录音成功！' });
  } else {
    ElMessage({ type: 'warning', message: '上传录音失败！' });
  }
}

// 上传前校验
async function beforeAvatarUpload(rawFile) {
  var isType = true
  if(rawFile.type === 'audio/mp3' || rawFile.type === 'audio/mpeg' ||rawFile.type === 'audio/wav'){
    isType = true
  } else {
    isType = false
  }
  if (isType === false) {
    ElMessage.error('上传音频格式类型必须为mp3 、mpeg 或者 wav 格式!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('文件大小不能超过2MB!');
    return false;
  }
  // console.log(isType)
  // console.log(isLt2M)
  // console.log(isType && isLt2M)

  return isType && isLt2M;


  //   const iswh = await ExternalFunction(rawFile);
  //   if (!iswh) {
  //     ElMessage.error(
  //       '上传图片尺寸必须满足 竖屏 1080*1920 或者 横屏 3413*1920 !'
  //     );
  //     return false;
  //   }
  //   return isType && isLt2M && iswh;
  // return isLt2M;
}

function ExternalFunction(rawFile) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = function (e) {
      let image = new Image();
      image.src = reader.result;
      image.onload = function (e) {
        if (
          (image.width === 1080 && image.height === 1920) ||
          (image.width === 3413 && image.height === 1920)
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
    };
  });
}

//
function randomString(len) {
  const charSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return sampleSize(charSet, len).toString().replace(/,/g, '');
}
//
function getSuffix(name) {
  const arr = name.split('.');
  return '.' + arr[arr.length - 1];
}
//
function getRandomName(name) {
  return randomString(20) + getSuffix(name);
}
//
function ossUpload(e) {
  const { file, onProgress, onSuccess, onError } = e;
  const client = new OSS(ossData.value.base);
  // 定义上传方法
  async function multipartUpload() {
    try {
      // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
      // 您可以通过自定义文件名（例如exampleobject.txt）或目录（例如exampledir/exampleobject.txt）的形式，实现将文件上传到当前Bucket或Bucket中的指定目录。
      const { res, data } = await client.multipartUpload(
        `voice/${props.type}/${format(
          new Date(),
          'yyyy-MM-dd'
        )}/${getRandomName(file.name)}`,
        file,
        {
          progress(p, checkpoint) {
            onProgress({ percent: p * 100 });
            // checkpoint参数用于记录上传进度，断点续传上传时将记录的checkpoint参数传入即可。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
            // tempCheckpoint = checkpoint
          },
          parallel: 4,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024,
          meta: { year: 2020, people: 'test' },
          mime: file.type,
          callback: {
            url: ossData.value.callback.callbackUrl,
            // host: 'oss-cn-beijing.aliyuncs.com',
            /* eslint no-template-curly-in-string: [0] */
            body: ossData.value.callback.callbackBody,
            contentType: ossData.value.callback.callbackBodyType,
            customValue: {
              filename: file.name,
              type: String(props.type),
              suffix: getSuffix(file.name),
            },
          },
        }
      );
      if (res.status === 200 && data.code === 0) {
        onSuccess(data, file);
      } else {
        onError('文件上传失败，服务器端无响应', file);
      }
    } catch (err) {
      console.log(err);
      onError('文件上传失败，请求封装失败', file);
    }
  }
  // 开始分片上传。
  multipartUpload();
}
</script>

<style lang="scss" scoped>
.fileindex {
  position: relative;
  .file_content {
    width: 100%;
    // height: 416px;
    height: 328px;
    border: 1px solid #c5c5c5;
    // border: 1px solid red;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    position: relative;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      font-weight: 600;
      background-color: #fff;
      border-bottom: 1px solid #c5c5c5;
      .el-icon-close {
        color: #9b9b9b;
        font-weight: 600 !important;
        cursor: pointer;
      }
    }

    .img-box {
      position: relative;
      display: flex;
      align-items: center;
      width: calc(50% - 4px);
      //   height: 100px;
      height: 50px;
      margin: 2px;
      background-color: #444444;
      border: 2px solid #333;
      cursor: pointer;
      //   img {
      //     width: 80px;
      //     height: 80px;
      //     margin: 0 10px;
      //   }
      .img-info {
        width: 100%;
        padding: 0px 6px;
        display: flex;
        justify-content: space-between;
        // flex-direction: column;
        // justify-content: center;
        // border: 1px solid red;
        // p {
        //   margin: 0;
        //   line-height: 20px;
        //   span {
        //     color: #409eff;
        //     font-size: 12px;
        //     border: 1px solid red;
        //   }
        // }
        // .name {
        //   font-weight: 700;
        //   color: #409eff;
        // }
      }
    }
    .img-box-border {
      // border: 2px solid red;
      border: 1px solid #409eff;
    }
    .empty_box {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 360px;
      font-size: 20px;
    }
  }
  .dialog-footer {
    // border: 1px solid red;
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: 100%;
    padding: 4px 10px 10px 0px;

    .eluploadsty {
      position: relative;
      // border: 1px solid blue;
      padding: 0;
      margin: 0;
      margin-left: 10px;
    }
    // .el-button {
    //   // height: 31px;
    //   // margin-left: 10px;
    // }
  }
}
</style>
