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
          v-for="marker in markerList"
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
      title="导图样式"
      placement="bottom"
      trigger="hover"
      popper-class="map-theme-popper"
      :show-arrow="true"
      :width="264"
    >
      <template #reference>
        <div class="btn color-bar">
          <SvgIcon class="icon fit-view" icon="tree" />
        </div>
      </template>
      <div class="map-container">
        <div
          class="map-item"
          v-for="(map, index) in mapList"
          :class="{selected: map.id === curMapStyle}"
          :key="map.id"
          :tabindex="index"
          :title="map.name"
          @click="onChangeMapStyle(map.id)"
          >
          <img :src="map.imgUrl" alt="map">
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
import { computed } from 'vue'
import { useWebsiteStore } from '@/store/website'
import useZoomMap from 'hooks/useZoomMap'
import SvgIcon from 'components/SvgIcon.vue'
import { markerList, mapList } from 'hooks/useMapStyle'

const store = useWebsiteStore()
const curMapStyle = computed(() => store.mapStyle)

const fitView = () => {
  useZoomMap.registerZoom()
  useZoomMap.fitView()
}
const addMarker = makerUrl => {
  console.log('addMarker > ', makerUrl)
}
const onChangeMapStyle = mapId => {
  store.switchMapStyle(mapId)
}
</script>

<style lang="scss" scoped>
@import '../assets/css/handler';
.map-bar {
  position: absolute;
  top: 70px;
  right: 20px;
  z-index: 2;
  align-items: center;
  height: 44px;
  overflow: hidden;
  user-select: none;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 8px 4px rgb(31 35 41 / 6%);
  @include horiFlex;
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
      grid-template-columns: repeat(7, 1fr);
      grid-row-gap: 8px;
      grid-column-gap: 10px;
      column-gap: 4px;
      margin: 0 2px;
      .icon-wrapper {
        @include centerFlex;
        padding: 2px;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
          background-color: #f2f2f2;
        }
      }
    }
  }
}
.map-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 10px 12px;
  padding: 0 8px;
  .map-item {
    cursor: pointer;
    border-color: rgba(0, 0, 0, 0.1);
    border-width: 0.5px;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%), 0 1px 6px rgb(0 0 0 / 10%);
    img {
      width: 100%;
      max-width: 100%;
      height: 100%;
      border-radius: 5px;
    }
    &:last-child {
      margin-bottom: 15px;
    }
    &:first-child {
      margin-top: 10px;
    }
  }
  .selected {
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 0 0 3px #0f66de, 0 1px 2px rgb(0 0 0 / 10%), 0 1px 6px rgb(0 0 0 / 10%);
  }
}
</style>
