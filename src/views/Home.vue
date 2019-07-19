<template lang="html">
  <el-row class="container">
    <!-- 头部 -->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn">
        <a href="/"><img src="" alt="" style="padding-left:8px"></a>
      </div>
      <div class="topbar-logos" v-show="collapsed">
        <a href="/"><img src="" alt=""></a>
      </div>
      <div class="topbar-title">
        <span style="font-size:18px;color:#fff;">后台管理系统</span>
      </div>
      <div class="topbar-account topbar-btn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">
            <i class="iconfont icon-guanliyuan1"></i>
            {{sysUserName}}
            <i class="iconfont icon-huabanfuben"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link :to="{name: '个人信息'}"><span style="color: #555;font-size: 14px;">个人信息</span></router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link :to="{name: '修改密码'}"><span style="color: #555;font-size: 14px;">修改密码</span></router-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <!-- 中间 -->
    <el-col :span="24" class="main">
      <!-- 左侧导航 -->
      <aside :class="{showSidebar:!collapsed}">
        <!-- 展开折叠开关 -->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont icon-icon-zhangjai2" v-show="!collapsed"></i>
          <i class="iconfont icon-icon-test" v-show="collapsed"></i>
        </div>
        <!-- 导航菜单 -->
        <el-menu default-active="0" router :collapse="collapsed">
          <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
            <el-submenu v-if="!item.leaf" :index="index+''">
              <template slot="title">
                <i :class="item.iconCls"></i><span slot="title" class="titleText">{{item.name}}</span>
              </template>
              <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow" :class="$route.path==term.path?'is-active':''">
                <i :class="term.iconCls"></i><span slot="title" class="titleText">{{term.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path" :class="$route.path==item.children[0].path?'is-active':''">
              <i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <!-- 右侧内容区 -->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
   import {bus} from '@/bus'
export default {
     
  name : 'Home',
  
  data () {
    return {
      sysUserName:"",
      sysUserAvatar:"",
      collapsed:false
    }
  },
//created () { //通过监听eventBus中的事件获得传来的参数
// bus.$on("setUserName",(text)=>{
//   this.sysUserName = text;
// })
// },
  methods : {
    //折叠导航栏
    collapse () {
      this.collapsed = !this.collapsed;
    },
    logout () {
      this.$confirm("确认退出吗？","提示",{}).then(()=>{
           sessionStorage.removeItem("admin-user");
        this.$router.push('/login');
      }).catch(()=>{

      })
    }
  },
 mounted() {
   let user = sessionStorage.getItem('admin-user');
   if (user) {
     user = JSON.parse(user);
     this.sysUserName = user.userName || '';
   }
 }
}
</script>

<style lang="scss" scoped="">
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;

  .topbar-wrap {
    height: 50px;
    line-height: 50px;
    background: #2d3642;
    padding: 0px;

    .topbar-btn {
      color: #fff;
    }
    /*.topbar-btn:hover {*/
    /*background-color: #4A5064;*/
    /*}*/
    .topbar-logo {
      float: left;
      width: 59px;
      line-height: 26px;
    }
    .topbar-logos {
      float: left;
      width: 120px;
      line-height: 26px;
    }
    .topbar-logo img, .topbar-logos img {
      height: 40px;
      margin-top: 5px;
      margin-left: 2px;
    }
    .topbar-title {
      float: left;
      text-align: left;
      width: 200px;
      padding-left: 10px;
      border-left: 1px solid #000;
    }
    .topbar-account {
      float: right;
      padding-right: 12px;
    }
    .userinfo-inner {
      cursor: pointer;
      color: #fff;
      padding-left: 10px;
    }
  }
  .main {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: absolute;
    top: 50px;
    bottom: 0px;
    overflow: hidden;
  }

  aside {
    min-width: 50px;
    background: #324157;
    color: #bfcbd9;
    &::-webkit-scrollbar {
      display: none;
    }

    &.showSidebar {
      overflow-x: hidden;
      overflow-y: auto;
    }

    .el-menu {
      height: 100%; /*写给不支持calc()的浏览器*/
      height: -moz-calc(100% - 80px);
      height: -webkit-calc(100% - 80px);
      height: calc(100% - 80px);
      border-radius: 0px;
      background-color: #324157;
    }
    .iconfont{
    	margin-right: 10px;
    }

    .el-submenu .el-menu-item {
      min-width: 60px;
    }
    .el-menu {
      width: 180px;
    }
    .el-menu--collapse {
      width: 60px;
    }

    .el-menu .el-menu-item, .el-submenu .el-submenu__title {
      height: 46px;
      line-height: 46px;
    }
     .el-menu .el-menu-item, .el-submenu .el-submenu__title span{
     		font-size: 14px;
     }
		.el-menu-item span{
			font-size: 14px;
		}
		.el-submenu .el-menu-item span{
			font-size: 12px;
		}
    .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
      background-color: #7ed2df;
    }
  }
  .menu-toggle {
    background: #4A5064;
    text-align: center;
    color: #bfcbd9;
    height: 26px;
    line-height: 30px;
    cursor: pointer;
  }

  .content-container {
    background: #fff;
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    padding-bottom: 1px;

    .content-wrapper {
      background-color: #fff;
      box-sizing: border-box;
    }
  }
}
</style>
