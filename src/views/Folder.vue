<template>
  <div class="container">
    <div class="header">
      <bread-crumb :list="navigationList" />
      <div class="btn-wrapper">
        <div class="btn-show" @click="onToggleStyle">
          <SvgIcon class="icon" :icon="showTable ? 'table' : 'grid'" />
        </div>
      </div>
    </div>
    <el-table
      v-if="hasData && showTable"
      :data="docTableData"
      style="width: 100%"
      row-class-name="table-row"
      @row-click="onRowClick"
    >
      <el-table-column label="文件名" min-width="40%">
        <template #default="scope">
          <div class="row">
            <SvgIcon
              class="icon"
              :icon="isFolder(scope.row) ? 'folder' : 'file-small'"
            />
            <p class="">{{ scope.row.name }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="itemCount" label="" min-width="20%" />
      <el-table-column
        prop="formatedUpdateTime"
        label="最近编辑"
        min-width="20%"
      />
      <el-table-column label="创建时间" min-width="20%">
        <template #default="scope">
          <div class="end-col">
            <p class="">{{ scope.row.formatedCreateTime }}</p>
            <operate-popover :data="scope.row" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="grid" v-if="hasData && !showTable">
      <div
        class="grid-item"
        v-for="row in docTableData"
        :key="row.id"
        @click="onRowClick(row)"
      >
        <SvgIcon
          class="icon"
          :icon="isFolder(row) ? 'folder-large' : 'file-large'"
        />
        <span>{{ row.name }}</span>
        <div class="popover">
          <operate-popover :data="row" />
        </div>
      </div>
    </div>
    <div class="empty" v-show="!hasData">
      <img :src="ICON_EMPTY" alt="" />
      <p class="empty-info">暂无文件，点击左上角"+"新建文件</p>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed } from 'vue'
import useDocStore from '@/store/doc'
import useWebsiteStore from '@/store/website'
import { useRouter, useRoute } from 'vue-router'
import BreadCrumb from '@/components/BreadCrumb.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import OperatePopover from '@/components/DocPopover.vue'
import ICON_EMPTY from '@/assets/pic/empty.png'

export default defineComponent({
  components: {
    BreadCrumb,
    SvgIcon,
    OperatePopover
  },
  setup() {
    const docStore = useDocStore()
    const websiteStore = useWebsiteStore()
    const router = useRouter()
    const route = useRoute()

    const folderId = route.params?.id || '0'
    const navigationList = computed(() => docStore.getNavigationLists(folderId))
    const docTableData = computed(() => docStore.getAllDocuments(folderId))
    const hasData = computed(() => docTableData.value?.length)
    const showTable = computed(() => websiteStore.showTable)

    const isFolder = row => 'folderType' in row
    const onRowClick = (row, column, event) => {
      if (isFolder(row)) {
        // `params` 不能与 `path` 一起使用
        router.push({ path: `/app/folder/${row.id}` })
      } else {
        router.push({ path: `/app/edit/${row.id}/map` })
      }
    }
    const onSortTable = () => {
      console.log('todo')
    }
    const onToggleStyle = () => {
      websiteStore.toggleShowTable()
    }
    return {
      hasData,
      showTable,
      navigationList,
      docTableData,
      onRowClick,
      onToggleStyle,
      onSortTable,
      isFolder,
      ICON_EMPTY
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/css/handler';
.container {
  box-sizing: border-box;
  @include wh100;
  padding: 0 82px;
  transition: 0.3s ease all;
  .header {
    position: relative;
    @include horiFlex;
    justify-content: space-between;
    padding: 31px 16px 9px 8px;
    .btn-wrapper {
      position: relative;
      @include horiFlex;
      align-items: center;
      margin-left: 10px;
      @include border_color(bdc_show_btn);
      cursor: pointer;
      user-select: none;
      border: 1px solid;
      border-radius: 4px;
      .btn-show {
        position: relative;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: auto;
        height: 28px;
        padding: 0 8px;
        font-size: 14px;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        outline: none;
        .icon {
          width: 14px;
          height: 14px;
          @include fill_color(fc_girdtable);
        }
      }
    }
  }
  .grid {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(auto-fill, 146px);
    row-gap: 30px;
    column-gap: 30px;
    width: 100%;
    height: auto;
    padding: 25px 5px;
    .grid-item {
      position: relative;
      box-sizing: border-box;
      @include vertFlex;
      align-items: center;
      width: 146px;
      height: 142px;
      cursor: pointer;
      border-radius: 8px;
      transition: box-shadow 100ms linear 0s;
      &:hover {
        @include background_color(bc_griditem_hover);
        @include border_color(bdc_grid);
        border: 1px solid;
        box-shadow: rgb(17 34 51 / 15%) 0 4px 8px;
        .popover {
          .more {
            visibility: visible !important;
          }
        }
      }
      span {
        width: 123px;
        height: 40px;
        overflow: hidden;
        @include font_color(fc_grid);
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        line-clamp: 2;
        text-overflow: ellipsis;
        word-break: break-all;
      }
      .icon {
        width: 57px;
        height: 57px;
        margin: 27px 0 12px;
        transform: translateZ(0) scale(1, 1);
      }
      .popover {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }
  .row {
    position: relative;
    @include horiFlex;
    align-items: center;
    height: 64px;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    .icon {
      width: 40px;
      height: 40px;
      margin-right: 15px;
    }
  }
  .end-col {
    @include horiFlex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    .more {
      visibility: visible !important;
    }
  }
  .el-table {
    background-color: transparent !important;
    &::before {
      height: 0;
    }
    td {
      border-bottom: none;
    }
    th.is-leaf {
      @include border_color(bdc_table_divider);
    }
    tr,
    th {
      background-color: transparent;
      &:hover {
        td {
          @include background_color(bc_td_hover);
        }
      }
    }
  }
  .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 14px;
    line-height: 1.45;
    color: #92929c;
    transition: 0.2s all ease;
    transform: translate(-50%, -50%);
  }
}
</style>
