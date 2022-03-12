<template>
  <div class="container">
    <div class="header">
      <bread-crumb :list="navigationList" />
      <div class="btn-wrapper">
        <el-popover
          placement="bottom"
          trigger="click"
          :show-arrow="false"
        >
          <template #reference>
            <div class="sort" @click="onSortTable">自定义排序</div>
          </template>
          <ul>
            <li>创建时间</li>
            <li>最近编辑时间</li>
          </ul>
        </el-popover>
        <div class="show" @click="onToggleStyle">{{ showTable ? '表格展示' : 'grid展示' }}</div>
      </div>
    </div>
    <el-table
      v-if="showTable"
      :data="docTableData"
      style="width: 100%"
      row-class-name="table-row"
      @row-click="onRowClick">
      <el-table-column label="文件名" min-width="40%">
        <template #default="scope">
          <div class="row">
            <SvgIcon class="icon" :icon="isFolder(scope.row)?'folder':'file-small'" />
            <p class="">{{ scope.row.name }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="itemCount" label="" min-width="20%"/>
      <el-table-column prop="formatedUpdateTime" label="最近编辑" min-width="20%"/>
      <el-table-column label="创建时间" min-width="20%">
        <template #default="scope">
          <div class="end-col">
            <p class="">{{ scope.row.formatedCreateTime }}</p>
            <div class="more">
              <SvgIcon icon="more" />
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="grid" v-else>
      <div class="grid-item" v-for="row in docTableData" :key="row.id" @click="onRowClick(row)">
        <img :src="isFolder(row) ? ICON_FOLDER_LARGE : ICON_FILE_LARGE" alt="">
        <span>{{ row.name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
// import tables from '@/mock/tables'
// import { ref, defineComponent, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { useStore } from 'vuex'
import BreadCrumb from '@/components/BreadCrumb.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import '@/assets/pic/file-small.svg'
import '@/assets/pic/folder-large.svg'
import '@/assets/pic/file-large.svg'
import '@/assets/pic/folder.svg'
import '@/assets/pic/more.svg'

export default defineComponent({
  components: {
    BreadCrumb,
    SvgIcon
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const folderId = route.params?.id
    const navigationList = computed(() => store.getters.getNavigationLists(folderId))
    const docTableData = computed(() => store.getters.getAllDocuments(folderId))
    const pageParams = reactive({
      showTable: true
    })
    onMounted(() => {
      // store.dispatch('changeNavigation', route.params.id)
    })
    const isFolder = row => {
      console.log(row)
      return 'folderType' in row
    }
    const onRowClick = (row, column, event) => {
      if (isFolder(row)) {
        // 修改路由URL
        // `params` 不能与 `path` 一起使用
        router.push({ path: `/app/folder/${row.id}` })
        // 更新面包屑导航
      } else {
        router.push({ path: `/app/edit/${row.id}` })
      }
    }
    const onSortTable = () => {
      console.log('')
    }
    const onToggleStyle = () => {
      pageParams.showTable = !pageParams.showTable
    }
    return {
      ...toRefs(pageParams),
      navigationList,
      docTableData,
      onRowClick,
      onToggleStyle,
      onSortTable,
      isFolder
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/css/mixin';
.container {
  @include wh100;
  transition: 0.3s ease all;
  padding: 0 82px;
  box-sizing: border-box;
  .header {
    position: relative;
    @include horiFlex;
    justify-content: space-between;
    padding: 31px 16px 9px 8px;
    .btn-wrapper {
      position: relative;
      @include horiFlex;
      align-items: center;
      border: 1px solid rgb(201, 201, 206);
      margin-left: 10px;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
      .show {
        margin-left: 30px;
      }
    }
  }
  .grid {
    @include wh100;
    @include horiFlex;
    flex-wrap: wrap;
    padding: 20px;
    .grid-item {
      position: relative;
      @include vertFlex;
      width: 146px;
      height: 142px;
      border-radius: 8px;
      cursor: pointer;
      transition: box-shadow 100ms linear 0s;
      box-sizing: border-box;
      &:hover {
        border: 1px solid rgb(222, 222, 225);
        background-color: rgb(244, 244, 245);
        box-shadow: rgb(17 34 51 / 15%) 0px 4px 8px;
      }
    }
    .grid-item + .grid-item {
      margin-left: 25px;
    }
  }
  .row {
    @include horiFlex;
    position: relative;
    height: 64px;
    align-items: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    .icon {
      height: 40px;
      width: 40px;
      margin-right: 15px;
    }
  }
  .end-col {
    @include horiFlex;
    position: relative;
    /* height: 64px;
    font-size: 16px; */
    align-items: center;
    justify-content: space-between;
    .more {
      @include centerFlex;
      padding: 0px 4px;
      margin-right: 4px;
      border-radius: 4px;
      color: #1d1d1f;
      cursor: pointer;
      &:hover {
        background: #0000000d;
      }
      &>svg {
        width: 20px;
        height: 20px;
      }
    }
  }
  .el-table {
    &::before {
      height: 0;
    }
    td {
      border-bottom: none;
    }
  }
}
</style>
