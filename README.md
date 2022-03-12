### ZMindMap
仿幕布(mubu.com)风格思维导图，使用Canvas实现

#### 相关技术
1. svg
2. d3.js

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

> vuex state持久化——vuex-persistedstate

> 使用svg：https://blog.csdn.net/qq_37059838/article/details/108980970  
如果需要修改svg的颜色，svg文件中的填充色fill必须删除
