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
    <el-table v-if="showTable" :data="docTableData" style="width: 100%" @row-click="onRowClick">
      <el-table-column prop="name" label="文件名" width="300">
        <template #default="scope">
          <div class="row">
            <img :src="isFolder(scope.row) ? ICON_FOLDER : ICON_FILE" alt="" class="icon">
            <p class="">{{ scope.row.name }}</p>
          </div>
      </template>
      </el-table-column>
      <el-table-column prop="itemCount" label="" width="180" />
      <el-table-column prop="formatedUpdateTime" label="最近编辑" width="200" />
      <el-table-column prop="formatedCreateTime" label="创建时间" width="300" />
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
import ICON_FOLDER_LARGE from '@/assets/pic/folder-large.svg'
import ICON_FOLDER from '@/assets/pic/folder-small.svg'
import ICON_FILE_LARGE from '@/assets/pic/file-large.svg'
import ICON_FILE from '@/assets/pic/file-small.svg'

export default defineComponent({
  components: {
    BreadCrumb
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
      isFolder,
      ICON_FOLDER_LARGE,
      ICON_FILE_LARGE,
      ICON_FOLDER,
      ICON_FILE
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/mixin';
.container {
  @include wh100;
  transition: 0.3s ease all;
  .header {
    position: relative;
    @include horiFlex;
    justify-content: space-between;
    padding: 10px;
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
  }
}
</style>
