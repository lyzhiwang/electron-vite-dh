<template>
  <div class="questions">
    <div class="formdata_list">
      <div v-for="(item, index) in formdata" :key="index" class="formdata_item">
        <div class="item_left">
          <el-form
            ref="form"
            :model="item"
            label-width="100px"
            :style="'width:500px'"
            :rules="rules"
            status-icon
            scroll-to-error
          >
            <el-form-item label="问题描述" prop="describe">
              <el-input v-model="item.describe" placeholder="请输入问题描述" />
            </el-form-item>

            <el-form-item label="关键词">
              <!-- <el-tag
                v-for="tag in item.keyword"
                type="info"
                size="large"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleClose(tag, index)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="ml-1 w-20"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag ml-1" @click="showInput">
                + 新的关键词
              </el-button> -->

              <div class="tag_lest">
                <div v-for="tag in item.keyword" :key="tag" class="tag_item">
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

                <div v-if="item.keyword.length<6 && !item.is_add" class="tag_item_btn">
                  <el-button class="button-new-tag ml-1" @click="showInput(index)">
                    + 新的关键词
                  </el-button>
                </div>
              </div>

              <el-input
                v-if="item.is_add"
                ref="InputRef"
                v-model="inputValue"
                class="ml-1 w-20 add_input"
                @keyup.enter="handleInputConfirm(index)"
                @blur="handleInputConfirm(index)"
              />
            </el-form-item>

            <el-form-item label="回复内容">
              <div class="reply_content">
                <div class="">
                  <div class="">
                    <div class="">上传附件</div>
                    <div class="">
                      <el-upload
                        v-model:file-list="fileList"
                        class="upload-demo"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                        :on-change="handleChange"
                      >
                        
                        <div>
                          <el-button type="primary">点击上传</el-button>
                        </div>
                        <!-- <template #tip>
                            <div class="el-upload__tip">
                              jpg/png files with a size less than 500kb
                            </div>
                          </template> -->
                      </el-upload>
                    </div>
                  </div>
                  <div class=""></div>
                </div>
                <div class="prompt_tip">
                  *只能上传wav, mp3, mp4文件，且不超过10MB
                </div>
              </div>
            </el-form-item>
          </el-form>
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
        <el-button v-if="formdata.length < 8" color="#333333" @click="addform">
          添加新问题
        </el-button>
        <el-button type="primary" @click="submitform"> 
          立即提交 
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick,onMounted } from 'vue';
import { postinteract, updateinteract, keywordinteract } from '../../api/index'
import { ElInput } from 'element-plus';
import type { UploadProps, UploadUserFile } from 'element-plus';
const trigger = ['blur', 'change'];

const formdata = reactive<any>([
  {
    describe: '', // 问题描述
    keyword: ['Tag 1', 'Tag 2'], // 关键词
    content: [], // 回复内容 上传列表
    is_add:false,// 是否准备添加标签
  },
])


const rules = reactive({
  describe: [{ required: true, message: '请输入问题描述', trigger }],
  // keyword: [{ required: true, message: '请输入关键词', trigger }],
});

// 删除
const delitem = async (item: any, index: any) => {
  console.log('删除');
  formdata.splice(formdata.indexOf(item), 1);
};

// 添加新问题
const addform = async (qwe: any) => {
  const item_data: any = {
    describe: '', // 问题描述
    keyword: [], // 关键词
    content: [], // 回复内容 上传列表
    is_add:false
  };
  console.log('添加新问题');
  formdata.push(item_data);
};

// 提交表单
const submitform = async (form: any) => {
  if (!form) return;
  await form.validate((valid: any, fields: any) => {
    if (valid) {
      console.log('qweqwe', valid);
      // postinteract().then(res=>{
      //   console.log('res')
      //   console.log(res)
      // })
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 标签------------------------
const inputValue = ref('');
// const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3']);
// const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

// 删除标签
const handleClose = (tag: string, index:any) => {
  // console.log('删除标签')
  // console.log(tag)
  // console.log(index)
  formdata[index].keyword.splice(formdata[index].keyword.indexOf(tag), 1);
  // console.log(formdata,formdata.value,"form")
};
// 隐藏添加按钮，显示添加输入框
const showInput = (index:any) => {
  formdata[index].is_add = true
  // inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

// 添加小标签
const handleInputConfirm = (index:any) => {
  if (inputValue.value) {
    // dynamicTags.value.push(inputValue.value);
    formdata[index].keyword.push(inputValue.value)
  }
  formdata[index].is_add = false
  // inputVisible.value = false;
  inputValue.value = '';
};

// -----------------------------------------

// 上传-----------------------------------------
const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
]);

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  fileList.value = fileList.value.slice(-3);
};
// ----------------------------------------------------------------
</script>

<style lang="scss" scoped>
.questions{
  .formdata_list{
    .formdata_item{
      display: flex;
      align-items: center;
      background-color: rgb(61, 61, 59);
      border-radius: 10px;
      margin-bottom: 10px;
      padding: 10px 0;
      .item_left{
        .tag_lest{
          display: flex;
          align-items: center;
          
          .tag_item{
            margin-right: 10px;
            
          }
        }

        .add_input{
          margin-top: 10px;
        }

        .reply_content{
          background-color: rgb(77, 82, 82);
          border-radius: 5px;

          .prompt_tip{
            color: #ffffff;
          }
        }
      }
      .operate_btn{

      }
    }

    .keyword_operate{
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


</style>
