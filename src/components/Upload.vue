<template>
    <el-upload
        action="https://zwshuziren.oss-cn-beijing.aliyuncs.com"
        :show-file-list="showFileList"
        :multiple="multiple"
        :http-request="ossUpload"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
        :on-success="uploadSuccess"
        :accept="accept"
    >
        <slot></slot>
    </el-upload>
</template>

<script setup>
import OSS from 'ali-oss'
import { format } from 'date-fns'
import { sampleSize } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../stores'

const { ossData } = storeToRefs(useProjectStore())
const props = defineProps({
    params: {
      type: Object,
      default() {
        return { type: 3 }
      }
    },
    beforeUpload: {
        type: Function
    },
    uploadSuccess: {
        type: Function
    },
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

function randomString(len) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return sampleSize(charSet, len).toString().replace(/,/g, '')
}
function getSuffix(name) {
    const arr = name.split('.')
    return '.' + arr[arr.length - 1]
}
function getRandomName(name) {
    return randomString(20) + getSuffix(name)
}
function handleExceed(files){
    // 超出上传限制时的钩子函数
    console.log('超出上传限制', files)
}
function ossUpload(e){
    const { file, onProgress, onSuccess, onError } = e
    const client = new OSS(ossData.value.base)
    // 定义上传方法
    async function multipartUpload() {
        try {
          // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
          // 您可以通过自定义文件名（例如exampleobject.txt）或目录（例如exampledir/exampleobject.txt）的形式，实现将文件上传到当前Bucket或Bucket中的指定目录。
          const { res, data } = await client.multipartUpload(`voice/${props.params.type}/${format(new Date(), 'yyyy-MM-dd')}/${getRandomName(file.name)}`, file, {
            progress(p, checkpoint) {
              onProgress({ percent: p * 100 })
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
                suffix: getSuffix(file.name)
              }
            }
          })
          if (res.status === 200 && data.code === 0) {
            onSuccess(data, file)
          } else {
            onError('文件上传失败，服务器端无响应', file)
          }
        } catch (err) {
          console.log(err)
          onError('文件上传失败，请求封装失败', file)
        }
    }
    // 开始分片上传。
    multipartUpload()
}
</script>