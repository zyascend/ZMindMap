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
          <img class="avatar" :src="user?.avatar" alt="">
        </div>
        <div class="nickname">
          <p>{{ user?.name || user?.email || '' }}</p>
          <svg-icon icon="triangle"/>
        </div>
      </div>
    </template>
    <div class="info">
      <div class="img">
        <img class="avatar" :src="user?.avatar" alt="">
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
    append-to-body
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
              <div><img :src="user?.avatar" alt="avatar"></div>
              <button class="avatar-edit" @click="onEditAvatar">编辑</button>
            </div>
            <div class="info">
              <p class="label">昵称</p>
              <div class="editer">
                <p class="name" v-if="!isEditName">{{ user?.name || user?.email || '' }}</p>
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
  <el-dialog
    v-model="showEditAvatar"
    append-to-body
    :width="530"
    title="编辑头像"
    @closed="onAvatarDialogClose"
    custom-class="profile-dialog avatar-dialog"
  >
    <div class="avatar-wrapper">
      <div class="main-img">
        <img :src="user.avatar" alt="avatar-edit" ref="mainImg">
      </div>
      <div class="right-imgs" ref="rightImg">
        <div class="img-large"/>
        <div class="img-medium"/>
        <div class="img-small"/>
      </div>
    </div>
    <template #footer>
      <div class="footers">
        <div class="upload-btn">
          <input type="file" accept=".png,.jpg,.gif" @change="fileChange($event)">
          <div class="upload-content">
            <svg-icon icon="upload" />
            <span>选择图片</span>
          </div>
        </div>
        <el-button>取消</el-button>
        <el-button @click="submit" type="primary" :loading="isSaving">{{ isSaving ? '正在保存':'保存头像' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { computed, defineComponent, ref, watch, nextTick, reactive, toRefs } from 'vue'
import Cropper from 'cropperjs'
import { useWebsiteStore } from '@/store/website'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon.vue'
import 'cropperjs/dist/cropper.css'

export default defineComponent({
  name: 'ProfilePopover',
  components: {
    SvgIcon
  },
  setup () {
    const websiteStore = useWebsiteStore()
    const userStore = useUserStore()
    const router = useRouter()
    const user = computed(() => userStore.getUser)
    const isDarkMode = ref(websiteStore.isDark)
    const mainImg = ref(null)
    const rightImg = ref(null)
    const editStatus = reactive({
      showSettings: false,
      showEditAvatar: false,
      isEditName: false,
      isSaving: false,
      editedName: userStore.getUser?.name || ''
    })
    // const showSettings = ref(false)
    // const showEditAvatar = ref(false)
    // const isEditName = ref(false)
    // const editedName = ref()
    let curFileName = ''
    let myCropper = null
    watch(isDarkMode, () => {
      websiteStore.toggleDarkMode()
    })

    const toggleShowSettings = () => {
      editStatus.showSettings = !editStatus.showSettings
    }

    const submit = () => {
      editStatus.isSaving = true
      myCropper.getCroppedCanvas({
        imageSmoothingQuality: 'high'
      }).toBlob(async (blob) => {
        const file = new File([blob], curFileName)
        await userStore.updateUser({
          user: {
            ...user.value,
            name: editStatus.editedName
          },
          file
        })
        editStatus.isSaving = false
        editStatus.showEditAvatar = !editStatus.showEditAvatar
      })
    }

    const logout = () => {
      userStore.logout()
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }

    const makeCropper = () => {
      myCropper = new Cropper(mainImg.value, {
        viewMode: 1,
        dragMode: 'crop',
        initialAspectRatio: 1,
        aspectRatio: 1,
        preview: rightImg.value.children,
        background: false,
        autoCropArea: 1,
        zoomOnWheel: true,
        wheelZoomRatio: 0.2
      })
      // ! 保证每次裁剪最新上传的图片
      myCropper.replace(user.value.avatar)
    }
    const onEditAvatar = () => {
      editStatus.showEditAvatar = !editStatus.showEditAvatar
      nextTick(() => {
        // ? mainImg 不能跟随user的改变自动刷新
        // ? display: none导致丧失响应能力？
        // mainImg.value.src = user.value.avatar
        makeCropper()
      })
    }
    const toggleEditName = async () => {
      if (editStatus.isEditName && editStatus.editedName) {
        // TODO 提交失败了怎么办
        await userStore.updateUser({
          user: {
            ...user.value,
            name: editStatus.editedName
          }
        })
        editStatus.isEditName = !editStatus.isEditName
      } else {
        editStatus.isEditName = !editStatus.isEditName
      }
    }
    const onAvatarDialogClose = () => {
      console.log('onAvatarDialogClose> ')
      // Dialog关闭后销毁Cropper实例
      myCropper.destroy()
      myCropper = null
    }
    const fileChange = event => {
      const file = event.target.files[0]
      curFileName = file.name
      const reader = new FileReader()
      reader.onload = e => {
        // 把获取到的图片展示
        myCropper.replace(e.target.result)
      }
      reader.readAsDataURL(file)
    }
    return {
      mainImg,
      rightImg,
      user,
      isDarkMode,
      ...toRefs(editStatus),
      logout,
      submit,
      fileChange,
      onEditAvatar,
      toggleEditName,
      toggleShowSettings,
      onAvatarDialogClose
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/css/handler";
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
      @include background_color(bc_hover_nickname);
    }
    &>p {
      @include font_color(fc_nickname);
      font-size: 14px;
      overflow: hidden;
      max-width: 140px;
      margin: 0px 2px 0px 0px;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 24px;
    }
    &>svg {
      @include fill_color(fc_nickname);
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
  @include background_color(bc_divider);
}
.profile-popover {
  padding: 0px 20px 10px 20px !important;
  @include background_color(bc_popover);
  border: none !important;
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
      @include font_color(fc_nickname);
    }
  }
  .pop-item {
    @include horiFlex;
    @include font_color(fc_nickname);
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
  @include background_color(bc_dialog_right);
  box-shadow: rgb(0 0 0 / 16%) 0px 2px 30px 0px !important;
  .el-dialog__body {
    padding: 0 0;
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
        border-right: 1px solid;
        @include border_color(bdc_dialog_left);
        @include background_color(bc_dialog_left);
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
        box-sizing: border-box;
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
            @include font_color(fc_normal);
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
                  @include background_color(bc_avatar_btn_hover)
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
                @include background_color(bc_dialog_left);
                border-radius: 4px;
                line-height: 20px;
                margin-bottom: 28px;
                .name {
                  @include font_color(fc_normal);
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
                    @include background_color(bc_avatar_btn_hover)
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
    .avatar-wrapper {
      @include horiFlex;
      padding-top: 5px;
      margin-bottom: 16px;
      .main-img {
        width: 318px;
        height: 318px;
        img {
          /* opacity: 0; */
          max-width: 100%;
        }
      }
      .right-imgs {
        @include vertFlex;
        justify-content: flex-start;
        display: flex;
        width: 150px;
        margin-left: 23px;
        div {
          margin-bottom: 14px;
          overflow: hidden;
        }
        .img-large {
          width: 150px;
          height: 150px;
        }
        .img-medium {
          width: 80px;
          height: 80px;
        }
        .img-small {
          width: 60px;
          height: 60px;
        }
      }
    }
  }
}
.avatar-dialog {
  padding: 20px 20px !important;
  margin-top: 19vh !important;
  .el-dialog__header {
    padding-left: 0;
  }
  .el-dialog__footer {
    padding: 0 0;
  }
  .footers {
    @include horiFlex;
    align-items: center;
    justify-content: flex-end;
    .upload-btn {
      width: 144px;
      height: 40px;
      display: inline-block;
      line-height: 1;
      cursor: pointer;
      border: 1px solid #DCDFE6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      font-weight: 500;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px;
      margin-right: 14px;
      position: relative;
      &:hover {
        color: #409EFF;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
        .upload-content {
          svg {
            fill: #409EFF;
          }
        }
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        @include wh100;
        opacity: 0;
        z-index: 10;
      }
      .upload-content {
        @include wh100;
        @include horiFlex;
        align-items: center;
        justify-content: center;
        svg {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
      }
    }
  }
}
.el-overlay {
  background-color: rgba(0,0,0,.2) !important;
}
</style>
