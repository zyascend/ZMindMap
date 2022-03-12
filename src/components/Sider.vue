<template>
  <div class="sidebar" :style="siderStyle">
    <slot />
    <div class="toggle-wrapper">
      <div class="collapse" @click="collapse">
        <img :src="ICON_LEFT_ARROW" alt="">
      </div>
    </div>
  </div>
  <div class="open" @click="open" v-show="isSiderCollapse">
    <img :src="ICON_HAMBERGER" alt="">
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import ICON_LEFT_ARROW from '@/assets/pic/arrow-left.svg'
import ICON_HAMBERGER from '@/assets/pic/hamberger.svg'
export default defineComponent({
  name: 'Sider',
  props: {
    width: {
      type: Object,
      required: false
    }
  },
  setup (props) {
    const siderStyle = reactive({
      width: `${props.width}px`,
      transform: 'translateX(0)'
    })
    const isSiderCollapse = ref(false)
    const collapse = () => {
      isSiderCollapse.value = true
      siderStyle.width = 0
      siderStyle.transform = `translateX(-${props.width}px)`
    }
    const open = () => {
      isSiderCollapse.value = false
      siderStyle.width = `${props.width}px`
      siderStyle.transform = 'translateX(0)'
    }
    return {
      isSiderCollapse,
      siderStyle,
      collapse,
      open,
      ICON_LEFT_ARROW,
      ICON_HAMBERGER
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '@/assets/css/mixin';
.sidebar {
  @include wh100;
  @include vertFlex;
  position: relative;
  background-color: #f4f4f5;
  border-right: 1px #dedee1 solid;
  box-sizing: border-box;
  transition: 0.3s ease all;
  min-width: 325px;
  .toggle-wrapper {
    position: absolute;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    right: -3px;
    top: 0;
    z-index: 50;
    transition: .2s ease-in-out all;
    opacity: 0;
    &::before {
      position: absolute;
      left: 3px;
      width: 1px;
      height: 100%;
      background-color: #5856d5;
      content: "";
    }
    &:hover {
      opacity: 1;
    }
    .collapse {
      position: absolute;
      top: 26px;
      left: 50%;
      width: 20px;
      height: 20px;
      padding: 0px;
      z-index: 100;
      border: 1px solid #5856d5;
      background-color: #ffffff;
      /* background: url("~@/assets/pic/arrow-left.svg") no-repeat; 必须是 ~@; */
      border-radius: 100%;
      cursor: pointer;
      transform: translateX(-50%) translateY(-50%) rotateY(0deg);
      transition: transform 0.2s ease 0s, color 0.2s ease 0s, background-color 0.2s ease 0s;
      &::before {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-color: transparent;
        border-radius: 4px;
        content: "";
      }
    }
  }
}
.open {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 20px;
  height: 20px;
  z-index: 200;
  background-color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease 0s, color 0.2s ease 0s, box-shadow 0.2s ease 0s, border 0.2s ease 0s;
}
</style>
