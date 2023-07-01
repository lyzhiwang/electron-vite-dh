<template>
  <div class="questions">
    <div class="formdata_list">
      <div>
        <el-form
          ref="ruleRef"
          :model="formdata"
          label-width="100px"
          :style="'width:500px'"
        >
          <!-- status-icon scroll-to-error -->
          <div
            v-for="(item, index) in formdata"
            :key="index"
            class="formdata_item"
          >
            <div class="item_left">
              <!-- <el-form-item label="问题描述" :prop="'name'">
                <el-input v-model="item.name" maxlength="30" show-word-limit placeholder="请输入问题描述" />
              </el-form-item> -->

              <el-form-item
                :label="'问题描述'"
                :prop="index + '.name'"
                show-word-limit
                placeholder="请输入问题描述"
                :rules="{
                  validator: validateName,
                  required: true,
                  message: '请输入问题描述',
                  trigger: 'blur',
                }"
              >
                <el-input v-model="item.name" />
              </el-form-item>

              <el-form-item
                label = "关键词"
                :prop="index + '.keywords'"
                :rules="{
                  validator: validateKeyword,
                  required: true,
                  trigger: 'blur',
                }"
              > 
                <div class="tag_lest">
                  <div v-if="item.keywords" class="tag_item">
                    <div
                      v-for="tag in item.keywords"
                      :key="tag"
                      class="tag_item_item"
                    >
                      <el-tag
                        type="info"
                        size="large"
                        class="mx-1"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag, index)"
                      >
                        {{ tag }}
                      </el-tag>
                    </div>
                  </div>

                  <div class="tag_item_btn">
                    <el-button
                      v-if="!item.is_add && item.keywords.length < 5"
                      class="button-new-tag ml-1"
                      @click="showInput(index)"
                    >
                      + 新的关键词
                    </el-button>
                  </div>

                  <el-input
                    v-if="item.is_add"
                    ref="InputRef"
                    maxlength="40"
                    show-word-limit
                    v-model="inputValue"
                    class="add_input"
                    @keyup.enter="handleInputConfirm(index)"
                    @blur="handleInputConfirm(index)"
                  />
                </div>
              </el-form-item>

              <el-form-item 
                label="回复内容" 
                :prop="index + '.audio'"
                :rules="{
                  validator: validateAudio,
                  required: true,
                  trigger: 'blur',
                }"
              >
                <div class="reply_content">
                  <div class="up_header">
                    <div class="left_text">上传附件</div>
                    <Upload
                      :beforeUpload="beforeUpload"
                      :uploadSuccess="uploadSuccess"
                      :showFileList="false"
                    >
                      <el-button
                        v-if="item.audio.length < 5"
                        type="primary"
                        class="upload"
                        @click="setindex(index)"
                      >
                        <el-icon class="insertIcon">
                          <CirclePlusFilled />
                        </el-icon>
                        <span>上传录音</span>
                      </el-button>
                    </Upload>
                    <!-- <el-button
                      v-if="item.audio.length < 5"
                      type="primary"
                      class="upload"
                      @click="setindex(index)"
                    >
                      <el-icon class="insertIcon">
                        <CirclePlusFilled />
                      </el-icon>
                      <span>上传录音</span>
                    </el-button> -->
                  </div>

                  <div v-if="item.audio.length > 0" class="audio_list">
                    <div
                      v-for="(audio_item, audio_index) in item.audio"
                      :key="audio_index"
                      class="audio_list_item"
                    >
                      <div class="item_name">
                        {{ audio_index + 1 }} {{ audio_item.name }}
                      </div>
                      <div class="item_time">{{ audio_item.created_at }}</div>
                      <div
                        @click="del_audio(index, audio_item)"
                        class="item_del"
                      >
                        删除
                      </div>
                    </div>
                  </div>

                  <div class="prompt_tip">
                    *只能上传wav, mp3, mp4文件，且不超过10MB
                  </div>
                </div>
              </el-form-item>
            </div>

            <div class="operate_btn">
              <el-button
                v-if="index > 0"
                type="danger"
                @click="delitem(item, index)"
              >
                删除
              </el-button>
            </div>
          </div>

          <div class="keyword_operate">
            <el-button
              v-if="formdata.length < 8"
              color="#333333"
              @click="addform"
            >
              添加新问题
            </el-button>
            <el-button type="primary" @click="submitform(ruleRef)">
              立即提交
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, onMounted } from 'vue';
import {
  getInteract,
  postInteract,
  delInteract,
  updateInteract,
  keywordInteract,
} from '../../api/index';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import type { FormInstance, ElInput } from 'element-plus';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useProjectStore } from '../../stores'
const ruleRef = ref<FormInstance>();
const route = useRoute()
const router = useRouter()
const project = useProjectStore()

// const formdata = reactive<any>([
//   // {
//   //   id: '',
//   //   name: '', // 问题描述
//   //   project_id: '',
//   //   keyword: ['Tag 1', 'Tag 2'], // 关键词
//   //   audio: [
//   //     {
//   //       id: '1',
//   //       name: '测试1',
//   //       created_at: '2023.09.29 15:30',
//   //     },
//   //   ], // 回复内容 上传列表
//   //   is_add: false, // 是否准备添加标签
//   // },
// ]);

const formdata = reactive<any>([]);
const formdata_two = reactive<any>([]);

const project_id = ref<any>('11');
const page_type = ref<any>('1');

onMounted(() => {
  // project_id.value = 11
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  const { pid, pagetype } = route.query
  project_id.value = pid
  page_type.value = pagetype
  getlist(project_id);
  project.queryAliToken()
  setTimeout(() => {
    loading.close()
  }, 500)
});



const validateName = (rule: any, value: any, callback: any) => {
  // console.log('请输入问题描述');
  // console.log(value);
  if (value === '' || value === undefined || value === null) {
    callback(new Error('请输入问题描述'));
  } else {
    callback();
  }
};
const validateKeyword = (rule: any, value: any, callback: any) => {
  // console.log('关键词校验');
  // console.log(value.length);
  if (value.length === 0) {
    callback(new Error('关键词至少添加一个'));
  } else {
    callback();
  }
};
const validateAudio = (rule: any, value: any, callback: any) => {
  // console.log('音频校验');
  // console.log(value.length);
  if (value.length === 0) {
    callback(new Error('音频至少上传一个'));
  } else {
    callback();
  }
};


// 删除问题
const delitem = async (item: any, index: any) => {
  if (item.id) {
    ElMessageBox.confirm('是否删除已提交问题?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    })
      .then(() => {
        delInteract({ id: item.id }).then((res) => {
          // console.log('删除已提交问题');
          // console.log(res);
          formdata.splice(formdata.indexOf(item), 1);
          ElMessage({ message: '删除成功！' });
        });
      })
      .catch(() => {
        console.log('已取消');
      });
  } else {
    // console.log('删除问题');
    formdata.splice(formdata.indexOf(item), 1);
    ElMessage({ message: '删除成功！' });
  }
};

// 添加新问题
const addform = async (qwe: any) => {
  const item_data: any = {
    id: '', //
    project_id: project_id.value,
    name: '', // 问题描述
    keywords: [], // 关键词
    audio: [], // 回复内容 上传列表
    is_add: false, // 是否准备添加标签
  };
  // console.log('添加新问题');
  formdata.push(item_data);
};

// 获取问题列表
const getlist = async (project_id: any) => {
  getInteract(project_id.value).then((res) => {
    // console.log('获取问题列表');
    // console.log(res);
    // formdata = []
    formdata.length = 0
    formdata_two.length = 0
    if (res.data.length === 0) {
      const item_data: any = {
        id: '',
        project_id: project_id.value, //
        name: '', // 问题描述
        keywords: [], // 关键词
        audio: [], // 回复内容 上传列表
        is_add: false, // 是否准备添加标签
      };
      formdata.push(item_data);
    } else {
      for (var i = 0; i < res.data.length; i++) {
        const item_data_two: any = {
          id: res.data[i].id,
          project_id: project_id,
          name: res.data[i].name,
          keywords: res.data[i].keywords,
          audio: res.data[i].audio,
          is_add: false,
        };
        formdata.push(item_data_two);
        formdata_two.push(JSON.parse(JSON.stringify(item_data_two)));
      }
    }
  });
};

// 提交表单
const submitform = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      for (var j = 0; j < formdata.length; j++) {
        if (formdata[j].id) {
          // console.log(contrastformdata(formdata[j]))
          if(contrastformdata(formdata[j]) === false){
            updateInteract(handleformdata(formdata[j])).then((res) => {
              // console.log('更新表单', j);
              // console.log(res);
            });
          }
          // updateInteract(handleformdata(formdata[j])).then((res) => {
          //   console.log('更新表单', j);
          //   console.log(res);
          // });
        } else {
          postInteract(handleformdata(formdata[j])).then((res) => {
            // console.log('提交表单', j);
            // console.log(res);
          });
        }
      }

      setTimeout(() => {
        // getlist(project_id)
        loading.close()
        ElMessage({ type: 'success', message: '更新成功！' });

        if(page_type.value==='1'){
          router.push('/')
        } else {
          router.push('/project')
        }
      }, 1000)
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 
const handleformdata = (data:any) => {
  const dataform = data
  const audio_arr = reactive<any>([])
  for (var k = 0; k < dataform.audio.length; k++){
    audio_arr.push(dataform.audio[k].id)
  }
  var params = {
    project_id: project_id.value,
    name: data.name,
    keywords: data.keywords,
    audio: audio_arr,
    id : data.id
  }
  
  if(params.id === ''){
    delete params.id
  }

  return params
}

// 对比  待优化
const contrastformdata = (data:any) =>{
  for (var a = 0; a < formdata_two.length; a++){
    if(formdata_two[a].id === data.id){
      if(formdata_two[a].name !== data.name){
        // console.log('进入name')
        return false
      }
      if(formdata_two[a].keywords.length !== data.keywords.length){
        // console.log('关键词数量不一致')
        return false
      } else {
        for (var b = 0; b < formdata_two[a].keywords.length; b++){
          if((formdata_two[a].keywords[b] !== data.keywords[b])){
            // console.log('关键词不一致')
            return false
          }
        }
      }

      if(formdata_two[a].audio.length !== data.audio.length){
        // console.log('音频数量不一致')
        return false
      } else {
        for (var c = 0; c < formdata_two[a].audio.length; c++){
          if((formdata_two[a].audio[c].id !== data.audio[c].id)){
            // console.log('音频不一致')
            return false
          }
        }
      }

    }
  }

  return true
}

// 标签------------------------
const inputValue = ref('');
const InputRef = ref<InstanceType<typeof ElInput>>();

// 删除标签
const handleClose = (tag: string, index: any) => {
  // console.log('删除标签')
  formdata[index].keywords.splice(formdata[index].keywords.indexOf(tag), 1);
};
// 隐藏添加按钮，显示添加输入框
const showInput = (index: any) => {
  formdata[index].is_add = true;

  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
// 添加小标签
const handleInputConfirm = (index: any) => {
  if (inputValue.value) {
    formdata[index].keywords.push(inputValue.value);
  }
  formdata[index].is_add = false;
  inputValue.value = '';
};


// ----------------------------------------------------------
const index_audio = ref<any>('0');
// 上传索引
const setindex = (index: any) => {
  // console.log('上传索引');
  // console.log(index);
  index_audio.value = index;
  if (formdata[index].audio.length >= 8) {
    ElMessage({ type: 'warning', message: '最多上传8个附件！' });
    return false;
  }
  // 测试用
  // const item_data: any = {
  //   created_at: '2023-06-27 15:34:08',
  //   id: 21,
  //   name: 'test.mp3',
  //   path: 'https://zwshuziren.oss-cn-beijing.aliyuncs.com/voice/3/2023-06-27/olcENGQA4x9gaMKsPqJU.mp3',
  //   size: '0.12MB',
  //   storage: 3,
  //   suffix: '.mp3',
  //   type: '3',
  // };
  // formdata[index_audio.value].audio.push(item_data);
};
// 删除上传音频
const del_audio = (index: any, audio_item: any) => {
  // console.log(index);
  // console.log(audio_item);
  formdata[index].audio.splice(formdata[index].audio.indexOf(audio_item), 1);
};
// 上传音频 前置
function beforeUpload() {
  if (formdata[index_audio.value].audio.length >= 8) {
    ElMessage({ type: 'warning', message: '最多上传8个附件！' });
    return false;
  }
}
// 上传音频
function uploadSuccess(res: any, file: any) {
  // console.log('上传音频结果', res);
  if (res.data.id) {
    // for (var a = 0; a < formdata[index_audio.value].audio.length; a++){
    //   if(formdata[index_audio.value].audio[a] !== res.data.id){
    //     formdata[index_audio.value].audio.push(res.data);
    //     ElMessage({ type: 'success', message: '上传录音成功！' });
    //   }
    // }

    formdata[index_audio.value].audio.push(res.data);
    ElMessage({ type: 'success', message: '上传录音成功！' });

  } else {
    ElMessage({ type: 'warning', message: '上传录音失败！' });
  }
}
// -------------------------------------------------------------------
</script>

<style lang="scss" scoped>
.questions {
  .formdata_list {
    .formdata_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: rgb(61, 61, 59);
      border-radius: 10px;
      margin-bottom: 10px;
      padding: 10px 0;
      width: 75vw;
      padding-right: 10vw;
      .item_left {
        .tag_lest {
          // border: 1px solid red;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .tag_item {
            // height: 36px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            // border: 1px solid green;
            .tag_item_item {
              margin-right: 20px;
              margin-bottom: 6px;
              // border: 1px solid blue;
            }
          }
          .tag_item_btn {
            position: relative;
            top: -3px;
          }
        }

        .reply_content {
          background-color: rgb(77, 82, 82);
          border-radius: 5px;
          width: 450px;

          .up_header {
            width: 450px;
            height: 50px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            .left_text {
              font-size: 14px;
              font-family: Microsoft YaHei, Microsoft YaHei-Regular;
              font-weight: 400;
              text-align: left;
              color: #cccccc;
              line-height: 6px;
            }
          }
          .audio_list {
            width: 450px;
            // border: 1px solid blue;
            margin-top: 10px;
            .audio_list_item {
              height: 40px;
              display: flex;
              justify-content: space-between;
              padding: 2px 20px;
              .item_name {
                font-size: 14px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                text-align: left;
                color: #ffffff;
                line-height: 6px;
              }
              .item_time {
                font-size: 14px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                text-align: left;
                color: #ffffff;
                line-height: 6px;
              }
              .item_del {
                font-size: 14px;
                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                font-weight: 400;
                text-align: left;
                color: #ffffff;
                line-height: 6px;
                cursor: pointer;
              }
            }
          }
        }
        .prompt_tip {
          color: #ffffff;
          margin-top: 5px;
          padding-left: 10px;
        }
      }
      .operate_btn {
        margin-left: 1px;
      }
    }

    .keyword_operate {
      padding-left: 125px;
    }
  }
}

:deep(.el-input) {
  .el-input__wrapper {
    background: #1a1a1a;
    border: 1px solid rgb(88, 86, 86);
    // box-shadow: none;
  }
}

.el-form-item__content {
  width: 300px !important;
  .el-input {
    width: 300px !important;
    .el-input__wrapper {
      width: 300px !important;
      .el-input__inner {
        width: 300px !important;
      }
    }
  }
}
</style>
