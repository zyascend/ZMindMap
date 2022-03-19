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
          <img class="avatar" :src="user.avatar" alt="">
        </div>
        <div class="nickname">
          <p>{{ user?.name || user?.email || '' }}</p>
          <svg-icon icon="triangle"/>
        </div>
      </div>
    </template>
    <div class="info">
      <div class="img">
        <img class="avatar" :src="user.avatar" alt="">
      </div>
      <p>{{ user?.name || user?.email || '' }}</p>
    </div>
    <div class="divider" />
    <div class="pop-item" @click="toggleShowSettings">
      <SvgIcon icon="settings" />
      <span>账号设置</span>
    </div>
    <div class="pop-item pop-switch">
      <div>
        <SvgIcon icon="skin" />
        <span>黑暗模式</span>
      </div>
      <el-switch
        :width="37"
        v-model="isDarkMode"
        class="ml-2"
        active-color="#5856d5"
        inactive-color="#b3b3ba"/>
    </div>
    <div class="divider" />
    <div class="pop-item" @click="logout">
      <SvgIcon icon="logout" />
      <span>退出登录</span>
    </div>
  </el-popover>
  <el-dialog
    v-model="showSettings"
    :append-to-body="true"
    :width="800"
    custom-class="profile-dialog"
  >
    <div class="settings">
      <div class="left">
        <a href="#" class="tab">
          <span>个人信息</span>
        </a>
      </div>
      <div class="right">
        <div class="user-message">
          <h1 class="title">个人信息</h1>
          <div class="content">
            <div class="avatar">
              <div><img :src="user.avatar" alt="avatar"></div>
              <button class="avatar-edit" @click="onEditAvatar">编辑</button>
            </div>
            <div class="info">
              <p class="label">昵称</p>
              <div class="editer">
                <p class="name" v-if="!isEditName">{{ editedName || '' }}</p>
                <el-input v-else v-model="editedName" autofocus/>
                <button class="info-edit" @click="toggleEditName">
                  {{ isEditName ? '保存' : '修改' }}
                </button>
              </div>
              <p class="label">用户ID</p>
              <div class="editer">
                <p class="name">{{ user?._id }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon.vue'
import '@/assets/pic/settings.svg'
import '@/assets/pic/logout.svg'
import '@/assets/pic/skin.svg'
import '@/assets/pic/triangle.svg'

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
    const router = useRouter()
    const user = computed(() => store.getters.getUser)
    const isDarkMode = ref(store.getters.isDark)
    const showSettings = ref(false)
    const isEditName = ref(false)
    const editedName = ref(store.getters.getUser?.name || '')
    watch(isDarkMode, () => {
      store.dispatch('toggleDarkMode')
    })

    const toggleShowSettings = () => {
      showSettings.value = !showSettings.value
    }

    const logout = () => {
      store.dispatch('logout')
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }

    const toggleSkin = () => {
    }
    const onEditAvatar = () => {}
    const toggleEditName = () => {
      if (isEditName.value && editedName.value) {
        // TODO 提交失败了怎么办
        store.dispatch('updateUser', {
          ...user.value,
          name: editedName.value
        }).then(() => {
          isEditName.value = !isEditName.value
        })
      } else {
        isEditName.value = !isEditName.value
      }
    }
    return {
      // newName,
      // showDeleteDialog,
      showSettings,
      user,
      isDarkMode,
      isEditName,
      editedName,
      toggleShowSettings,
      logout,
      toggleSkin,
      onEditAvatar,
      toggleEditName
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
    &>svg {
      height: 10px;
      width: 10px;
      transform: rotate(-90deg);
    }
  }
}
.divider {
  height: 1px;
  margin: 4px 5px;
  box-sizing: border-box;
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
      margin-bottom: 10px;
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
    text-align: center;
    box-sizing: border-box;
    padding: 5px 0px;
    &:hover {
      background-color: rgb(0 0 0 / 3%);
    }
    svg {
      width: 20px;
      height: 20px;
      fill: #75757d;
      /* margin-right: 10px; */
    }
    span {
      margin-left: 15px;
    }
  }
  .pop-switch {
    justify-content: space-between;
    padding-right: 5px;
    div {
      @include horiFlex;
      align-items: center;
    }
  }
}
.profile-dialog {
  border-radius: 4px !important;
  box-shadow: rgb(0 0 0 / 16%) 0px 2px 30px 0px !important;
  .el-dialog__body {
    padding: 0 0 !important;
    .settings {
      display: flex;
      width: 700px;
      height: 534px;
      border-radius: 4px;
      overflow: hidden auto;
      .left {
        box-sizing: border-box;
        position: absolute;
        top: 0px;
        height: 100%;
        padding-top: 40px;
        border-right: 1px solid #dedee1;
        background: #f4f4f5;
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
        font-size: 16px;
        .tab {
          position: relative;
          display: flex;
          width: 140px;
          height: 38px;
          align-items: center;
          justify-content: center;
          margin: 0px 0px 12px;
          color: #5856d5;
          cursor: pointer;
          font-size: 16px;
          user-select: none;
          text-decoration: none;
          &::before {
            content: "";
            position: absolute;
            display: block;
            top: 0px;
            left: 0px;
            width: 3px;
            height: 100%;
            color: #5856d5;
            background: #5856d5;
          }
        }
      }
      .right {
        width: 557px;
        flex: 1 1 0%;
        margin-left: 140px;
        .user-message {
          min-height: 534px;
          padding: 10px 60px 0px 40px;
          /* background: #ffffff; */
          .title {
            display: flex;
            height: 38px;
            -webkit-box-align: center;
            align-items: center;
            margin-bottom: 12px;
            color: #1d1d1f;
            font-size: 18px;
            font-weight: normal;
            line-height: 1.45;
          }
          .content {
            @include horiFlex;
            .avatar {
              @include vertFlex;
              margin-right: 40px;
              div {
                width: 80px;
                height: 80px;
                position: relative;
                @include centerFlex;
                border-radius: 50%;
                img {
                  @include wh100;
                  border-radius: 50%;
                }
              }
              button {
                @include centerFlex;
                position: relative;
                height: 20px;
                padding: 4px;
                margin-top: 20px;
                border: none;
                background-color: transparent;
                border-radius: 5px;
                color: #5856d5;
                cursor: pointer;
                font-size: 14px;
                outline: none;
                text-align: center;
                text-decoration: none;
                transition: background-color 0.2s ease 0s, color 0.2s ease 0s, box-shadow 0.2s ease 0s, border 0.2s ease 0s;
                white-space: nowrap;
                &:hover {
                  background: #f8f8fd;
                }
              }
            }
            .info {
              width: 338px;
              .label {
                font-size: 14px;
                margin-bottom: 10px;
                color: #92929c;
              }
              .editer {
                @include horiFlex;
                min-height: 22px;
                justify-content: space-between;
                align-items: center;
                padding: 5px 8px;
                background-color: #f4f4f5;
                border-radius: 4px;
                line-height: 20px;
                margin-bottom: 28px;
                .name {
                  color: #1d1d1f;
                  font-size: 16px;
                }
                .info-edit {
                  position: relative;
                  height: 20px;
                  box-sizing: border-box;
                  padding: 4px;
                  @include centerFlex;
                  border: none;
                  background-color: transparent;
                  border-radius: 4px;
                  color: #5856d5;
                  cursor: pointer;
                  font-size: 14px;
                  outline: none;
                  text-align: center;
                  text-decoration: none;
                  transition: background-color 0.2s ease 0s, color 0.2s ease 0s, box-shadow 0.2s ease 0s, border 0.2s ease 0s;
                  white-space: nowrap;
                  &:hover {
                    background: #f8f8fd;
                  }
                }
                .el-input__inner {
                  height: 30px;
                  font-size: 16px !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
.el-overlay {
  background-color: rgba(0,0,0,.2) !important;
}
</style>
