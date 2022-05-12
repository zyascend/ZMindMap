<template>
  <div class="login" v-show="!confirmed">
    <h1 class="title">扫码登录ZMindMap</h1>
    <template v-if="!hasLogin">
      <Form @submit="onSubmit" class="form">
        <CellGroup inset>
          <Field
            v-model="email"
            name="email"
            label="用户账号"
            placeholder="用户账号"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <Field
            v-model="pwd"
            type="password"
            name="pwd"
            label="用户密码"
            placeholder="用户密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </CellGroup>
        <Button size="large" color="#5856d5" type="primary" class="login-btn" native-type="submit">
          登录
        </Button>
      </Form>
    </template>
    <template v-else>
      <div class="info" v-if="currentUser">
        <img alt="用户头像" :src="currentUser.avatar">
        <p>{{ currentUser.name }}</p>
      </div>
      <Button color="#5856d5" class="btn" size="large" type="primary" @click="confirmLogin">
        确认登录
      </Button>
    </template>
  </div>
  <div class="confirmed" v-show="confirmed">
    <div class="success"></div>
    <h1>登录成功!</h1>
    <p>请回到PC端操作!</p>
    <Button class="btn" size="large" type="warning" @click="logout">
      注销登录
    </Button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Form, Field, CellGroup, Button, Toast } from 'vant'
import md5 from 'js-md5'
import { getUrlParams, asyncHttp } from './util'

const email = ref('')
const pwd = ref('')
const hasLogin = ref(false)
const confirmed = ref(false)
const currentUser = ref(null)
const { qid } = getUrlParams()

const setStatus = async (status, data) => {
  const res = await asyncHttp('/code/setStatus', {
    method: 'post',
    data: { qid, status, data }
  })
  if (res && status === 'CONFIRMED') {
    confirmed.value = true
  }
  if (!res) {
    Toast.fail('系统繁忙, 请重试！')
  }
}
const checkLogin = () => {
  const infoString = localStorage.getItem('mindmap-info')
  if (!infoString) return
  const info = JSON.parse(infoString)
  const { user, expiredTime } = info
  const expired = Date.now() > Number(expiredTime)
  hasLogin.value = user && !expired
  if (hasLogin.value) {
    currentUser.value = user.user
    setStatus('CONFIRMING', currentUser.value)
  }
}
const onSubmit = async values => {
  Toast.loading({
    message: '登录中...',
    forbidClick: true
  })
  const loginForm = {
    ...values,
    pwd: md5(values.pwd)
  }
  const user = await asyncHttp(`/users/login?qid=${qid}`, { method: 'post', data: loginForm })
  if (user && user?.code === 0) {
    Toast.clear()
    const info = {
      user: user.data,
      expiredTime: Date.now() + 1000 * 60 * 60 - 1000 * 60 * 10
    }
    localStorage.setItem('mindmap-info', JSON.stringify(info))
    hasLogin.value = true
    currentUser.value = user.data.user
    setStatus('CONFIRMING', currentUser.value)
  } else {
    console.log('error', user)
    Toast.fail('登录失败, 请重试！')
  }
}
const confirmLogin = async () => {
  await setStatus('CONFIRMED', currentUser.value)
}
const logout = () => {
  localStorage.clear()
  Toast.success('已注销当前移动端登录信息')
}
checkLogin()
</script>
<style lang="scss">
#mlogin {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to top, #9890e3 0%, #b1f4cf 100%);
  .btn {
    font-size: 15px;
  }
  .login {
    position: relative;
    padding: 10vw 10vw;
    .title {
      margin-bottom: 20vw;
      font-size: 20px;
      font-weight: bold;
    }
    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: 50vw;
        height: 50vw;
        margin-bottom: 5vw;
      }
      p {
        margin-bottom: 20vw;
        font-size: 20px;
      }
    }
    .form {
      margin-top: 20vw;
    }
    .login-btn {
      margin-top: 10vw;
    }
  }
  .confirmed {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10vw 10vw;
    .success {
      width: 50vw;
      height: 50vw;
      margin-bottom: 10vw;
      background: center url('../assets/pic/success.png') no-repeat;
    }
    h1 {
      margin-bottom: 10vw;
      font-size: 20px;
      font-weight: bold;
    }
    p {
      margin-bottom: 25vw;
      font-size: 20px;
    }
  }
}
</style>
