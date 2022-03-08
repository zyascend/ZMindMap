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
        >
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" type="text" placeholder="请输入邮箱地址" ></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model="loginForm.pwd" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="submitForm" class="btn">{{isLogin ? '登录' : '注册'}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import useLogin from '../hooks/useLogin'

export default defineComponent({
  setup () {
    const router = useRouter()
    const store = useStore()
    const loginForm = reactive({
      email: '',
      pwd: ''
    })
    const loginFormRef = ref()
    const isLogin = ref(true)
    // 定义校验规则
    const rules = reactive(useLogin.loginRules)
    const submitForm = () => {
      loginFormRef.value.validate(valid => {
        if (valid) {
          store.dispatch('login', { loginForm, isLogin: isLogin.value })
            .then(() => {
              router.push({ path: '/', replace: true })
            })
            .catch(e => {
              console.log(e)
            })
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
    width: 800px;
    height: 500px;
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
        font-size: 1.2em;
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
        font-size: 1.2em;
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
