### 出现的问题记录
> vue3.x:route路径相同参数不同页面不刷新解决
https://blog.csdn.net/AIB_Kasic/article/details/122985366

> import router from '@/router/index'  
  **useRoute, useRouter**必须写到setup中,详见vue-next-router.强行在函数中使用这两会报undefined,导致无法获取路由数据和路由方法

> **for in** & **for of**  
- for in遍历的是数组的索引（即键名）。
而for of遍历的是数组元素值。
- for in 是es5中有的，for of是es6的

- for-in是为遍历对象而设计的，不适用于遍历数组。它可以正确响应break、continue和return语句
for-in遍历数组的缺点：
因为for-in遍历的index值"0","1","2"等是字符串而不是数字
for-in循环存在缺陷：会遍历对象自身的和继承的可枚举属性(不含Symbol属性)

- for-of这个方法避开了for-in循环的所有缺陷
适用遍历数/数组对象/字符串/map/set等拥有迭代器对象的集合
它可以正确响应break、continue和return语句  

**for in 得到的数组下标是字符串形式的**

> vuex state持久化——vuex-persistedstate

> 使用svg：https://blog.csdn.net/qq_37059838/article/details/108980970  
如果需要修改svg的颜色，svg文件中的填充色fill必须删除

> vue div contenteditable属性，模拟v-model双向数据绑定功能 
` <div  v-html="item.journey_detail"  @input="item.journey_detail=$event.target.innerHTML" contenteditable="true"></div>
`

> TODO 数据更新后取消默认收起
https://blog.csdn.net/qq_52151772/article/details/119756511

> TODO 右键菜单
https://www.cnblogs.com/gaofz/p/11995001.html

> TODO 头像上传裁剪
https://www.cnblogs.com/eightFlying/p/cropper-demo.html

### chunk-vendors太大了怎么办?
  - splitChunks：elementUI单独打包900kb--->300kb
  - publicPath: 'cdn' ----->干扰了路由：https://blog.csdn.net/weixin_29491885/article/details/119253898
  解决：修改createWebHistory()

### 打包构建优化
  - 缩小文件检索解析范围 添加别名 避免无用的检索与递归遍历，使用alias指定引用时候的模块 
  `config.resolve.alias.set('@', getAliasPath('src'))`

### Map数据流向修改
  - edit页集中维护 ---> map.store集中维护
  - 流向如何

### 优化措施
  - v-show替换v-if ---> 导图与Note切换时
  - svg相关
    - 封装SvgIcon组件 传入icon="name"属性方便使用
    - main.js 一次性引入所有svg图标 不用单独引入
    - svgo-loader 压缩了svg冗余内容 减小体积
  - 网络传输相关
    - DNS Prefetch
      ```js
      <meta http-equiv="x-dns-prefetch-control" content="on" />
      <link ref="dns-prefetch" href="//cdn.kimjisoo.cn" />
      <link ref="dns-prefetch" href="//mapapi.kimjisoo.cn" />
      ```
  
### css书写顺序 
  https://markdotto.com/2011/11/29/css-property-order/
（1）定位属性：position  display  float  left  top  right  bottom   overflow  clear   z-index

（2）自身属性：width  height  padding  border  margin   background

（3）文字样式：font-family   font-size   font-style   font-weight   font-varient   color   

（4）文本属性：text-align   vertical-align   text-wrap   text-transform   text-indent    text-decoration   letter-spacing    word-spacing    white-space   text-overflow

（5）css3中新增属性：content   box-shadow   border-radius  transform……