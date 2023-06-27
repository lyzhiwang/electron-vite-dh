<template>
  <div class="welcomedata">
    <el-form
      ref="form_data"
      :model="form_data"
      label-width="100px"
      :style="'width:300px'"
      :rules="rules"
      status-icon
      scroll-to-error
      class="welcomecreate_"
    >
      <!-- <el-form-item label="触发条件" prop="describe">
        <div class="count_unit">全场</div>
      </el-form-item> -->
      <el-form-item label="回复频率" prop="time">
        <div class="count">
          <div class="count_unit">每</div>
          <el-input-number
            v-model="form_data.time"
            :min="1"
            :max="60"
            @change="handleChangetime"
          />
          <div class="count_unit_two">分钟</div>
          <el-input-number
            v-model="form_data.number"
            :min="1"
            :max="60"
            @change="handleChangenumber"
          />
          <div class="count_unit">次</div>
        </div>
      </el-form-item>
      <el-form-item label="选择音色">

        <div class="timbre_list_two">
          <el-radio-group v-model="temporary_timbre">
            <div v-for="(item, index) in timbre_list" :key="index" >
                <el-radio-button :label="item.id">
                  <div class="group_item">
                    <div class="item_left">
                      <!-- <icon type="" :size="23" color="" /> -->
                      <el-icon :size="20">
                        <VideoPlay />
                      </el-icon>
                      <div class="item_left_content">{{ item.name }}&nbsp;&nbsp;({{ item.type }})</div>
                    </div>
                    <div class="item_right" @click.stop="playmusic(item)">
                      <el-icon :size="20">
                        <VideoPlay />
                      </el-icon>
                    </div>
                  </div>
                </el-radio-button>
            </div>
          </el-radio-group>
        </div>
      </el-form-item>

      <!-- <audio ref="audio" /> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm(form_data)">
          立即提交
        </el-button>
      </el-form-item>
    </el-form>

    <!-- <audio ref="audioRef" :src="qweqwe" @canplay="onCanplay(1)"></audio> -->
    <!-- <button class="butt" @click="qweqweq(1)">确认</button> -->
  </div>
</template>

<script lang="ts" setup>

const onCanplay = async (value: number) => {
  // let music1 = new Audio(); //建立一个music1对象
  // music1 = require("../../assets/audio/test.mp3");//通过require引入音频
  // this.$refs.audio.src = music1;//此处的audio为代码ref="audio"中的audio
  // this.$refs.audio.play();//play()为播放函数
}; 

// const audio = ref<HTMLAudioElement>();
const qweqwe = ref('../../assets/audio/test.mp3');
// const player = new Player(audio.value);

import { gettimbre, getwelcome, postwelcome } from '../../api/index'
import { ref, reactive, onMounted } from 'vue';
import { VideoPlay } from '@element-plus/icons-vue';
const trigger = ['blur', 'change'];

const form_data = reactive<any>({
  project_id: '', // 项目id
  timbre_id: 2, // 音色id
  time: 0, // 时间(分)
  number: 0, // 次数
});

onMounted(() => {
  console.log('创建完成');
  temporary_timbre.value = form_data.timbre_id;
  gettimbrelist()
});


// 临时值 选中音色
const temporary_timbre = ref('1');

// 音色列表
const timbre_list = reactive<any>([
  {
    id: 1,
    name: '雅婷',
    voice: 'xiaoyun',// 标识
    type: '知性女生',//类型
    scene: '通用场景',//场景
    icons: 'nva',
    url:"",
  },
  {
    id: 2,
    name: '德玛西亚',
    voice: 'xiaoyun',
    type: '女',
    scene: '通用场景',
    icons: 'nva',
  },
  {
    id: 3,
    name: '艾泽拉斯',
    voice: 'xiaoyun',
    type: '男',
    scene: '通用场景',
    icons: 'nva',
  },
]);

const rules = reactive({
  // describe: [{ required: true, message: '请输入问题描述', trigger }],
  time: [{ required: true, message: '请输入时间(分)', trigger }],
  number: [{ required: true, message: '请输入时间(分)', trigger }],
  timbre_id: [{ required: true, message: '请选择音色', trigger }],
});

//
const handleChangetime = async (value: number) => {
  form_data.time = value;
};
//
const handleChangenumber = async (value: number) => {
  form_data.number = value;
};

// 获取音色列表
const gettimbrelist = async () => {
  gettimbre().then(res=>{
    console.log('获取音色列表')
    console.log(res)
  })
}

// 获取欢迎语详情
const getwelcomedetail = async (value: number) => {
  getwelcome().then(res=>{
    console.log('获取欢迎语详情')
    console.log(res)
  })
}

// 提交表单 设置欢迎语
const submitForm = async (form_data: any) => {
  if (!form_data) return;
  await form_data.validate((valid: any, fields: any) => {
    if (valid) {
      console.log('成功', valid);
      // postwelcome().then(res=>{
      // 
      //   console.log(res)
      // })
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 播放音色音频
const playmusic = async (item: any) => {
  // router.replace('/questions')
  console.log('播放音色音频');
  console.log(item);
};
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

  // .timbre_list {
  //   margin-top: 4px;
  //   .timbre_list_item {
  //     display: flex;
  //     width: 275px;
  //     height: 40px;
  //     background: #333333;
  //     border-radius: 4px;
  //     color: #ffffff;
  //     justify-content: space-around;
  //     align-items: center;
  //     .item_left {
  //     }
  //     .item_right {
  //       cursor: pointer;
  //       padding-top: 10px;
  //     }
  //   }
  //   .timbre_list_item:hover {
  //     // background-color: #282828;
  //     background-color: #434343;
  //   }
  //   .selected_timbre {
  //     // background-color: #191919;
  //     // background-color: #252323;
  //     background-color: aquamarine;
  //   }
  // }
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
      .item_left_content{
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
</style>
