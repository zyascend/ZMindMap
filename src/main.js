import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  ElContainer, ElHeader, ElMain, ElAside, ElTooltip,
  ElForm, ElFormItem, ElRow, ElCol, ElButton, ElInput
} from 'element-plus'
import './assets/css/reset.css'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)

app.component(ElContainer.name, ElContainer)
app.component(ElHeader.name, ElHeader)
app.component(ElMain.name, ElMain)
app.component(ElAside.name, ElAside)
app.component(ElTooltip.name, ElTooltip)

app.component(ElForm.name, ElForm)
app.component(ElFormItem.name, ElFormItem)
app.component(ElRow.name, ElRow)
app.component(ElCol.name, ElCol)
app.component(ElButton.name, ElButton)
app.component(ElInput.name, ElInput)

app.use(store).use(router).mount('#app')
