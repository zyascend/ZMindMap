import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/reset.css'
// import 'element-plus/lib/theme-chalk/index.css'

// 一次性引入所有svg图
const req = require.context('./assets/pic', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

const app = createApp(App)

const websiteCfg = JSON.parse(localStorage.getItem('zmindmap_website') || '{}')
const isDark = websiteCfg?.isDark
window.document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
app.use(store).use(router).mount('#app')
