<template>
  <div class="livesettings">
    <div class="questions_title">互动设置</div>

    <div class="switch_radio">
      <el-radio-group v-model="set_radio">
        <el-radio-button label="1"> 关键词设置 </el-radio-button>
        <el-radio-button label="2"> 欢迎语设置 </el-radio-button>
      </el-radio-group>
    </div>

    <div v-if="set_radio === '1'" class="set_module">
        <Questions />
    </div>

    <div v-if="set_radio === '2'" class="set_module">
        <Welcome />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref} from 'vue';

const set_radio = ref<any>('1');
</script>

<style lang="scss" scoped>
.livesettings {
  min-height: calc(100vh - 96px);
  // background-color: #282828;
  background-color: #282729;
  padding: 30px;
  .questions_title {
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    line-height: 6px;
  }

  .switch_radio{
    margin-top: 10px;
  }

  .set_module{
    margin-top: 10px;
  }
}
</style>
