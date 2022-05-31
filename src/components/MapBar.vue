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
          v-for="marker in styles.markerList"
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
      title="颜色主题"
      placement="bottom"
      trigger="hover"
      popper-class="map-theme-popper"
      :show-arrow="true"
      :width="264"
    >
      <template #reference>
        <div class="btn">
          <SvgIcon class="icon" icon="theme" />
        </div>
      </template>
      <div class="color-container">
        <div
          class="color-item"
          v-for="(color, index) in styles.colorList"
          :class="{selected: color.id === curStyle.colorId}"
          :key="color.id"
          :tabindex="index"
          :title="color.id"
          @click="onColorStyle(color.id)"
          >
          <img :src="color.imgUrl" alt="color">
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
        <div class="btn">
          <SvgIcon class="icon fit-view" icon="tree" />
        </div>
      </template>
      <div class="map-container">
        <div
          class="map-item"
          v-for="(map, index) in styles.mapList"
          :class="{selected: map.id === curStyle.mapStyleId}"
          :key="map.id"
          :tabindex="index"
          :title="map.name"
          @click="onChangeMapStyle(map.id)"
          >
          <img :src="map.imgUrl" alt="map">
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWebsiteStore } from '@/store/website'
import { useMapStore } from '@/store/map'
import useZoomMap from 'hooks/useZoomMap'
import SvgIcon from 'components/SvgIcon.vue'

const websiteStore = useWebsiteStore()
const mapStore = useMapStore()
// 所有可选的主题列表
const styles = computed(() => websiteStore.styles)
// 当前导图的主题id
const curStyle = computed(() => mapStore?.mapData.styles)

const fitView = () => {
  useZoomMap()
}
const addMarker = async (makerUrl) => {
  const markerList = mapStore.content[mapStore.idFocused]?.markerList
  console.log('addMarker', markerList)
  if (markerList?.includes(makerUrl)) return
  mapStore.setMarkers(markerList.concat(makerUrl))
}
const onChangeMapStyle = async (mapStyleId) => {
  if (mapStyleId === curStyle.value.mapStyleId) return
  await mapStore.setStyle({ ...curStyle.value, mapStyleId })
}
const onColorStyle = async (colorId) => {
  if (colorId === curStyle.value.colorId) return
  await mapStore.setStyle({ ...curStyle.value, colorId })
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
      object-fit: cover;
      border-radius: inherit;
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
.color-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 12px;
  padding: 0 8px 8px;
  .color-item {
    cursor: pointer;
    border-color: rgba(0, 0, 0, 0.1);
    border-width: 0.5px;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%), 0 1px 6px rgb(0 0 0 / 10%);
    img {
      width: 100%;
      max-width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
  }
  .selected {
    border-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 0 0 3px #0f66de, 0 1px 2px rgb(0 0 0 / 10%), 0 1px 6px rgb(0 0 0 / 10%);
  }
}
</style>
