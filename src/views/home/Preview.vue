<template>
<div class="preview">
    <!-- <div class="">
        <el-icon><Back/></el-icon>
        <span>返回首页</span>
    </div> -->
    <div class="page">
        <video 
            class="v" 
            :src="actItem.video_path" 
            controls
        ></video>
    </div>
    <div class="page mat10">
        <el-scrollbar>
            <ul class="partList">
                <li 
                    :class="['item',{'act': item.id===actItem.id}]" 
                    v-for="item in details.footages" 
                    @click="selectPart(item)"
                    :key="item.id"
                >
                    <el-image class="img" :src="item.video_path+'?x-oss-process=video/snapshot,t_1000,f_jpg,m_fast,ar_auto,w_192'" loading="lazy" fit="contain"/>
                </li>
            </ul>
        </el-scrollbar>
    </div>
</div>
</template>
    
<script setup>
import { useRoute } from 'vue-router'
import { projectDetail } from '../../api'

const route = useRoute()
const details = ref({
    footages: [],
})
const actItem = ref(1)

function selectPart(item){
    actItem.value = item
}

onBeforeMount(()=>{
    const { pid } = route.query
    projectDetail(pid).then(res=>{
        if(res && res.data){
            details.value = res.data
            selectPart(details.value.footages[0])
        }
    })
})
</script>

<style lang="scss" scoped>
.preview{
    .mat10{
        margin-top: 10px;
    }
    .v{
        width: 1137px;
        height: 488px;
        background: #1e1e1e;
    }
    .partList{
        display: flex;
        list-style: none;
        margin: 0 -5px;
        padding: 0 0 10px 0;
        box-sizing: border-box;
        .item{
            min-width: 192px;
            width: 192px;
            height: 108px;
            margin: 0 5px;
            background: #000;
            border-radius: 5px;
            --el-fill-color-light: #000;
            cursor: pointer;
            &.act{
                overflow: hidden;
                border: 1px solid #ccc;
            }
        }
        .img{
            width: 100%;
            height: 100%;
        }
    }
}
</style>