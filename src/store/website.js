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
      isDark: false
    }
  },
  actions: {
    toggleShowTable () {
      this.showTable = !this.showTable
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
