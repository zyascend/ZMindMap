<template>
  <div class="map-bar">
    <el-tooltip
      effect="light"
      content="适应屏幕"
      :offset="20"
      placement="left">
      <div class="btn" @click="fitView">
        <SvgIcon class="icon fit-view" icon="fit-view" />
      </div>
    </el-tooltip>
    <el-popover
      title="添加贴纸"
      placement="bottom"
      trigger="hover"
      popper-class="map-theme-popper"
      :show-arrow="true"
      :width="264"
    >
      <template #reference>
        <div class="btn">
          <SvgIcon class="icon" icon="marker" />
        </div>
      </template>
      <div class="marker-container">
        <div
          class="icon-group"
          v-for="marker in markerData"
          :key="marker.category"
          >
          <h5>{{ marker.category }}</h5>
          <div class="icons">
            <div
              class="icon-wrapper"
              v-for="imgUrl in marker.imgs"
              :key="imgUrl"
              @click="addMarker(imgUrl)">
              <img :src="imgUrl" alt="marker">
            </div>
          </div>
        </div>
      </div>
    </el-popover>
    <el-popover
      title="选择主题"
      placement="bottom"
      trigger="hover"
      popper-class="map-theme-popper"
      :show-arrow="true"
      :width="264"
    >
      <template #reference>
        <div class="btn color-bar">
          <SvgIcon class="icon" icon="theme" />
        </div>
      </template>
      <div>theme</div>
    </el-popover>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useZoomMap from 'hooks/useZoomMap'
import SvgIcon from './SvgIcon.vue'
import { markerList } from 'hooks/useMapStyle'
const fitView = () => {
  useZoomMap.registerZoom()
  useZoomMap.fitView()
}
const addMarker = makerUrl => {
  console.log('addMarker > ', makerUrl)
}
const markerData = ref(markerList)
</script>

<style lang="scss" scoped>
@import '../assets/css/handler';
.map-bar {
  position: absolute;
  @include horiFlex;
  align-items: center;
  top: 70px;
  right: 20px;
  z-index: 2;
  height: 44px;
  user-select: none;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 8px 4px rgb(31 35 41 / 6%);
  .btn {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 6px 6px;
    cursor: pointer;
    &:hover {
      background-color: rgb(0 0 0 / 5%);
    }
    .icon {
      width: 32px;
      height: 32px;
    }
    .fit-view {
      width: 24px;
      height: 24px;
      margin: 8px;
    }
  }
  .btn+.btn {
    margin-left: 10px;
  }
}
.marker-container {
  @include vertFlex;
  padding: 10px;
  .icon-group {
    margin-bottom: 16px;
    h5 {
      margin-bottom: 16px;
      font-size: 13px;
      font-weight: 600;
      line-height: 16px;
      color: #000;
    }
    .icons {
      display: grid;
      margin: 0 2px;
      grid-column-gap: 10px;
      grid-row-gap: 8px;
      column-gap: 4px;
      grid-template-columns: repeat(7, 1fr);
      .icon-wrapper {
        @include centerFlex;
        cursor: pointer;
        padding: 2px;
        border-radius: 4px;
        &:hover {
          background-color: #f2f2f2;
        }
      }
    }
  }
}
</style>
