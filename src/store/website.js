/**
 * 网站页面相关状态
 */
import { defineStore } from 'pinia'
export const useWebsiteStore = defineStore({
  id: 'website',
  state: () => {
    return {
      // 文件列表展示方式
      showTable: false,
      // 主题模式
      isDark: false,
      // 侧边栏是否折叠
      siderCollapse: true,
      // 导图风格
      mapStyleIndex: 0
    }
  },
  actions: {
    toggleShowTable () {
      this.showTable = !this.showTable
    },
    toggleSiderCollapse () {
      this.siderCollapse = !this.siderCollapse
    },
    switchMapStyle (index) {
      this.mapStyleIndex = index
    },
    toggleDarkMode () {
      this.isDark = !this.isDark
      const mode = this.isDark ? 'dark' : 'light'
      window.document.documentElement.setAttribute('data-theme', mode)
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
