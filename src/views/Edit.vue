<template>
  <div class="map-wrapper">
    <header class="map-header">
      <div class="info">
        <a :href="`/app/folder/${mapData?.originMapData?.directory[0]?.id}`" class="name">
          <svg-icon icon="folder"/>
          <span>{{ mapData?.originMapData?.directory[0]?.name }}</span>
        </a>
        <span>&nbsp;|&nbsp;&nbsp;{{ mapData?.originMapData?.name || '' }}</span>
      </div>
      <p class="saved">已保存</p>
      <div class="show-map" @click="toggleShowMap">
        <template v-if="!showMap">
          <svg-icon icon="tree"/>
          <span>思维导图</span>
        </template>
        <template v-else>
          <svg-icon icon="note"/>
          <span>大纲笔记</span>
        </template>
      </div>
    </header>
    <!-- <mind-map v-model="mapData"></mind-map> -->
    <note v-if="!showMap" :data="noteData" />
    <!-- <div class="toolbar">
      <el-tooltip
        class="tool-item"
        effect="light"
        content="适应当前大小"
        popper-class="popper"
        placement="left">
        <div class="" @click="fitView">
          <img :src="ICON_FITVIEW" alt="">
        </div>
      </el-tooltip>
    </div>
    <div class="tool-item">
      <img :src="ICON_THEME" alt="">
    </div> -->
  </div>
</template>
<script>
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useZoomMap } from '@/hooks'
// import MindMap from '@/components/MindMap.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import Note from '@/components/Note.vue'
import note from '@/mock/note'
import '@/assets/pic/fit-view.svg'
import '@/assets/pic/folder.svg'
import '@/assets/pic/theme.svg'
import '@/assets/pic/tree.svg'
import '@/assets/pic/note.svg'

export default defineComponent({
  components: {
    // MindMap,
    Note,
    SvgIcon
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const docId = route.params?.id
    const mapData = computed(() => store.getters.getMapData)
    const noteData = computed(() => note)
    const showMap = ref(false)
    const fitView = () => {
      useZoomMap.fitView()
    }
    onMounted(() => {
      store.dispatch('fetchDocContent', docId)
    })
    const toggleShowMap = () => {
      showMap.value = !showMap.value
    }
    return {
      docId,
      showMap,
      mapData,
      noteData,
      fitView,
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
  .map-header {
    position: relative;
    display: flex;
    width: 100%;
    height: 46px;
    align-items: center;
    padding: 4px 16px 0 0;
    color: #92929c;
    cursor: pointer;
    font-size: 14px;
    line-height: 22px;
    .info {
      flex: 1 1 0%;
      @include horiFlex;
      margin-left: 70px;
      .name {
        @include horiFlex;
        align-items: center;
        text-align: center;
        color: #92929c;
        border-radius: 4px;
        padding: 0px 4px;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          color: #1d1d1f;
          background-color: rgba(0, 0, 0, 0.04);
        }
        svg {
          height: 20px;
          width: 20px;
          margin-right: 2px;
        }
      }
    }
    .saved {
      min-width: 50px;
      padding-top: 2px;
      margin-right: 10px;
      color: #bbbfc4;
      font-size: 13px;
    }
    .show-map {
      position: relative;
      display: inline-flex;
      width: auto;
      min-width: 0px;
      height: 26px;
      margin-right: 10px;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      padding: 0px 6px;
      background-color: #f4f4f5;
      border-radius: 6px;
      transition: background-color 0.2s ease 0s, color 0.2s ease 0s, box-shadow 0.2s ease 0s, border 0.2s ease 0s;
      &:hover {
        color: #75757d;;
        background-color: rgba(0, 0, 0, 0.04);
      }
      svg {
        width: 20px;
        height: 20px;
        margin-right: 2px;
      }
    }
  }
  .toolbar {
    @include vertFlex;
    position: absolute;
    z-index: 2;
    top: 50px;
    right: 50px;
    border: 1px solid #dee0e3;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 8px 4px rgba(31, 35, 41, .06);
    user-select: none;
    padding: 8px;
    cursor: pointer;
    .tool-item + .tool-item {
      @include wh(16px, 16px);
      margin-top: 8px;
    }
  }
}
.popper {
  font-size: 10px !important;
  padding: 6px !important;
}
</style>
