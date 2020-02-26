// import { observable, action, runInAction } from "mobx";
// import { PgRedeem } from 'Common/pages/PgRedeem/store'
// import { commonStore } from "Common/pages/store"
// import { session } from 'Common/utils/store'
// import { INNER_CODE } from 'Common/config/params.enum'
// import { actions, tradingStatus } from 'Common/utils/errorAlert' // 对于失败的弹框统一处理
// import help from 'Common/utils/Tool'
// import { BIZ_TYPE } from 'Common/config/params.enum'
//
// class Redeem extends PgRedeem {
//     // @observable isTip = false; //是否显示提示
//     @observable isEditInput = false; //是否显示input
//     @observable needMsgCode = false
//     @observable isRequestRate = true // 是否请求收益接口
//     @observable isRequestProInfo = true
//
//     // 设置传递过来的参数
//     setParams = () => {
//         runInAction(() => {
//             const obj: any = this.Store.query()
//             obj.amount = help.clearComma(obj.amount)
//             this.prePageParam = obj
//
//
//             // 判断是否为全部支取
//             if (Number(obj.prdDrawMode) == 1) {
//                 runInAction(() => {
//                     this.money = obj.amount;
//                     this.isEditInput = false
//                 })
//             }
//
//             // 判断是否为部分支取
//             if (Number(obj.prdDrawMode) == 2) {
//                 runInAction(() => {
//                     this.isEditInput = true
//                 })
//             }
//         })
//     }
//
//     /**不需要验证码的回调 */
//     reChangeNextNOSMS = (params) => {
//         this.apiRedemptionFns(params)
//     }
//
//     // 初始化获取当前状态【查询订单？ =====  展示页面？】
//     initAcquisitionState = async () => {
//         const { apiRedemptionFn, prePageParam }: any = this
//         let localParams = session.get('localParams')
//         let allParams = {
//             prdIndexId: session.get('proId'),
//             type: '1',
//             ...localParams
//         }
//         await apiRedemptionFn(allParams).then((res: any) => {
//             session.remove('localParams')
//             if (res.orderStatus == 20000) {
//                 commonStore.Hash.history.replace(
//                     `/redeemWaiting?orderMsgTitle=${res.orderMsgTitle}&orderMsgContent=${res.orderMsgContent}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}`
//                 )
//             } else if (res.orderStatus == 0) {
//                 commonStore.Hash.history.replace(
//                     `/redeemSuccess?amountDesc=${res.amountDesc}&profit=${res.profit}&rate=${res.rate}&profitDesc=${res.profitDesc}&bankElecAccountNum=${res.bankElecAccountNum}&optionDate=${res.optionDate}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}&reqSerial=${res.reqSerial}&prdIndexId=${prePageParam.prdIndexId}`
//                 )
//             }
//         }).catch(e => {
//             session.remove('localParams')
//             let Parameter = {
//                 bizType: BIZ_TYPE.buy
//             }
//             this.errHandle(e, Parameter)
//         })
//     }
//
//     // 支取
//     apiRedemptionFns = (Parameter = null, code?, phone?) => {
//         const { apiRedemptionFn } = this
//
//         let query = Parameter
//         var url = window.location.href.split("#/")[0]
//         if (url.indexOf("file:///") != -1) {
//             url = url.replace("file:///", "https://www.bicai-android.com/")
//         }
//         var urlParams = decodeURI(window.location.href.split('#/')[1])
//         let params = {
//             bankElecAccountNum: query.bankElecAccountNum,  // 二类电子户卡号
//             prdIndexId: query.prdIndexId, // 比财产品索引表ID
//             reqSerial: query.reqSerial, // 购买时后台订单号
//             amount: query.amount, // 金额
//             bankSerialNum: query.bankSerialNum || '',
//             validateCode: code || '', // 验证码
//             validateCodeSerialNum: session.get('validateCodeSerialNum') || '',// 验证码流水号
//             phoneNum: phone || '',
//             successUrl: url + '#/' + urlParams + `&PassPasswordOrNot=${true}`,
//             failUrl: url + '#/' + urlParams,
//             callbackUrl: url + '#/' + urlParams + `&PassPasswordOrNot=${true}`,
//             fallbackUrl: url + '#/' + urlParams
//         }
//         apiRedemptionFn(params).then((res: any) => {
//             let localParams = {
//                 reqSerial: res.reqSerial,
//                 amount: query.amount,
//                 prdIndexId: query.prdIndexId
//             }
//             let url = res.successUrl //获取银行url地址
//             session.set('localParams', localParams)
//             // return;
//             window.location.replace(url)
//         }).catch(e => {
//             this.errHandle(e, Parameter)
//         })
//
//
//     }
//     // 失败的方法
//     errHandle = (e, Parameter?, params = '') => {
//         let query = Parameter
//         if (e.popType != 300 || e.innerCode == INNER_CODE.SubmitOnly) return // 表示弹toast
//         if (!e.innerCode) return
//         let action = actions(e, tradingStatus.get(query.bizType * 1)[1], query)
//         commonStore.openAlert(tradingStatus.get(query.bizType * 1)[0] + '失败', action.get(e.innerCode)[0], action.get(e.innerCode)[1])
//     }
// }
// export default new Redeem()
