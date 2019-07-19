<template>
	<el-row class="wrap">

		<!-- 面包屑 -->
		<el-col :span="24" class="wrap-breadcrum">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
				<el-breadcrumb-item>会员</el-breadcrumb-item>
			</el-breadcrumb>
		</el-col>
		<el-col :span="24" class="wrap-main">

			<!-- 列表统计 -->
			<el-col :span="12" class="list-statistics">
				<!--<el-form :model="filters" :inline="true">
					<el-form-item>
						<el-input placeholder="请输入title" v-model="filters.title" @keyup.enter.native="getItem"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getItem">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="showAddDialog">新增</el-button>
					</el-form-item>
				</el-form>-->
			</el-col>
			<el-col :span="12">
				<el-card class="box-card">
					<div class="text item">
						今日新增 <span>{{statistics.toDayAdd}}</span>
					</div>
					<div class="text item">
						昨日新增 <span>{{statistics.yesterDayAdd}}</span>
					</div>
					<div class="text item">
						今日登陆 <span>{{statistics.toDayLogin}}</span>
					</div>
					<div class="text item">
						昨日登陆 <span>{{statistics.yesterDayLogin}}</span>
					</div>
					<div class="text item">
						本月新增 <span>{{statistics.thisMonthAdd}}</span>
					</div>
					<div class="text item">
						会员总计 <span>{{statistics.totalCount}}</span>
					</div>
				</el-card>
			</el-col>
		</el-col>
	</el-row>

</template>

<script>
	import { reqGetMemberStatistics } from 'api/api'
	export default {
		data() {
			return {
				statistics: {
					toDayAdd: 0,
					yesterDayAdd: 0,
					toDayLogin: 0,
					yesterDayLogin: 0,
					thisMonthAdd: 0,
					totalCount: 0
				}
			}
		},
		mounted() {
			reqGetMemberStatistics().then(res => {
				let data = res.data.data[0];
				console.log(data)
				this.statistics.toDayAdd = data.toDayAdd;
				this.statistics.yesterDayAdd = data.yesterDayAdd;
				this.statistics.toDayLogin = data.toDayLogin;
				this.statistics.yesterDayLogin = data.yesterDayLogin;
				this.statistics.thisMonthAdd = data.thisMonthAdd;
				this.statistics.totalCount = data.totalCount;
			})
		}
	}
</script>

<style lang="scss">
	.text {
		font-size: 14px;
	}
	
	.item {
		display: inline-block;
		margin-right: 20px;
		span {
			color: #FF0000;
		}
	}
</style>