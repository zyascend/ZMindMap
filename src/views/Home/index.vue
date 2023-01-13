<template>
  <div class="main">
    <sider :width="325">
      <template #default>
        <profile-popover />
        <div class="inputer">
          <div class="input-wrapper">
            <SvgIcon icon="search" />
            <input type="text" class="" placeholder="全局搜索" value="" />
          </div>
          <div class="adder">
            <el-popover
              placement="bottom"
              trigger="hover"
              :show-arrow="false"
              popper-class="add-popper"
            >
              <template #reference>
                <SvgIcon class="icon" icon="add-file" />
              </template>
              <div class="pop-item" @click="addNew(true)">
                <SvgIcon icon="folder" />
                <span>新建文件夹</span>
              </div>
              <div class="pop-item" @click="addNew(false)">
                <SvgIcon icon="file-small" />
                <span>新建文件</span>
              </div>
            </el-popover>
          </div>
        </div>
        <div class="divider" />
        <router-link
          class="folders"
          to="/app/folder"
          active-class="folder-active"
        >
          <SvgIcon class="icon" icon="home" />
          <span>我的文档</span>
        </router-link>
        <el-tree
          v-if="docTreeData.length"
          :expand-on-click-node="false"
          :data="docTreeData"
          :highlight-current="true"
        >
          <template #default="scope">
            <div class="node">
              <router-link :to="getUrl(scope.data)" class="link">
                <SvgIcon
                  class="icon"
                  :icon="isFolder(scope.data) ? 'folder' : 'file-small'"
                />
                <span>{{ scope.data.name }}</span>
              </router-link>
              <doc-popover :data="scope.data" />
            </div>
          </template>
        </el-tree>
        <router-link
          class="folders"
          to="/app/folder/quick"
          active-class="folder-active"
        >
          <SvgIcon class="icon" icon="quick" />
          <span>快速访问</span>
        </router-link>
        <router-link
          class="folders"
          to="/app/folder/latest"
          active-class="folder-active"
        >
          <SvgIcon class="icon" icon="latest" />
          <span>最近编辑</span>
        </router-link>
      </template>
      <template #sideContent>
        <router-view :key="route.fullPath"></router-view>
      </template>
    </sider>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import useDocStore from '@/store/doc'
import useUserStore from '@/store/user'
import useWebsiteStore from '@/store/website'

import SvgIcon from '@/components/SvgIcon.vue'
import DocPopover from '@/components/DocPopover.vue'
import Sider from './components/Sider.vue'
import ProfilePopover from './components/ProfilePopover.vue'

export default {
  name: 'Home',
  components: {
    Sider,
    SvgIcon,
    DocPopover,
    ProfilePopover
  },
  setup() {
    const route = useRoute()
    const store = useDocStore()
    const userStore = useUserStore()
    const websiteStore = useWebsiteStore()

    const docTreeData = computed(() => store.allTreeDocs || [])
    const isDrawerOpen = ref(true)
    const isShowDeleteDialog = ref(false)
    const isShowRenameDialog = ref(false)
    const searchText = ref('')

    store.fetchAllDocuments()
    websiteStore.fetchMapStyles()

    const isFolder = row => 'folderType' in row
    const getUrl = row =>
      isFolder(row) ? `/app/folder/${row.id}` : `/app/edit/${row.id}/note`  // 默认展示大纲

    const addNew = addFolder => {
      const newData = {
        name: `${addFolder ? '新文件夹' : '无标题'}`,
        folderId: '0',
        userId: userStore.user._id
      }
      if (addFolder) {
        store.postSetFolder({ ...newData, folderType: 0 })
      } else {
        store.postSetDoc(newData)
      }
    }

    return {
      route,
      docTreeData,
      isDrawerOpen,
      isShowDeleteDialog,
      isShowRenameDialog,
      searchText,
      getUrl,
      isFolder,
      addNew
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/handler';
.main {
  position: relative;
  @include wh100;
  @include horiFlex;
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
      @include background_color(bc_input);
      border-radius: 4px;
      &:hover {
        border: 1px solid #8a89e2;
      }
      & > input {
        width: 100%;
        height: 20px;
        padding: 1px;
        margin: 0 0 0 4px;
        font-size: 13px;
        line-height: 18px;
        @include font_color(fc_input);
        background-color: transparent;
        border: none;
        outline: none;
      }
      svg {
        width: 14px;
        height: 14px;
        @include fill_color(fc_input);
      }
    }
    .adder {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      min-width: 28px;
      height: 28px;
      margin-left: 16px;
      cursor: pointer;
      @include background_color(bc_adder);
      border-radius: 16px;
      & > svg {
        width: 15px;
        height: 15px;
        fill: #f5f7fa;
      }
    }
    .icon {
      width: 20px;
      height: 20px;
    }
  }
  .divider {
    height: 1px;
    margin-bottom: 2px;
    background: #dedee1;
  }
  .folders {
    position: relative;
    @include horiFlex;
    align-items: center;
    height: 32px;
    padding: 2px 8px;
    margin: 5px 8px;
    @include font_color(fc_side_link);
    font-size: 14px;
    white-space: nowrap;
    user-select: none;
    border-radius: 6px;
    transition: background 0.1s ease-in-out 0s, color 0.1s ease-in-out 0s;
    &:first-child {
      margin: 5px 8px;
    }
    &:hover {
      @include background_color(bc_side_link_hover);
      @include font_color(fc_side_link_hover);
      .icon {
        @include fill_color(fc_side_link_hover);
      }
    }
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      @include fill_color(fc_side_link);
    }
  }
  .folder-active {
    @include background_color(bc_side_link_active);
    @include font_color(fc_side_link_active);
    .icon {
      @include fill_color(fc_side_link_active);
    }
  }
  .el-tree {
    background-color: transparent;
    .is-current {
      .el-tree-node__content {
        @include background_color(bc_tree_node_hover);
        .more {
          visibility: visible;
        }
      }
    }
    .el-tree-node:focus > .el-tree-node__content {
      background-color: transparent !important;
    }
    .el-tree-node__content {
      height: auto;
      .el-tree-node__expand-icon {
        margin-left: 10px;
      }
      &:hover {
        @include background_color(bc_tree_node_hover);
        .more {
          visibility: visible;
        }
      }
    }
  }
  .node {
    position: relative;
    @include horiFlex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto !important;
    padding: 2px 8px;
    .link {
      flex: 1;
      @include horiFlex;
      align-items: center;
      height: 32px;
      @include font_color(fc_tree_node);
      .icon {
        width: 20px !important;
        margin-right: 10px;
      }
    }
    .more {
      padding: 0 4px;
      margin-right: 4px;
      color: #1d1d1f;
      cursor: pointer;
      visibility: hidden;
      border-radius: 4px;
      &:hover {
        background: #0000000d;
      }
      & > svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
.add-popper {
  padding: 7px 0 !important;
  @include background_color(bc_popover);
  border: none !important;
  .pop-item {
    position: relative;
    box-sizing: border-box;
    @include horiFlex;
    align-items: center;
    width: 100%;
    height: 32px;
    padding: 0 10px;
    @include font_color(fc_nickname);
    font-size: 14px;
    line-height: 32px;
    cursor: pointer;
    &:hover {
      @include background_color(bc_pop_hover);
    }
    svg {
      width: 20px;
      height: 20px;
      @include fill_color(fc_nickname);
    }
    span {
      margin-left: 12px;
    }
  }
}
</style>
