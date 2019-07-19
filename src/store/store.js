import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


//数据存储
const state = {
	count: 1212
}

//对数据进行二次操作
const getters = {
	count(state){
		return state.count+=10
	}
}

//数据处理
const mutations = {
	addCount(state){
		state.count++
	},
	reduceCount(state){
		state.count--
	}
}



//实例化store对象
let store = new Vuex.Store({
	state,
	mutations,
	getters
})
export default store

