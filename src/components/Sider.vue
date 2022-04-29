<template>
  <div class="sidebar" :style="siderStyle">
    <slot />
    <div class="toggle-wrapper">
      <div class="collapse" @click="collapse">
        <SvgIcon class="icon" icon="arrow-left" />
      </div>
    </div>
  </div>
  <div class="content" :style="contentStyle" id="siderContent">
    <slot name="sideContent" />
  </div>
  <el-tooltip
    effect="light"
    content="打开侧边栏"
    placement="right">
    <div class="open" @click="open" v-show="isSiderCollapse">
      <SvgIcon class="icon" icon="hamberger" />
    </div>
  </el-tooltip>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
export default defineComponent({
  name: 'Sider',
  components: {
    SvgIcon
  },
  props: {
    width: {
      type: Number,
      required: false
    }
  },
  setup (props) {
    const siderStyle = reactive({
      width: `${props.width}px`,
      transform: 'translateX(0)',
      zIndex: 102
    })
    const contentStyle = reactive({
      marginLeft: `${props.width}px`,
      width: `calc(100% - ${props.width}px)`
    })
    const isSiderCollapse = ref(false)
    const collapse = () => {
      isSiderCollapse.value = true
      siderStyle.transform = `translateX(-${props.width}px)`
      contentStyle.marginLeft = '0'
      contentStyle.width = '100%'
    }
    const open = () => {
      isSiderCollapse.value = false
      siderStyle.transform = 'translateX(0)'
      contentStyle.marginLeft = `${props.width}px`
      contentStyle.width = `calc(100% - ${props.width}px)`
    }
    return {
      isSiderCollapse,
      siderStyle,
      contentStyle,
      collapse,
      open
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/handler';
.sidebar {
  @include wh100;
  @include vertFlex;
  /* @include bg-color(bc_sidebar); */
  @include background_color(bc_sidebar);
  position: fixed;
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
      @include centerFlex;
      position: absolute;
      top: 26px;
      left: 50%;
      width: 24px;
      height: 24px;
      z-index: 100;
      box-sizing: border-box;
      border: 1px solid #5856d5;
      @include background_color(bc_collapser);
      border-radius: 100%;
      cursor: pointer;
      transform: translateX(-50%) translateY(-50%) rotateY(0deg);
      transition: all .2s ease-in-out;
      .icon {
        @include wh100;
        fill: $color-base;
      }
    }
  }
}
.content {
  @include wh100;
  @include background_color(bc_content);
  position: relative;
  transition: all .2s ease-in-out;
}
.open {
  position: fixed;
  @include centerFlex;
  box-sizing: border-box;
  top: 15px;
  left: 20px;
  width: 25px;
  height: 25px;
  padding: 2px;
  z-index: 200;
  cursor: pointer;
  transition: all 0.2s ease 0s;
  .icon {
    width: 20px;
    height: 20px;
  }
}
</style>
