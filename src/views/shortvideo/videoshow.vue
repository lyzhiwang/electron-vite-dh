<template>
  <div class="preview">
    <div class="page">
      <video class="v" :src="video_path" controls></video>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const video_path = ref('');

onBeforeMount(() => {
  const { url } = route.query;
  video_path.value = url  
});
</script>

<style lang="scss" scoped>
.preview {
  .mat10 {
    margin-top: 10px;
  }
  .v {
    width: 1137px;
    height: 488px;
    background: #1e1e1e;
  }
}
</style>
