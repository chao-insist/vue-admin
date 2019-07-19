对视图上数据进行格式化，加减字符串等可以用到过滤器,
Vue.filter("splitStr",function(value){
  return value.split(",")
  })
