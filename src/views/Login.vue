<template>
  <div class="container">
    <div class="main">
      <div class="box signin">
        <h2 class="title">没有账号？</h2>
        <el-button type="primary" @click="toggleSign" class="btn">去注册</el-button>
      </div>
      <div class="box signup">
        <h2 class="title">已有账号？</h2>
        <el-button type="primary" @click="toggleSign" class="btn">去登录</el-button>
      </div>
      <div :class="`form ${isLogin ? 'active' : ''}`">
        <h3 class="title">{{isLogin ? '登录' : '注册'}}<span>ZMindMap</span></h3>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          size="large"
        >
          <el-form-item prop="email" size="large">
            <el-input v-model="loginForm.email" type="text" placeholder="请输入邮箱地址" ></el-input>
          </el-form-item>
          <el-form-item prop="pwd" size="large">
            <el-input v-model="loginForm.pwd" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="submitForm"
          native-type="submit"
          :loading="isSubmitting"
          class="btn">
          {{isLogin ? '登录' : '注册'}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import md5 from 'js-md5'
import useLogin from '../hooks/useLogin'

export default defineComponent({
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useUserStore()
    const loginForm = reactive({
      email: '',
      pwd: ''
    })
    const loginFormRef = ref()
    const isLogin = ref(true)
    const isSubmitting = ref(false)
    // 定义校验规则
    const rules = reactive(useLogin.loginRules)
    const submitForm = () => {
      loginFormRef.value.validate(async (valid) => {
        if (valid) {
          isSubmitting.value = true
          await store.login({
            loginForm: {
              ...loginForm,
              pwd: md5(loginForm.pwd)
            },
            isLogin: isLogin.value
          })
          isSubmitting.value = false
          if (store.getToken) {
            // 登录/注册成功
            router.replace({ path: route?.query?.redirect || '/' })
          }
        } else {
          return false
        }
      })
    }
    const toggleSign = () => {
      isLogin.value = !isLogin.value
    }
    return {
      loginFormRef,
      loginForm,
      rules,
      isLogin,
      isSubmitting,
      toggleSign,
      submitForm
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/mixin';
.container {
  @include wh100;
  @include centerFlex;
  transition: .2s;
  .main {
    position: relative;
    width: 1000px;
    min-width: 500px;
    height: 600px;
    margin: 20px;
    background-color: #2c3034;
    box-shadow: 0 5px 45px rgba(0, 0, 0, .15);
    .btn {
      background-color: $color-base;
      border: none;
    }
    .box {
      position: relative;
      width: 50%;
      height: 100%;
      @include centerFlex;
      flex-direction: column;
      h2 {
        color: #fff;
        font-size: 1.5em;
        font-weight: 500;
        margin-bottom: 20px;
      }
    }
    .form {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background: #fff;
      z-index: 1000;
      @include centerFlex;
      flex-direction: column;
      box-shadow: 0 5px 45px rgba(0, 0, 0, .25);
      transition: .5s ease-in-out all;
      h3 {
        font-size: 1.5em;
        color: #333;
        margin-bottom: 20px;
        font-weight: 500;
        span {
          color: $color-base;
        }
      }
    }
    .active {
      left: 50%;
    }
  }
}
</style>
