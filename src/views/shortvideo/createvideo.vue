<template>
  <div class="createPage">
    <div class="fixedHead vcenter">
      <!-- <el-input v-if="form.footages[partAct]" v-model.trim="form.footages[partAct].name" placeholder="素材名称" class="partName" />
      <el-input v-else v-model.trim="part.name" placeholder="素材名称" class="partName" /> -->
      <!-- <el-button link class="save" @click="saveToTemp">
        <el-icon class="cgxIcon">
          <Collection />
        </el-icon>
        保存到草稿箱
      </el-button> -->
      <!-- <button :class="['banBtn', { act: form.config.bg_upload_type === 1 }]" @click="setHs(1)">
        竖版
      </button>
      <button :class="['banBtn', { act: form.config.bg_upload_type === 2 }]" @click="setHs(2)">
        横板
      </button> -->
      <el-button type="primary" round class="CreateLive" @click="startCfmCrate">
        创建短视频
      </el-button>
    </div>
    
    <div class="leftArea">

      <div class="option_title">
        <el-radio-group v-model="pagetype">
          <el-radio-button label="1" >选择形象</el-radio-button>
          <el-radio-button label="2" >选择背景</el-radio-button>
          <el-radio-button label="3" >选择花字</el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="pagetype==='2'" class="btn_hap">
        <button :class="['banBtn', { act: form.config.bg_type === 1 }]" @click="setHs(1)">
          竖版
        </button>
        <button :class="['banBtn', { act: form.config.bg_type === 2 }]" @click="setHs(2)">
          横板
        </button>
      </div>
      
      <!-- 选择形象 -->
      <div v-if="pagetype==='1'" class="leftArea_box">
        <ul class="pList">
          <el-image
            v-for="item in dpList"
            :key="item.id"
            :src="item.image"
            :class="['person', { checked: form.human_id == item.human_id }]"
            loading="lazy"
            @click="selectHuman(item.human_id, item)"
          />
        </ul>
      </div>
      <!-- 选择背景 -->
      <div v-if="pagetype==='2'" class="leftArea_box">
        <el-button plain type="info" class="upload_btn" @click="openFile" >
          <el-icon><Upload /></el-icon>
          上传背景图片
        </el-button>
        <!-- <div class="bgcolorList">
          <div v-for="(item,index) in bgcolorList" :key="index" :class="['bgcolorList_item',{ checked: form.bgcolor === item }]" :style="'background-color:'+item" @click="selectbg(1,item)"  />
        </div> -->

        <ul class="pList">
          <li v-for="item in bgList" :key="item.id">
            <el-image
              v-if="item.screen === form.config.bg_type"
              :src="item.bg.path"
              :class="['person', { checked: form.config.background == item.id }]"
              loading="lazy"
              @click="selectbg(1,item)"
            />
          </li>
        </ul>
      </div>

      <div v-if="pagetype==='3'" class="leftArea_box">
        <div class="signature_title">花字内容</div>
        <el-input class="inpsty" v-model="form.config.font_content" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" :placeholder="'请输入花字内容'" :maxlength="50" show-word-limit />

        <!-- <div class="signature_title">花字大小</div>
        <el-input-number class="inpsty" v-model="form.config.font_size" :controls="false" :min="75" :max="175" @blur="blurfontsize" /> -->

        <div class="signature_title">选择字体</div>
        <div class="fontarr_list">
          <div v-for="(item, index) in shortvideo.fontarr" :key="index" :class="['fontarr_list_item', { checked: form.config.font_family.id === item.id }]" :style="{'font-family':item.font}" @click="changeFamily(item)">
            {{ item.string }}
          </div>
        </div>

        <div class="signature_title">花字样式</div>
        <div class="fontstyle_list">
          <div v-for="(item, index) in shortvideo.fontStyle" :key="index" :class="['fontstyle_list_item', { checked: fontstyleindex === index }]" :style="getnewStyle(item)" @click="changeStyle(item,index)">
            字体颜色
          </div>
        </div>


        <div class="signature_title">字幕样式</div>
        <div class="subtitle_style_list">
          <div v-for="(item, index) in shortvideo.subtitle_style" :key="index" :class="['subtitle_style_list_item', { checked: subtitlestyleindex === index }]" :style="getStyle(item)" @click="changeSubtitle(item,index)">
            字幕样式
          </div>
        </div>

      </div>

    </div>

    <div class="rightArea">
      <div class="topCon center">
        <div class="dpBox" >
          <el-image v-if="bg_path"
            :src="bg_path"
            :class="['img_box_bg',form.config.bg_type === 1 ? 'vertical' : 'horizontal']"
            fit="fill"
          />
          <el-image
            :src="HumanData.image"
            :class="['img_box',form.config.bg_type === 1 ? 'vertical' : 'horizontal']"
            fit="contain"
          />

          <div v-if="form.config.font_content" class="preview" :style="poStyle()">
            <el-input v-model="form.config.font_content" 
              :input-style="getinpStyle()" 
              type="textarea" 
              :autosize="{ minRows: 2, maxRows: 10 }" 
              :placeholder="'请输入花字内容'" 
              :maxlength="50"  />
          </div>
        </div>
      </div>

      <div class="botCon">
        <!-- 操作区 -->
        <div class="btnGroup">
          <el-button color="#333" @click="setdub()">
            选择配音
          </el-button>

          <div v-if="chooseaudio.id" class="chooseaudio">
            当前选择配音：{{chooseaudio.name}}
          </div>

          <div>
            <audio v-if="playVideoObj" ref="audioitem" :src="playVideoObj.path" :controls="false" :loop="false">
              您的浏览器不支持 audio 标签。
            </audio>
          </div>
        </div>

        <!--  -->
        <div v-if="pagetype==='3'" class="signature">
          <div>花字位置</div>
          <div class="">
            <el-radio-group v-model="form.config.font_position">
              <el-radio v-for="(item,index) in shortvideo.fontPostion" :key="index" :label="item.value" @change="fontposition(item)">
                {{ item.title }}
              </el-radio>
            </el-radio-group>
            <div class="tip-font">建议开启字幕后不要选择 下-文字左对齐、下-文字居中、下-文字右对齐</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建短视频确认弹窗 -->
    <el-dialog v-model="crtCfmPop" title="是否创建短视频" width="567" destroy-on-close align-center center>
      <!-- 预计创建等待时间4分钟， -->
      <p style="text-align: center">
        预计消耗合成时长{{ hms }}（以实际合成时长为准），确认后开始创建
      </p>

      <template #footer>
        <el-button type="primary" @click="createLive">确定创建</el-button>
        <el-button @click="crtCfmPop = false">取消创建</el-button>
      </template>
    </el-dialog>

    <!-- 配音设置侧边弹窗 -->
    <el-drawer v-model="isjobdrawer" border title="选择配音" size="50%">
      <div class="jobdrawer_content">

        <div class="">
          <el-table :data="zmList" style="width: 100%" :empty-text="'暂无数据'">
            <el-table-column :label="'请点击选择短视频需要绑定的音频'">
              <template #default="scope">
                <div class="flex_between">
                  <div v-if="scope.row.detail.length && scope.row.detail[0].content" class="content">
                    {{ scope.row.detail[0].content }}
                  </div>
                  <div v-else class="content">
                    口播语音
                  </div>
                  <el-link v-if="scope.row.detail.length===1" @click="createAsr(scope.row)" type="primary" :underline="false">
                    点击生成字幕
                  </el-link>
                  <el-link v-else-if="scope.row.detail.length>1" @click="modefiAsr(scope.row, scope.row.detail[1])" type="primary" :underline="false">
                    字幕校验
                  </el-link>
                  <el-link v-else type="primary" :underline="false">
                    字幕已生成
                  </el-link>
                </div>
                <div class="flex_between">
                  <div v-if="scope.row.detail[0] && scope.row.detail[0].uploads">
                    <span>编号:{{ scope.row.detail[0].uploads.id }}</span>
                    <span v-if="scope.row.detail[0].uploads.extensions">
                      / 时长：{{ scope.row.detail[0].uploads.extensions.duration }}秒
                    </span>
                  </div>
                  <div>
                    <el-button v-if="isPlay && playVideoObj.id === scope.row.detail[0].uploads.id" size="small" @click="pauseVoice">
                      <el-icon><VideoPause /></el-icon>
                      暂停
                    </el-button>
                    <el-button v-else size="small" @click="playVoice(scope.row.detail[0].uploads)">
                      <el-icon><VideoPlay /></el-icon>
                      播放
                    </el-button>

                    <el-button v-if="scope.row.detail[1] && scope.row.detail[1].id" type="primary" size="small" @click="chooseVocie(1,scope.row)">
                      <el-icon><Lock /></el-icon>
                      {{ form.config.subtitle_id === scope.row.detail[1].id?'已选字幕':'选择字幕' }}
                    </el-button>
                    <el-button type="primary" size="small" @click="chooseVocie(2,scope.row)">
                      <el-icon><Lock /></el-icon>
                      {{ form.audio_id === scope.row.detail[0].uploads.id?'已选音频':'选择音频' }}
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="paginationstyle">
            <el-pagination 
              :page-size="5" 
              shide-on-single-page 
              small background 
              layout="prev, pager, next" 
              :total="pagination.total" 
              @size-change="sizechange"
              @current-change="currentchange"
              @prev-click="prevclick"
              @next-click="nextclick"
              class="mt-4"/>
          </div>
          
        </div>
        <div class="content_footer">
          <el-button type="primary" class="btn_style" @click="closejobdrawer">确认</el-button>
          <el-upload
            action="https://zwshuziren.oss-cn-beijing.aliyuncs.com"
            :show-file-list="false"
            :http-request="ossUpload"
            :on-success="uploadSuccess"
            :accept="'.mp3,.ogg,.wav,audio,img'"
          >
            <el-button>本地上传</el-button>
          </el-upload>
          <!-- <el-button v-has="'jobStore'" type="success" @click="createVoice">制作配音</el-button> -->
          <!-- <el-button @click="closejobdrawer" class="btn_style">确认</el-button> -->
        </div>
      </div>
    </el-drawer>

    <!-- 字幕校验 -->
    <el-drawer v-model="checkDrawer" title="字幕校验" size="50%" @close="closemodefiAsr" >
      <div v-if="isasr" class="asr_content">
        <!-- <el-form v-if="asr && asr.content" ref="asr" :rules="rulesForm" :model="asr.content" label-width="150px">
          <el-form-item prop="content" label-width="0px">
            <el-timeline >
              <el-timeline-item v-for="(item,index) in asr.content" :key="index" :timestamp="item.from+'ms'" placement="top" color="#3a8ee6">
                <el-form-item :prop="`content.${index}.content`" :rules="rulesForm.contentItem">
                  <el-input v-model="item.content" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" style="width:40vw" :placeholder="'原字幕：'+item.old" :maxlength="100" show-word-limit />
                  <div style="width:40vw">
                    <el-button type="primary" size="small" plain @click="addasritem(index)">
                      拆分
                    </el-button>
                  </div>
                </el-form-item>
              </el-timeline-item>
              <div v-if="asr.content && asr.content.length" class="endtime">
                结束时间：{{ asr.content[asr.content.length-1].to }}ms
              </div>
            </el-timeline>
          </el-form-item>
        </el-form> -->

        <el-timeline >
          <el-timeline-item v-for="(item,index) in asr.content" :key="index" :timestamp="item.from+'ms'" placement="top" color="#3a8ee6">
            <el-input v-model="item.content" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" style="width:40vw" :placeholder="'原字幕：'+item.old" :maxlength="100" show-word-limit />
            <div style="width:40vw;margin-top: 6px;">
              <el-button type="primary" size="small" plain @click="addasritem(index)">
                拆分
              </el-button>
            </div>
          </el-timeline-item>
          <div v-if="asr.content && asr.content.length" class="endtime">
            结束时间：{{ asr.content[asr.content.length-1].to }}ms
          </div>
        </el-timeline>

        <div class="asr_title">字幕校验说明</div>
        <ul class="asr_rule">
          <li>系统是根据你选择的语音自动生成的字幕，字幕中的文字本系统不保证完全正确，故需要您进行校验。</li>
          <li>校验只能修改因读音不准确造成的文字识别错误，并不能进行大段文字修改。</li>
          <li>如因系统无法识别造成段落过长，可进行拆分操作，如拆分错误可点击重置按钮重新拆分。</li>
          <li>校验后的结果将在提交后生效。</li>
        </ul>
        <div class="asr_footer">
          <el-button type="primary" @click="submitasr('asr')">提交校验</el-button>
          <el-button type="warning" @click="initasr">重置</el-button>
          <el-button @click="checkDrawer=false">取消</el-button>
        </div>
      </div>
    </el-drawer>


    <!-- 上传文件管理 -->
    <FileManager :type="6" :pageSize="8" :isvisible="isFileCard" @change="changeFile"  @close="closeuploadinfo" />

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
  Upload,
  VideoPause,
  VideoPlay,
  Lock
} from '@element-plus/icons-vue';
import {
  humanList,
  // createProJect,
  // updateProJect,
  // projectDetail,
  // compositeVideo,
  // videoNeedTime,
  // 
  shortvideoBackgroundList,
  shortvideoBackjob,
  postjob,
  generateVideo,
  putsubtitle,
  svjobdetail,
  generateDuration
} from '../../api';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { clone, remove, uniqBy } from 'lodash-es';
import { useProjectStore,shortvideoStore } from '../../stores';
import { getTime, getTime_two } from '../../utils/helper';
import OSS from 'ali-oss'
import { format } from 'date-fns'
import { sampleSize } from 'lodash-es'
import { storeToRefs } from 'pinia'
const { ossData } = storeToRefs(useProjectStore())

const route = useRoute();
const router = useRouter();
const project = useProjectStore(); // 仓库 直播
const shortvideo = shortvideoStore(); //仓库 短视频
// const partAct = ref(null); // 选中的片段下标
const crtCfmPop = ref(false); //是否显示创建弹窗
const usedTime = ref(''); // 生成视频预计消耗时长
const dpList = ref([]); // 数字人形象列表
const bgList = ref([]); // 背景图列表
// const bgcolorList = ref([
//   '#fa436a',
//   '#e54d42',
//   '#f37b1d',
//   '#fbbd08',
//   '#8dc63f',
//   '#39b54a',
//   '#1cbbb4',
//   '#0081ff',
//   '#6739b6',
//   '#9c26b0',
//   '#e03997',
//   '#e03007',
// ]); // 背景颜色列表

const pagetype = ref('1'); // 页面类型1：数字人  2：背景  3：花字
// const colorselection = ref('#409EFF'); // 颜色选择器
const form = reactive({
  // id:'',
  name: '', // 短视频名称
  // wideorvertical:1, // 1：宽屏  2：竖屏
  human_id:'',// 数字人id
  audio_id:'',// 音频id
  config:{
    background:"", // 背景图id（图片记录id）
    bg_type:1,//  背景类型 1竖屏 2横屏
    bg_upload_type:1, // 背景上传图片 1系统 2自定义 

    font_family: { id: 1, font: 'zk-kuaile-font' }, //
    font_position:'TopCenter', // 花字位置
    font_style:null, // 花字样式
    font_size:75, // 字体大小
    font_content:"", //

    subtitle_style:null, // 字幕样式
    subtitle_id:"", // 字幕记录id
  },
});

const asr = reactive({
  id:null,
  row: null,
  content: null
})
const isasr = ref(true); // 是否显示字幕校验弹窗内容
const asr_two = reactive({
  id:null,
  row: null,
  content: null
})
const rulesForm = reactive({
  content: [{ required: true, message: '请输入配音文字', trigger: 'blur' }],
  contentItem: [{ required: true, message: '请填写文字', trigger: 'change' }]
})


const fontstyleindex  = ref(-1);// 选中样式的索引
const subtitlestyleindex  = ref(-1);// 选中样式的索引
const HumanData = ref({}); // 选中数字人
const bg_path = ref(''); // 选中背景链接


const isjobdrawer = ref(false); // 是否显示字幕设置弹窗
const checkDrawer = ref(false); // 是否显示字幕校验弹窗
const isFileCard = ref(false); // 是否显示文件列表弹窗
const iscreateAsr = ref(false); // 是否允许创建字幕

const zmList = ref([]); // 字幕任务列表
const captions = reactive({  // 字幕上传 type
    type:13
});
const chooseaudio = ref({}); // 已选择音频
const playVideoObj = ref({}); // 音频 载体 播放
const audioitem = ref()
const isPlay = ref(false);  // 是否播放音频

const pagination = reactive({
  page: 1, // 当前页数
  size: 5, // 每页显示条目个数
  total: 100 // 总条目数
});
const previewfontstyle = reactive({
  FontColor:'',
  OutlineColour: '',
  BackColour: '',
  FontColor: '',
  Outline: '',
  Shadow: '',
  left:'36px',
  right:'',
  top:'100px',
  bottom:'',
});


// 对时间显示进行处理
const hms = computed(()=>{
  if(usedTime.value){
      const [h, m, s] = getTime_two(usedTime.value)
      if(h !== '00'){
        return `${h}时${m}分${s}秒`
      } else if(m !== '00'){
        return `${m}分${s}秒`
      } else {
        return `${s}秒`
      }
      // return `${h}时${m}分${s}秒`
  } else {
    return `${'1'}时${'4'}分${'16'}秒`
  }
})

// 
onBeforeMount(() => {
  const { pn, pid } = route.query;

  if(pn){
    form.name = pn;
  }
  getHumanList().then((data) => {
    if (data && data.length > 0) {
      const { human_id, image } = data[0];
      form.human_id = human_id
      HumanData.value = data[0]
    }
  });
  getShortvideoBackgroundList().then()  
});

onMounted(() => {
  project.queryAliToken()
});

// 设置横竖屏
function setHs(num) {
  // form.config.bg_upload_type = num;
  form.config.bg_type = num;
  if(form.config.bg_type===1){
    if(form.config.font_position==='TopCenter'){
      previewfontstyle.left='36px',
      previewfontstyle.right='',
      previewfontstyle.top='0px',
      previewfontstyle.bottom=''
    }
    if(form.config.font_position==='CenterCenter'){
      previewfontstyle.left='36px',
      previewfontstyle.right='',
      previewfontstyle.top='100px',
      previewfontstyle.bottom=''
    }
    if(form.config.font_position==='BottomCenter'){
      previewfontstyle.left='36px',
      previewfontstyle.right='',
      previewfontstyle.top='',
      previewfontstyle.bottom='10px'
    }
  } else {
    if(form.config.font_position==='TopCenter'){
      previewfontstyle.left='38%',
      previewfontstyle.right='',
      previewfontstyle.top='0px',
      previewfontstyle.bottom=''
    }
    if(form.config.font_position==='CenterCenter'){
      previewfontstyle.left='38%',
      previewfontstyle.right='',
      previewfontstyle.top='100px',
      previewfontstyle.bottom=''
    }
    if(form.config.font_position==='BottomCenter'){
      previewfontstyle.left='38%',
      previewfontstyle.right='',
      previewfontstyle.top='',
      previewfontstyle.bottom='10px'
    }
  }
  // 背景初始化
  form.config.background = ''
  bg_path.value = ''
}

// ---------------------------------------------------

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
function selectHuman(id, item) {
  form.human_id = id
  HumanData.value = item
}

// -----------------------------------------------------------
// 打开文件弹窗
function openFile(){
  isFileCard.value = true
}
// 文件传值
function changeFile(val){
  // console.log('传值')
  // console.log(val)
  // form.config.bg_type = 2
  form.config.bg_upload_type = 2

	// 创建实例对象
	const imageobj = new Image();
	// 图片地址
	imageobj.src = val.path;
	imageobj.onload = function () {
    //  竖屏 1080*1920 横屏 3413*1920
    // bg_type 背景类型 1竖屏 2横屏
    // console.log(imageobj.width)
    // console.log(imageobj.height)
    if(imageobj.width===1080 && imageobj.height===1920){
      // form.config.bg_upload_type = 1
      form.config.bg_type = 1
    } else {
      // form.config.bg_upload_type = 2
      form.config.bg_type = 2
    }
}

  form.config.background = val.id
  bg_path.value = val.path
  isFileCard.value = false
}
// 关闭文件弹窗
function closeuploadinfo(val){
  isFileCard.value = false
}
// 获取背景图列表
async function getShortvideoBackgroundList() {
  const res = await shortvideoBackgroundList();
  if (res && res.data) {
    bgList.value = res.data;
    return res.data;
  }
  return false;
}

// 选择背景图
function selectbg(type,item) {
  // type 背景上传图片 1系统 2自定义
  // form.config.bg_type = type
  form.config.bg_upload_type = type
  if(form.config.background ===''){
    form.config.background = item.bg.id
    bg_path.value = item.bg.path
  } else if(form.config.background === item.bg.id) {
    form.config.background = ''
    bg_path.value = ''
  } else {
    form.config.background = item.bg.id
    bg_path.value = item.bg.path
  }
  
  
  // if(type===1){
  //   form.bgcolor = item
  //   form.bg_id = -1
  //   form.bg_path = ''
  // } else {
  //   form.config.background = item.id
  //   bg_path.value = item.bg.path
  //   // form.bgcolor = ''
  // }
}

// 取色器选颜色
function selectbgcolor(e){
  if(e){
    form.bg_id = -1
    form.bg_path = ''
    form.bgcolor = e
  }
}

// ---------------------------------------------------------------
// 选择花字
function selectsignature(item) {
  form.bg_id = item.id
}
function getnewStyle(item) {
  return {
    'font-family': form.config.font_family ? form.config.font_family.font : '',
    color: item ? item.FontColor : '',
    'text-shadow': item ? `${item.OutlineColour} 1px 0 0, ${item.OutlineColour} 0 1px 0, ${item.OutlineColour} -1px 0 0, ${item.OutlineColour} 0 -1px 0` : ''
  }
}

function getStyle(item) {
  return {
    'font-family': 'xinqingnian-changgui',
    color: item.FontColor,
    'text-shadow': `${item.OutlineColour} 1px 0 0, ${item.BackColour} 0 1px 0, ${item.OutlineColour} -1px 0 0, ${item.OutlineColour} 0 -1px 0`
  }
}


function getinpStyle() {
  return {
    'font-family': form.config.font_family ? form.config.font_family.font : '',
    // 'font-size':form.config.font_size?form.config.font_size:''
    color: previewfontstyle.FontColor ? previewfontstyle.FontColor: '',
    'text-shadow': previewfontstyle.OutlineColour?`${previewfontstyle.OutlineColour} 1px 0 0, ${previewfontstyle.BackColour} 0 1px 0, ${previewfontstyle.OutlineColour} -1px 0 0, ${previewfontstyle.OutlineColour} 0 -1px 0`:''
  }
}
// 预览位置
function poStyle() {
  if(previewfontstyle.left){
    if(previewfontstyle.top){
      return {
        left:previewfontstyle.left ? previewfontstyle.left: '',
        top:previewfontstyle.top ? previewfontstyle.top: '',
      }
    }else {
      return {
        left:previewfontstyle.left ? previewfontstyle.left: '',
        bottom:previewfontstyle.bottom ? previewfontstyle.bottom: "",
      }
    }
  } else {
    if(previewfontstyle.top){
      return {
        right:previewfontstyle.right ? previewfontstyle.right: '',
        top:previewfontstyle.top ? previewfontstyle.top: '',
      }
    }else {
      return {
        right:previewfontstyle.right ? previewfontstyle.right: '',
        bottom:previewfontstyle.bottom ? previewfontstyle.bottom: "",
      }
    }
  }
}
// 花字大小
function blurfontsize(e){
  console.log('花字大小')
  console.log(e)
}
// 选择字体位置
function fontposition(item){
  // console.log('选择字体位置')
  // console.log(item)
  switch (item.value) {
    case 'TopLeft':
      previewfontstyle.left='0px',
      previewfontstyle.right='',
      previewfontstyle.top='0px',
      previewfontstyle.bottom=''
      break 
    case 'TopCenter':
      previewfontstyle.right='',
      previewfontstyle.top='0px',
      previewfontstyle.bottom=''
      if(form.config.bg_type===1){
        previewfontstyle.left='36px'
      } else {
        previewfontstyle.left='38%'
      }
      break 
    case 'TopRight':
      previewfontstyle.left='',
      previewfontstyle.right='0px',
      previewfontstyle.top='0px',
      previewfontstyle.bottom=''
      break 
    case 'CenterLeft':
      previewfontstyle.left='0px',
      previewfontstyle.right='',
      previewfontstyle.top='100px',
      previewfontstyle.bottom=''
      break 
    case 'CenterCenter':
      previewfontstyle.right='',
      previewfontstyle.top='100px',
      previewfontstyle.bottom=''
      if(form.config.bg_type===1){
        previewfontstyle.left='36px'
      } else {
        previewfontstyle.left='38%'
      }
      break 
    case 'CenterRight':
      previewfontstyle.left='',
      previewfontstyle.right='0px',
      previewfontstyle.top='100px',
      previewfontstyle.bottom=''
      break 
    case 'BottomLeft':
      previewfontstyle.left='0px',
      previewfontstyle.right='',
      previewfontstyle.top='',
      previewfontstyle.bottom='10px'
      break 
    case 'BottomCenter':
      previewfontstyle.right='',
      previewfontstyle.top='',
      previewfontstyle.bottom='10px'
      if(form.config.bg_type===1){
        previewfontstyle.left='36px'
      } else {
        previewfontstyle.left='38%'
      }
      break 
    case 'BottomRight':
      previewfontstyle.left='',
      previewfontstyle.right='0px',
      previewfontstyle.top='',
      previewfontstyle.bottom='10px'
      return 
  }
}

// 选择字体
function changeFamily(item) {
  // console.log('选择字体')
  // console.log(item)
  form.config.font_family = item
  getnewStyle()
}
// 选择花字
function changeStyle(item,index) {
  // console.log('选择花字')
  // console.log(item)
  if(fontstyleindex.value === index){
    form.config.font_style = null
    fontstyleindex.value = ''
    previewfontstyle.OutlineColour = ''
    previewfontstyle.BackColour = ''
    previewfontstyle.FontColor = ''
    previewfontstyle.Outline = ''
    previewfontstyle.Shadow = ''
  } else {
    form.config.font_style = item
    fontstyleindex.value = index
    previewfontstyle.OutlineColour = item.OutlineColour
    previewfontstyle.BackColour = item.BackColour
    previewfontstyle.FontColor = item.FontColor
    previewfontstyle.Outline = item.Outline
    previewfontstyle.Shadow = item.Shadow
  }
}

// 选择字幕样式
function changeSubtitle(item,index) {
  // console.log('选择字幕样式')
  if(subtitlestyleindex.value === index){
    form.config.subtitle_style = null
    subtitlestyleindex.value = ''
  } else {
    form.config.subtitle_style = item
    subtitlestyleindex.value = index
  }
}


// ------------------------------------------------------------
// 打开侧边栏 选择配音
function setdub(){
  getshortvideoBackjob().then()
  isjobdrawer.value = true
}

// 关闭侧边弹窗 选择配音
function closejobdrawer(){
  isjobdrawer.value = false
}

// 获取字幕任务列表
async function getshortvideoBackjob() {
  const res = await shortvideoBackjob(pagination);
  if (res && res.data) {
    zmList.value = res.data;
    pagination.total = res.meta.total
    return res.data;
  }
  return false;
}
// 点击生成字幕
function createAsr (row){
  if(iscreateAsr.value === true){
    ElMessage({ type: 'warning', message: '请务频繁点击！' });
    return
  }
  const params = {
    type:2,
    upload_id:row.detail[0].uploads.id,
    job_id:row.id
  }
  postjob(params).then(res=>{
    iscreateAsr.value === true
    const loading = ElLoading.service({
      lock: true,
      text: '花字生成中，请稍等。。。',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    getsvjobdetail(res.data.id).then(res=>{
      if(res){
        iscreateAsr.value === false
        // console.log('成功')
        // console.log(res)
        loading.close()
        // modefiAsr(row, res)
        getshortvideoBackjob().then()
      }
    })

    setTimeout(() => {
      getshortvideoBackjob().then()
      loading.close()
    }, 6000)
  })
}
// 获取字幕详情
async function getsvjobdetail(id) {
  let num = 0
  const max = 15
  const errResponse = (i) => {
    clearInterval(i)
  }
  const t = setInterval(() => {
    num++
    svjobdetail(id).then(res=>{
      // Created、Finished、Executing、Failed
      switch (res.data.status) {
        case 'Finished':
          clearInterval(t)
          // resolve(res.data)
          modefiAsr(row, res.data)
          getshortvideoBackjob().then()
          return res.data
          break
        case 'Failed':
          errResponse(t)
          break
        default:
          // 第十次请求仍旧无结果则放弃等待
          if (num === max) {
            errResponse(t)
          }
        break
      }
    }).catch(() => {
      errResponse(t)
    })
    // 上限
    if (num === max) {
      clearInterval(t)
    }
  }, 6000)
  return false;
}

// 字幕校验
function modefiAsr(row, content){
  // console.log('字幕校验')
  // console.log(row)
  // console.log(content)
  if(content.content===null){
    ElMessage({ type: 'warning', message: '字幕生成中，请稍等！' });
    return
  }
  isasr.value = true
  asr.row = JSON.parse(JSON.stringify(row))
  asr.content = JSON.parse(JSON.stringify(content.content))
  asr.id = JSON.parse(JSON.stringify(content.id))

  checkDrawer.value = true
  asr_two.row = JSON.parse(JSON.stringify(row))
  asr_two.content = JSON.parse(JSON.stringify(content.content))
  asr_two.id = JSON.parse(JSON.stringify(content.id))
}
// 关闭字幕校验
function closemodefiAsr (){
  // console.log('关闭字幕校验')
  checkDrawer.value = false
  asr.row = null
  asr.content = null
  isasr.value = false
}

// 重置 原有字幕
function initasr() {
  asr.id = asr_two.id
  asr.content = asr_two.content.map(item => {
    return {
      ...item,
      old: item.content
    }
  })
}
// 拆分 字幕
function addasritem(index){
  const pre = asr.content[index]
  const obj = {
    from: Math.round((pre.from + (pre.to - pre.from) / 2)),
    to: pre.to,
    content: '',
    old: ''
  }
  asr.content.splice(index + 1, 0, obj)
  asr.content[index].to = obj.from
}
// 更新字幕
function submitasr(formName) {
  // this.$refs[formName].validate((valid) => {
  //   if (valid) {
    let issubasr = false
      const content = asr.content.map(item => {
        if(item.content===''){
          issubasr = false
          return
        } else {
          issubasr = true
        }
        const obj = { ...item }
        delete obj.old
        return obj
      })
      if(issubasr===false){
        ElMessage({ type: 'warning', message: '拆分内容不能为空！' });
        return
      }
      // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      putsubtitle({id: asr.id,content}).then(res=>{
        // console.log('更新字幕')
        // console.log(res)
        closemodefiAsr()
      })
  //   }
  // })
}

// 播放
function playVoice(row) {
  // 若点击播放与之前不相等，则先暂停再播放
  if (playVideoObj.id !== row.id) {
    pauseVoice()
  }

  playVideoObj.value = row
  setTimeout(() => {
    audioitem.value.play()
    isPlay.value = true
  }, 100)
}
// 暂停
function pauseVoice() {
  audioitem.value.pause()
  isPlay.value = false
}

// 选择字幕 配音
function chooseVocie(type,row) {
  if(type===1){
    if(row.detail[1] && row.detail[1].id){
      if(form.audio_id === '' && form.config.subtitle_id === '' ){
        form.config.subtitle_id = row.detail[1].id
      } else if(form.audio_id > 0 && form.audio_id !==row.detail[0].uploads.id){
        ElMessage({ type: 'warning', message: '字幕与配音请保持对应！' });
      } else if(form.config.subtitle_id === row.detail[1].id){
        form.config.subtitle_id = ''
      } else {
        form.config.subtitle_id = row.detail[1].id
      }
    } else {
      ElMessage({ type: 'warning', message: '请先生成字幕！' });
    }
  } else { 
    if(form.audio_id === '' && form.config.subtitle_id === '' ){
      form.audio_id = row.detail[0].uploads.id
      chooseaudio.value = row.detail[0].uploads
    } else if(form.config.subtitle_id > 0 && !row.detail[1]){
      ElMessage({ type: 'warning', message: '字幕与配音请保持对应！' });
    }  else if(form.config.subtitle_id > 0 && row.detail[1] && row.detail[1].id && form.config.subtitle_id !==row.detail[1].id){
      ElMessage({ type: 'warning', message: '字幕与配音请保持对应！' });
    } else if(form.audio_id === row.detail[0].uploads.id){
      form.audio_id = ''
      chooseaudio.value = {}
    } else {
      chooseaudio.value = row.detail[0].uploads
      form.audio_id = row.detail[0].uploads.id
    }
  }
}

// ----------------------

// 弹窗页码
function sizechange(val){
  pagination.page = val
  getshortvideoBackjob().then()
}
// 弹窗页码 指定页
function currentchange(val){
  pagination.page = val
  getshortvideoBackjob().then()
}
// 弹窗页码 上一页
function prevclick(val){
  if(pagination.page===1){
    ElMessage({ type: 'info', message: '当前页面为第一页' })
  } else {
    pagination.page = pagination.page - 1
    getshortvideoBackjob().then()
  }
}
// 弹窗页码 下一页
function nextclick(val){
  const can = Math.ceil(pagination.total / 5)
  if (can <= pagination.page){
    ElMessage({ type: 'info', message: '当前页面为最后一页' })
  } else {
    pagination.page = pagination.page - 1
    getshortvideoBackjob().then()
  }
}

// --------------------------------------------------------------------------------------------------
// 上传音频
function uploadSuccess(res, file) {
  console.log('上传音频结果', res);
  if (res.code===0) {
    pagination.page = 1
    getshortvideoBackjob().then()
    ElMessage({ type: 'success', message: '上传录音成功！' });
  } else {
    ElMessage({ type: 'warning', message: '上传录音失败！' });
  }
}
// 
function randomString(len) {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return sampleSize(charSet, len).toString().replace(/,/g, '')
}
// 
function getSuffix(name) {
  const arr = name.split('.')
  return '.' + arr[arr.length - 1]
}
// 
function getRandomName(name) {
  return randomString(20) + getSuffix(name)
}
// 
function ossUpload(e){
  const { file, onProgress, onSuccess, onError } = e
  const client = new OSS(ossData.value.base)
  // 定义上传方法
  async function multipartUpload() {
    try {
      // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
      // 您可以通过自定义文件名（例如exampleobject.txt）或目录（例如exampledir/exampleobject.txt）的形式，实现将文件上传到当前Bucket或Bucket中的指定目录。
      const { res, data } = await client.multipartUpload(`voice/${captions.type}/${format(new Date(), 'yyyy-MM-dd')}/${getRandomName(file.name)}`, file, {
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
            type: String(captions.type),
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
// -------------------------------------------------------------


// 打开创建短视频弹窗 显示预计时间
 function startCfmCrate() {
  // 1.获取音频时长
  // if(form.audio_id){
  //   await generateDuration( form.audio_id ).then((res) => {
  //     if (res && res.data) {
  //       usedTime.value = res.data.duration;
  //       crtCfmPop.value = true;
  //     }
  //   });
  // } else {
  //   ElMessage({ type: 'warning', message: '请选择音频！' })
  // }
  const data = JSON.parse(JSON.stringify(form))
  if(data.audio_id){
    if(data.config.subtitle_id && (data.config.subtitle_style===null || data.config.subtitle_style===undefined ||data.config.subtitle_style ==='')){
      ElMessage({ type: 'warning', message: '请选择字幕样式！' })
      return
    } else if(data.config.font_content &&(data.config.font_style===null || data.config.font_style===undefined ||data.config.font_style ==='')){
      ElMessage({ type: 'warning', message: '请选择花字样式！' })
      return
    } else {
      
      console.log('通过')
      console.log(data)
      getgenerateDuration()
    }
  } else {
    ElMessage({ type: 'warning', message: '请选择音频！' })
  }

}

// 1.获取音频时长
async function getgenerateDuration(){
  await generateDuration( form.audio_id ).then((res) => {
    if (res && res.data) {
      usedTime.value = res.data.duration;
      crtCfmPop.value = true;
    }
  });
}

// 创建短视频
function createLive() {
  // 2.根据语音ID生成视频
  // formateData(form)
  // console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
  generateVideo(formateData(form)).then(res=>{
    if (res && res.data) {
      crtCfmPop.value = false
      // loading.close()
      ElMessage({ type: 'success', message: res.message })
      router.back()
    } else {
      crtCfmPop.value = false
      // loading.close()
    }
  });
}

function formateData(form){
  const data = JSON.parse(JSON.stringify(form))
  for (const item in data) {
    // if ((item === 'id') && (data[item]===null || data[item]===undefined || data[item]==='')){
    //   delete data[item]
    // }
    if (item === 'config'){
      for (const item_item in data[item]){

        if((item_item === 'font_content')&&(data[item][item_item]===null || data[item][item_item]===undefined || data[item][item_item]==="")){
          delete data[item]['font_content']
          delete data[item]['font_family']
          delete data[item]['font_position']
          delete data[item]['font_style'] 
          delete data[item]['font_size']
          // console.log('font_content为空')
        } 
        // if(data[item]['font_family']&&(data[item][item_item]===null || data[item][item_item]===undefined || data[item][item_item]==="")){
        //   if(data.config.font_content===null || data.config.font_content===undefined || data.config.font_content===""){
        //     delete data[item][item_item]
        //   }
        // }
        // if(data[item]['font_style']&&(data[item][item_item]===null || data[item][item_item]===undefined || data[item][item_item]==="")){
        //   if(data.config.font_content===null || data.config.font_content===undefined || data.config.font_content===""){
        //     delete data[item][item_item]
        //   }
        // }


        if(data[item]['subtitle_id']===''){
          delete data[item]['subtitle_id']
          delete data[item]['subtitle_style']
        }

        if(data[item][item_item]===null || data[item][item_item]===undefined || data[item][item_item]==='') {
          delete data[item][item_item]
        }
      }
    }
  }

  console.log('结果')
  console.log(data)
  return data
}
</script>

<style lang="scss" scoped>
.createPage {
  // border: 1px solid red;
  display: flex;
  color: #fff;
  position: relative;
  // position: fixed;
  // top: 20px;
  .fixedHead {
    // border: 1px solid red;
    width: 1250px;
    height: 56px;
    position: fixed;
    top: 0;
    left: 190px;
    z-index: 1;
    padding: 0 40px;
    justify-content: center;
    background-color: #282828;
    .partName {
      width: 101px;
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
    .banBtn {
      width: 60px;
      height: 28px;
      background: #333;
      border-radius: 4px;
      margin: 0 10px;
      font-size: 14px;
      cursor: pointer;
      &.act {
        background: #666 !important;
      }
    }
  }

  //   
  .leftArea {
    // border: 1px solid red;
    width: 300px;
    // min-height: 824px;
    height: 824px;
    overflow: hidden;
    background: #282828;
    // padding: 14px 15px;
    margin-right: 11px;
    .option_title{
      width: 100%;
      text-align: center;
      padding-top: 10px;
    }
    .btn_hap{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      .banBtn {
        width: 60px;
        height: 28px;
        background: #333;
        border-radius: 4px;
        margin: 0 10px;
        margin-top: 10px;
        font-size: 14px;
        cursor: pointer;
        &.act {
          background: #666 !important;
        }
      }
    }
    .leftArea_box{
      height: 820px;
      width: 100%;
      scroll-behavior: smooth;
      overflow-y: scroll;
      padding: 0px 15px 90px 15px;
      .pList {
        // margin: 20px -5px 0;
        margin: 14px -5px 0;
        column-width: 100px;
        column-count: auto;
        column-gap: 10px;

        .person {
          display: block;
          background: #1e1e1e;
          margin-bottom: 10px;
          cursor: pointer;
          border: 1px solid rgb(0,0,0,0);
          &.checked {
            // border: 1px solid #1182fb;
            border: 1px solid #409eff;
            // border: 1px solid red;
            border-radius: 4px;
          }
        }
      }

      .signature_title{
        padding-left: 10px;
        margin-top: 10px;
      }
      .inpsty{
        margin-top: 6px;
      }
      .fontarr_list{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding: 0 20px;
        .fontarr_list_item{
          cursor: pointer;
          font-size: 20px;
          margin-bottom: 5px;
          &.checked {
            // border: 1px solid #409eff;
            color: #409eff;
            font-size: 21px;
          }
        }
      }
      .fontstyle_list{
        display: flex;
        flex-wrap: wrap;
        justify-content:space-around;
        align-items: center;
        margin-top: 10px;
        .fontstyle_list_item{
          width: 35%;
          cursor: pointer;
          font-size: 20px;
          margin-bottom: 5px;
          &.checked {
            // border: 1px solid #1182fb;
            border: 1px solid #409eff;
            font-size: 21px;
            border-radius: 4px;
            padding-left: 2px;
          }
        }
      }
      .subtitle_style_list{
        display: flex;
        flex-wrap: wrap;
        justify-content:space-around;
        align-items: center;
        margin-top: 10px;
        .subtitle_style_list_item{
          width: 35%;
          cursor: pointer;
          font-size: 20px;
          margin-bottom: 5px;
          &.checked {
            // border: 1px solid #1182fb;
            border: 1px solid #409eff;
            font-size: 21px;
            border-radius: 4px;
            padding-left: 2px;
          }
        }
      }

      .upload_btn{
        width: 270px;
        margin-top: 10px;
      }

      .bgcolorList{
        // margin-top: 6px;
        width: 270px;
        // border: 1px solid red;
        display: flex;
        flex-wrap: wrap;
        padding-left: 4px;
        // justify-content: space-between;
        .bgcolorList_item{
          margin-top: 10px;
          margin-right: 10px;
          width: 34px;
          height: 34px;
          border: 1px solid #999999;
          border-radius: 5px;
          // border: 1px solid rgb(0,0,0,0);
          // background-color: #d2e4f7;
          cursor: pointer;
          &.checked {
            // border: 1px solid #f10808;
            border-radius: 4px;
          }
        }
        .bgcolorList_item_color{
          padding: 0;
          overflow: hidden;
        }
      }
    }

    .leftArea_box::-webkit-scrollbar {
      width: 4px;
    }
    .leftArea_box::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(0,0,0,0);
    }
    .leftArea::-webkit-scrollbar-track {
        border-radius: 0;
        background: rgba(0,0,0,0);
    }
  }

  .rightArea {
    width: 905px;
    // border: 1px solid blue;
    .topCon {
      // border: 1px solid rgb(0, 255, 76);
      height: 607px;
      background: #282828;
      padding: 20px;
      margin-bottom: 10px;
      .dpBox {
        // border: 1px solid rgb(208, 255, 0);
        background-color: #1e1e1e;
        height: 567px;
        display: flex;
        align-items: flex-end;
        position: relative;
        .img_box{
          position: relative;
          z-index: 3;
          height: 530px;
        }
        .img_box_bg{
          position: absolute;
          z-index: 2;
        }
        .horizontal {
          width: 865px;
          height: 567px;
        }
        .vertical {
          width: 325px;
        }
        .preview{
          z-index: 3;
          // border: 1px solid red;
          position: absolute;
          margin: 0;
          padding:0 ;
          overflow: hidden;
        }
      }
    }
    .botCon {
      min-height: 206px;
      background: #282828;
      // border: 1px solid red;
      .btnGroup {
        // border: 1px solid rgb(255, 0, 200);
        height: 54px;
        border-bottom: 1px solid #4b4b4b;
        padding: 0 20px;
        display: flex;
        align-items: center;
        .chooseaudio{
          margin-left: 20px;
          font-size: 16px;
        }
      }
      .signature{
        padding-left: 30px;
        padding-top: 10px;
        .tip-font{
          color: #e6a23c;
          font-size: 12px;
        }
      }
      // .btnIcon {
      //   font-size: 23px;
      //   color: #ccc;
      //   cursor: pointer;
      //   width: 50px;
      //   height: 30px;
      // }
      // .upload-voice {
      //   margin-left: 20px;
      // }
      // .insertIcon {
      //   font-size: 18px;
      //   color: #ccc;
      //   margin-right: 4px;
      // }
    }

    
  }

}


.jobdrawer_content{
  position: relative;
  width: 100%;
  height: 100%;
  .content_footer{
    position: absolute;
    bottom: 40px;
    right: 20px;
    display: flex;
    align-items: center;
    // .el-button {
    //   // height: 31px;
    //   margin-left: 10px;
    // }
    .btn_style{
      position: relative;
      top: 1px;
      height: 30px;
      margin-right: 10px;
    }
  }
}
.flex_between{
  width: 100%;
  // line-height: 25px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 16px;
}
.paginationstyle{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.asr_content{
  position: relative;
  .asr_title{
    font-size: 16px;
    margin-top: 16px;
  }
  .asr_rule{
    margin-top: 8px;
    list-style: cjk-ideographic;
    font-size: 13px;
    line-height: 22px;
    padding-left: 20px;
    padding-bottom: 60px;
    li{
      margin-bottom: 5px;
    }
  }
  .asr_footer{
    position: fixed;
    bottom: 30px;
    right: 50px;
  }
  .endtime{
    color: #909399;
    line-height: 1;
    font-size: 13px;
    margin-left: 28px;
  }
}
</style>
