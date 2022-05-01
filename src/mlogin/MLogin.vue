<template>
  <div class="login" v-show="!loginDone">
    <h1>登录ZMindMap</h1>
    <template v-if="!hasLogin">
      <Form @submit="onSubmit">
        <CellGroup inset>
          <Field
            v-model="email"
            name="email"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <Field
            v-model="pwd"
            type="password"
            name="pwd"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </CellGroup>
        <div style="margin: 16px;">
          <Button round block type="primary" native-type="submit">
            登录
          </Button>
        </div>
      </Form>
    </template>
    <template v-else>
      <div class="info" v-if="currentUser">
        <img alt="" :src="currentUser.avatar">
        <div>{{ currentUser.name }}</div>
      </div>
      <Button round block type="primary" @click="confirmLogin">
        确认登录
      </Button>
    </template>
  </div>
  <div class="done" v-show="loginDone">登录成功</div>
</template>
<script setup>
import { ref } from 'vue'
import { Form, Field, CellGroup, Button } from 'vant'
import md5 from 'js-md5'
import { getUrlParams, asyncHttp } from './util'

const email = ref('')
const pwd = ref('')
const hasLogin = ref(false)
const loginDone = ref(false)
const currentUser = ref(null)
const { qid } = getUrlParams()

const reportScan = async () => {
  const res = await asyncHttp('/code/update', { method: 'post', data: { qid, status: 'SCANED' } })
  if (res) {
    console.log('/code/update SCANED!', res)
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
  }
  console.log('hasLogin > ', currentUser.value)
}

reportScan()
checkLogin()

const onSubmit = async values => {
  console.log(values)
  const loginForm = {
    ...values,
    pwd: md5(values.pwd)
  }
  const user = await asyncHttp(`/users/login?qid=${qid}`, { method: 'post', data: loginForm })
  if (user && user?.code === 0) {
    const info = {
      user: user.data,
      expiredTime: Date.now() + 1000 * 60 * 60 - 1000 * 60 * 10
    }
    localStorage.setItem('mindmap-info', JSON.stringify(info))
    loginDone.value = true
  } else {
    console.log('login failed! > ', user)
  }
}

const confirmLogin = async () => {
  const res = await asyncHttp('/code/update', {
    method: 'post',
    data: {
      qid,
      status: 'CONFIRMED',
      user: currentUser.value
    }
  })
  if (res) {
    loginDone.value = true
    console.log('/code/update CONFIRMED!')
  } else {
    console.log('/code/update CONFIRMED! FAILED')
  }
}

</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
