<template>
  <div class="container">
    EDIT
  </div>
</template>

<script>
import { defineComponent } from 'vue'
// import { ref, defineComponent, reactive } from 'vue'
// import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
// import useLogin from '../hooks/useLogin'

export default defineComponent({
  setup () {
    return {
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
