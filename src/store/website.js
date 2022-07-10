/**
 * 网站页面相关状态
 */
import { defineStore } from 'pinia'
import { websiteApi } from '@/hooks/http'

const useWebsiteStore = defineStore({
  id: 'website',
  state: () => ({
    // 文件列表展示方式
    showTable: false,
    // 主题模式
    isDark: false,
    // 侧边栏是否折叠
    siderCollapse: true,
    // 导图风格
    styles: undefined
  }),
  actions: {
    toggleShowTable() {
      this.showTable = !this.showTable
    },
    toggleSiderCollapse() {
      this.siderCollapse = !this.siderCollapse
    },
    switchMapStyle(id) {
      this.mapStyle = id
    },
    switchMapColor(id) {
      this.mapColor = id
    },
    toggleDarkMode() {
      this.isDark = !this.isDark
      const mode = this.isDark ? 'dark' : 'light'
      window.document.documentElement.setAttribute('data-theme', mode)
    },
    async fetchMapStyles() {
      const data = await websiteApi.fetchMapStyles()
      this.styles = data
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'zmindmap_website',
        storage: localStorage
        // paths: ['name', 'age']
      }
    ]
  }
})
export default useWebsiteStore
