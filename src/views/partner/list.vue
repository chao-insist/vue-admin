<template lang="html">
  <el-row class="wrap">
  	
    <!-- 面包屑 -->
    <el-col :span="24" class="wrap-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>合作伙伴</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="wrap-main">
    	
      <!-- 列表查询新增 -->
      <el-col :span="24" class="list-statistics">
        <el-form :model="filters" :inline ="true">
          <el-form-item>
            <el-input placeholder="请输入title" v-model="filters.title" @keyup.enter.native="getItem"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getItem">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      
      <!-- 列表 -->
      <!--参数：名称，LOGO，网址，创建时间-->
      <el-table :data="news" highlight-current-row @selection-change="selsChange" style="width:100%" v-loading="listLoading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" sortable></el-table-column>
        <el-table-column prop="partnerName" label="名称"></el-table-column>
        <el-table-column prop="logo" label="logo" sortable></el-table-column>
        <el-table-column prop="url" label="网址" sortable></el-table-column>
        <el-table-column prop="created" label="创建时间" :formatter="formatDate"></el-table-column>
        <el-table-column prop="status" label="状态" sortable>
          <template scope="scope">
            <el-tag size="small" :type="statusTag.type">{{statusTag.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="delnew(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 工具条 -->
      <el-col :span="24" class="toolBar">
        <el-button tyepe="danger" @click="batchDeleteLists" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :total="total" style="float:right"></el-pagination>
      </el-col>
      
      <!-- 编辑界面 -->
      <!--参数：名称，LOGO，网址-->
      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="formRules">
          <el-form-item label="名称" prop="partnerName">
            <el-input v-model="editForm.partnerName" auto-complete="off"></el-input>
          </el-form-item>
		  <el-form-item label="LOGO" prop="pic">
              <el-upload class="avatar-uploader"
               :action="picUpload"
               :show-file-list="false"
               :on-success="handleEditPic">
                <img v-if="editForm.pic" :src="editForm.pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="网址" prop="url">
          	<el-input v-model="editForm.url" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>
      
      <!-- 新增界面 -->
      <!--参数：名称，LOGO，网址-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="100px" ref="addForm" :rules="formRules">
          <el-form-item label="名称" prop="partnerName">
            <el-input v-model="addForm.partnerName" auto-complete="off"></el-input>
          </el-form-item>
		  <el-form-item label="LOGO" prop="logo">
              <el-upload class="avatar-uploader"
               :action="picUpload"
               :show-file-list="false"
               :on-success="handleAddPic">
                <img v-if="addForm.logo" :src="addForm.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="网址" prop="url">
          	<el-input v-model="addForm.url" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    </el-col>

  </el-row>
</template>

<script>
	import {formatDate} from 'common/js/date.js'
import {reqGetPartnerList,reqAddPartner,reqDeletePartner,reqEditPartner,reqGetListByTitle,picUpload} from 'api/api'
export default {
  name : 'partner',
  computed : {
  	//设置状态标签
    statusTag (val) {
      if(val == -1){
        return {
          name : "删除",
          type : "danger"
        }
      }else if(val == 0){
        return {
          name : "锁定",
          type : "warning"
        }
      }
      else{
        return {
          name : "正常",
          type : "success"
        }
      }
    }
  },

  data () {
    return {
    	isQuery: false,
      picUpload: picUpload,
      //公共
      news: [],
      filters : {
        title:''
      },
      page : 1,
      total : 1,
      sels : [],
      listLoading: false,
      editLoading: false,
      addLoading: false,
      editFormVisible: false,
      addFormVisible: false,

      editForm:{},
      addForm:{
        partnerName: '',
        logo: '',
        url: ''
      },
      formRules : {
        partnerName : [
          {required : true,message : "请输入标题",trigger : "blur"}
        ],
        url : [
          {required : true,message : "请输入快讯内容",trigger : "blur"}
        ],
    	logo: [
        {required : true,message : "请上传图片",trigger : "change"}
    	]
      }
    }
  },
  methods : {
  	//格式化时间戳
    formatDate (row,column) {
		let date = new Date(row[column.property]);
		return formatDate(date,"yy-MM-dd hh:mm")
	},
    //图片上传
    handleEditPic(res, file) {
      this.editForm.logo = file.response.data;
    //   console.log(res);
    },
    handleAddPic(res, file) {
      this.addForm.logo = file.response.data;
      console.log(this.addForm.logo)
  },
    // beforeAvatarUpload(file) {
    //     const isJPG = file.type === 'image/jpeg';
    //     const isLt2M = file.size / 1024 / 1024 < 2;
    //
    //     if (!isJPG) {
    //       this.$message.error('上传头像图片只能是 JPG 格式!');
    //     }
    //     if (!isLt2M) {
    //       this.$message.error('上传头像图片大小不能超过 2MB!');
    //     }
    //     return isJPG && isLt2M;
    // },
   //选中列
    selsChange (sels) {
      this.sels = sels;
      console.log(this.sels);
    },
   
   //列表分页
    handleCurrentChange (val) {
      this.page = val;  //当前页赋值
      this.getList();
    },
  
  //获取列表
    getList () {
      if(!this.isQuery){
      	let params = new URLSearchParams();
	      params.append('page',this.page);
	      this.listLoading = true;
	      reqGetPartnerList(params).then(res=>{
	          this.news = res.data.list;    //==>返回的是单页的数据
	          this.total = res.data.navigatepageNums.length*10;   //取到后台返回的总页码
	          console.log(this.total);
	          this.listLoading = false;
	          console.log(this.news);
	          // this.$set(this.news,index,val) 全局给news数组增加元素
	      })
      }else{
      	this.getTitleList();
      }
    },
    
    //根据title查询列表
			getTitleList () {
				let params = new URLSearchParams();
			    params.append("title",this.filters.title);
			    params.append("moduleName","合作伙伴")
			    params.append('page',this.page);
			    this.listLoading = true;
			    reqGetListByTitle(params).then(res=>{
			    	let {list, navigatepageNums} = res.data;
			        if(list != []){
			        	this.news = list;
			            this.total = navigatepageNums.length * 10
			            this.listLoading = false;
			        }else{
			        	this.news = [];
			        	this.listLoading = false;
			        }
									console.log(res)
			    })
			},
  
    //显示新增界面
    showAddDialog () {
      this.addFormVisible = true;
    },
    
    //列表新增
    addSubmit () {
      this.$refs.addForm.validate((valid)=>{    //验证表单
        if(valid){
          this.$confirm("确认新增此条合作伙伴吗？","提示",{type:"warning"}).then(()=>{
          	console.log(this.addForm)
            this.addLoading = true;
            let params = new URLSearchParams();
            params.append("partnerName",this.addForm.partnerName)
            params.append("logo",this.addForm.logo)
            params.append("url",this.addForm.url)
            reqAddPartner(params).then(res=>{
            	this.addLoading = false;
            	let {code, msg} = res.data;
            	if(code != 2000){
            		this.$message({
                  message : "添加成功!",
                  type : "success"
               	})
                this.$refs['addForm'].resetFields();   //重置表单,只重置校验部分
                this.addFormVisible = false;
                this.getList();
            	}else{
            		this.$message({
                  message : msg,
                  type : "warning"
               	})
            	}
            })
          })
        }
      })
    },
   
    //单条删除
    delnew (index,row) {
      this.$confirm("确认删除该条记录吗？","提示",{type:"warning"}).then(()=>{
          this.listLoading = true;
        let params = new URLSearchParams();
        params.append("id",row.id);

        reqDeletePartner(params).then(res=>{
            this.listLoading = false;
            this.$message({
              message : "删除成功",
              type : "success"
            })
            this.getList();
        }).catch((error)=>{})
      })
    },
    //批量删除
    batchDeleteLists (index,row) {
      this.$confirm("确认删除选中记录吗","提示",{type:"warning"}).then(()=>{
        let ids = this.sels.map(item => item.id).toString();
        let params = new URLSearchParams();
        params.append("id",ids)
        //请求删除接口
      })
    },
   
   //显示编辑界面
    showEditDialog (index,row) {			//偶然出现编辑框取不到城市的情况
      this.editFormVisible = true;
      this.editForm = Object.assign({},row)   //将需要编辑的那一项数据赋给编辑表单
    },
    //列表编辑
    editSubmit () {
      this.$refs.editForm.validate((valid)=>{
        if(valid){
          this.$confirm("确认提交吗","提示").then(()=>{
            this.editLoading = true;
            let params = new URLSearchParams();
            params.append("partnerName",this.editForm.partnerName)
            params.append("logo",this.editForm.logo)
            params.append("url",this.editForm.url)
            reqEditPartner(params).then(res=>{
            	let {code, msg} = res.data;
            	if(code != 2000){
            		this.$message({
                  message:"提交成功",
                  type:"success"
                })
                this.editLoading = false;
                this.$refs.editForm.resetFields();   //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
                this.editFormVisible = false;
                this.getList();   //查询获取数据
            	}else{
            		this.$message({
                  message: msg,
                  type:"warning"
                })
            		this.editLoading = false;
            	}
            }).catch((error)=>{})
          })
        }
      })
    },

   //获取单条数据
    getItem() {
      if(this.filters.title){
        this.isQuery = true;
        this.getTitleList();
      }else{
      	this.isQuery = false;
        this.getList();
      }
    },
  },
  mounted () {
  	this.getList();
  }
}
</script>

<style lang="scss" scoped="">

</style>
