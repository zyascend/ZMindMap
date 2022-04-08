![](https://cdn.kimjisoo.cn/pic/logo.png)  
**仿[幕布](https://mubu.com)思维导图。**

预览地址：[ZMind思维导图](https://map.kimjisoo.cn)

后台地址：[mind-map-node](https://github.com/zyascend/mind-map-node)

*努力完善中...*

## 相关内容
- vue3 CompositionApi
- Vuex状态管理
  - vuex-persistedstate 状态持久化
- VueRouter路由控制
- SVG画图
  - 类幕布思维导图的文档构建方式实现
    - 数据驱动UI的思路
  - d3.js控制Svg
- Element-plus
  - splitChunks单独打包
- 基于七牛云的CDN加速
- more...

## 待优化
- [x] 基于vue响应式，通过数据驱动svg子元素更新
- [ ] 对于大纲编辑，如何不通过递归查找的方式在源数据中定位到待更新的节点
  - key-value形式构建map?
- [x] Vuex切换为pinia
  - [x] store分模块维护
- [x] 支持撤回操作
  - [ ] 待优化bug