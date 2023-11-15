<template>
  <div class="createPage">
    <div class="fixedHead vcenter">
      <div>
        <!-- audition_url -->
        <!-- <audio
          v-if="playVideoObj"
          ref="audioitem"
          :src="playVideoObj.path ? playVideoObj.path : playVideoObj.voice_url"
          @ended="timbreanswerEnd"
          :controls="false"
          :loop="false"
        >
          您的浏览器不支持 audio 标签。
        </audio> -->
        <audio
          v-if="playVideoObj"
          ref="audioitem"
          :src="playVideoObj.path ? playVideoObj.path : playVideoObj.voice_url ? playVideoObj.voice_url : playVideoObj.audition_url"
          @ended="timbreanswerEnd"
          :controls="false"
          :loop="false"
        >
          您的浏览器不支持 audio 标签。
        </audio>
      </div>
      <el-input
        v-model.trim="form.name"
        placeholder="项目名称"
        class="partName"
      />
      <el-button link class="save" @click="saveToTemp(ruleFormRef,false)">
        <el-icon class="cgxIcon">
          <Collection />
        </el-icon>
        保存到草稿箱
      </el-button>
      <el-button type="primary" round class="CreateLive" @click="saveToTemp(ruleFormRef,true)">
        创建直播
      </el-button>
    </div>

    <div class="content">
      <div :class="['content_left', { checked: ishuman == true }]">
        <div class="content_left_title">
          <div class="content_left_title_left">选择形象</div>
          <div class="content_left_title_right" @click="ishuman = true">
            <el-icon>
              <Close />
            </el-icon>
          </div>
        </div>
        <div class="leftArea_box">
          <ul class="pList">
            <el-image
              v-for="item in dpList"
              :key="item.id"
              :src="item.image"
              :class="['person', { checked: human_id_index == item.human_id }]"
              loading="lazy"
              @click="selectHuman(item.human_id, item.image)"
            />
          </ul>
        </div>
      </div>

      <div class="content_right">
        <div v-if="form.footages.length >= 3" class="change_random">
          <el-radio-group v-model="form.is_random">
            <el-radio :label="0" size="large">顺序播放</el-radio>
            <el-radio :label="1" size="large">随机播放</el-radio>
          </el-radio-group>
        </div>

        <div :class="[ 'content_right_box', { content_right_box_two: ishuman == false,content_right_box_three:form.footages.length < 3 } ]">
          <el-form ref="ruleFormRef" :model="form.footages">
            <transition-group tag="ul" class="container">
              <li
                :class="[ 'box_item', { checked: fragment_index == index, box_item_two: ishuman == false }]"
                v-for="(item, index) in form.footages"
                :key="item.sort"
                draggable="true"
                @click="selectfragment(index)"
                @dragstart="handleDragStart($event, item)"
                @dragover.prevent="handleDragOver($event, item)"
                @dragenter="handleDragEnter($event, item)"
                @dragend="handleDragEnd($event, item)"
              >
                <div class="box_item_two">
                  <div class="box_item_two_left">
                    <el-image
                      :src="item.human_cover"
                      @click="ishuman = false"
                      class="two_left_image"
                      loading="lazy"
                    />
                  </div>
                  <div class="box_item_two_center">
                    <div class="center_inp_one">
                      <el-form-item
                        :prop="index + '.name'"
                        :rules="{
                          validator: validateName,
                          required: true,
                          message: '请输入片段名称',
                          trigger: trigger,
                        }"
                      >
                        <el-input
                          v-model="item.name"
                          maxlength="25"
                          placeholder="请输入片段名称"
                        />
                      </el-form-item>
                    </div>
                    <div class="center_inp_two">
                      <!-- <el-form-item :prop="index + '.detail'" :rules="{ validator:validateDetail, required:true, message:'请输入片段描述', trigger: trigger}" > -->
                        <el-input
                          v-model="item.detail"
                          resize="none"
                          :rows="5"
                          maxlength="200"
                          type="textarea"
                          placeholder="请输入片段描述"
                        />
                      <!-- </el-form-item> -->
                    </div>
                    <div class="center_operate">
                      <div class="center_operate_left">
                        <el-radio-group v-model="item.type" >
                          <el-radio-button :label="1" >
                            <div class="type_btn">上传录音</div>
                          </el-radio-button>
                          <el-radio-button :label="2" >
                            <div class="type_btn">AI 配音</div>
                          </el-radio-button>
                        </el-radio-group>
                      </div>
                    </div>
                  </div>
                  <div class="box_item_two_tight">
                    <div>
                      <el-tooltip content="复制当前素材片段" placement="top-end" >
                        <el-icon class="copyitem" @click="copyfragment(item)">
                          <CopyDocument />
                        </el-icon>
                      </el-tooltip>
                    </div>
                    <div>
                      <el-tooltip content="删除当前素材片段" placement="top-end" >
                        <el-icon class="Deleteitem" @click="delfragment(item, index)">
                          <DeleteFilled />
                        </el-icon>
                      </el-tooltip>
                    </div>
                    <div>
                      <el-tooltip :content=" item.is_play === 1 ? '播放此片段' : '不播放此片段' " placement="top-end" >
                        <el-icon class="isplayitem" @click=" item.is_play === 1 ? (item.is_play = 0) : (item.is_play = 1) " >
                          <View v-if="item.is_play === 1" />
                          <Hide v-else />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </div>
                </div>

                <div v-if="item.type === 1" class="template_one">
                  <div class="reply_content">
                    <div class="up_header">
                      <div class="left_text">上传附件</div>
                      <el-button type="primary" class="sound_btn" @click="isFileCard = true" >
                        <el-icon class="insertIcon">
                          <CirclePlusFilled />
                        </el-icon>
                        <span>上传录音</span>
                      </el-button>
                    </div>

                    <el-form-item :prop="index + '.audio'" :rules="{ validator:validateAudio, required:true, message:'请上传音频', trigger:trigger,}">
                      <div v-if="item.audio && item.audio.id" class="audio_list" >
                        <div class="audio_list_item">
                          <div class="item_name">
                            {{ 1 }} . {{ item.audio.name }}
                          </div>
                          <div class="item_time">
                            {{ item.audio.created_at }}
                          </div>
                          <div class="item_right">
                            <div
                              v-if="isPlay && playVideoObj.id === item.audio.id"
                              class="item_del"
                              @click="pauseVoice(item.audio)"
                            >
                              暂停
                            </div>
                            <div
                              v-else
                              class="item_del"
                              @click="playVoice(item.audio)"
                            >
                              试听
                            </div>
                            <div
                              @click="del_audio(index, item.audio)"
                              class="item_del"
                            >
                              删除
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-else class="audio_list_empty">暂无音频</div>
                    </el-form-item>

                    <div class="prompt_tip">
                      *只能上传.mp3文件，且不超过10MB
                    </div>
                  </div>
                </div>

                <div v-if="item.type === 2" class="template_two">
                  <div class="aidescribe">
                    <el-form-item
                      :prop="index + '.content'"
                      :rules="{
                        validator: validateContent,
                        required: true,
                        message: '请输入配音文本',
                        trigger: trigger,
                      }"
                    >
                      <el-input
                        v-model="item.content"
                        resize="none"
                        :rows="8"
                        type="textarea"
                        placeholder="请输入配音文本"
                      />
                    </el-form-item>
                  </div>

                  <div class="template_two_right">
                    <div class="audio_box">
                      <div
                        class="audio_box_left"
                        @click="changetimbre(item, index)"
                      >
                        <div class="left_box_left">
                          <el-icon class="left_box_left_icon">
                            <VideoPause />
                          </el-icon>
                        </div>
                        <div class="left_box_center">
                          <div class="left_box_center_name">
                            {{
                              item.timbre && item.timbre.name
                                ? item.timbre.name
                                : ''
                            }}
                          </div>
                          <div class="left_box_center_type">
                            {{
                              item.timbre && item.timbre.type
                                ? item.timbre.type
                                : ''
                            }}
                          </div>
                        </div>
                        <div class="left_box_right">
                          <el-icon class="left_box_right_icon">
                            <CaretBottom />
                          </el-icon>
                        </div>
                      </div>
                      <div class="audio_box_right">
                        <el-button
                          v-if="
                            isPlay &&
                            item.timbre &&
                            item.timbre.id &&
                            playVideoObj.id === item.timbre.id
                          "
                          type="primary"
                          class="audio_box_right_btn"
                          @click="pauseVoice(item)"
                        >
                          <el-icon class="insertIcon">
                            <Headset />
                          </el-icon>
                          <div class="btn_text">暂停</div>
                        </el-button>
                        <el-button
                          v-else
                          type="primary"
                          class="audio_box_right_btn"
                          @click="synthesisaudio(item)"
                        >
                          <el-icon class="insertIcon">
                            <Headset />
                          </el-icon>
                          <div class="btn_text">试听音频</div>
                        </el-button>
                      </div>
                    </div>

                    <div class="slider_box_item">
                      <div class="item_label">语速</div>
                      <div class="item_slider">
                        <el-slider
                          v-if="item.timbre && item.timbre.platform_type === 1"
                          v-model="item.speed"
                          :max="500"
                          :min="-500"
                          size="small"
                          placement="right"
                          :step="100"
                          show-stops
                        />
                        <el-slider
                          v-else
                          v-model="item.speed"
                          :max="1.0"
                          :min="0.1"
                          size="small"
                          placement="right"
                          :step="0.1"
                          show-stops
                        />
                      </div>
                    </div>
                    <div class="slider_box_item">
                      <div class="item_label">语调</div>
                      <div class="item_slider">
                        <el-slider
                          v-if="item.timbre && item.timbre.platform_type === 1"
                          v-model="item.pitch"
                          :max="500"
                          :min="-500"
                          size="small"
                          placement="right"
                          :step="100"
                          show-stops
                        />
                        <el-slider
                          v-else
                          v-model="item.pitch"
                          :max="500"
                          :min="-500"
                          size="small"
                          placement="right"
                          :step="100"
                          show-stops
                        />
                      </div>
                    </div>
                    <div class="slider_box_item">
                      <div class="item_label">音量</div>
                      <div class="item_slider">
                        <el-slider
                          v-if="item.timbre && item.timbre.platform_type === 1"
                          v-model="item.volume"
                          :max="100"
                          :min="0"
                          size="small"
                          placement="right"
                          :step="10"
                          show-stops
                        />
                        <el-slider
                          v-else
                          v-model="item.volume"
                          :max="100"
                          :min="0"
                          size="small"
                          placement="right"
                          :step="10"
                          show-stops
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <div
                :class="[
                  'add_item',
                  {
                    checked: ishuman == false,
                    checked_two: form.footages.length % 2 === 0,
                  },
                ]"
                @click="addfragment()"
              >
                <div class="add_item_left">
                  <el-icon>
                    <FolderAdd />
                  </el-icon>
                </div>
                <div class="add_item_right">新增片段素材</div>
              </div>
            </transition-group>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogTableVisible" width="628" title="选择音色" center :close-on-click-modal="false" :close-on-press-escape="false" @close="confirmtimbre()">
      <div class="timbre_box">
        <div
          v-for="(timbre_item, index) in timbre_list"
          :key="index"
          :class="[
            'timbre_box_item',
            { checked: selected_timbre.id == timbre_item.id },
          ]"
          @click="preview_timbre(timbre_item)"
        >
          <div class="timbre_box_item_left">
            <el-icon class="timbre_box_item_left_icon" @click="playtimbrebox(timbre_item)">
              <VideoPause v-if="timbre_item.istimbreboxplay" />
              <VideoPlay v-else />
            </el-icon>
          </div>
          <div class="timbre_box_item_right">
            <div class="timbre_box_item_right_name">{{ timbre_item.name }}</div>
            <div class="timbre_box_item_right_type">{{ timbre_item.type }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button type="primary" @click="confirmtimbre()"> 保存 </el-button>
      </template>
    </el-dialog>

    <!-- 创建直播确认弹窗 -->
    <el-dialog
      v-model="crtCfmPop"
      title="是否创建直播"
      width="567"
      destroy-on-close
      align-center
      center
    >
      <p style="text-align: center">
        预计消耗合成时长{{ hms }}（以实际合成时长为准），确认后开始创建
      </p>
      <template #footer>
        <el-button type="primary" @click="createLive"> 确定创建 </el-button>
        <el-button @click="crtCfmPop = false"> 取消创建 </el-button>
      </template>
    </el-dialog>

    <!-- 上传文件管理 -->
    <Audiofile
      :type="4"
      :pageSize="12"
      :isvisible="isFileCard"
      @change="changeFile"
      @close="closeuploadinfo"
    />
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
  FolderAdd,
  Headset,
  VideoPause,
  CaretBottom,
  Close,
  View,
  Hide,
  VideoPlay
} from '@element-plus/icons-vue';

import {
  humanList,
  createProJect,
  updateProJect,
  projectDetail,
  compositeVideo,
  videoNeedTime,
  getTimbre,
  posttts,
  getttsdetail,
} from '../../api';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { clone, remove, uniqBy } from 'lodash-es';
import { useProjectStore } from '../../stores';
import { getTime_two } from '../../utils/helper';

const route = useRoute();
const router = useRouter();
const project = useProjectStore();
const partAct = ref(null); // 选中的片段下标
const crtCfmPop = ref(false); // 是否显示创建提示弹窗
const usedTime = ref(''); // 生成视频预计消耗时长

const dpList = ref([]); // 数字人预览列表 左侧边栏

const fragment_index = ref(null); // 选中片段索引
const human_id_index = ref(0); // 选中数字人索引
const ishuman = ref(false); // 是否显示数字人列表

const isFileCard = ref(false); // 是否显示文件列表弹窗

const dialogTableVisible = ref(false); // 音色弹窗
const timbre_list = ref([]); // 音色列表
const selected_timbre = ref({});

const selected_timbre_index = ref(null); // 更改音色的索引
// const istimbreboxplay = ref(false); // 是否播放 音色 音频

const timbreboxbox = ref({});  // 保存音色播放


const ruleFormRef = ref();
const trigger = ['blur', 'change'];
const validateName = (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    callback(new Error('请输入片段名称'));
  } else {
    callback();
  }
};
const validateDetail = (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    callback(new Error('请输入片段描述'));
  } else {
    callback();
  }
};
const validateAudio = (rule, value, callback) => {
  if (value && value.id) {
    callback();
  } else {
    callback(new Error('请上传音频'));
  }
};
const validateContent = (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    callback(new Error('请输入配音文本'));
  } else {
    callback();
  }
};
// -------------------------------
const form = reactive({
  name: '', // 项目名称
  footages: [
    // {
    //   name: '这是测试11111', // 片段名称
    //   detail:null, // 描述  //   describe:null, // 描述
    //   human_id: null,// 数字人id
    //   human_cover: 'https://zwklt.zwwltkl.com/human/43828.png',// 数字人图像
    //   audio_id: null,// 录音id
    //   screen:1,  // 屏幕方向 1竖屏2横屏
    //   is_play:1,  //  是否播放 1播放0不播放 (可为空 默认值1)
    //   sort:1, // 排序值(可为空 默认值0)
    //   type, //  音频方式 1上传 2AI配音        is_operate:1, // 操作模式
    //   content:null, // 配音文本
    //   timbre_id:1,// 音色ID
    //   speed:0, // speechspeed:0,// 语速  语速 阿里云(取值范围：-500~500,默认值:0) 深声(lower/low/normal/high/higher)
    //   pitch:0, // intonation:0,// 语调 音调 阿里云(取值范围：-500~500,默认值:0) 深声(lower/low/normal/high/higher)
    //   volume:50,// 音量  音量 阿里云(取值0~100,默认值50) 深声(浮点数0.0-1.0)
    //
    //   数据添加部分
    //   audio:{
    //     id:'',
    //     path:''
    //   }
    //   timbre:{
    //     audition_url: "https://zwshuziren.oss-cn-beijing.aliyuncs.com/example/xiaoxian.wav",
    //     file_id: 0,
    //     id: 4,
    //     name: "小仙",
    //     platform_type: 1,   // 平台类型  1 阿里云  2 深声
    //     scene: "直播场景",
    //     type: "亲切女声",
    //     voice: "xiaoxian"
    //   }
    //   existtimbre:{
    //      id:'', //
    //      content:'', //
    //      path:'', //
    //      speed:0, // 语速
    //      pitch:0, // 音调
    //      volume:50,// 音量
    //   }
    //
    //
    // },
  ], // 片段集合
  is_random: 0,
});

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
  gettimbrelist();
  getHumanList();
  if (pid) {
    const loading = ElLoading.service({
      lock: true,
      text: '加载中，请稍等。。。',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    //
    project_id = pid; // 同步项目ID
    Promise.all([
      new Promise((resolve, reject) => {
        projectDetail(pid)
          .then((res) => resolve(res.data))
          .catch(() => resolve(null));
      }),
    ]).then((res) => {
      const data = res[0];
      setTimeout(() => {
        if (data) {
          const { name, footages, is_random } = data;
          form.name = name;
          form.is_random = Number(is_random);
          form.footages = footages.map((item,index) => {
            item.sort = index
            if (item.type === 1) {
              item.audio = {
                id: '',
                path: '',
                name: '',
              };
              item.audio.id = item.audio_id;
              item.audio.path = item.audio_path;
              item.audio.name = item.audio_name;

              item.timbre = {};
              item.timbre = timbre_list.value[0];
            } else {
              item.audio = {};
              for (var i = 0; i < timbre_list.value.length; i++) {
                if (timbre_list.value[i].id === item.timbre_id) {
                  console.log('处理音色部分');
                  item.timbre = timbre_list.value[i];
                }
              }
            }

            if (item.timbre && item.timbre.platform_type === 1) {
              item.speed = Number(item.speed);
              item.pitch = Number(item.pitch);
              item.volume = Number(item.volume);
            }
            item.existtimbre = {};
            item.existtimbre.id = null;
            item.existtimbre.content = null;
            item.existtimbre.path = null;
            item.existtimbre.speed = null;
            item.existtimbre.pitch = null;
            item.existtimbre.volume = null;
            return item;
          });
        }
        setTimeout(() => {
          loading.close();
        }, 5000);
      }, 1000);
    });
    setTimeout(() => {
      loading.close();
    }, 10000);
  } else {
    form.name = pn;
    setTimeout(() => {
      let params = {
        sort: 0, // 排序值
        name: null, // 片段名称
        detail: null, // 描述
        human_id: dpList.value[0].human_id, // 数字人id
        human_cover: dpList.value[0].image,
        type: 1, // 操作模式  音频方式 1上传 2AI配音
        content: null, // 配音文本
        audio_id: 0, // 录音id
        timbre_id: null, // 音色ID
        speed: 0, // 语速
        pitch: 0, // 语调
        volume: 50, // 音量
        screen: 1, // 屏幕方向 1竖屏2横屏
        is_play: 1, //  是否播放 1播放0不播放 (可为空 默认值1)
        audio: {},
        timbre: timbre_list.value[0],
        existtimbre: {
          id: null, //
          content: null, //
          path: null, //
          speed: null, // 语速
          pitch: null, // 音调
          volume: null, // 音量
        },
      };
      form.footages.push(params);
    }, 1000);
  }
});

//
onMounted(() => {
  project.queryAliToken();
});

// 离开页面前保存草稿箱
onBeforeRouteLeave(async () => {
  // const flag = await saveToTemp()
  // if (!flag) return false
});

// ----------------------------------------------------
let ending = null;
let dragging = null;
// 拖拽开始时触发的事件
const handleDragStart = (e, item) => {
  dragging = item;
};
// 拖拽结束时触发的事件
const handleDragEnd = (e, item) => {
  if (ending && ending.sort === dragging?.sort) {
    return;
  }
  const newItems = form.footages;
  const src = newItems.indexOf(dragging);
  const dst = newItems.indexOf(ending);
  newItems.splice(src, 1, ...newItems.splice(dst, 1, newItems[src]));
  form.footages = newItems;
  dragging = null; // 被拖拽元素
  ending = null; // 目标元素

  setTimeout(() => {
    fragment_index.value = null;
    human_id_index.value = null;
  }, 100);
};
// 拖拽过程中在目标元素上移动时触发的事件
const handleDragOver = (e, item) => {
  e.dataTransfer.dropEffect = 'move';
};
// 拖拽进入目标元素时触发的事件
const handleDragEnter = (e, item) => {
  e.dataTransfer.effectAllowed = 'move';
  ending = item;
};

// ---------------------------------------------------------------

// 选择音色
function changetimbre(item, index) {
  selected_timbre.value = item.timbre;
  selected_timbre_index.value = index;
  dialogTableVisible.value = true;
}

// 预览音色
function preview_timbre(item) {
  selected_timbre.value = item;
}
// 确定音色
function confirmtimbre(item) {
  dialogTableVisible.value = false;
  form.footages[selected_timbre_index.value].timbre = selected_timbre.value;
  timbre_list.value.map((item,index) => {
    item.istimbreboxplay = false
  });
  pauseVoice()
  setTimeout(() => {
    selected_timbre.value = {};
    selected_timbre_index.value = null;
  }, 100);
}

// 获取音色列表
const gettimbrelist = () => {
  getTimbre().then((res) => {
    timbre_list.value = res.data;
    timbre_list.value.map((item,index) => {
      item.istimbreboxplay = false
    });
  });
};
// 播放音色列表
function playtimbrebox (box_item){
  console.log('播放音色列表')
  if(timbreboxbox.value && timbreboxbox.value.id === box_item.id){
    console.log('赋值')
    if(box_item.istimbreboxplay === false){
      box_item.istimbreboxplay = true
      playVoice(box_item);
    } else {
      box_item.istimbreboxplay = false
      pauseVoice()
    }
    return
  }
  timbre_list.value.map((item,index) => {
    if(item.id === box_item.id){
      item.istimbreboxplay = true
    } else {
      item.istimbreboxplay = false
    }
  });
  timbreboxbox.value = box_item
  console.log(timbreboxbox.value)
  playVoice(box_item);
}

const iscreateAsr = ref(false); // 是否允许试听音频
// 播放音色音频
const synthesisaudio = (item) => {
  console.log('播放音色音频');
  console.log(item);
  if (
    item.existtimbre.id === item.timbre.id &&
    item.existtimbre.content === item.content &&
    item.existtimbre.path &&
    item.existtimbre.speed === item.speed &&
    item.existtimbre.pitch === item.pitch &&
    item.existtimbre.volume === item.volume
  ) {
    console.log('条件未变，已合成过，不需要再次合成');
    playVoice(item.existtimbre);
    return;
  }
  if (iscreateAsr.value === true) {
    ElMessage({ type: 'warning', message: '请务频繁点击！' });
    return;
  }
  if (!item.content) {
    return ElMessage({ type: 'warning', message: '配音文本不能为空！' });
  }
  let params = {
    content: item.content,
    timbre_id: item.timbre.id,
    speed: item.speed,
    pitch: item.pitch,
    volume: item.volume,
  };
  let num = 0;
  const max = 10;
  const errResponse = (i) => {
    clearInterval(i);
  };

  // 发起合成请求
  posttts(params).then((res) => {
    iscreateAsr.value === true;
    // console.log('发起合成请求')
    // console.log(res)
    const loading = ElLoading.service({
      lock: true,
      text: '音频生成中，请稍等。。。',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    const t = setInterval(() => {
      num++;
      getttsdetail(res.data.task_id)
        .then((detail) => {
          // console.log('获取语音合成详情')
          // console.log(detail)
          // 语音合成状态 2合成中 3合成成功 4合成失败
          switch (detail.data.voice_status) {
            case 3:
              errResponse(t);
              item.existtimbre.id = item.timbre.id;
              item.existtimbre.content = item.content;
              item.existtimbre.path = detail.data.voice_url;
              item.existtimbre.speed = item.speed;
              item.existtimbre.pitch = item.pitch;
              item.existtimbre.volume = item.volume;
              iscreateAsr.value === false;
              console.log('合成成功！');
              loading.close();
              playVoice(detail.data);
              return;
            case 4:
              iscreateAsr.value === false;
              console.log('试听合成失败，请重试！');
              ElMessage({ type: 'warning', message: detail.data.message });
              loading.close();
              errResponse(t);
              return;
            default:
              // 第十次请求仍旧无结果则放弃等待
              console.log('已执行' + num + '次');
              if (num === max) {
                errResponse(t);
              }
              break;
          }
        })
        .catch(() => {
          errResponse(t);
        });
      // 上限
      if (num === max) {
        console.log('上限');
        clearInterval(t);
      }
    }, 1500);
    setTimeout(() => {
      loading.close();
      iscreateAsr.value === false;
    }, 6000);
  });
};

// -----------------------------------------------------------

// 选择 片段素材
function selectfragment(index) {
  fragment_index.value = index;
  human_id_index.value = form.footages[index].human_id;
}

// 添加 片段素材
function addfragment() {
  let params = {
    sort: Number(form.footages.length + 2),
    name: null, // 片段名称
    detail: null, // 描述
    human_id: dpList.value[0].human_id, // 数字人id
    human_cover: dpList.value[0].image,
    type: 1, // 操作模式  音频方式 1上传 2AI配音
    content: null, // 配音文本
    audio_id: 0, // 录音id
    timbre_id: null, // 音色ID
    speed: 0, // 语速
    pitch: 0, // 语调
    volume: 50, // 音量

    screen: 1, // 屏幕方向 1竖屏2横屏
    is_play: 1, //  是否播放 1播放0不播放 (可为空 默认值1)

    audio: {},
    timbre: timbre_list.value[0],
    existtimbre: {
      id: null, //
      content: null, //
      path: null, //
      speed: null, // 语速
      pitch: null, // 音调
      volume: null, // 音量
    },
  };

  form.footages.push(params);
}

// 复制 片段素材
function copyfragment(item) {
  let itemdata = JSON.parse(JSON.stringify(item));
  let params = {
    sort: Number(form.footages.length + 2),
    name: itemdata.name, // 片段名称
    detail: itemdata.detail, // 描述
    human_id: itemdata.human_id, // 数字人id
    human_cover: itemdata.human_cover,
    audio_id: itemdata.audio_id, // 录音id

    type: itemdata.type, // 操作模式
    content: itemdata.content, // 配音文本
    audio_id: itemdata.audio_id, // 录音id
    timbre_id: itemdata.timbre_id, // 音色ID
    speed: itemdata.speed, // 语速
    pitch: itemdata.pitch, // 语调
    volume: itemdata.volume, // 音量

    screen: itemdata.screen, // 屏幕方向 1竖屏2横屏
    is_play: itemdata.is_play, //  是否播放 1播放0不播放 (可为空 默认值1)

    audio: itemdata.audio,
    timbre: itemdata.timbre,
    existtimbre: {
      id: null, //
      content: null, //
      path: null, //
      speed: null, // 语速
      pitch: null, // 音调
      volume: null, // 音量
    },
  };

  form.footages.push(params);
}

// 删除 片段素材
function delfragment(item_item, index_index) {
  if (form.footages.length === 1) {
    ElMessage({ type: 'error', message: '请至少保证有一个片段！' });
    return;
  }
  remove(form.footages, (item, index) => item == item_item);
  setTimeout(() => {
    fragment_index.value = null;
    human_id_index.value = null;
  }, 100);
}

// -----------------------------------------------
// 删除文件
function del_audio(index, item) {
  form.footages[index].audio = {};
}
// 打开文件弹窗
function openFile() {
  isFileCard.value = true;
}
// 文件传值
function changeFile(val) {
  form.footages[fragment_index.value].audio = val;
  isFileCard.value = false;
}
// 关闭文件弹窗
function closeuploadinfo(val) {
  isFileCard.value = false;
}

// ------------------------------------------------------------
const playVideoObj = ref({}); // 音频 载体 播放
const audioitem = ref();
const isPlay = ref(false); // 是否播放音频
// 播放
function playVoice(row) {
  // 若点击播放与之前不相等，则先暂停再播放
  if (playVideoObj.id !== row.id) {
    pauseVoice();
  }
  playVideoObj.value = row;
  setTimeout(() => {
    audioitem.value.play();
    isPlay.value = true;
  }, 100);
}
// 暂停
function pauseVoice() {
  audioitem.value.pause();
  isPlay.value = false;
}
//
function timbreanswerEnd() {
  audioitem.value.pause();
  isPlay.value = false;
  playVideoObj.value = {};
}

// ---------------------------------------------------

//
// 获取数字人列表
async function getHumanList() {
  const res = await humanList();
  if (res && res.data) {
    dpList.value = res.data;
    return res.data;
  }
  return false;
}

// 选择数字人
function selectHuman(id, image) {
  if (fragment_index.value !== null) {
    human_id_index.value = id;
    form.footages[fragment_index.value].human_id = id;
    form.footages[fragment_index.value].human_cover = image;
  } else {
    ElMessage({ type: 'warning', message: '请先选择片段！' });
  }
}

// -------------------------------------------------------------
// 数据处理
function formateDel(formddata) {
  formddata = JSON.parse(JSON.stringify(formddata));
  // console.log(formddata)

  for (var i = 0; i < formddata.footages.length; i++) {
    formddata.footages[i].sort = i;
    if (formddata.footages[i].type === 1) {
      if (formddata.footages[i].audio && formddata.footages[i].audio.id) {
        formddata.footages[i].audio_id = formddata.footages[i].audio.id;
      }
    } else {
      if (formddata.footages[i].timbre && formddata.footages[i].timbre.id) {
        formddata.footages[i].timbre_id = formddata.footages[i].timbre.id;
      }
    }
    delete formddata.footages[i].existtimbre;
    delete formddata.footages[i].audio;
    delete formddata.footages[i].key1;
    delete formddata.footages[i].key2;
    delete formddata.footages[i].timbre;
  }

  console.log('数据处理');
  console.log(formddata);
  return formddata;
}


// // 1.先保存到草稿箱
// async function startCfmCrate() {
//   const flag = await saveToTemp(ruleFormRef.value);
//   console.log('aaaaaaaaaaaaaaaaaaaaaaa')
//   console.log(flag)
//   // 2.获取音频时长a
//   if (flag) {
//     await videoNeedTime({ project_id }).then((res) => {
//       if (res && res.data) {
//         usedTime.value = res.data.duration;
//         crtCfmPop.value = true;
//       }
//     });
//   }
// }

// 保存到草稿箱
async function saveToTemp(formEl,iscreate) {
  try {
    if (form.name === '' || form.name === undefined || form.name === null) {
      ElMessage({ type: 'warning', message: '项目名称不能为空！' });
      return;
    }
    if (!formEl) return;

    formEl.validate((valid, fields) => {
      if (valid) {
        // console.log('校验通过');
        // console.log(valid);
        let formddata = JSON.parse(JSON.stringify(form));
        // 先去重片段中的重复数据
        const data1 = formddata.footages.map((item,index) => {
          if(item.type===1){
            item.key1 = `${item.human_id}-${item.audio_id}`;
            item.key2 = index;
          } else {
            item.key1 = index;
            item.key2 = `${item.human_id}-${item.timbre_id}`;
          }
          return item;
        });
        formddata.footages = uniqBy(data1, 'key1');
        formddata.footages = uniqBy(data1, 'key2');
        // console.log('aaaaaaaaaaaaaaaa')
        // console.log(formateDel(formddata))

        if(project_id === null){
          createProJect(formateDel(formddata)).then(res=>{
            if (res && res.code == 0) {
              if (project_id === null) project_id = res.data.id;
              ElMessage({ type: 'success', message: '保存到草稿箱成功' });
              if(iscreate){
                videoNeedTime({ project_id }).then((res) => {
                  if (res && res.data) {
                    usedTime.value = res.data.duration;
                    crtCfmPop.value = true;
                  }
                });
              }
            }
          })
        } else {
          updateProJect(project_id, formateDel(formddata)).then(res=>{
            if (res && res.code == 0) {
              if (project_id === null) project_id = res.data.id;
              ElMessage({ type: 'success', message: '保存到草稿箱成功' });
              if(iscreate){
                videoNeedTime({ project_id }).then((res) => {
                  if (res && res.data) {
                    usedTime.value = res.data.duration;
                    crtCfmPop.value = true;
                  }
                });
              }
            }
          })
        }
      }
    })
  } catch (error) {
    console.log(error);
    return false;
  }
}

// // 保存到草稿箱
// async function saveToTemp(formEl) {
//   if (form.name === '' || form.name === undefined || form.name === null) {
//     ElMessage({ type: 'warning', message: '项目名称不能为空！' });
//     return;
//   }
//   if (!formEl) return;
//   formEl.validate((valid, fields) => {
//     if (valid) {
//       console.log('校验通过');
//       console.log(valid);
//       // try {
//         let formddata = JSON.parse(JSON.stringify(form));
//         // 先去重片段中的重复数据
//         const data1 = formddata.footages.map((item) => {
//           item.key1 = `${item.human_id}-${item.audio_id}`;
//           item.key2 = `${item.human_id}-${item.timbre_id}`;
//           return item;
//         });
//         formddata.footages = uniqBy(data1, 'key1');
//         formddata.footages = uniqBy(data1, 'key2');

//         // 再组合form发出请求
//         // const res =
//         //   project_id === null
//         //     ? createProJect(formateDel(formddata))
//         //     : updateProJect(project_id, formateDel(formddata));

//         //     console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqq')
//         //     console.log(res)
//         //     console.log(res.code)
//         //     console.log(res.message)

//             if(project_id === null){
//               createProJect(formateDel(formddata)).then(res=>{
//                 // console.log()
//                 if (res && res.code == 0) {
//                   if (project_id === null) project_id = res.data.id;
//                   ElMessage({ type: 'success', message: '保存到草稿箱成功' });
//                   return true;
//                 }
//               })
//             } else {
//               updateProJect(project_id, formateDel(formddata)).then(res=>{
//                 // console.log()
//                 if (res && res.code == 0) {
//                   if (project_id === null) project_id = res.data.id;
//                   ElMessage({ type: 'success', message: '保存到草稿箱成功' });
//                   return true;
//                 }
//               })
//             }
            
//         // if (res && res.code == 0) {
//         //   if (project_id === null) project_id = res.data.id;
//         //   ElMessage({ type: 'success', message: '保存到草稿箱成功' });
//         // }
//         // return true;
//       // } catch (error) {
//       //   console.log(error);
//       //   return false;
//       // }
//     } else {
//       console.log('error submit!', fields);
//       ElMessage({ type: 'warning', message: '请完善片段内容' });
//     }
//   });
// }

// // 保存到草稿箱
// async function saveToTemp() {
//   try {
//     // 先去重片段中的重复数据
//     const data1 = form.footages.map((item) => {
//       item.key = `${item.human_id}-${item.audio_id}`;
//       return item;
//     });
//     form.footages = uniqBy(data1, 'key');

//     // 再组合form发出请求
//     const res =
//       project_id === null
//         ? await createProJect(formateDel(form))
//         : await updateProJect(project_id, formateDel(form));
//     if (res && res.data) {
//       if (project_id === null) project_id = res.data.id;
//       ElMessage({ type: 'success', message: '保存到草稿箱成功' });
//     }
//     return true;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// }

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
  // position: relative;
  padding: 0;
  margin: 0;
  display: flex;
  color: #fff;
  overflow: hidden;
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
      width: 161px;
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

  .content {
    // border: 1px solid red;
    position: relative;
    display: flex;
    width: 100%;
    overflow: hidden;
    // min-height: 100vh;
    height: 86vh;

    .content_left {
      // height: 846px;
      height: 655px;
      width: 410px;
      background: #282828;
      margin-right: 20px;
      overflow: hidden;
      transition: all linear 0.3s;
      &.checked {
        transition: all linear 0.3s;
        position: absolute;
        left: -500px;
      }
      .content_left_title {
        padding-left: 15px;
        padding-right: 15px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .content_left_title_left {
          font-size: 18px;
        }
        .content_left_title_right {
          display: flex;
          align-items: center;
          font-size: 28px;
          cursor: pointer;
        }
      }
      .leftArea_box {
        // height: 820px;
        // height: 780px;
        height: 596px;
        margin-top: 10px;
        // width: 100%;
        // width: 410px;
        width: 310px;
        scroll-behavior: smooth;
        overflow-y: scroll;
        // padding: 0px 0px 150px 15px;
        padding: 0px 0px 0px 15px;

        .pList {
          // margin: 10px 10px 0px 0px;
          display: flex;
          flex-wrap: wrap;

          // column-width: 100px;
          // column-count: auto;
          // column-gap: 10px;

          .person {
            width: 130px;
            // height: 230px;
            height: 200px;
            // height: 266px;
            display: block;
            background: #1e1e1e;
            margin-bottom: 14px;
            margin-right: 12px;
            cursor: pointer;
            // border: 1px solid rgb(0, 0, 0, 0);
            background-color: #00c764;
            overflow: hidden;
            &.checked {
              border: 1px solid #409eff;
              border-radius: 2px;
            }
          }
        }
      }

      .leftArea_box::-webkit-scrollbar {
        width: 4px;
      }
      .leftArea_box::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0);
      }
    }

    .content_right {
      // border: 1px solid red;
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden !important;
      .change_random {
        // width: 48.6%;
        // width: 588px;
        width: 100%;
        height: 63px;
        background: #282828;
        border-radius: 5px;
        display: flex;
        justify-content: left;
        align-items: center;
        padding-left: 16px;
        margin-bottom: 10px;
      }
      .content_right_box {
        width: 105%;
        height: 90%;
        // height: 80%;
        padding-right: -20px;
        // scroll-behavior: smooth;
        overflow-y: scroll;
        .container {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          overflow: hidden;
        }

        .box_item {
          // width: 48.6%;
          overflow: hidden;
          // width: 588px;
          // width: 590px;
          width: 594px;
          background: #282828;
          // margin-top: 10px;
          margin-bottom: 10px;
          margin-right: 10px;
          padding: 16px 16px 10px 10px;
          border-radius: 3px;
          transition: all linear 0.3s;
          position: relative;
          border: 1px solid #282828;
          &.checked {
            border: 1px solid #409eff;
            border-radius: 4px;
          }
          // .box_item_first{}
          .box_item_two {
            display: flex;
            .box_item_two_left {
              .two_left_image {
                border-radius: 2px;
                width: 150px;
                height: 236px;
                background-color: #00c764;
                border: 1px solid rgb(97, 96, 96);
                cursor: pointer;
              }
            }
            .box_item_two_center {
              margin-left: 10px;
              .center_inp_one {
                // border: 1px solid rgb(97, 96, 96);
                border-radius: 5px;
                width: 365px;
                .el-input {
                  border: 1px solid rgb(97, 96, 96);
                }
                .el-input__inner {
                  width: 300px;
                }
              }
              .center_inp_two {
                width: 365px;
                border-radius: 5px;
                // border: 1px solid rgb(97, 96, 96);
                margin-top: 10px;
                height: 140px;
                overflow: hidden;
                .el-textarea {
                  width: 362px;
                  border: 1px solid rgb(97, 96, 96);
                }
              }
              .center_operate {
                // margin-top: 14px;
                display: flex;
                .center_operate_left {
                  display: flex;
                  .type_btn{
                    width: 60px;
                    // border: 1px solid red;
                    // .el-radio-button__inner{
                    //   display: inline-block;
                    //   width: 90px;
                    // }
                    // span{
                    //   display: inline-block;
                    //   width: 100px;
                    // }
                  }
                }
              }
            }
            .box_item_two_tight {
              margin-left: 10px;
              .copyitem {
                font-size: 25px;
                cursor: pointer;
              }
              .Deleteitem {
                cursor: pointer;
                font-size: 25px;
                margin-top: 10px;
              }
              .isplayitem {
                cursor: pointer;
                font-size: 25px;
                margin-top: 10px;
              }
            }
          }

          .template_one {
            .reply_content {
              background-color: rgb(77, 82, 82);
              border-radius: 3px;
              width: 565px;
              // height: 185px;
              height: 198px;
              padding-left: 15px;
              padding-bottom: 8px;
              .up_header {
                width: 530px;
                height: 50px;
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
                // padding: 0 10px;
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
                width: 565px;
                margin-top: 10px;
                display: flex;
                flex-wrap: wrap;
                .audio_list_item {
                  width: 545px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  justify-content: space-between;
                  padding: 2px 20px 0px 10px;
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
                  .item_right {
                    display: flex;
                    .item_del {
                      margin-right: 12px;
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

              .audio_list_empty {
                width: 565px;
                color: #ffffff;
                margin-top: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
              }

              .prompt_tip {
                color: #ffffff;
                margin-top: 5px;
                font-size: 12px;
              }
            }
          }

          .template_two {
            display: flex;
            .aidescribe {
              width: 360px;
              // height: 170px;
              height: 196px;
              //   border: 1px solid rgb(97, 96, 96);
              border-radius: 5px;
              overflow: hidden;
              .el-textarea {
                border: 1px solid rgb(97, 96, 96);
              }
            }
            .template_two_right {
              margin-left: 12px;
              .audio_box {
                display: flex;
                align-items: center;
                width: 220px;
                // height: 40px;
                height: 50px;
                .audio_box_left {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 120px;
                  // height: 40px;
                  height: 50px;
                  background-color: #444444;
                  border-radius: 5px;
                  cursor: pointer;
                  .left_box_left {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .left_box_left_icon {
                      font-size: 30px;
                    }
                  }
                  .left_box_center {
                    margin-left: 5px;
                    .left_box_center_name {
                      font-size: 15px;
                    }
                    .left_box_center_type {
                      font-size: 10px;
                    }
                  }
                  .left_box_right {
                    margin-left: 5px;
                    .left_box_right_icon {
                      // border: 1px solid red;
                      font-size: 22px;
                      position: relative;
                      top: 5px;
                    }
                  }
                }
                .audio_box_right {
                  margin-left: 5px;
                  .audio_box_right_btn {
                    .insertIcon {
                      font-size: 12px;
                    }
                    .btn_text {
                      font-size: 12px;
                    }
                  }
                }
              }

              .slider_box_item {
                background-color: #444444;
                margin-top: 11px;
                border-radius: 4px;
                // border: 1px solid red;
                display: flex;
                align-items: center;
                padding-left: 10px;
                height: 32px;

                .item_label {
                  font-size: 12px;
                }
                .item_slider {
                  margin-left: 8px;
                  .el-slider {
                    margin-top: 0;
                    margin-left: 12px;
                    width: 150px;
                    font-size: 10px;
                    // --el-slider-runway-bg-color:rgb(107, 173, 228);
                    --el-slider-runway-bg-color: #949191;
                    // --el-slider-main-bg-color:red;
                  }
                }
              }
            }
          }
        }

        // 变化样式
        .box_item_two {
          width: 888px;
          .box_item_two {
            .box_item_two_center {
              .center_inp_one {
                width: 663px;
                .el-input__inner {
                  width: 660px;
                }
              }
              .center_inp_two {
                width: 663px;
                .el-textarea {
                  width: 660px;
                }
              }
            }
          }

          .template_one {
            width: 865px;
            .reply_content {
              width: 865px;
              .up_header {
                // width: 865px;
                width: 830px;
              }
              .audio_list {
                width: 865px;
                .audio_list_item {
                  width: 835px;
                }
              }
              .audio_list_empty {
                width: 865px;
              }
            }
          }

          .template_two {
            .aidescribe {
              width: 660px;
            }
          }
        }

        .add_item {
          cursor: pointer;
          transition: all linear 0.3s;
          width: 610px;
          margin-right: 10px;
          border-radius: 5px;
          height: 85px;
          background: #282828;
          display: flex;
          justify-content: center;
          align-items: center;
          &.checked {
            width: 888px;
            transition: all linear 0.3s;
          }
          &.checked_two {
            width: 1270px;
            transition: all linear 0.3s;
          }
          .add_item_left {
            font-size: 28px;
          }

          .add_item_right {
            margin-left: 10px;
            font-size: 20px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            color: #ffffff;
          }
        }
      }
      .content_right_box_two {
        min-height: 92%;
        padding-bottom: 20px;
      }
      .content_right_box_three {
        min-height: 100%;
        padding-bottom: 0px;
      }
    }
  }
}

.timbre_box {
  display: flex;
  flex-wrap: wrap;
  .timbre_box_item {
    margin-top: 10px;
    margin-right: 10px;
    cursor: pointer;
    width: 109px;
    // height: 39px;
    height: 49px;
    background-color: #444444;
    border: 1px solid #444444;
    border-radius: 3px;
    // padding-top: 4px;
    display: flex;
    align-items: center;
    .timbre_box_item_left {
      margin-left: 10px;
      display: flex;
      align-items: center;
      .timbre_box_item_left_icon {
        font-size: 30px;
      }
    }

    .timbre_box_item_right {
      // border: 1px solid red;
      margin-left: 5px;
      position: relative;
      top: -2px;
      .timbre_box_item_right_name {
        font-size: 15px;
      }
      .timbre_box_item_right_type {
        font-size: 10px;
      }
    }
    &.checked {
      border: 1px solid #409eff;
      border-radius: 4px;
    }
  }
  .timbre_box_item:hover {
    border: 1px solid #409eff;
  }
}
</style>
