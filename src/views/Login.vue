<template>
<div class="loginPage">
  <div class="boxCenter">
    <div class="rebot"></div>
    <!-- 表单 -->
    <el-form ref="ruleFormRef" :model="form" :rules="rules" class="login_form" status-icon scroll-to-error @keyup.enter.native="submitForm(ruleFormRef)">
        <h2>账号密码登录</h2>
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input v-model.trim="form.username" placeholder="你的账号">
            <template #prefix>
              <el-icon class="leftIcon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" show-password>
            <template #prefix>
              <el-icon class="leftIcon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-button type="primary" @click="submitForm(ruleFormRef)" class="submit">立即登录</el-button>
    </el-form>
  </div>
</div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'
import { login } from '../api'

const router = useRouter()
const user = useUserStore()

const trigger = ['blur', 'change']
const ruleFormRef = ref()
const form = reactive({
    username: '',
    password: '',
})
const rules = reactive({
    username: [
        { required: true, message: '请输入您的账号', trigger },
    ],
    password: [
        { required: true, message: '请输入您的密码', trigger },
    ]
})
// 提交表单
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            login(form).then(res => {
              // 登录成功
              loginSuccess(res.data)
              // loginSuccess({token: 11111, user: {}})
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
const loginSuccess = (data) => {
    user.setUserToken(data.token)
    router.push('/home')
}
</script>

<style lang="scss" scoped>
.loginPage{
    background-color: #b5d9f1;
    background-image: url('../assets/images/bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    --el-text-color-regular: #666;
    .boxCenter{
      width: 1078px;
      height: 340px;
      position: relative;
      display: flex;
      justify-content: flex-end;
    }
    .rebot{
      width: 686px;
      height: 422px;
      background: url('../assets/images/rebot.png') center no-repeat;
      background-size: cover;
      position: absolute;
      left: -100px;
      top: 50px;
    }
    .login_form{
      width: 384px;
      height: 340px;
      background: #ffffff;
      border: 2px solid #cccccc;
      border-radius: 10px;
      padding: 57px 75px 76px;
      box-sizing: border-box;
      --el-border-color: #ccc;
      h2{
        font-size: 20px;
        margin-bottom: 37px;
        font-weight: 400;
        text-align: center;
      }
      .leftIcon{
        font-size: 17px;
      }
      .submit{
        width: 234px;
        height: 35px;
        font-weight: 700;
        margin-top: 6px;
      }
    }
}
</style>