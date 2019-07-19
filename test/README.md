# bzj-houtai

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


导航选中样式会重叠

城市偶尔显示不出来


ueditor bug: 
1.弹框中浮动bug
2.新增后不能清空内容

提交到线上时：出现错误，找到ueditor/thirf-party/zeroclipboard/zeroclipboard.js中最后一行,将部分代码注释掉
//if (typeof define === "function" && define.amd) {
//  define(function() {
//    return ZeroClipboard;
//  });
//} else if (typeof module === "object" && module && typeof module.exports === "object" && module.exports) {
//  module.exports = ZeroClipboard;
//} else {
    window.ZeroClipboard = ZeroClipboard;
//}


