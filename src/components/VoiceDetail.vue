<template>
<el-empty description="暂无数据" v-if="list.length==0" class="noData"/>
<el-scrollbar wrap-class="balanceDetail" v-else>
    <p class="detailTit">语音消耗明细</p>
    <div class="item" v-for="(item, i) in list" :key="i">
        <p class="vcenter"><span class="name ell">{{ item.project }}</span><span class="used">消耗{{ item.use }}次</span></p>
        <p class="vcenter"><span class="date">{{ item.created_at }}</span><span class="times">剩余{{ item.surplus }}次</span></p>
    </div>
</el-scrollbar>
</template>

<script setup>
import { voiceRecord } from '../api'
const list = ref([])
onBeforeMount(()=>{
    voiceRecord({size: 20, page: 1}).then(res=>{
        if(res && res.data){
            list.value = res.data
            // list.value = [
            //     {
            //         "id":1,
            //         "created_at":"2023-06-15 15:59:08",
            //         "use":10,
            //         "surplus":90,
            //         "project":"测试"
            //     }
            // ]
        }
    })
})
</script>

<style lang="scss" scoped>
.detailTit{
    margin-top: 40px;
    font-size: 24px;
    padding-left: 20px;
    color: #fff;
}
.item{
    width: 100%;
    height: 90px;
    border-bottom: 1px solid #4B4B4B;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    font-size: 16px;
    color: #fff;
    .vcenter{
        justify-content: space-between;
    }
    .date{
        color: #ccc;
        font-size: 14px;
    }
    .name{
        flex: 1;
    }
}
.noData{
    height: 100%;
}
</style>