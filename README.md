![](https://cdn.kimjisoo.cn/pic/logo.png)  
**仿[幕布](https://mubu.com)思维导图。**

预览地址：[ZMind思维导图](https://map.kimjisoo.cn)

后台地址：[mind-map-node](https://github.com/zyascend/mind-map-node)  

![](https://github.com/zyascend/ZMindMap/blob/main/assets/export01.png?raw=true)
*努力完善中...*

## Features
- Vue3 CompositionApi
- Pinia状态管理
- VueRouter路由控制
- SVG画图
  - 类幕布思维导图的文档构建方式实现
    - 数据驱动UI的思路
  - svg导出为png图片 
- Element-plus
  - splitChunks单独打包
- 基于七牛云的CDN加速
- JWT & 二维码扫码登录
- 前端监控
  - 使用Sentry收集错误信息
  - 百度统计

## TODO
- [x] 基于vue响应式，通过数据驱动svg子元素更新
- [x] 对于大纲编辑，如何不通过递归查找的方式在源数据中定位到待更新的节点
  - [x] key-value形式构建map
- [x] Vuex切换为pinia
  - [x] store分模块维护
- [x] 支持撤回操作
  - [x] bug fix
- [x] 导图风格切换
- [x] 支持导出
  - [x] 导出为图片
    - [x] 图片不显示 bug fix
  - [ ] 导出为其他格式
- [x] 二维码扫码登录
  - [ ] 轮询接口查状态 => websocket
- 大纲编辑页相关优化：
  - [ ] 防止XSS攻击
