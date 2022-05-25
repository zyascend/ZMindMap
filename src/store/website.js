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
      mapStyle: 'MAPID-LogicTree'
    }
  },
  actions: {
    toggleShowTable () {
      this.showTable = !this.showTable
    },
    toggleSiderCollapse () {
      this.siderCollapse = !this.siderCollapse
    },
    switchMapStyle (id) {
      this.mapStyle = id
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
