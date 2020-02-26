/*
 * @Author: 张政
 * @Date: 2019-07-18 14:00:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 13:37:41
 * @Description: 交易公共方法提取
 *
 *          Parameter 接收传递的参数【原本验证码中的的state】
 *          code      接收的验证码【需要就传，不需要就不传】
 */

import { session } from '../../utils/store'
import { actions, tradingStatus } from 'Common/utils/errorAlert' // 对于失败的弹框统一处理
import { commonStore } from "Common/pages/store"
import { Native } from "Common/utils/appBridge"
import { INNER_CODE } from 'Common/config/params.enum'
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
export class TradeRequestMethod {
    // 失败的方法
    errHandle = (e:errorType, Parameter?:any, params = '') => {
        let query = Parameter
        if (e.popType != 300 || e.innerCode == INNER_CODE.SubmitOnly) return // 表示弹toast
        if (!e.innerCode) return
        let action:Map<any,any> = actions(e, tradingStatus.get(query.bizType * 1)![1], query)
        commonStore.openAlert(tradingStatus.get(query.bizType * 1)![0] + '失败', action.get(e.innerCode)[0], action.get(e.innerCode)![1])
    }
    // 充值提交
    apiRechargeFn:anyFnType = (Parameter, additionalParameters?, code?, phone?, defaultCard? ) => {
        let params = {
            ...Parameter
        }
        apiBank.apiRecharge(params).then((res: any) => {
            if (res.orderStatus == 20000) {
                if (Parameter.processingTimeFn) {
                    Parameter.processingTimeFn()
                } else {
                    commonStore.Hash.history.replace(
                        `/rechargeWaiting?orderMsgTitle=${res.orderMsgTitle}&orderMsgContent=${res.orderMsgContent}`
                    )
                }
            } else if (res.orderStatus == 0) {
                commonStore.Hash.history.replace(
                    `/rechargeSuccess?amountDesc=${res.amountDesc}&reqSerial=${res.reqSerial}&optionDate=${res.optionDate}&bankElecAccountNum=${res.bankElecAccountNum}`
                )
            }
        }).catch((e:errorType) => {

            return;
            if (e.innerCode == INNER_CODE.Signing) {
                let { defaultCard } = Parameter
                commonStore.openAlert('充值失败', e.popMsg, [
                    { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                    {
                        text: '去签约', onPress: () => {
                            commonStore.Hash.history.push(`/signing?defaultCard=${JSON.stringify(defaultCard)}&source='recharge'`)
                        }
                    },
                ])
                return
            }
            this.errHandle(e, Parameter)
        })
    }
    // 购买提交
    apiBuyFn:anyFnType = (Parameter, code?, phone?, SpecialExpression?) => {
        let combinedPurchaseParams = session.get('comBuyParams') ? (session.get('comBuyParams').groupPrdFlag == '1' ? session.get('comBuyParams') : {}) : {} //组合购买参数
        let params: any = {
            ...Parameter,
            ...combinedPurchaseParams,
        }
        apiBank.apiBuy(params).then((res:Record<string,any>) => {
            if (res.orderStatus == 20000) {
                let currentTradingStatus = tradingStatus.get(Parameter.bizType * 1);
                commonStore.Hash.history.replace( // 购买等待中
                    `/buyResults?orderMsgTitle=${res.orderMsgTitle}&orderMsgContent=${res.orderMsgContent}&page=${currentTradingStatus?currentTradingStatus[1]:null}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}&SpecialExpression=${Parameter.SpecialExpression}`
                )

            } else if (res.orderStatus == 0) { // 购买成功
                // 判断是否是拼团过来的
                if (session.get('JUMP_LINK')) {
                    let jump = session.get('JUMP_LINK');
                    jump.indexOf('?') != -1 ? jump = jump + '&' : jump = jump + '?';
                    let bankData: any = session.get('bankData') || '';
                    let buyParams: any = JSON.stringify(session.get('buyParams')) || '';
                    let proId: any = session.get('proId') || ''
                    let url1: any = jump + `stepList=${JSON.stringify(res.buyResult)}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}&bankData=${bankData}&buyParams= ${buyParams}&proId= ${proId}&hideRightShare=1&amount=${res.amount * 1}`
                    Native.apiNavBarStyleClose('back')  // 针对ios做的头部标题
                    // 外链针对安卓做跳转
                    Native.goBannerUrl({
                        url: url1, closeState: "0"
                    })
                } else {
                    commonStore.Hash.history.replace(
                        `/buySuccess?stepList=${JSON.stringify(res.buyResult)}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}&SpecialExpression=${SpecialExpression}`
                    )
                }
            }
        }).catch((e:errorType) => {
            this.errHandle(e, Parameter)
        })
    }
    // 提现
    apiCashFn:anyFnType = (Parameter, code?, phone?) => {
        let params = {
            ...Parameter
        }
        apiBank.apiCash(params).then((res:Record<string,any>) => {
            if (res.orderStatus == 20000) {
                commonStore.Hash.history.replace(
                    `/withdrawInWaiting?`
                    + `orderMsgTitle=${res.orderMsgTitle}`
                    + `&orderMsgContent=${res.orderMsgContent}`
                )
            } else {
                if (res.path && res.path.indexOf("boundBank")) { // 判断是不是从绑定银行卡管理过来的  此逻辑带修改
                    commonStore.Hash.history.replace(
                        `/withdrawInWaiting?`
                        + `orderMsgTitle=${res.orderMsgTitle}`
                        + `&orderMsgContent=${res.orderMsgContent}`
                    )
                } else if (res.orderStatus == 0) {
                    commonStore.Hash.history.replace(
                        `/withdrawSuccess?`
                        + `amountDesc=${res.amountDesc}`
                        + `&reqSerial=${res.reqSerial}`
                        + `&optionDate=${res.optionDate}`
                        + `&page=${Parameter.page}`
                        + `&optionDate=${res.optionDate}`
                    )
                }
            }
        }).catch((e:errorType) => {
            this.errHandle(e, Parameter)
        })
    }
    // 支取
    apiRedemptionFn:anyFnType = (Parameter, code?, phone?) => {
        let query = Parameter
        let params = {
            bankElecAccountNum: query.bankElecAccountNum,  // 二类电子户卡号
            prdIndexId: query.prdIndexId, // 比财产品索引表ID
            reqSerial: query.reqSerial, // 购买时后台订单号
            amount: query.amount, // 金额
            bankSerialNum: query.bankSerialNum || '',
            validateCode: Parameter.validateCode || '', // 验证码
            validateCodeSerialNum: session.get('validateCodeSerialNum') || '',// 验证码流水号
            phoneNum: phone || '',
            rate: query.rate ? query.rate : ''
        }
        apiBank.apiRedemption(params).then((res: any) => {
            if (res.orderStatus == 20000) {
                commonStore.Hash.history.replace(
                    `/redeemWaiting?orderMsgTitle=${res.orderMsgTitle}&orderMsgContent=${res.orderMsgContent}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}`
                )
            } else if (res.orderStatus == 0) {
                commonStore.Hash.history.replace(
                    `/redeemSuccess?amountDesc=${res.amountDesc}&profit=${res.profit}&rate=${res.rate}&profitDesc=${res.profitDesc}&bankElecAccountNum=${res.bankElecAccountNum}&optionDate=${res.optionDate}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}&reqSerial=${res.reqSerial}&prdIndexId=${query.prdIndexId}`
                )
            }
        }).catch((e:errorType) => {
            this.errHandle(e, Parameter)
        })
    }
    // 撤单
    apiCancelFn:anyFnType = (Parameter, code?, phone?) => {
        let query = Parameter
        let params: any = {
            validateCode: code, //验证码
            validateCodeSerialNum: session.get('validateCodeSerialNum') || '',// 验证码流水号
            reqSerial: query.reqSerial, // this.state.buyApiPackSeq  // 购买时的reqSerial
            prdIndexId: query.prdIndexId
        }
        apiBank.getApiCancelOrder(params).then((res:Record<string,any>) => {
            switch (res.orderStatus * 1) {
                case 0:
                    commonStore.Hash.history.replace( // 撤单成功
                        `/cancelSuccess?payAmountDesc=${res.amountDesc}&bankElecAccountNum=${res.bankElecAccountNum}&payDate=${res.optionDate}&toCancelPageType=${query.toCancelPageType}&prdTypeName=${res.prdTypeName}&prdType=${res.prdType || ''}`
                    )
                    break
                case 20000:
                    commonStore.Hash.history.replace( // 撤单处理中
                        `/cancelWaiting?orderMsgTitle=${res.orderMsgTitle}&orderMsgContent=${res.orderMsgContent}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}`
                        // '/depositDetail'
                    )
                    break
                default:
                    commonStore.openAlert("撤单失败", '失败原因：' + res.popMsg, [
                        { text: '确定', onPress: () => { commonStore.Hash.history.replace(`/cancelTheOrder`) } }
                    ])
                    break;
            }
        }).catch((e:errorType) => {
            this.errHandle(e, Parameter)
        })
    }
}
export default new TradeRequestMethod()
