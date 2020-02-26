import React from 'react'
import * as Index from "Common/pages/PgBuy/Hooks/index"
import StoreBase from "Common/pages/PgBuy/Hooks/store"
import { action, computed, observable, runInAction } from "mobx"; // mian
import { commonStore } from "Common/pages/store"
import { session } from "Common/utils/store";
import { tradingStatus, actions } from 'Common/utils/errorAlert' // 对于失败的弹框统一处理
import { Native } from "Common/utils/appBridge"
import { INNER_CODE } from 'Common/config/params.enum'
import { BIZ_TYPE } from 'Common/config/params.enum'
import { apiBankAll } from 'Common/api/bank'
import help from 'Common/utils/Tool'
const apiBank = new apiBankAll.ApiBankV2()

//  新增重写
let Config = {

}

const Item = {
    // 新增Item
    // 初始化执行函数，可重写
    initFunc : async(FuncList: { getBankCardList: any; getproductInformation: any; getProductAgreement: any; getOuterChainParameters: any; }) => {
            let { initTradingStatus }: any = StoreBase
            let query: any = commonStore.query()
            let { PassPasswordOrNot }: any = commonStore.query()
            if (PassPasswordOrNot) {
                if (session.get('localParams')) {
                    await initTradingStatus() // 初始化获取当前交易状态
                    return;
                }
            }
            let { getBankCardList, getproductInformation, getProductAgreement, getOuterChainParameters } = FuncList
            await getBankCardList()
            await getproductInformation()
            await getProductAgreement()
            await getOuterChainParameters()
        }
}
const Handle = {
    // 新增Handle

}

class Store extends StoreBase {

    @observable needMsgCode: boolean = true

    setTabIsRead = (flag: boolean) => {
        runInAction(() => { this.isRead = flag })
    }

    initTradingStatus = async () => {
        let localParams = session.get('localParams')
        let allParams = {
            prdIndexId: session.get('proId'),
            type: '1',
            ...localParams
        }
        await apiBank.apiBuy(allParams).then((res: { orderStatus: number; orderMsgTitle: any; orderMsgContent: any; prdType: any; prdTypeName: any; depositTypeId: any; buyResult: any; amount: number; }) => {
            session.remove('localParams')
            if (res.orderStatus == 20000) {
                commonStore.Hash.history.replace(`/buyResults?orderMsgTitle=${res.orderMsgTitle}&orderMsgContent=${res.orderMsgContent}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}`)

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
                        `/buySuccess?stepList=${JSON.stringify(res.buyResult)}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&depositTypeId=${res.depositTypeId}`
                    )
                }
            }
        }).catch((e: any) => {
            session.remove('localParams')
            let Parameter = {
                bizType: BIZ_TYPE.buy
            }
            this.errHandle(e, Parameter)
        })
    }
    // 失败的方法
    errHandle = (e: errorType, Parameter?: any, params = '') => {
        let query = Parameter
        if (e.popType != 300 || e.innerCode == INNER_CODE.SubmitOnly) return // 表示弹toast
        if (!e.innerCode) return
        let action:Map<string,any> = actions(e, tradingStatus.get(query.bizType * 1)[1], query)
        commonStore.openAlert(tradingStatus.get(query.bizType * 1)[0] + '失败', action.get(e.innerCode)[0], action.get(e.innerCode)[1])
    }

    // 购买提交
    apiBuyFns = async (Parameter = null, code?: any, phone?: any, SpecialExpression?: any) => {
        var url = window.location.href.split("#/")[0]
        if (url.indexOf("file:///") != -1) {
            url = url.replace("file:///", "https://www.bicai-android.com/")
        }
        let query:any = Parameter
        let combinedPurchaseParams = session.get('comBuyParams') ? (session.get('comBuyParams').groupPrdFlag == '1' ? session.get('comBuyParams') : {}) : {} //组合购买参数
        let params: any = {
            prdIndexId: session.get('proId'),
            amount: query.amount,
            validateCode: code || '',
            validateCodeSerialNum: session.get('validateCodeSerialNum') || '',// 验证码流水号
            tranBackAdd: query.tranBackAdd,
            phoneNum: phone || '',
            expandJson: session.get('expandJson') || window.sessionStorage.getItem('buyParams') || '',
            bankSerialNum: session.get('orderNumber') || '', // 针对营口的侧业务订单号
            bankElecAccountNum: query.bankElecAccountNum || '', // 二类户电子卡号
            ...combinedPurchaseParams,
            successUrl: url + `#/buy?proId=${session.get('proId')}&PassPasswordOrNot=${true}`,
            failUrl: url + `#/buy?proId=${session.get('proId')}`,
            callbackUrl: url + `#/buy?proId=${session.get('proId')}&PassPasswordOrNot=${true}`,
            fallbackUrl: url + `#/buy?proId=${session.get('proId')}`
        }
        await apiBank.apiBuy(params).then((res: { reqSerial: any; successUrl: any; }) => {
            let localParams = {
                reqSerial: res.reqSerial,
                amount: query.amount
            }
            let url = res.successUrl //获取银行url地址
            session.set('localParams', localParams)
            // window.location.href = url
            window.location.replace(url)
        })
    }

    reChangeNextNOSMS = () => {
        let { bankCardInfo, amount } = this
        if (typeof amount == 'string') {
            amount = help.clearComma(amount)
        }
        let query: any = commonStore.query()
        let bankCardRes: any = bankCardInfo
        // let bankPhone = bankCardRes.cardList.length ? (bankCardRes.cardList[(selectedCardInd == null ? 0 : selectedCardInd)].bankCardPhone) : bankCardRes.bankCardPhone // 银行卡的手机号
        let bankPhone = bankCardRes.bankCardPhone
        let params: any = {
            prdIndexId: session.get('proId'),
            amount: amount,
            tranBackAdd: window.location.href.split("?")[0],
            bizType: BIZ_TYPE.buy, // 1表示为购(买
            bankCardPhone: bankPhone,
            phoneNum: bankCardRes.bankCardPhone, // 二类户的手机号
            expandJson: window.sessionStorage.getItem('buyParams'),
            bankElecAccountNum: bankCardRes.bankElecAccountNum, // 二类户的卡号
            prdPeriod: query.prdPeriod,
            userName: bankCardRes.realName, // 用户名
            userCardId: bankCardRes.userCardId, // 身份证号
        }
        this.apiBuyFns(params)
    }

}

export default Index.default({ Config, Item, Handle, Store })
