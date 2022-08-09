<template>
  <div class="qrcode">
    <div
      class="img"
      v-show="codeStatus === 'EXPIRED' || codeStatus === 'UNUSED'"
    >
      <vue-qr
        :size="150"
        :margin="0"
        :auto-color="true"
        :dot-scale="1"
        :text="codeUrl"
      />
    </div>
    <div class="refresh" v-show="codeStatus === 'EXPIRED'">
      <i class="refresh_mask"></i>
      <i class="refresh_icon" @click.stop="generateCode" title="点击刷新"></i>
    </div>
    <div class="result" v-show="codeStatus === 'CONFIRMING'">
      <img class="u_avatar" :src="avatar" alt="用户头像" />
      <p class="u_name">{{ username }}</p>
    </div>
    <div>
      <p class="sub_title">{{ tip }}</p>
      <p class="sub_desc">扫码登录，更易、更快、更安全</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import io from 'socket.io-client'
import { useRouter, useRoute } from 'vue-router'
import { betterInterval } from '@/hooks/utils'
import useUserStore from '@/store/user'

const router = useRouter()
const route = useRoute()
const store = useUserStore()

const codeUrl = ref('')
const codeStatus = ref('EMPTY')
const username = ref('')
const avatar = ref('')
const tip = ref('正在获取登录码，请稍等...')

let timer
const { socketCfg } = window.CFG
const isPrd = process.env.NODE_ENV === 'production'
const socketUrl = isPrd ? socketCfg.prdHost : socketCfg.devHost
const getStatus = statusData => {
  if (!statusData) return
  const { status, data } = statusData
  codeStatus.value = status
  switch (status) {
    case 'CONFIRMING':
      tip.value = '扫码成功，请在手机上确认'
      username.value = data?.name
      avatar.value = data?.avatar
      break
    case 'CONFIRMED':
      timer && clearInterval(timer)
      store.setUser(data)
      if (store.getToken) {
        // 登录/注册成功
        router.replace({ path: route?.query?.redirect || '/' })
      }
      break
    case 'EXPIRED':
      tip.value = '二维码已过期，请刷新'
      timer && timer.clear()
      break
    default:
      break
  }
}

const renderQrCode = qid => {
  if (!qid) return
  codeUrl.value = `${window.location.origin}/login?qid=${qid}`
  // codeUrl.value = `http://localhost:4000/login?qid=${qid}`
  console.log(codeUrl.value)
  codeStatus.value = 'UNUSED'
  tip.value = '请使用手机扫码登录'
}
const socket = io(socketUrl, {
  autoConnect: true,
  transports: ['websocket'],
  reconnect: true,
  reconnectionAttempts: 5
})

const generateCode = () => {
  socket.emit('genCode')
}

socket.on('connect', res => {
  generateCode()
})
socket.on('sendedCode', res => {
  const qid = res?.data
  renderQrCode(qid)
  timer = betterInterval(() => socket.emit('checkExpired', qid), 2000)
})
socket.on('statusChanged', res => {
  getStatus(res?.data)
})

onUnmounted(() => {
  timer && timer.clear()
  timer = null
  socket.disconnect()
})
</script>

<style lang="scss" scoped>
.qrcode {
  position: relative;
  text-align: center;
  .img {
    display: block;
    width: 200px;
    height: 200px;
    margin: 35px auto 25px;
  }
  .sub_title {
    margin-bottom: 23px;
    font-size: 19px;
    color: #353535;
    text-align: center;
  }
  .sub_desc {
    padding: 0 40px;
    font-size: 14px;
    line-height: 1.8;
    color: #a3a3a3;
    text-align: center;
  }
  .refresh {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 240px;
    .refresh_mask {
      position: absolute;
      top: 55%;
      left: 50%;
      width: 240px;
      height: 240px;
      margin-top: -120px;
      margin-left: -120px;
      background: #ffffffe0;
    }
    .refresh_icon {
      position: absolute;
      top: 45%;
      left: 50%;
      width: 48px;
      height: 48px;
      cursor: pointer;
      background: url(../assets/pic/refresh.png) no-repeat;
      transform: translate(-50%, -50%);
      &:hover {
        animation: refresh 1s linear infinite;
      }
    }
  }
  .result {
    display: block;
    width: 240px;
    height: 240px;
    margin: 15px auto 25px;
    .u_avatar {
      width: 150px;
      height: 150px;
      margin-top: 15px;
      border-radius: 5px;
      -moz-box-shadow: #999 0 2px 10px;
      -webkit-box-shadow: #999 0 2px 10px;
      box-shadow: 0 2px 10px #999;
    }
    .u_name {
      margin-top: 20px;
      font-size: 19px;
      color: #353535;
      text-align: center;
    }
  }
}
</style>
