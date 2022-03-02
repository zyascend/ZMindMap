### ZMindMap
仿幕布(mubu.com)风格思维导图，使用Canvas实现

#### 相关技术
1. svg
2. d3.js

### 问题
vue3.x:route路径相同参数不同页面不刷新解决
https://blog.csdn.net/AIB_Kasic/article/details/122985366


1==》for in遍历的是数组的索引（即键名）。
而for of遍历的是数组元素值。

2==》for in 是es5中有的，for of是es6的

3==》for-in是为遍历对象而设计的，不适用于遍历数组。
它可以正确响应break、continue和return语句
for-in遍历数组的缺点：
因为for-in遍历的index值"0","1","2"等是字符串而不是数字
for-in循环存在缺陷：会遍历对象自身的和继承的可枚举属性(不含Symbol属性)

3==》for-of这个方法避开了for-in循环的所有缺陷
适用遍历数/数组对象/字符串/map/set等拥有迭代器对象的集合
它可以正确响应break、continue和return语句
