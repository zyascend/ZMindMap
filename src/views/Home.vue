<template>
  <div class="main">
    <sider :width="325">
      <template #default>
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
      <a class="folders" href="/app/folder">
        <SvgIcon class="icon" icon="home" />
        <span>我的文档</span>
      </a>
      <el-tree
        v-if="asideData.length"
        :expand-on-click-node="false"
        :data="asideData"
      >
        <template #default="scope">
          <div class="node">
            <router-link :to="getUrl(scope.data)" class="link">
              <SvgIcon class="icon" :icon="isFolder(scope.data)?'folder':'file-small'" />
              <span>{{ scope.data.name }}</span>
            </router-link>
            <operate-popover :data="scope.data"/>
          </div>
        </template>
      </el-tree>
      <a class="folders" href="/app/folder/quick">
        <SvgIcon class="icon" icon="quick" />
        <span>快速访问</span>
      </a>
      <a class="folders" href="/app/folder/latest">
        <SvgIcon class="icon" icon="latest" />
        <span>最近编辑</span>
      </a>
      </template>
      <template #sideContent>
        <router-view :key="route.fullPath"></router-view>
      </template>
    </sider>
  </div>
</template>

<script>
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useZoomMap } from '../hooks'
import { useRoute } from 'vue-router'
import Sider from '@/components/Sider.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import OperatePopover from '@/components/OperatePopover.vue'
import '@/assets/pic/add-file.svg'
import '@/assets/pic/more.svg'
import '@/assets/pic/home.svg'
import '@/assets/pic/quick.svg'
import '@/assets/pic/latest.svg'
import '@/assets/pic/folder.svg'
import '@/assets/pic/delete.svg'
import '@/assets/pic/add-quick.svg'
import '@/assets/pic/rename.svg'
import '@/assets/pic/file-small.svg'

export default defineComponent({
  name: 'Home',
  components: {
    Sider,
    SvgIcon,
    OperatePopover
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
    const addQuick = data => {
      console.log('[click]addQuick')
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
      addQuick
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
  .folders {
    position: relative;
    height: 32px;
    @include horiFlex;
    align-items: center;
    padding: 2px 8px;
    margin: 2px 8px;
    border-radius: 6px;
    color: #75757d;
    font-size: 14px;
    transition: background 0.1s ease-in-out 0s, color 0.1s ease-in-out 0s;
    user-select: none;
    white-space: nowrap;
    &:hover {
      background-color: #deddf7;
      color: $color-base;
      .icon {
        fill: $color-base;
      }
    }
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      fill: #75757d;
    }
  }
  .el-tree {
    background-color: #F5F7FA;
    .el-tree-node__content {
      height: auto;
      background-color: #F5F7FA;
      .el-tree-node__expand-icon {
        margin-left: 10px;
        /* margin-right: 4px; */
      }
      &:hover {
        background-color: #e9e9eb;
        .more {
          visibility: visible;
        }
      }
  }
  }
  .node {
    @include horiFlex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto !important;
    padding: 2px 8px;
    position: relative;
    .link {
      color: #75757d;
      height: 32px;
      @include horiFlex;
      align-items: center;
      .icon {
        width: 20px !important;
        width: 20px;
        margin-right: 10px;
      }
    }
    .more {
      padding: 0px 4px;
      margin-right: 4px;
      border-radius: 4px;
      color: #1d1d1f;
      cursor: pointer;
      visibility: hidden;
      &:hover {
        background: #0000000d;
      }
      &>svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
.el-popper {
  padding: 7px 0 !important;
  .pop-item {
    @include horiFlex;
    width: 100%;
    position: relative;
    align-items: center;
    color: #1d1d1f;
    cursor: pointer;
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    padding: 0px 10px;
    &:hover {
      background-color: rgb(0 0 0 / 3%);
    }
    svg {
      width: 20px;
      height: 20px;
      fill: #75757d;
    }
    span {
      margin-left: 12px;
    }
  }
}
</style>
