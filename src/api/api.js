import axios from 'axios'

let base = process.env.API_HOST

//根据title查数据
export const reqGetListByTitle = params => {return axios.post(`${base}/backManagerment/else/selectAllByTitle.html`,params)}



// 图片上传地址
export const picUpload = `${base}/headImgUpload.html`

//话题、实时快讯
export const reqGetTopicList = params => {return axios.post(`${base}/backManagerment/topic/selectTopicListByType.html`,params)}
export const reqAddTopic = params => {return axios.post(`${base}/backManagerment/topic/insertTopic.html`,params)}
export const reqDeleteTopic = params => {return axios.post(`${base}/backManagerment/topic/deleteTopic.html`,params)}
export const reqEditTopic = params => {return axios.post(`${base}/backManagerment/topic/updateTopic.html`,params)}
export const reqGetTopicQuery = params => {return axios.post(`${base}/backManagerment/topic/selectTopicByid.html`,params)}
export const reqGetTopicStatistics = params => {return axios.post(`${base}/backManagerment/topic/statisticsTopic.html`,params)}


//峰会
export const reqGetFenghuiList = params => {return axios.post(`${base}/backManagerment/summit/selectSummitList.html`,params)}
export const reqAddFenghui = params => {return axios.post(`${base}/backManagerment/summit/insertSummit.html`,params)}
export const reqDeleteFenghui = params => {return axios.post(`${base}/backManagerment/summit/deleteSummit.html`,params)}
export const reqEditFenghui = params => {return axios.post(`${base}/backManagerment/summit/updateSummit.html`,params)}
export const reqGetFenghuiQuery = params => {return axios.post(`${base}/backManagerment/summit/selectSummitById.html`,params)}

//币导航
export const reqGetBiteList = params => {return axios.post(`${base}/backManagerment/MoneyNavigation/selectList.html`,params)}
export const reqDeleteBite = params => {return axios.post(`${base}/backManagerment/MoneyNavigation/deleteMoneyNavigation.html`,params)}
export const reqEditBite = params => {return axios.post(`${base}/backManagerment/MoneyNavigation/updateMoneyNavigation.html`,params)}
export const reqGetBiteQuery = params => {return axios.post(`${base}/backManagerment/MoneyNavigation/selectMoneyNavigationById.html`,params)}
//币大全
export const reqAddBiteAll = params => {return axios.post(`${base}/backManagerment/MoneyNavigation/MoneyWhole/insertMoneyWhole.html`,params)}

//币交所
export const reqAddBitePlace = params => {return axios.post(`${base}/backManagerment/MoneyNavigation/MoneyDeal/insertMoneyDeal.html`,params)}

//币钱包
export const reqAddBiteWallet = params => {return axios.post(`${base}/backManagerment/MoneyNavigation/MoneyWallet/insertMoneyWallet.html`,params)}

//矿池
export const reqAddMiningPool = params => {return axios.post(`${base}/backManagerment/MoneyNavigation/MoneyWallet/insertPool.html`,params)}

//其他导航
export const reqGetOtherBiteList = params => {return axios.post(`${base}/backManagerment/navigation/selectNavigationByType.html`,params)}
export const reqAddOtherBite = params => {return axios.post(`${base}/backManagerment/navigation/insertNavigation.html`,params)}
export const reqDeleteOtherBite = params => {return axios.post(`${base}/backManagerment/navigation/deleteNavigation.html`,params)}
export const reqEditOtherBite = params => {return axios.post(`${base}/backManagerment/navigation/updateNavigation.html`,params)}
export const reqGetOtherBiteQuery = params => {return axios.post(`${base}/backManagerment/navigation/selectNavigationById.html`,params)}

//合作伙伴
export const reqGetPartnerList = params => {return axios.post(`${base}/backManagerment/partner/selectPartnerList.html`,params)}
export const reqAddPartner = params => {return axios.post(`${base}/backManagerment/partner/insertPartner.html`,params)}
export const reqDeletePartner = params => {return axios.post(`${base}/backManagerment/partner/deletePartner.html`,params)}
export const reqEditPartner = params => {return axios.post(`${base}/backManagerment/partner/updatePartner.html`,params)}
export const reqGetPartnerQuery = params => {return axios.post(`${base}/backManagerment/partner/selectPartnerById.html`,params)}


//矿机交易
export const reqGetMiningTransactionList = params => {return axios.post(`${base}/backManagerment/machine/selectMachineList.html`,params)}
export const reqAddMiningTransaction = params => {return axios.post(`${base}/backManagerment/machine/insertMachine.html`,params)}
export const reqDeleteMiningTransaction = params => {return axios.post(`${base}/backManagerment/machine/deleteMachine.html`,params)}
export const reqEditMiningTransaction = params => {return axios.post(`${base}/backManagerment/machine/updateMachine.html`,params)}
export const reqMiningTransactionQuery = params => {return axios.post(`${base}/backManagerment/machine/selectMachineById.html`,params)}

//矿机测评
export const reqGetMiningTestList = params => {return axios.post(`${base}/backManagerment/machineTest/selectMachineTestList.html`,params)}
export const reqAddMiningTest = params => {return axios.post(`${base}/backManagerment/machineTest/insertMachineTest.html`,params)}
export const reqDeleteMiningTest = params => {return axios.post(`${base}/backManagerment/machineTest/deleteMachineTest.html`,params)}
export const reqEditMiningTest = params => {return axios.post(`${base}/backManagerment/machineTest/updateMachineTest.html`,params)}
export const reqMiningTestQuery = params => {return axios.post(`${base}/backManagerment/machineTest/selectMachineTestById.html`,params)}

//学院文章
export const reqSchoolArticleList = params => {return axios.post(`${base}/backManagerment/academy/selectAcademyArticleList.html`,params)}
export const reqAddSchoolArticle = params => {return axios.post(`${base}/backManagerment/academy/insertAcademyArticle.html`,params)}
export const reqDeleteSchoolArticle = params => {return axios.post(`${base}/backManagerment/academy/deleteAcademyArticle.html`,params)}
export const reqEditSchoolArticle = params => {return axios.post(`${base}/backManagerment/academy/updateAcademyArticle.html`,params)}
export const reqSchoolArticleQuery = params => {return axios.post(`${base}/backManagerment/academy/selectAcademyArticleById.html`,params)}

//专题选择
export const reqSelectModuleList = params => {return axios.post(`${base}/backManagerment/academy/selectModuleList.html`,params)}

//学院模块
export const reqSchoolModuleList = params => {return axios.post(`${base}/backManagerment/academy/selectAcademyModuleList.html`,params)}
export const reqAddSchoolModule = params => {return axios.post(`${base}/backManagerment/academy/insertAcademyModule.html`,params)}
export const reqDeleteSchoolModule = params => {return axios.post(`${base}/backManagerment/academy/deleteAcademyModule.html`,params)}
export const reqEditSchoolModule = params => {return axios.post(`${base}/backManagerment/academy/updateAcademyModule.html`,params)}
export const reqSchoolModuleQuery = params => {return axios.post(`${base}/backManagerment/academy/selectAcademyModuleById.html`,params)}
//异步校验专题名称（修改）
export const reqVerifyModuleNameEdit = params => {return axios.post(`${base}/backManagerment/academy/updateVerifyModuleName.html`,params)}
//异步校验专题名称（新增）
export const reqVerifyModuleNameAdd = params => {return axios.post(`${base}/backManagerment/academy/verifyModuleName.html`,params)}
//管理员
export const reqGetManagerList = params => {return axios.post(`${base}/backManagerment/admin/selectAdminList.html`,params)}
export const reqAddManager = params => {return axios.post(`${base}/backManagerment/admin/insertAdmin.html`,params)}
export const reqDeleteManager = params => {return axios.post(`${base}/backManagerment/admin/deleteAdmin.html`,params)}
export const reqEditManager = params => {return axios.post(`${base}/backManagerment/admin/updateAdmin.html`,params)}
export const reqGetManagerQuery = params => {return axios.post(`${base}/backManagerment/admin/selectAdminById.html`,params)}

//会员管理
export const reqGetMemberStatistics = params => {return axios.post(`${base}/backManagerment/user/countUser.html`,params)}

//登录
export const reqLogin = params => {return axios.post(`${base}/backManagerment/admin/loginAdmin.html`,params)}
