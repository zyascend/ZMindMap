<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <mind-map
          v-model="mapData"
          >
        </mind-map>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { useFetchData } from '../hooks'
import MindMap from '../components/MindMap.vue'

export default defineComponent({
  name: 'Home',
  components: {
    MindMap
  },
  setup () {
    const mapData = reactive(useFetchData())
    return {
      mapData
    }
  }
})
</script>
