<template>
  <div class="main">
    <sider :width="325">
      <div class="profile">
        <div class="avatar">
          <img class="avatar" src="https://api2.mubu.com/v3/photo/7aadfeca-72df-48b5-ad19-262432df8fa5.jpg" alt="">
        </div>
        <div class="nickname">
          <p>THE YANG</p>
        </div>
      </div>
      <div class="inputer">
        <div class="input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 14 14" type="search" color="#2C2C2F" class="Iconstyle__StyledIcon-sc-8g7jb-0 cFoaNV" cursor="pointer" fill="currentColor" overflow="visible" style="display: inline-block; width: 14px; height: 14px; flex-shrink: 0;"><path d="M6 1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 1a3.5 3.5 0 110 7 3.5 3.5 0 010-7z"></path><path d="M9 8.306l3.242 3.548a.499.499 0 11-.738.674L8.28 9H9v-.694z"></path></svg>
          <input type="text" class="" placeholder="全局搜索 Ctrl+Shift+F " value="">
        </div>
        <div class="adder">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 14 14" type="add" cursor="pointer" fill="currentColor" overflow="visible" style="width: 14px; height: 14px;"><path fill-rule="evenodd" d="M7 2a.5.5 0 01.5.5v4h4a.5.5 0 010 1H7.499l.001 4a.5.5 0 01-1 0l-.001-4H2.5a.5.5 0 010-1h4v-4A.5.5 0 017 2z"></path></svg>
        </div>
      </div>
      <div class="divider" />
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
        <el-button type="primary" @click="submitRemove"  native-type="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="showRenameDialog" title="重命名">
    <el-input v-model="newName" placeholder="输入新的名字" @keyup.enter="submitRename"/>
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
    const searchText = ref('')
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
      newName.value = data.name
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
      searchText,
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
    padding: 13px 16px 5px;
    position: relative;
    align-items: center;
    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
    }
    .nickname {
      @include horiFlex;
      height: 24px;
      padding: 0px 4px;
      margin-left: 6px;
      border-radius: 4px;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: #e9e9eb;
      }
      &>p {
        font-size: 14px;
        overflow: hidden;
        max-width: 140px;
        margin: 0px 2px 0px 0px;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 24px;
      }
    }
  }
  .inputer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    .input-wrapper {
      width: 100%;
      @include centerFlex;
      padding: 5px 6px;
      border: 1px solid transparent;
      background-color: #e9e9eb;
      border-radius: 4px;
      &:hover{
        border: 1px solid #8a89e2;
      }
      &>input {
        width: 100%;
        height: 20px;
        padding: 1px;
        border: none;
        margin: 0px 0px 0px 4px;
        background-color: rgb(233, 233, 235);
        color: rgb(146, 146, 156);
        font-size: 13px;
        line-height: 18px;
        outline: none;
      }
    }
    .adder {
      position: relative;
      width: 28px;
      min-width: 28px;
      height: 28px;
      margin-left: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: #2c2c2f;
      border-radius: 16px;
      &>svg {
        width: 14px;
        height: 14px;
        fill: #f4f4f5;
      }
    }
  }
  .divider {
    margin-bottom: 2px;
    height: 1px;
    background: #dedee1;
  }
}
</style>
