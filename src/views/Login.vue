<template>
  <div class="container">
    <div class="main">
      <div class="box signin">
        <h2 class="title">没有账号？</h2>
        <el-button type="primary" @click="isLogin = !isLogin" class="btn"
          >去注册</el-button
        >
      </div>
      <div class="box signup">
        <h2 class="title">已有账号？</h2>
        <el-button type="primary" @click="isLogin = !isLogin" class="btn"
          >去登录</el-button
        >
      </div>
      <div class="form" :class="{ active: isLogin }">
        <template v-if="!qrLogin">
          <div class="btn-qr" v-show="isLogin" @click="qrLogin = !qrLogin" />
          <h3 class="title">
            {{ isLogin ? '登录' : '注册' }}<span>ZMindMap</span>
          </h3>
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            size="large"
          >
            <el-form-item prop="email" size="large">
              <el-input
                v-model="loginForm.email"
                type="text"
                placeholder="请输入邮箱地址"
              ></el-input>
            </el-form-item>
            <el-form-item prop="pwd" size="large">
              <el-input
                v-model="loginForm.pwd"
                type="password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            @click="submitForm"
            native-type="submit"
            :loading="isSubmitting"
            class="btn"
          >
            {{ isLogin ? '登录' : '注册' }}
          </el-button>
        </template>
        <template v-else>
          <div class="btn-pc" v-show="isLogin" @click="qrLogin = !qrLogin" />
          <qrcode />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useUserStore from '@/store/user'
import md5 from 'js-md5'
import useLogin from '@/hooks/useLogin'
import Qrcode from '@/components/Qrcode.vue'

export default defineComponent({
  components: {
    Qrcode
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useUserStore()
    const qrLogin = ref(false)
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
      loginFormRef.value.validate(async valid => {
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
        }
      })
    }
    return {
      loginFormRef,
      loginForm,
      rules,
      isLogin,
      qrLogin,
      isSubmitting,
      submitForm
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/mixin';
.container {
  @include centerFlex;
  @include wh100;
  background-image: linear-gradient(to top, #9890e3 0%, #b1f4cf 100%);
  transition: 0.2s;
  .main {
    position: relative;
    width: 1000px;
    min-width: 500px;
    height: 600px;
    margin: 20px;
    background-color: #2c3034;
    box-shadow: 0 5px 45px rgba(0, 0, 0, 0.15);
    .btn {
      background-color: $color-base;
      border: none;
    }
    .box {
      position: relative;
      @include centerFlex;
      flex-direction: column;
      width: 50%;
      height: 100%;
      h2 {
        margin-bottom: 20px;
        font-size: 1.5em;
        font-weight: 500;
        color: #fff;
      }
    }
    .form {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
      @include centerFlex;
      flex-direction: column;
      width: 50%;
      height: 100%;
      background: #fff;
      box-shadow: 0 5px 45px rgba(0, 0, 0, 0.25);
      transition: 0.5s ease-in-out all;
      h3 {
        margin-bottom: 20px;
        font-size: 1.5em;
        font-weight: 500;
        color: #333;
        span {
          color: $color-base;
        }
      }
      .btn-qr,
      .btn-pc {
        position: absolute;
        top: 0;
        right: 0;
        width: 64px;
        height: 64px;
        cursor: pointer;
        &::after {
          position: absolute;
          width: 0;
          height: 0;
          content: '';
          border-right: 64px solid transparent;
          border-bottom: 64px solid #fff;
        }
      }
      .btn-pc {
        background: url(../assets/pic/pc.png) no-repeat;
      }
      .btn-qr {
        background: url(../assets/pic/qrcode.png) no-repeat;
      }
    }
    .active {
      left: 50%;
    }
  }
}
</style>
