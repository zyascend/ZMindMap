<template>
  <div class="qrcode">
    <div class="img" v-show="codeStatus === 'EXPIRE' || codeStatus === 'UNUSED'">
      <vue-qr
        :size="150"
        :margin="0"
        :auto-color="true"
        :dot-scale="1"
        :text="codeUrl"
      />
    </div>
    <!-- <div class="empty" v-show="codeStatus === 'EMPTY'"></div>
    <div class="refresh" v-show="codeStatus === 'EXPIRE'">
      <i class="refresh_mask"></i>
      <i class="refresh_icon" @click.stop="getToken"></i>
    </div>
    <div class="result" v-show="codeStatus === 'CONFIRMING'">
      <img class="u_avatar" :src="avatar" alt="用户头像"/>
      <p class="u_name">{{username}}</p>
    </div> -->
    <div>
      <p class="sub_title">{{ tip }}</p>
      <p class="sub_desc">扫码登录，更易、更快、更安全</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import axios from '@/hooks/useHttp'
import api from '@/hooks/api'

const codeUrl = ref('')
const codeStatus = ref('EMPTY')
const tip = ref('正在获取登录码，请稍等...')

const generateCode = async () => {
  codeStatus.value = 'EMPTY'
  tip.value = '正在获取登录码，请稍等...'
  await axios(api.generate, { method: 'get' })
    .then(res => {
      codeUrl.value = `${window.location.origin}/mlogin?qid=${res.data}`
      codeStatus.value = 'UNUSED'
      tip.value = '请使用手机扫码登录'
      console.log('generateCode > then: ', codeUrl.value)
    })
    .catch(err => {
      // TODO
      console.log('generateCode > catch: ', err)
    })
}
generateCode()
</script>

<style scoped>
.qrcode {
  clear: right;
  position: relative;
  text-align: center;
}

.qrcode .img {
  display: block;
  width: 200px;
  height: 200px;
  margin: 35px auto 25px;
}

.qrcode .sub_title {
  text-align: center;
  font-size: 19px;
  color: #353535;
  margin-bottom: 23px;
}

.qrcode .sub_desc {
  text-align: center;
  color: #a3a3a3;
  font-size: 14px;
  padding: 0 40px;
  line-height: 1.8;
}

.qrcode .empty {
  display: block;
  width: 200px;
  height: 200px;
  margin: 35px auto 25px;
  background: #d7e8fc;
}

.qrcode .refresh {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 240px;
}

.qrcode .refresh .refresh_mask {
  position: absolute;
  left: 50%;
  top: 55%;
  margin-left: -120px;
  margin-top: -120px;
  width: 240px;
  height: 240px;
  background: #ffffffe0;
}

.qrcode .refresh .refresh_icon {
  position: absolute;
  left: 50%;
  top: 55%;
  margin-left: -48px;
  margin-top: -48px;
  height: 96px;
  width: 96px;
  cursor: pointer;
  /* background: url(../assets/img/refresh.png) no-repeat; */
}

.qrcode .refresh .refresh_icon:hover {
  animation: refresh 1s linear infinite;
}

@keyframes refresh {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.qrcode .result {
  display: block;
  width: 240px;
  height: 240px;
  margin: 15px auto 25px;
}

.qrcode .result .u_avatar {
  height: 150px;
  width: 150px;
  margin-top: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 10px #999;
  -moz-box-shadow: #999 0 2px 10px;
  -webkit-box-shadow: #999 0 2px 10px;
}

.qrcode .result .u_name {
  text-align: center;
  font-size: 19px;
  color: #353535;
  margin-top: 20px;
}
</style>
