import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  ElContainer, ElHeader, ElMain, ElAside
} from 'element-plus'
import './assets/css/reset.css'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)

app.component(ElContainer.name, ElContainer)
app.component(ElHeader.name, ElHeader)
app.component(ElMain.name, ElMain)
app.component(ElAside.name, ElAside)

app.use(store).use(router).mount('#app')
