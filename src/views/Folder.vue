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
        <div class="show" @click="onToggleStyle">{{ showStyle ? '表格展示' : 'grid展示' }}</div>
      </div>
    </div>
    <el-table :data="docTableData" style="width: 100%" @row-click="onRowClick">
      <el-table-column prop="name" label="文件名" width="300" />
      <el-table-column prop="itemCount" label="" width="180" />
      <el-table-column prop="formatedUpdateTime" label="最近编辑" width="200" />
      <el-table-column prop="formatedCreateTime" label="创建时间" width="300" />
    </el-table>
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
      showStyle: 0
    })
    onMounted(() => {
      // store.dispatch('changeNavigation', route.params.id)
    })
    const onRowClick = (row, column, event) => {
      const isFolder = 'folderType' in row
      if (isFolder) {
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
      pageParams.showStyle = !pageParams.showStyle
    }
    return {
      ...toRefs(pageParams),
      navigationList,
      docTableData,
      onRowClick,
      onToggleStyle,
      onSortTable
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
}
</style>
