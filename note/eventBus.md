通过eventBus可以实现兄弟组件之间的传值

在要相互通信的兄弟组件之中，都引入一个新的vue实例，然后通过分别调用这个实例的事件触发和监听来实现通信和参数传递。


1.新建一个bus.js文件，在里面创建一个空的vue实例绑定在Vue的原型上，用来接收并分发数据
import Vue from 'vue'
Vue.protutype.$eventBus = new Vue();

2.上传数据到bus
import 'common/js/bus.js'
this.$eventBus.$emit("event",target)		将target数据传递给Bus

3.从Bus中接收数据
import 'common/js/bus.js'
this.$eventBus.$on("event",target =>{
	console.log(target)
})

4.从bus中销毁数据
this.$eventBus.$off('event', target)
