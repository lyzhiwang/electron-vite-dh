<template>
<div class="preview">
    <div class="page">
        <video 
            class="v" 
            src="https://zwklt.oss-cn-beijing.aliyuncs.com/video/13/2023-04-20/ZQdXMPiLYREHu4vzShWy.mp4" 
            controls
        ></video>
    </div>
    <div class="page mat10">
        <el-scrollbar>
            <ul class="partList">
                <li :class="['item',{'act': item===act}]" v-for="item in 10" @click="selectPart(item)"><el-image class="img" src=""/></li>
            </ul>
        </el-scrollbar>
    </div>
</div>
</template>
    
<script setup>
const act = ref(1)
function selectPart(item){
    console.log(1111, item)
    act.value = item
}
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