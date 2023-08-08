<template>
  <div class="aicreate">
    <div>
      <el-form ref="ruleFormRef" :model="form" :rules="rules" scroll-to-error>
        <div class="form_line">
          <el-form-item prop="content">
            <el-input
              v-model="form.content"
              placeholder="请输入文案描述！"
              :disabled="iscompile"
              style="width: 500px; background-color: #312f2f"
              size="large"
              type="textarea"
              show-word-limit
              maxlength="200"
            />
          </el-form-item>
          <el-form-item v-if="!iscompile" class="btnstyle">
            <el-button
              type="primary"
              :disabled="iscompile"
              @click="submitForm(ruleFormRef)"
              >生成文案</el-button
            >
          </el-form-item>
          <el-form-item v-else class="btnstyle">
            <el-button type="primary" @click="initialization"
              >再次提问</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="gtp_title">GPT文案</div>

    <div class="content_box">
      <!-- <div v-html="copywriting" class="markdown leading-7"></div> -->
      <span v-if="iscompile" ref="copywriting" class="msg"></span>
      <span v-else ref="text" class="msg"></span>
      <!-- <div v-html="html" class="markdown leading-7" /> -->
    </div>



  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import TypeIt from 'typeit';
const trigger = ['blur', 'change'];
const ruleFormRef = ref();
import { postchatgpt } from '../../api/index';
const form = reactive({
  content: '',
});
const rules = reactive({
  content: [
    { required: true, message: '请输入文案描述！', trigger },
    { min: 3, max: 200, message: '输入字数在3个到200个之间', trigger },
  ],
});
const iscompile = ref(false);

const copywriting = ref('请耐心等待文案生成。。。');
const copywritingtwo = ref(
  '苏联的解体是指苏联国ssssssssssssssssssssssssssssssssssssssssssssss家解体的过程，发生在1991年。苏联解ddddddddddddddddddddddddd体是由于一系列政治、经济、社会、民族等多种因素的累积导致的。\n\n苏联解体的原因可以追溯到上世纪80年代末期，当时苏联面临着严重的经济危机和政治动荡。苏联的经济体系无法满足人民的需求，国家财政困难，通货膨胀严重，生活水平普遍下降。同时，政府的腐败和不作为进一步加剧了人们对苏联政权的不满。\n\n此外，苏联境内的不同民族之间也存在着严重的矛盾和冲突，这一点在战后特别明显。民族主义思潮的抬头，导致许多苏联共和国内部要求独立的运动，如波罗的海三国（立陶宛、拉脱维亚和爱沙尼亚）、乌克兰、格鲁吉亚等。这些运动进一步削弱了苏联的统一性。\n\n此外，战略上的失败也是导致苏联解体的原因之一。苏联的军费开支巨大，但在与美国的军备竞赛中处于下风，这使得苏联的经济负担更加沉重。苏联试图通过军事干预来保持其影响力，如入侵阿富汗等行动，但均以失败告终，进一步削弱了苏联的国际地位和国内的民众信心。\n\n最终，在1991年12月25日，苏联最高苏维埃通过了决议，宣布苏联解散。这标志着苏联作为一个国家的终结。\n\n苏联的解体对世界产生了深远影响。它结束了冷战时期两个超级大国之间的对抗，也结束了苏联对东欧国家的占领和控制。此后，苏联解体后的国家独立，重新确立了自己的政治和经济体系。苏联的解体是指苏联国家解体的过程，发生在1991年。苏联解体是由于一系列政治、经济、社会、民族等多种因素的累积导致的。\n\n苏联解体的原因可以追溯到上世纪80年代末期，当时苏联面临着严重的经济危机和政治动荡。苏联的经济体系无法满足人民的需求，国家财政困难，通货膨胀严重，生活水平普遍下降。同时，政府的腐败和不作为进一步加剧了人们对苏联政权的不满。\n\n此外，苏联境内的不同民族之间也存在着严重的矛盾和冲突，这一点在战后特别明显。民族主义思潮的抬头，导致许多苏联共和国内部要求独立的运动，如波罗的海三国（立陶宛、拉脱维亚和爱沙尼亚）、乌克兰、格鲁吉亚等。这些运动进一步削弱了苏联的统一性。\n\n此外，战略上的失败也是导致苏联解体的原因之一。苏联的军费开支巨大，但在与美国的军备竞赛中处于下风，这使得苏联的经济负担更加沉重。苏联试图通过军事干预来保持其影响力，如入侵阿富汗等行动，但均以失败告终，进一步削弱了苏联的国际地位和国内的民众信心。\n\n最终，在1991年12月25日，苏联最高苏维埃通过了决议，宣布苏联解散。这标志着苏联作为一个国家的终结。\n\n苏联的解体对世界产生了深远影响。它结束了冷战时期两个超级大国之间的对抗，也结束了苏联对东欧国家的占领和控制。此后，苏联解体后的国家独立，重新确立了自己的政治和经济体系。苏联的解体是指苏联国家解体的过程，发生在1991年。苏联解体是由于一系列政治、经济、社会、民族等多种因素的累积导致的。\n\n苏联解体的原因可以追溯到上世纪80年代末期，当时苏联面临着严重的经济危机和政治动荡。苏联的经济体系无法满足人民的需求，国家财政困难，通货膨胀严重，生活水平普遍下降。同时，政府的腐败和不作为进一步加剧了人们对苏联政权的不满。\n\n此外，苏联境内的不同民族之间也存在着严重的矛盾和冲突，这一点在战后特别明显。民族主义思潮的抬头，导致许多苏联共和国内部要求独立的运动，如波罗的海三国（立陶宛、拉脱维亚和爱沙尼亚）、乌克兰、格鲁吉亚等。这些运动进一步削弱了苏联的统一性。\n\n此外，战略上的失败也是导致苏联解体的原因之一。苏联的军费开支巨大，但在与美国的军备竞赛中处于下风，这使得苏联的经济负担更加沉重。苏联试图通过军事干预来保持其影响力，如入侵阿富汗等行动，但均以失败告终，进一步削弱了苏联的国际地位和国内的民众信心。\n\n最终，在1991年12月25日，苏联最高苏维埃通过了决议，宣布苏联解散。这标志着苏联作为一个国家的终结。\n\n苏联的解体对世界产生了深远影响。它结束了冷战时期两个超级大国之间的对抗，也结束了苏联对东欧国家的占领和控制。此后，苏联解体后的国家独立，重新确立了自己的政治和经济体系。苏联的解体是指苏联国家解体的过程，发生在1991年。苏联解体是由于一系列政治、经济、社会、民族等多种因素的累积导致的。\n\n苏联解体的原因可以追溯到上世纪80年代末期，当时苏联面临着严重的经济危机和政治动荡。苏联的经济体系无法满足人民的需求，国家财政困难，通货膨胀严重，生活水平普遍下降。同时，政府的腐败和不作为进一步加剧了人们对苏联政权的不满。\n\n此外，苏联境内的不同民族之间也存在着严重的矛盾和冲突，这一点在战后特别明显。民族主义思潮的抬头，导致许多苏联共和国内部要求独立的运动，如波罗的海三国（立陶宛、拉脱维亚和爱沙尼亚）、乌克兰、格鲁吉亚等。这些运动进一步削弱了苏联的统一性。\n\n此外，战略上的失败也是导致苏联解体的原因之一。苏联的军费开支巨大，但在与美国的军备竞赛中处于下风，这使得苏联的经济负担更加沉重。苏联试图通过军事干预来保持其影响力，如入侵阿富汗等行动，但均以失败告终，进一步削弱了苏联的国际地位和国内的民众信心。\n\n最终，在1991年12月25日，苏联最高苏维埃通过了决议，宣布苏联解散。这标志着苏联作为一个国家的终结。\n\n苏联的解体对世界产生了深远影响。它结束了冷战时期两个超级大国之间的对抗，也结束了苏联对东欧国家的占领和控制。此后，苏联解体后的国家独立，重新确立了自己的政治和经济体系。'
);
const copywritingthree = ref(null);


const text = ref(null);


onMounted(() => {
  initialization();
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      iscompile.value = true;
      const loading = ElLoading.service({
        lock: true,
        text: '请耐心等待文案生成。。。',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      postchatgpt(form).then((res) => {
        // console.log('qqqqqqqqqqqq');
        // console.log(res);
        copywritingthree.value = res.data;
        new TypeIt(copywriting.value, {
          strings: copywritingthree.value,
          cursorChar: "<span class='cursorChar'>|<span>", //用于光标的字符。HTML也可以
          speed: 10,
          lifeLike: true, // 使打字速度不规则
          cursor: true, //在字符串末尾显示闪烁的光标
          breakLines: false, // 控制是将多个字符串打印在彼此之上，还是删除这些字符串并相互替换
          loop: false, //是否循环
        }).go();
        setTimeout(() => {
          loading.close();
        }, 500);
      });

      setTimeout(() => {
        loading.close();
      }, 20000);
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 方法一 初始化
// ---------------------------------------------------
const initialization = async () => {
  form.content = '';
  iscompile.value = false;
  setTimeout(() => {
    new TypeIt(text.value, {
      strings: '请耐心等待文案生成',
      cursorChar: "<span class='cursorChar'>|<span>", //用于光标的字符。HTML也可以
      speed: 100,
      lifeLike: true, // 使打字速度不规则
      cursor: true, //在字符串末尾显示闪烁的光标
      breakLines: false, // 控制是将多个字符串打印在彼此之上，还是删除这些字符串并相互替换
      loop: false, //是否循环
    }).go();
  }, 500);
};
// ------------------------------------------------------------------------------------

// import { computed } from 'vue';
// import DOMPurify from 'dompurify';
// import { marked } from 'marked';
// import hljs from 'highlight.js';
// import mdInCode from "../../utils/mdInCode"; // 用于判断是否显示光标


// const text = ref('');
// const showCursor = ref(false);




// // 配置高亮
// marked.setOptions({
//   highlight: function (code, lang) {
//     try {
//       if (lang) {
//         return hljs.highlight(code, { language: lang }).value;
//       } else {
//         return hljs.highlightAuto(code).value;
//       }
//     } catch (error) {
//       return code;
//     }
//   },
//   gfmtrue: true,
//   breaks: true,
// });

// // 计算最终要显示的 html 文本
// const html = computed(() => {
//   // 将 markdown 转为 html
//   // const qwe = copywritingtwo.value
//   function trans(copywritingtwo) {
//     return DOMPurify.sanitize(marked.parse(copywritingtwo));
//   }
//   // 光标元素，可以用 css 美化成你想要的样子
//   const cursor = '<span></span>';
//   if (showCursor.value) {
//     // 判断 AI 正在回的消息是否有未闭合的代码块。
//     const inCode = mdInCode(copywritingtwo.value);
//     if (inCode) {
//       // 有未闭合的代码块，不显示光标
//       return trans(copywritingtwo.value);
//     } else {
//       // 没有未闭合的代码块，将光标元素追加到最后。
//       return trans(copywritingtwo.value + cursor);
//     }
//   } else {
//     // 父组件明确不显示光标
//     return trans(copywritingtwo.value);
//   }
// });
</script>

<style lang="scss" scoped>
.aicreate {
  min-height: calc(100vh - 96px);
  background-color: #282729;
  padding: 30px;
  .form_line {
    display: flex;
  }

  .btnstyle {
    margin-left: 30px;
  }

  .gtp_title {
    font-size: 32px;
    color: #ffffff;
    margin-top: 20px;
  }

  .content_box {
    // width: 500px;
    width: 80%;
    height: 460px;
    // background-color: #ffffff;
    border-radius: 5px;
    margin-top: 20px;
    list-style: none;
    padding: 0;
    overflow-y: auto;
    // overflow: hidden;
  }
}

.msg {
  // color: rgb(88, 88, 88);
  color: #ffffff;
  letter-spacing: 2px;
}

.msg :v-deep(.cursorChar) {
  display: inline-block;
  margin-left: 2px;
}
</style>
<style lang="scss" scoped>
/** 控制段落间的上下边距 **/
// .markdown p {
//   margin: 1.25rem 0;
// }
// .markdown p:first-child {
//   margin-top: 0;
// }

// /** 小代码块样式，对应 markdown 的 `code` **/
// .markdown :not(pre) > code {
//   @apply bg-[#282c34] px-1 py-[2px] text-[#e06c75] rounded-md;
// }

// /** 列表样式 **/
// .markdown ol {
//   list-style-type: decimal;
//   padding-left: 40px;
// }
// .markdown ul {
//   list-style-type: disc;
//   padding-left: 40px;
// }

// /** 光标样式 **/
// .markdown .cursor {
//   display: inline-block;
//   width: 2px;
//   height: 20px;
//   @apply bg-gray-800 dark:bg-gray-100;
//   animation: blink 1.2s step-end infinite;
//   margin-left: 2px;
//   vertical-align: sub;
// }
// @keyframes blink {
//   0% {
//     opacity: 1;
//   }
//   50% {
//     opacity: 0;
//   }
//   100% {
//     opacity: 1;
//   }
// }
</style>

<style>
.el-textarea__inner {
  color: #333;
  font-size: 16px;
}
</style>
