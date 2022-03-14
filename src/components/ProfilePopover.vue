<template>
  <el-popover
    width="260px"
    placement="bottom"
    trigger="click"
    :show-arrow="false"
    popper-class="profile-popover"
  >
    <template #reference>
      <div class="profile">
        <div class="avatar">
          <img class="avatar" src="http://cdn.kimjisoo.cn/pic/20211201094227.jpg" alt="">
        </div>
        <div class="nickname">
          <p>THE YANG</p>
        </div>
      </div>
    </template>
    <div class="info">
      <div class="img">
        <img class="avatar" src="http://cdn.kimjisoo.cn/pic/20211201094227.jpg" alt="">
      </div>
      <p>THE YANG</p>
    </div>
    <div class="divider" />
    <div class="pop-item" @click="openSettings">
      <SvgIcon icon="settings" />
      <span>账号设置</span>
    </div>
    <div class="pop-item">
      <SvgIcon icon="skin" />
      <span>黑暗模式</span>
    </div>
    <div class="divider" />
    <div class="pop-item" @click="logout">
      <SvgIcon icon="logout" />
      <span>推出登录</span>
    </div>
  </el-popover>
  <!-- <el-dialog
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
        <el-button type="danger" @click="submitRemove"  native-type="submit">确认</el-button>
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
    <el-input v-model="newName" placeholder="输入新的名字" @keyup.enter="submitRename"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showRenameDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRename">确认</el-button>
      </span>
    </template>
  </el-dialog> -->
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import SvgIcon from '@/components/SvgIcon.vue'
import '@/assets/pic/settings.svg'
import '@/assets/pic/logout.svg'
import '@/assets/pic/skin.svg'

export default defineComponent({
  name: 'ProfilePopover',
  components: {
    SvgIcon
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    // const showDeleteDialog = ref(false)
    // const showRenameDialog = ref(false)
    // const searchText = ref('')
    // const tempData = ref({})
    // const newName = ref('')

    const openSettings = () => {
    }
    const logout = () => {
    }
    const toggleSkin = () => {
    }
    return {
      // newName,
      // showDeleteDialog,
      // showRenameDialog,
      // searchText,
      openSettings,
      logout,
      toggleSkin
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/css/mixin";
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
.divider {
  height: 1px;
  margin: 4px 14px;
  background-color: #e9e9eb;
}
.profile-popover {
  padding: 0px 20px 10px 20px !important;
  .info {
    @include vertFlex;
    margin: 30px 0px 30px;
    align-items: center;
    .img {
      @include centerFlex;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 7px;
      &>img {
        width: 42px;
        height: 42px;
      }
    }
    &>p{
      padding: 0px 20px;
      overflow: hidden;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }
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
    padding: 0px 15px;
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
.my-dialog {
  border-radius: 4px !important;
  box-shadow: rgb(0 0 0 / 16%) 0px 2px 30px 0px !important;
}
.el-overlay {
  background-color: rgba(0,0,0,.2) !important;
}
</style>
