<template>
  <div class="welcomedata">
    <el-form
      ref="ruleRefWel"
      :model="form_data"
      :style="'width:300px'"
      status-icon
      scroll-to-error
    >
      <!-- <el-form-item label="触发条件" prop="describe">
        <div class="count_unit">全场</div>
      </el-form-item> -->
      <el-form-item 
        label="回复频率" 
        prop="time"
        :rules="{
          validator: validateKeyword,
          required: true,
          message: '请输入回复频率',
          trigger: 'blur',
        }"
        >
        <div class="count">
          <div class="count_unit">每</div>
          <el-input-number
            v-model="form_data_time"
            :min="1"
            :max="60"
            @change="handleChangetime"
          />
          <div class="count_unit_two">分钟</div>
          <el-input-number
            v-model="form_data_number"
            :min="1"
            :max="60"
            @change="handleChangenumber"
          />
          <div class="count_unit">次</div>
        </div>
      </el-form-item>
      <el-form-item 
        label="选择音色" 
        prop="timbre_id"
        :rules="{
          validator: validateTimbre,
          required: true,
          message: '请选择音色',
          trigger: 'blur',
        }"
        >
        <div class="timbre_list_two">
          <el-radio-group v-model="temporary_timbre">
            <div v-for="(item, index) in timbre_list" :key="index">
              <el-radio-button :label="item.id">
                <div class="group_item">
                  <div class="item_left">
                    <!-- <icon type="" :size="23" color="" /> -->
                    <el-icon class="autionIcon">
                      <VideoPlay />
                    </el-icon>
                    <div class="item_left_content">
                      {{ item.name }}&nbsp;&nbsp;({{ item.type }})
                    </div>
                  </div>
                  <div v-if="item.audition_url" class="item_right" @click.stop="playmusic(item)">
                    <el-icon class="autionIcon">
                      <VideoPlay />
                    </el-icon>
                  </div>
                </div>
              </el-radio-button>
            </div>
          </el-radio-group>
        </div>
      </el-form-item>

      <div class="keyword_operate">
        <el-button type="primary" @click="submitForm(ruleRefWel)">
          立即提交
        </el-button>
      </div>
    </el-form>


    <audio id="timbresound" :src="timbreSoundUrl" ref="timbreAudio" @ended="timbreanswerEnd" />
  </div>
</template>

<script lang="ts" setup>
import { getTimbre, getWelcome, postWelcome } from '../../api/index';
import { ref, reactive, onMounted } from 'vue';
import { VideoPlay } from '@element-plus/icons-vue';
import { ElMessage, ElLoading } from 'element-plus';
import type { FormInstance } from 'element-plus';
const ruleRefWel = ref<FormInstance>();
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const form_data = reactive<any>({
  id: '',
  project_id: '', // 项目id
  timbre_id: 2, // 音色id
  time: 1, // 时间(分)
  number: 1, // 次数
});

const project_id = ref<any>('11');
const page_type = ref<any>('1');
const form_data_time = ref(1);
const form_data_number = ref(1);



onMounted(() => {
  // project_id.value = 11
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const { pid, pagetype } = route.query;
  project_id.value = pid;
  page_type.value = pagetype;

  gettimbrelist();
  getwelcomedetail(project_id);
  setTimeout(() => {
    loading.close();
  }, 500);
});

// 临时值 选中音色
const temporary_timbre = ref('1');

// 音色列表
const timbre_list = reactive<any>([
  // {
  //   id: 1,
  //   name: '雅婷',
  //   voice: 'xiaoyun',// 标识
  //   type: '知性女生',//类型
  //   scene: '通用场景',//场景
  //   icons: 'nva',
  //   audition_url:"",
  // }
]);

const validateKeyword = (rule: any, value: any, callback: any) => {
  if (
    form_data.time &&
    form_data.time > 0 &&
    form_data.number &&
    form_data.number > 0
  ) {
    callback();
  } else {
    callback(new Error('时间或次数不能为空'));
  }
};
const validateTimbre = (rule: any, value: any, callback: any) => {
  if (form_data.timbre_id) {
    callback();
  } else {
    callback(new Error('请选择音色'));
  }
};

// const rules = reactive<FormRules>({
//   time: [{ validator: validateKeyword, trigger: 'blur' }],
//   timbre_id: [
//     {
//       validator: validateTimbre,
//       required: true,
//       message: '请选择音色',
//       trigger,
//     },
//   ],
// });

//
const handleChangetime = async (value: any) => {
  form_data.time = value;
};
//
const handleChangenumber = async (value: any) => {
  form_data.number = value;
};

// 获取音色列表
const gettimbrelist = async () => {
  getTimbre().then((res) => {
    // console.log('获取音色列表')
    // console.log(res)
    for (var i = 0; i < res.data.length; i++) {
      timbre_list.push(res.data[i]);
    }
  });
};

// 获取欢迎语详情
const getwelcomedetail = async (project_id: any) => {
  getWelcome(project_id.value).then((res) => {
    // console.log('获取欢迎语详情');
    // console.log(res);
    if (res.data) {
      form_data.id = res.data.id;
      form_data.project_id = res.data.project_id;
      form_data.timbre_id = res.data.timbre_id;
      form_data.time = res.data.time;
      form_data_time.value = res.data.time;
      form_data.number = res.data.number;
      form_data_number.value = res.data.number;
      temporary_timbre.value = res.data.timbre_id;
    } else {
      (form_data.timbre_id = timbre_list[0].id),
        (form_data.time = 1),
        (form_data_time.value = 1),
        (form_data.number = 1),
        (form_data_number.value = 1),
        (form_data.value = project_id.value);
      temporary_timbre.value = timbre_list[0].id;
    }
  });
};

// 提交表单 设置欢迎语
const submitForm = async (form_data: any) => {
  // console.log('qqqqqqqqqqqqqqqq');
  // console.log(form_data);
  if (!form_data) return;
  await form_data.validate((valid: any, fields: any) => {
    if (valid) {
      // console.log('成功', valid);
      var params = {
        timbre_id: temporary_timbre.value,
        time: form_data_time.value,
        number: form_data_number.value,
        project_id: project_id.value,
      };
      postWelcome(params).then((res) => {
        // console.log(res);
        ElMessage({ type: 'success', message: '设置成功！' });
        if (page_type.value === '1') {
          router.push('/home');
        } else {
          router.push('/project');
        }
      });
    } else {
      console.log('error submit!', fields);
    }
  });
};


const timbreAudio = ref()
const timbreSoundUrl = ref('');
const isAudio = ref<Boolean>(true)
// 播放音色音频
const playmusic = async (item: any) => {
  // console.log('播放音色音频');
  // console.log(item);
  if(isAudio.value){
    isAudio.value = false
    if(item.audition_url){
      timbreSoundUrl.value = item.audition_url
      timbreAudio.value.autoplay = true
      // const music = new Audio(item.audition_url);
      // music.play();
      // const audio = document.getElementById('audio')
      // audio.load()
      // audio.pause()
    }
  } else {
    // timbreSoundUrl.value = ''
    // timbreAudio.value.autoplay = false
    // // isAudio.value = false、
    // isAudio.value = false
    
    if(timbreSoundUrl.value){
      ElMessage({ type: 'error', message: '请等待当前音频播放完毕！' });
    } else {
      ElMessage({ type: 'error', message: '选中音频无法播放！' });
    }
  }
};

const timbreanswerEnd = async (item: any) => {
  // console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
  isAudio.value = true
  timbreSoundUrl.value = ''
  timbreAudio.value.autoplay = false
}
</script>

<style lang="scss" scoped>
.welcomedata {
  background-color: rgb(61, 61, 59);
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px 0;
  .count {
    display: flex;
    align-items: center;
  }
  .count_unit {
    width: 40px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
    line-height: 6px;
  }

  .count_unit_two {
    width: 80px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
    line-height: 6px;
  }

  .keyword_operate {
    padding-left: 130px;
  }

}

.timbre_list_two {
  // border: 1px solid blue;
  .group_item {
    width: 300px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border: 1px solid red;
    margin-top: 2px;
    .item_left {
      display: flex;
      align-items: center;
      .item_left_content {
        margin-left: 3px;
      }
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

:deep(.el-form-item__label){
  width: 130px;
  // border: 1px solid red;
}

.autionIcon{
  font-size: 20px;
}
</style>
