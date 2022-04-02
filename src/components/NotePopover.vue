<template>
  <el-popover
    placement="bottom-end"
    trigger="hover"
    :show-after="400"
    :show-arrow="false"
    popper-class="note-popper"
  >
    <template #reference>
      <div class="bullet-wrapper">
        <div :class="`bullet ${node._children.length ? 'bullet-circled' : ''}`">
          <div></div>
        </div>
      </div>
    </template>
    <div class="pop-item">
      <SvgIcon icon="folder" />
      <span>新建文件夹</span>
    </div>
    <div class="pop-item">
      <SvgIcon icon="file-small" />
      <span>新建文件</span>
    </div>
    <div class="divider" />
    <div class="pop-item">
      <SvgIcon icon="delete" />
      <span>删除</span>
    </div>
  </el-popover>
</template>

<script>
import { defineComponent } from 'vue'
// import { useStore } from 'vuex'
import SvgIcon from '@/components/SvgIcon.vue'
import '@/assets/pic/more.svg'
import '@/assets/pic/folder.svg'
import '@/assets/pic/delete.svg'
import '@/assets/pic/add-quick.svg'
import '@/assets/pic/rename.svg'
import '@/assets/pic/file-small.svg'

export default defineComponent({
  name: 'BreadCrumb',
  components: {
    SvgIcon
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  setup () {
    // const store = useStore()
    return {
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/css/handler";
.bullet-wrapper {
  width: 18px;
  height: 18px;
  margin-top: 6px;
  cursor: pointer;
  .bullet {
    @include wh100;
    @include centerFlex;
    border-radius: 9px;
    div {
      z-index: 10;
      width: 6px;
      height: 6px;
      background-color: #646a73;
      border-radius: 3px;
    }
  }
  .bullet-circled {
    background-color: #ebecec;
  }
}
.note-popper {
  padding: 7px 0 !important;
  @include background_color(bc_popover);
  border: none !important;
  .pop-item {
    @include horiFlex;
    @include font_color(fc_nickname);
    width: 100%;
    position: relative;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    padding: 0px 10px;
    &:hover {
      @include background_color(bc_pop_hover);
    }
    svg {
      width: 20px;
      height: 20px;
      @include fill_color(fc_nickname);
    }
    span {
      margin-left: 12px;
    }
  }
}
.divider {
  height: 1px;
  margin: 4px 5px;
  box-sizing: border-box;
  @include background_color(bc_divider);
}
.el-overlay {
  background-color: rgba(0,0,0,.2) !important;
}
</style>
