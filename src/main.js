import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/reset.css'

// 一次性引入所有svg图
const req = require.context('./assets/pic', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

const app = createApp(App)

// TODO 待完善全局异常捕获
// app.config.errorHandler = (err, vm, info) => {
//   console.log('[全局异常]', err, vm, info)
// }

const websiteCfg = JSON.parse(localStorage.getItem('zmindmap_website') || '{}')
const isDark = websiteCfg?.isDark
window.document.documentElement.setAttribute(
  'data-theme',
  isDark ? 'dark' : 'light'
)
const { sentryCfg } = window.CFG
if (sentryCfg.tracingOrigins.includes(window.location.hostname)) {
  Sentry.init({
    app,
    dsn: sentryCfg.dsn,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: sentryCfg.tracingOrigins
      })
    ],
    tracesSampleRate: sentryCfg.tracesSampleRate
  })
}

app.use(store).use(router).mount('#app')
