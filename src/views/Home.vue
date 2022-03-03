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
        @node-click="onTreeNodeClick"
      >
        <template #default="scope">
          <div class="tool-item">
            <img src="../assets/pic/theme.svg" alt="" />
          </div>
          <router-link :to="getUrl(scope.data)">
            <span>{{ scope.data.name }}</span>
          </router-link>
          <div class="tool-item">
            <img src="../assets/pic/theme.svg" alt="" />
          </div>
          <div class="tool-item">
            <img src="../assets/pic/theme.svg" alt="" />
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
    const onTreeNodeClick = (data) => {
      console.log(data)
    }
    const getUrl = (row) => {
      const isFolder = 'folderType' in row
      if (isFolder) {
        return `/app/folder/${row.id}`
      } else {
        return `/app/edit/${row.id}`
      }
    }
    return {
      asideData,
      fitView,
      route,
      isDrawerOpen,
      onTreeNodeClick,
      getUrl
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
