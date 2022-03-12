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
          <div class="tool-item">
            <el-popover
              placement="bottom"
              trigger="click"
              :show-arrow="false">
                <template #reference>
                  <img :src="ICON_MORE" alt="" />
                </template>
                <template v-if="isFolder(scope.data)">
                  <div class="pop-item" @click="addNew(scope.data, true)">创建文件夹</div>
                  <div class="pop-item" @click="addNew(scope.data)">创建文件</div>
                  <div class="pop-item" @click="renameData(scope.data)">重命名</div>
                  <div class="pop-item" @click="removeData(scope.data)">删除</div>
                </template>
                <template v-else>
                  <div class="pop-item" @click="renameData(scope.data)">重命名</div>
                  <div class="pop-item" @click="removeData(scope.data)">删除</div>
                </template>
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
  <el-dialog v-model="showDeleteDialog" title="删除文档">
    <h2>确认删除此文档吗？</h2>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRemove">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="showRenameDialog" title="重命名">
    <el-input v-model="newName" placeholder="输入新的名字" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showRenameDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRename">确认</el-button>
      </span>
    </template>
  </el-dialog>
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
    const showDeleteDialog = ref(false)
    const showRenameDialog = ref(false)
    const tempData = ref({})
    const newName = ref('')
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
    const addNew = (data, addFolder = false) => {
      const newData = {
        name: `${addFolder ? '新文件夹' : '无标题'}`,
        folderId: data.id,
        userId: store.getters.getUser._id
      }
      if (addFolder) {
        Object.assign(newData, { ...newData, folderType: 0 })
      }
      store.dispatch(`${addFolder ? 'postSetFolder' : 'postSetDoc'}`, newData)
    }
    const renameData = data => {
      newName.value = ''
      tempData.value = data
      showRenameDialog.value = true
    }
    const submitRename = () => {
      showRenameDialog.value = false
      const renameFolder = isFolder(tempData.value)
      store.dispatch(`${renameFolder ? 'postSetFolder' : 'postSetDoc'}`, {
        ...tempData.value,
        name: newName.value
      })
    }
    const removeData = data => {
      tempData.value = data
      showDeleteDialog.value = true
    }
    const submitRemove = () => {
      showDeleteDialog.value = false
      store.dispatch('postRemove', {
        id: tempData.value.id,
        type: isFolder(tempData.value) ? 0 : 1
      })
    }
    return {
      asideData,
      route,
      isDrawerOpen,
      newName,
      showDeleteDialog,
      showRenameDialog,
      fitView,
      getUrl,
      isFolder,
      addNew,
      renameData,
      removeData,
      submitRemove,
      submitRename,
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
