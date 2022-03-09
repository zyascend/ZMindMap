<template>
  <div class="main">
    <sider :width="300">
      <div class="profile">
        <div class="info">
          <!-- <img src="https://api2.mubu.com/v3/photo/7aadfeca-72df-48b5-ad19-262432df8fa5.jpg" alt=""> -->
          <img class="avatar" src="" alt="">
          <p class="nickname">THE YANG</p>
        </div>
      </div>
      <el-tree
        v-if="asideData.length"
        :expand-on-click-node="false"
        :data="asideData"
      >
        <template #default="scope">
          <div class="tool-item">
            <img :src="isFolder(scope.data) ? ICON_FOLDER : ICON_FILE" alt="" />
            <router-link :to="getUrl(scope.data)">
              <span>{{ scope.data.name }}</span>
            </router-link>
          </div>
          <div class="tool-item" @click="onMore(scope.data)">
            <el-popover
              placement="bottom"
              trigger="click"
              :show-arrow="false">
                <template #reference>
                  <img :src="ICON_MORE" alt="" />
                </template>
                <ul>
                  <li>创建时间</li>
                  <li>最近编辑时间</li>
                </ul>
            </el-popover>
          </div>
        </template>
      </el-tree>
      <a class="folders" href="/app/folder/quick">
        <img src="../assets/pic/theme.svg" alt="" />
        <span>快速访问</span>
      </a>
      <a class="folders" href="/app/folder/recent">
        <img src="../assets/pic/theme.svg" alt="" />
        <span>最近编辑</span>
      </a>
      <a class="folders" href="/app/folder/clb">
        <img src="../assets/pic/theme.svg" alt="" />
        <span>回收站</span>
      </a>
    </sider>
    <router-view :key="route.fullPath"></router-view>
  </div>
</template>

<script>
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useZoomMap } from '../hooks'
import Sider from '@/components/Sider.vue'
import { useRoute } from 'vue-router'
import ICON_ADD from '@/assets/pic/add-file.svg'
import ICON_MORE from '@/assets/pic/more.svg'
import ICON_FOLDER from '@/assets/pic/folder.svg'
import ICON_FILE from '@/assets/pic/file-small.svg'

export default defineComponent({
  name: 'Home',
  components: {
    Sider
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const asideData = computed(() => store.getters.getAllDocuments(null))
    const isDrawerOpen = ref(true)
    onMounted(() => {
      store.dispatch('fetchAllDocuments')
    })
    const fitView = () => {
      useZoomMap.fitView()
    }
    const getUrl = (row) => {
      const isFolder = 'folderType' in row
      if (isFolder) {
        return `/app/folder/${row.id}`
      } else {
        return `/app/edit/${row.id}`
      }
    }
    const isFolder = row => {
      return 'folderType' in row
    }
    const onMore = data => {
      console.log(data)
    }
    return {
      asideData,
      route,
      isDrawerOpen,
      fitView,
      getUrl,
      isFolder,
      onMore,
      ICON_ADD,
      ICON_MORE,
      ICON_FOLDER,
      ICON_FILE
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/css/mixin";
.main {
  position: relative;
  @include wh100;
  @include horiFlex;
  .profile {
    width: 100%;
    @include horiFlex;
    .info {
      @include horiFlex;
      .avatar {
      }
    }
  }
}
</style>
