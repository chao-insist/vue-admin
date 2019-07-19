使用axios传递参数请求后台接口：参数类型为json对象，需要将参数使用URLSearchParams处理一下

let params = new URLSearchParams();
params.append(id,"id")
params.append(name:"wuchao")


全局使用qs插件即可


http://www.jianshu.com/p/042632dec9fb
