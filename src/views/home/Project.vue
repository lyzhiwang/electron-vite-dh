<template>
<div class="page allProject">
    <div class="list">
        <el-col :span="6">
            <div class="newPro center">
                <p class="tit">新建项目</p>
                <el-input v-model="projectName" placeholder="请先输入项目名称"/>
                <el-button type="primary" class="creatBtn">创建项目</el-button>
            </div>
        </el-col>
        <el-col :span="6" v-for="item in 5"><ProjectCard /></el-col>
    </div>
</div>
</template>

<script setup>
const projectName = ref('')
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
}
</style>