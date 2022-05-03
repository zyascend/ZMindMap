<template>
  <div class="qrcode">
    <div class="img" v-show="codeStatus === 'EXPIRED' || codeStatus === 'UNUSED'">
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
      <img class="u_avatar" :src="avatar" alt="用户头像"/>
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
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import axios from '@/hooks/useHttp'
import api from '@/hooks/api'
import { useUserStore } from '@/store/user'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useUserStore()
const codeUrl = ref('')
const codeStatus = ref('EMPTY')
const username = ref('')
const avatar = ref('')
const tip = ref('正在获取登录码，请稍等...')
let timer
let qid

const getStatus = async () => {
  await axios(`${api.getCodeStatus}?qid=${qid}`, { method: 'get' })
    .then(res => {
      const { status, data } = res.data
      codeStatus.value = status
      switch (status) {
        case 'CONFIRMING':
          tip.value = '扫码成功，请在手机上确认'
          username.value = data?.name
          avatar.value = data?.avatar
          break
        case 'CONFIRMED':
          timer && clearInterval(timer)
          console.log('CONFIRMED > ', data)
          store.setUser(data)
          if (store.getToken) {
            // 登录/注册成功
            router.replace({ path: route?.query?.redirect || '/' })
          }
          break
        case 'EXPIRED':
          tip.value = '二维码已过期，请刷新'
          timer && clearInterval(timer)
          break
        default:
          break
      }
    })
    .catch(err => {
      // TODO
      console.log('getStatus > catch: ', err)
    })
}
const generateCode = async () => {
  codeStatus.value = 'EMPTY'
  tip.value = '正在获取登录码，请稍等...'
  timer && clearInterval(timer)
  await axios(api.getCode, { method: 'get' })
    .then(res => {
      qid = res.data
      codeUrl.value = `${window.location.origin}/mlogin?qid=${res.data}`
      codeStatus.value = 'UNUSED'
      tip.value = '请使用手机扫码登录'
      console.log('generateCode > then: ', codeUrl.value)
      timer = setInterval(getStatus, 2000)
    })
    .catch(err => {
      // TODO
      console.log('generateCode > catch: ', err)
    })
}

generateCode()
onUnmounted(() => {
  timer && clearInterval(timer)
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
    text-align: center;
    font-size: 19px;
    color: #353535;
    margin-bottom: 23px;
  }
  .sub_desc {
    text-align: center;
    color: #a3a3a3;
    font-size: 14px;
    padding: 0 40px;
    line-height: 1.8;
  }
  .refresh {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 240px;
    .refresh_mask {
      position: absolute;
      left: 50%;
      top: 55%;
      margin-left: -120px;
      margin-top: -120px;
      width: 240px;
      height: 240px;
      background: #ffffffe0;
    }
    .refresh_icon {
      position: absolute;
      left: 50%;
      top: 45%;
      height: 48px;
      width: 48px;
      transform: translate(-50%, -50%);
      cursor: pointer;
      background: url(../assets/pic/refresh.png) no-repeat;
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
      height: 150px;
      width: 150px;
      margin-top: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 10px #999;
      -moz-box-shadow: #999 0 2px 10px;
      -webkit-box-shadow: #999 0 2px 10px;
    }
    .u_name {
      text-align: center;
      font-size: 19px;
      color: #353535;
      margin-top: 20px;
    }
  }
}
</style>
