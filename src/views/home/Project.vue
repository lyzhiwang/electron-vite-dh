<template>
<div class="page allProject">
    <div class="list">
        <el-col :span="6">
            <div class="newPro center">
                <p class="tit">新建项目</p>
                <el-input v-model.trim="projectName" placeholder="请先输入项目名称"/>
                <el-button type="primary" class="creatBtn" @click="createNewPro">创建项目</el-button>
            </div>
        </el-col>
        <el-col :span="6" v-for="item in projct.list" :key="item.id">
            <ProjectCard :data="item" pagetype="2" :key="item.id"/>
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
import { useProjectStore } from '../../stores'
import { useRouter } from 'vue-router'
import { synthetizedetail } from '../../api/index'


const projct = useProjectStore()
const router = useRouter()
const projectName = ref('')
const total = ref(0)
const page = ref(1)
const size = 23

const qwelist = ref([])
const ids = ref([])

var timer = null

function createNewPro(){
    if(!projectName.value) return ElMessageBox.alert('请输入项目名称')
    router.push('/creatlive?pn='+projectName.value)
}
function queryList(p){
    if(p) page.value = p
    projct.getList({page: page.value, size}).then(res=>{
        if(res){
            total.value = res.meta.total
            qwelist.value = res.data.filter(item => item.status==2);
            qwelist.value.forEach(item => {
                ids.value.push(item.id)
            })   
            if(ids.value.length>0){
                getsynthetizedetail(ids.value)
                timer = setInterval(() => {
                    getsynthetizedetail(ids.value)
                }, 10000);
                setTimeout(() => {  
                    clearInterval(timer);   
                }, 300000);
            }
        }
        
    })
}

onBeforeMount(()=>{
    queryList()
})

onBeforeUnmount(()=>{
    clearTimers();
    clearInterval(timer);  
})

function getsynthetizedetail(ids){
    synthetizedetail({ids:ids}).then(res=>{
        if(res.data.length>0){
            for (var i = 0; i < res.data.length; i++){
                projct.list.forEach(item => {
                    if(item.id === res.data[i].id){
                        item.already = res.data[i].already
                        item.total = res.data[i].total
                    }
                })
            }
        } else {
            clearInterval(timer); 
        }
        
    })
}

// 定义一个清除延时器的函数
function clearTimers() {
  // 获取所有具有 setTimeout 或 setInterval 方法的元素
  var timers = document.querySelectorAll('[data-timer]');
  // 循环遍历所有元素并清除它们的延时器
  for (var i = 0; i < timers.length; i++) {
    var timer = timers[i];
    // 清除 setTimeout 延时器
    // if (timer.dataset.timer !== undefined) {
    //   clearTimeout(timer.dataset.timer);
    // }
    // 清除 setInterval 延时器
    if (timer.dataset.interval !== undefined) {
      clearInterval(timer.dataset.interval);
    }
  }
}

</script>

<style lang="scss" scoped>
.allProject{
    .list{
        margin: 0 -10px;
        display: flex;
        flex-wrap: wrap;
    }
    .newPro{
        height: 336px;
        background: #1a1a1a;
        position: relative;
        flex-direction: column;
        margin: 0 5px 10px;
        .tit{
            font-size: 24px;
        }
        :deep(.el-input){
            width: 245px;
            margin: 46px 0;
            .el-input__wrapper{
                background: #333333;
            }
        }
        .creatBtn{
            width: 135px;
            height: 40px;
            font-weight: bold;
            font-size: 20px;
        }
    }
    .layout_right{
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
    }
}
</style>