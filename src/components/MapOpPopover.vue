<template>
  <el-popover
    placement="bottom"
    trigger="hover"
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
import { defineComponent, computed, onUnmounted } from 'vue'
import { useMapStore } from '@/store/map'
// import { useWebsiteStore } from '@/store/website'
import SvgIcon from '@/components/SvgIcon.vue'
import { ErrorTip, convertToImg } from '@/hooks/utils'
import useZoomMap from '@/hooks/useZoomMap'
import { ElLoading } from 'element-plus'

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
    let loading
    let timer
    const download = () => {
      if (!props.isMap) {
        ErrorTip('请切换到导图再试')
        return
      }
      loading = ElLoading.service({
        lock: true,
        text: '努力导出中...',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      useZoomMap.fitView()
      timer = setTimeout(async () => {
        await convertToImg(mapData.value?.name)
        loading.close()
      }, 1000)
    }
    onUnmounted(() => {
      loading && loading.close()
      clearTimeout(timer)
    })
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
  padding: 0 6px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 6px;
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
    position: relative;
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    height: 32px;
    padding: 0 10px;
    font-size: 14px;
    line-height: 32px;
    cursor: pointer;
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
  box-shadow: rgb(0 0 0 / 16%) 0 2px 30px 0 !important;
}
.el-overlay {
  background-color: rgba(0,0,0,.2) !important;
}
</style>
