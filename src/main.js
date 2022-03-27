import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  ElTooltip, ElForm, ElFormItem, ElButton, ElInput,
  ElMessage, ElTree, ElTable, ElTableColumn, ElPopover, ElDialog,
  ElSwitch
} from 'element-plus'
import './assets/css/reset.css'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)

app.component(ElTooltip.name, ElTooltip)
app.component(ElDialog.name, ElDialog)
app.component(ElForm.name, ElForm)
app.component(ElFormItem.name, ElFormItem)
app.component(ElButton.name, ElButton)
app.component(ElInput.name, ElInput)
app.component(ElMessage.name, ElMessage)
app.component(ElTree.name, ElTree)
app.component(ElTable.name, ElTable)
app.component(ElTableColumn.name, ElTableColumn)
app.component(ElPopover.name, ElPopover)
app.component(ElSwitch.name, ElSwitch)
// app.component(ElSkeleton.name, ElSkeleton)
const isDark = store.state.isDark
window.document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
app.use(store).use(router).mount('#app')
