/**
 * 网站页面相关状态
 */
import { defineStore } from 'pinia'
import { asyncHttp } from './handler'
import API from '@/hooks/api'
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
      styles: undefined
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
    switchMapColor (id) {
      this.mapColor = id
    },
    toggleDarkMode () {
      this.isDark = !this.isDark
      const mode = this.isDark ? 'dark' : 'light'
      window.document.documentElement.setAttribute('data-theme', mode)
    },
    async fetchMapStyles () {
      const data = await asyncHttp(API.getStyles)
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
