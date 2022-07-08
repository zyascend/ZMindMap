<template>
  <el-popover
    placement="bottom"
    trigger="click"
    :show-arrow="false"
    popper-class="op-popper"
  >
    <template #reference>
      <div class="more">
        <SvgIcon icon="more" />
      </div>
    </template>
    <div class="pop-item" v-if="isFolder(data)" @click="addNew(data, true)">
      <SvgIcon icon="folder" />
      <span>新建文件夹</span>
    </div>
    <div class="pop-item" v-if="isFolder(data)" @click="addNew(data)">
      <SvgIcon icon="file-small" />
      <span>新建文件</span>
    </div>
    <div class="pop-item" @click="renameData(data)">
      <SvgIcon icon="rename" />
      <span>重命名</span>
    </div>
    <div class="pop-item" @click="addQuick(data)">
      <SvgIcon icon="add-quick" />
      <span>添加到快捷访问</span>
    </div>
    <div class="pop-item" @click="removeData(data)">
      <SvgIcon icon="delete" />
      <span>删除</span>
    </div>
  </el-popover>
  <el-dialog
    v-model="showDeleteDialog"
    :append-to-body="true"
    title="删除文档"
    :width="400"
    custom-class="my-dialog"
  >
    <h2>确认删除此文档吗？</h2>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button type="danger" @click="submitRemove" native-type="submit"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="showRenameDialog"
    :append-to-body="true"
    :width="400"
    title="重命名"
    custom-class="my-dialog"
  >
    <el-input
      v-model="newName"
      placeholder="输入新的名字"
      @keyup.enter="submitRename"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showRenameDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRename">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useDocStore from '@/store/doc'
import useUserStore from '@/store/user'
import SvgIcon from '@/components/SvgIcon.vue'

export default defineComponent({
  name: 'BreadCrumb',
  components: {
    SvgIcon
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup() {
    const store = useDocStore()
    const userStore = useUserStore()
    const showDeleteDialog = ref(false)
    const showRenameDialog = ref(false)
    const searchText = ref('')
    const tempData = ref({})
    const newName = ref('')
    const isFolder = row => {
      return 'folderType' in row
    }
    const addNew = (data, addFolder = false) => {
      const newData = {
        name: `${addFolder ? '新文件夹' : '无标题'}`,
        folderId: data.id,
        userId: userStore.user._id
      }
      if (addFolder) {
        store.postSetFolder({ ...newData, folderType: 0 })
      }
      store.postSetDoc(newData)
    }
    const renameData = data => {
      newName.value = data.name
      tempData.value = data
      showRenameDialog.value = true
    }
    const submitRename = () => {
      showRenameDialog.value = false
      const renameFolder = isFolder(tempData.value)
      const data = { ...tempData.value, name: newName.value }
      if (renameFolder) {
        store.postSetFolder(data)
      }
      store.postSetDoc(data)
    }
    const removeData = data => {
      tempData.value = data
      showDeleteDialog.value = true
    }
    const submitRemove = () => {
      showDeleteDialog.value = false
      store.postRemove({
        id: tempData.value.id,
        type: isFolder(tempData.value) ? 0 : 1
      })
    }
    const addQuick = data => {
      console.log('[click]addQuick')
    }
    return {
      newName,
      showDeleteDialog,
      showRenameDialog,
      searchText,
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
@import '@/assets/css/handler';
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
    @include fill_color(fc_nickname);
    width: 20px;
    height: 20px;
  }
}
.op-popper {
  padding: 7px 0 !important;
  @include background_color(bc_popover);
  border: none !important;
  .pop-item {
    @include horiFlex;
    @include font_color(fc_nickname);
    position: relative;
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    height: 32px;
    padding: 0 10px;
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
.my-dialog {
  border-radius: 4px !important;
  box-shadow: rgb(0 0 0 / 16%) 0 2px 30px 0 !important;
}
.el-overlay {
  background-color: rgba(0, 0, 0, 0.2) !important;
}
</style>
