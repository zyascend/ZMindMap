<template>
  <div class="container">
    <div class="main">
      <p class="title">登录<span>ZMindMap</span></p>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
      >
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" type="text" placeholder="请输入邮箱地址" ></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="loginForm.pwd" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, reactive } from 'vue'
import useLogin from '../hooks/useLogin'

export default defineComponent({
  setup () {
    const loginForm = reactive({
      email: '',
      pwd: ''
    })
    const loginFormRef = ref()
    // 定义校验规则
    const rules = reactive(useLogin.loginRules)
    const submitForm = () => {
      loginFormRef.value.validate(valid => {
        if (valid) {
          useLogin.doLogin(loginForm)
        } else {
          return false
        }
      })
    }
    return {
      loginFormRef,
      loginForm,
      rules,
      submitForm
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/css/mixin';
.container {
  @include wh100;
  background-color: rgba($color: #000000, $alpha: 0.2);
  .main {
    @include abs-center;
    padding: 40px 30px 20px 30px;
    border-radius: 4px;
    width: 300px;
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 16%) 0px 2px 30px 0px;
    background-color: white;
    box-sizing: border-box;
    .login-btn{
      width: 100%;
      margin-top: 20px;
    }
    .title {
      @include wh100;
      text-align: center;
      margin-bottom: 20px;
      span {
        color: $color-base;
      }
    }
  }
}
</style>
