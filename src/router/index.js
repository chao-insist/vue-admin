import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'
import Timingnews from '@/views/bfriend/Timingnews'
import Fenghui from '@/views/fenghui/list'
import Topic from '@/views/bfriend/topic'
import Manager from '@/views/manager/list'

//币导航
import BiteAll from '@/views/biteNav/biteAll'
import BitePlace from '@/views/biteNav/bitePlace'
import BiteWallet from '@/views/biteNav/biteWallet'
import MiningPool from '@/views/biteNav/miningPool'
import OtherNav from '@/views/biteNav/otherNav'

//合作伙伴
import Partner from '@/views/partner/list'


//矿机交易
import MiningTransaction from '@/views/miningTransaction/list'

//矿机测评
import MiningTest from '@/views/miningTest/list'

//学院专题
import SchoolModule from '@/views/school/module'

//学院文章
import SchoolArticle from '@/views/school/article'

//会员
import Member from '@/views/member/list'

//管理员信息
import Profile from '@/views/user/profile'
import ChangePwd from '@/views/user/changepwd'
// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/views/Login'], resolve)

Vue.use(Router)

let router = new Router({
  //mode : history
  routes : [
  	{
  		path: '/login',
  		component: Login,
  		name: "登录"
  	},
  	{
      path : '/',
      component: Home,
      name : "币友圈",
    //   leaf : true,
      menuShow : true,
      redirect : '/bfriend/Timingnews',
      iconCls : 'iconfont icon-friend',
      children : [
        {path : '/bfriend/Timingnews',component : Timingnews,name : "实时快讯",menuShow : true},
        {path : '/bfriend/topic',component : Topic,name : "话题讨论",menuShow : true}
      ]
    },
    {
      path : '/',
      component: Home,
      name : '峰会',
      leaf : true,
      menuShow : true,
      iconCls : 'iconfont icon-hangyefenghui',
      children : [
        {path : '/fenghui/list',component : Fenghui,name : "峰会",menuShow : true}
      ]
    },
    {
      path : '/',
      component: Home,
      name : "币导航",
    //   leaf : true,
      menuShow : true,
      iconCls : 'iconfont icon-daohang',
      children : [
        {path: '/biteNav/biteAll', component: BiteAll, name: "币大全", menuShow: true},
        {path: '/biteNav/bitePlace', component: BitePlace, name: "币交所", menuShow: true},
        {path: '/biteNav/biteWallet', component: BiteWallet, name: "币钱包", menuShow: true},
        {path: '/biteNav/miningPool', component: MiningPool, name: "矿池", menuShow: true},
        {path: '/biteNav/otherNav', component: OtherNav, name: "其他导航", menuShow : true} ,
      ]
    },
    {
    	path: '/',
    	component: Home,
    	name: "矿机交易",
    	leaf: true,
    	menuShow: true,
    	iconCls: 'iconfont icon-jiaoyi',
    	children: [
    		{path: '/miningTransaction/list',component: MiningTransaction, name: "矿机交易", menuShow: true}
    	]
    },
    {
    	path: '/',
    	component: Home,
    	name: "矿机测评",
    	leaf: true,
    	menuShow: true,
    	iconCls: 'iconfont icon-pingce',
    	children: [
    		{path: '/miningTest/list',component: MiningTest, name: "矿机测评", menuShow: true}
    	]
    },
    {
    	path: '/',
    	component: Home,
    	name: "学院",
//  	leaf: true,
    	menuShow: true,
    	iconCls: 'iconfont icon-xueyuan',
    	children: [
    		{path: '/school/module',component: SchoolModule, name: "学院专题", menuShow: true},
    		{path: '/school/article',component: SchoolArticle, name: "学院文章", menuShow: true}
    	]
    },
    {
    	path: "/",
    	component: Home,
    	name: "合作伙伴",
    	leaf: true,
    	menuShow: true,
    	iconCls: 'iconfont icon-hezuohuoban',
    	children: [
    		{path: "/partner/list", component: Partner, name: "合作伙伴", menuShow: true}
    	]
    },
    {
    	path: '/',
    	component: Home,
    	name: '管理员',
    	leaf: true,
    	menuShow: true,
    	iconCls: 'iconfont icon-guanliyuan',
    	children: [
    		{path: '/manager/list', component: Manager, name: "管理员", menuShow: true}
    	]
    },
    {
    	path: '/',
    	component: Home,
    	name: '会员',
    	leaf: true,
    	menuShow: true,
    	iconCls: 'iconfont icon-a536',
    	children: [
    		{path: '/member/list', component: Member, name: "会员", menuShow: true}
    	]
    },
    {
    	path: '/',
    	component: Home,
    	name: '设置',
    	menuShow: true,
    	iconCls: 'iconfont icon-shezhi',
    	children: [
    		{path: '/user/profile', component: Profile, name: '个人信息', menuShow: true},
    		{path: '/user/changepwd', component: ChangePwd, name: '修改密码', menuShow: true}
    	]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    	window.sessionStorage.removeItem('admin-user')
    next()
  } else {
    let user = JSON.parse(window.sessionStorage.getItem('admin-user'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router