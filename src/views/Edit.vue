<template>
  <div class="map-wrapper">
    <header class="map-header">
      <div class="info">
        <a :href="`/app/folder/${mapData?.directory[0]?.id}`" class="name">
          <svg-icon icon="folder"/>
          <span>{{ mapData?.directory[0]?.name }}</span>
        </a>
        <span>&nbsp;|&nbsp;&nbsp;{{ mapData?.name || '' }}</span>
      </div>
      <p v-show="!isSaving" class="saved">已保存</p>
      <div v-show="isSaving" class="loader" />
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
    <note v-if="!showMap" />
    <mind-map-pro v-if="showMap" />
  </div>
</template>
<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMapStore } from '@/store/map'
import MindMapPro from '@/components/MindMapPro.vue'
import Note from '@/components/Note.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import '@/assets/pic/fit-view.svg'
import '@/assets/pic/folder.svg'
import '@/assets/pic/theme.svg'
import '@/assets/pic/tree.svg'
import '@/assets/pic/note.svg'

export default defineComponent({
  components: {
    MindMapPro,
    SvgIcon,
    Note
  },
  setup () {
    const store = useMapStore()
    const route = useRoute()
    const docId = route.params?.id
    const mapData = computed(() => store.mapData)
    const showMap = ref(false)
    const isSaving = computed(() => store.isSaving)
    onMounted(async () => {
      await store.fetchMap(docId)
    })
    const toggleShowMap = () => {
      showMap.value = !showMap.value
    }
    return {
      docId,
      isSaving,
      showMap,
      mapData,
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
    .loader {
      margin-right: 10px;
      border: 2px solid #f3f3f3;
      border-radius: 50%;
      border-top: 2px solid $color-base;
      width: 15px;
      height: 15px;
      animation: spin 1s linear infinite;
    }

    @-webkit-keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
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
