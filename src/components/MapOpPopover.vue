<template>
  <el-popover
    placement="bottom"
    trigger="click"
    :show-arrow="false"
    popper-class="map-op-popper"
  >
    <template #reference>
      <div class="map-op-more">
        <svg-icon icon="more" />
      </div>
    </template>
    <div class="pop-item" @click="download()">
      <svg-icon icon="download" />
      <span>导出为图片</span>
    </div>
  </el-popover>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useMapStore } from '@/store/map'
import SvgIcon from '@/components/SvgIcon.vue'
import { convertToImg, ErrorTip } from '@/hooks/utils'

export default defineComponent({
  name: 'MapOpPopover',
  components: {
    SvgIcon
  },
  props: {
    isMap: {
      type: Boolean,
      required: true
    }
  },
  setup (props) {
    const store = useMapStore()
    const mapData = computed(() => store.mapData)
    const download = async () => {
      if (!props.isMap) {
        ErrorTip('请切换到导图再试')
        return
      }
      const elem = document.getElementById('mapContainer')
      await convertToImg(elem, mapData.value?.name)
    }
    return {
      download
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/handler";
.map-op-more {
  @include centerFlex;
  height: 26px;
  padding: 0px 6px;
  margin-right: 10px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #0000000d;
  }
  &>svg {
    @include fill_color(fc_nickname);
    width: 20px;
    height: 20px;
  }
}
.map-op-popper {
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
.my-dialog {
  border-radius: 4px !important;
  box-shadow: rgb(0 0 0 / 16%) 0px 2px 30px 0px !important;
}
.el-overlay {
  background-color: rgba(0,0,0,.2) !important;
}
</style>
