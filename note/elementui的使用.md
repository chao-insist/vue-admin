###Welcome to use MarkDown

一、使用：
1.cnpm i element-ui -D

2.main.js  =>  import ElementUI from 'element-ui'   import 'element-ui/lib/theme-default/index.css';  Vue.use(ElementUI)

二、按需加载
1.cnpm i babel-plugin-component -D

2..babelrc  =>  {
	  "presets": [
	    ["es2015", { "modules": false }]
	  ],
	  "plugins": [["component", [
	    {
	      "libraryName": "element-ui",
	      "styleLibraryName": "theme-default"
	    }
	  ]]]
	}

3.main.js  =>  import { Button, Select } from 'element-ui'			 Vue.use(Button)  Vue.use(Select)