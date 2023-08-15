<template>
  <div class="file-manager">
    <!-- 文件管理 -->
    <div v-show="isVisible" class="file-list">
      <div class="header">
        <span>文件管理</span>
        <i class="el-icon-close" @click="toggleDialog" />
      </div>

      <div class="content">
        <!-- 音乐 -->
        <template v-if="type === 1 && list && list.length">
          <div
            v-for="(item, index) in list"
            :key="index"
            :class="[
              'img-box',
              'music',
              select.index === index ? 'img-box-border' : '',
            ]"
            @dblclick="changeItem(item, index)"
            @touchend="changeItem(item, index)"
            @mouseover="mouserOver(item, index)"
          >
            <p :title="item.name" class="ellipsis">{{ item.name }}</p>
            <p>{{ item.add_time }}</p>
          </div>
        </template>
        <!-- 图片 -->
        <template v-else-if="type === 2 &&list && list.length">
          <div
            v-for="(item, index) in list"
            v-show="index < 8"
            :key="index"
            :class="['img-box', select.index === index ? 'img-box-border' : '']"
            @dblclick="changeItem(item, index)"
            @touchend="changeItem(item, index)"
            @mouseover="mouserOver(item, index)"
          >
            <img :src="item.path" />
            <div class="img-info ellipsis">
              <p :title="item.name" class="name ellipsis">{{ item.name }}</p>
              <p>
                <span>{{ item.size }}</span>
                <span> - </span>
                <span>{{ item.created_at }}</span>
              </p>
            </div>
          </div>
        </template>

        <!-- 视频 -->
        <template v-else-if="type === 3 &&list && list.length">
          <div
            v-for="(item, index) in list"
            v-show="index < 8"
            :key="index"
            :class="['img-box', select.index === index ? 'img-box-border' : '']"
            @dblclick="changeItem(item, index)"
            @touchend="changeItem(item, index)"
            @mouseover="mouserOver(item, index)"
          >
            <img :src="item.path" />
            <div class="img-info ellipsis">
              <p :title="item.name" class="name ellipsis">{{ item.name }}</p>
              <p>
                <span>{{ item.size }}</span>
                <span> - </span>
                <span>{{ item.created_at }}</span>
              </p>
            </div>
          </div>
        </template>
        <!-- 空 -->
        <template v-else>
          <span class="img-box music">暂无数据</span>
        </template>
      </div>

      <!-- 翻页 -->
      <div class="foot">
        <!-- <el-upload
          :auto-upload="!isInfo"
          :action="upload_url"
          :data="params"
          :headers="headers"
          :before-upload="beforeUpload"
          :on-change="changeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :show-file-list="false"
        >
          <el-button type="primary" size="mini" class="el-icon-upload">
            本地上传
          </el-button>
        </el-upload> -->
        <el-button size="mini" @click="nextPage">下一页</el-button>
        <el-button size="mini" @click="lastPage">上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import OSS from 'ali-oss';
import { format } from 'date-fns';
import { sampleSize } from 'lodash-es';
import { storeToRefs } from 'pinia';
// import { useProjectStore } from '../stores';
import { useProjectStore } from '../../stores/project';
const { ossData } = storeToRefs(useProjectStore());
  // type
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
const props = defineProps({
    params: {
      type: Object,
      default() {
        return { type: 3 }
      }
    },
    // beforeUpload: {
    //     type: Function
    // },
    // uploadSuccess: {
    //     type: Function
    // },
    showFileList: {
        type: Boolean,
        default: true
    },
    limit: {
        type: Number,
        default: 1
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: '.mp3,.wav',
    }
})

// watch(){
//   isVisible: function(val) {
//       if (val) {
//         this.getList()
//       }
//     }
// }
//
// const isVisible = ref(false); // 是否显示文件弹窗
// watch(isVisible, (newValue, oldValue) => {
//     console.log('watch 已触发', newValue)
// })

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

// 超出上传限制时的钩子函数
function handleExceed(files) {
  console.log('超出上传限制', files);
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
        `voice/${props.params.type}/${format(
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
              type: String(props.params.type),
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
<style lang="scss" rel="stylesheet/scss" scoped>
// @import '@/styles/variables.scss';
.file-manager {
  .file-list {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 698px;
    height: 509px;
    color: #595959;
    // font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    background: #c5c5c5;
    border: 1px solid #c5c5c5;
    transform: translate(-50%, -50%);
    transition: transform 1000ms ease-in, opacity 150ms ease-in;
    z-index: 999;
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
    .content {
      display: flex;
      flex-wrap: wrap;
      max-height: 416px;
      overflow-y: auto;
      .img-box {
        position: relative;
        display: flex;
        align-items: center;
        width: calc(50% - 4px);
        height: 100px;
        margin: 2px;
        background-color: #fff;
        border: 2px solid #fff;
        img {
          width: 80px;
          height: 80px;
          margin: 0 10px;
        }
        .img-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          p {
            margin: 0;
            line-height: 20px;
            span {
              color: #929292;
              font-size: 12px;
            }
          }
          .name {
            font-weight: 700;
          }
        }
        .el-button {
          position: absolute;
          right: 10px;
          bottom: 6px;
          padding: 4px 11px;
        }
      }
      .img-box-border {
        // border: 2px solid $mainColor;
        border: 2px solid red;
      }
      .music {
        justify-content: space-between;
        height: 48px;
        padding: 0 10px;
      }
    }
    .foot {
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      width: 100%;
      padding: 4px 10px;
      background-color: #fff;
      border-top: 1px solid #c5c5c5;
      .el-button {
        height: 31px;
        margin-left: 10px;
      }
    }
  }
}
</style>
