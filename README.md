<div align="center">
<img src="https://cdn.kimjisoo.cn/pic/logo.png" align="center" width="176" height="56"/>
</div>  
<p align="center">
</p>
<p align="center">
  <a href="./LICENSE">
      <img src="https://img.shields.io/github/license/zyascend/ZMindMap" alt="MIT License" />
  </a>
  <a href="https://v3.cn.vuejs.org/">
      <img src="https://img.shields.io/badge/vue.js-3.2-green" alt="Vue3.2">
  </a>
  <a href="https://map.kimjisoo.cn">
      <img src="https://img.shields.io/badge/🚀-open--in--browser-blueviolet" alt="Live Demo">
  </a>
</p>

## 简介
**仿[幕布](https://mubu.com)思维导图。**  

## 项目地址：
项目总结：[ZMindMap-Wiki](https://github.com/zyascend/ZMindMap/wiki)  

预览地址：[ZMind思维导图](https://map.kimjisoo.cn)

后台地址：[mind-map-node](https://github.com/zyascend/mind-map-node)  

## 下载&安装

- 下载

  ```bash
  git clone --depth=1 https://github.com/zyascend/ZMindMap.git
  ```

- 进入项目目录
  ```bash
  cd ZmindMap
  ```
- 安装依赖

  ```bash
  npm install
  ```

- 运行
  ```bash
  npm run serve
  ```
## 效果图

| <img src="https://github.com/zyascend/ZMindMap/blob/main/assets/export01.png?raw=true" style="zoom:20%;" /> | <img src="https://github.com/zyascend/ZMindMap/blob/main/assets/export02.png?raw=true" style="zoom:20%;" /> |
| :------------------------------------------------------------------------------: | -------------------------------------------------------------------------------- |
| <img src="https://github.com/zyascend/ZMindMap/blob/main/assets/export03.png?raw=true" style="zoom:20%;" /> | <img src="https://github.com/zyascend/ZMindMap/blob/main/assets/export04.png?raw=true" style="zoom:20%;" /> |


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

## TODOs
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
- [ ] 大纲编辑页相关优化
  - [x] 防止XSS攻击
- [ ] 重写节点宽高计算逻辑