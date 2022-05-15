<template>
  <div class="container">
    <svg-icon icon="404"/>
    <h1>页面走丢了</h1>
    <el-button
      type="primary"
      @click="toIndex">
      回到主页
    </el-button>
  </div>
</template>
<script setup>
import SvgIcon from '@/components/SvgIcon.vue'
const toIndex = () => {
  window.location.replace('/')
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto auto;
  h1 {
    margin-top: 30px;
    margin-bottom: 40px;
    font-size: 20px;
  }
}
</style>
