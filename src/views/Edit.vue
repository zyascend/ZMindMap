<template>
  <div class="map-wrapper">
    <header class="map-header">
      <div class="info">
        <a :href="`/app/folder/${mapData?.directory[0]?.id}`" class="name">
          <svg-icon icon="folder" />
          <span>{{ mapData?.directory[0]?.name }}</span>
        </a>
        <span>&nbsp;|&nbsp;&nbsp;{{ mapData?.name || '' }}</span>
      </div>
      <p v-show="!isSaving" class="saved">已保存</p>
      <div v-show="isSaving" class="loader" />
      <div class="show-map" @click="toggleShowMap">
        <template v-if="!showMap">
          <svg-icon icon="tree" />
          <span>思维导图</span>
        </template>
        <template v-else>
          <svg-icon icon="note" />
          <span>大纲笔记</span>
        </template>
      </div>
      <map-op-popover :isMap="showMap" />
    </header>
    <keep-alive>
      <component :is="curComponent" :key="curComponent"></component>
    </keep-alive>
  </div>
</template>
<script>
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import useMapStore from '@/store/map'
import Note from '@/components/note/Note.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import MapOpPopover from '@/components/map/MapOpPopover.vue'
import Map from '@/components/map/Map.vue'

export default defineComponent({
  components: {
    Map,
    Note,
    SvgIcon,
    MapOpPopover
  },
  setup() {
    const store = useMapStore()
    const route = useRoute()

    const docId = route.params?.id
    const mapData = computed(() => store.mapData)
    const curComponent = ref(route.params?.view === 'note' ? 'note' : 'map')
    const showMap = computed(() => curComponent.value === 'map')
    const isSaving = computed(() => store.isSaving)

    store.fetchMap(docId)

    const toggleShowMap = () => {
      const nextView = curComponent.value === 'map' ? 'note' : 'map'
      let nextPath
      if (!route.params?.view) {
        nextPath = `${route.fullPath}/${nextView}`
      } else {
        nextPath = route.fullPath.replace(/(note|map)/gm, nextView)
      }
      window.history.replaceState('', '', nextPath)
      curComponent.value = nextView
    }
    return {
      docId,
      isSaving,
      showMap,
      mapData,
      curComponent,
      toggleShowMap
    }
  }
})
</script>
<style lang="scss" scoped>
@import '../assets/css/mixin';
.map-wrapper {
  @include wh100;
  position: relative;
  overflow: hidden;
  .map-header {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 46px;
    padding: 4px 16px 0 0;
    font-size: 14px;
    line-height: 22px;
    color: #92929c;
    cursor: pointer;
    .show-map {
      position: relative;
      @include centerFlex;
      width: auto;
      min-width: 0;
      height: 26px;
      padding: 0 6px;
      margin-right: 10px;
      background-color: #f4f4f5;
      border-radius: 6px;
      transition: background-color 0.2s ease 0s, color 0.2s ease 0s,
        box-shadow 0.2s ease 0s, border 0.2s ease 0s;
      svg {
        width: 20px;
        height: 20px;
        margin-right: 2px;
      }
      &:hover {
        color: #75757d;
        background-color: #0000000a;
      }
    }
    .more-op {
      @include centerFlex;
      height: 26px;
      padding: 0 6px;
      margin-right: 10px;
      cursor: pointer;
      background-color: #f4f4f5;
      border-radius: 6px;
      &:hover {
        background-color: #0000000a;
      }
      svg {
        width: 20px;
        height: 20px;
        fill: #75757d;
      }
    }
    .info {
      flex: 1 1 0%;
      @include horiFlex;
      margin-left: 70px;
      .name {
        @include horiFlex;
        align-items: center;
        padding: 0 4px;
        color: #92929c;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 4px;
        &:hover {
          color: #1d1d1f;
          background-color: rgba(0, 0, 0, 0.04);
        }
        svg {
          width: 20px;
          height: 20px;
          margin-right: 2px;
        }
      }
    }
    .saved {
      min-width: 50px;
      padding-top: 2px;
      margin-right: 10px;
      font-size: 13px;
      color: #bbbfc4;
    }
    .loader {
      width: 15px;
      height: 15px;
      margin-right: 10px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid $color-base;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @-webkit-keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
.popper {
  padding: 6px !important;
  font-size: 10px !important;
}
</style>
