<template>
  <div class="page allProject">
    <div class="list">
      <el-col :span="6">
        <div class="newPro center">
          <p class="tit">创作短视频</p>
          <el-input v-model.trim="projectName" placeholder="请先输入短视频名称" />
          <el-button type="primary" class="creatBtn" @click="createNewPro">
            创作短视频
          </el-button>
        </div>
      </el-col>

      <el-col :span="6" v-for="item in projct.list" :key="item.id">
        <VideoCard :data="item" pagetype="2" :key="item.id" />
      </el-col>
    </div>

    <div class="layout_right">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="size"
        :current-page="page"
        @current-change="queryList"
      />
    </div>
  </div>
</template>

<script setup>
import { shortvideoStore } from '../../stores';
import { useRouter } from 'vue-router';

const projct = shortvideoStore();
const router = useRouter();
const projectName = ref('');
const total = ref(0);
const page = ref(1);
const size = 23;

function createNewPro() {
  if (!projectName.value) return ElMessageBox.alert('请输入短视频名称');
  router.push('/createvideo?pn=' + projectName.value);
}

// 
function queryList(p) {
  if (p) page.value = p;
  projct.getList({ page: page.value, size }).then((meta) => {
    if (meta) {
      total.value = meta.total;
    }
  });
}


onBeforeMount(queryList);
</script>

<style lang="scss" scoped>
.allProject {
  .list {
    margin: 0 -10px;
    display: flex;
    flex-wrap: wrap;
  }
  .newPro {
    height: 336px;
    background: #1a1a1a;
    position: relative;
    flex-direction: column;
    margin: 0 5px 10px;
    .tit {
      font-size: 24px;
    }
    :deep(.el-input) {
      width: 245px;
      margin: 46px 0;
      .el-input__wrapper {
        background: #333333;
      }
    }
    .creatBtn {
      width: 135px;
      height: 40px;
      font-weight: bold;
      font-size: 20px;
    }
  }
  .layout_right {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>
