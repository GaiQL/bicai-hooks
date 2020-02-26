import React from 'react'
import * as Index from "Common/pages/PgRedeem/Hooks"
import StoreBase from "Common/pages/PgRedeem/Hooks/store"
import { session } from "Common/utils/store";
import { actions, tradingStatus } from 'Common/utils/errorAlert' // 对于失败的弹框统一处理
import { commonStore } from "Common/pages/store"
import { INNER_CODE } from "Common/config/params.enum";
// import {action, computed, observable} from "mobx"; // mian
//  新增重写
let Config = {
    extraText: `全部支取`,
    needMsgCode: false,
    tipText: '预计收益仅供参考，实际收益以银行到账为准'
}
// 新增Item
const Item = {

}
// 新增Handle
const Handle = {

}
class Store extends StoreBase {
    // 支取
    apiRedeemFn = (Parameter = null, code?: any, phone?: any) => {
        const { apiRedemptionFn, bankInfo }:any = this
        let query:any = commonStore.query()
        var url = window.location.href.split("#/")[0]
        if (url.indexOf("file:///") != -1) {
            url = url.replace("file:///", "https://www.bicai-android.com/")
        }
        var urlParams = decodeURI(window.location.href.split('#/')[1])
        let params = {
            bankElecAccountNum: bankInfo.bankElecAccountNum,  // 二类电子户卡号
            prdIndexId: query.prdIndexId, // 比财产品索引表ID
            reqSerial: query.reqSerial, // 购买时后台订单号
            amount: query.amount, // 金额
            bankSerialNum: query.bankSerialNum || '',
            validateCode: code || '', // 验证码
            validateCodeSerialNum: session.get('validateCodeSerialNum') || '',// 验证码流水号
            phoneNum: phone || '',
            successUrl: url + '#/' + urlParams + `&PassPasswordOrNot=${true}`,
            failUrl: url + '#/' + urlParams,
            callbackUrl: url + '#/' + urlParams + `&PassPasswordOrNot=${true}`,
            fallbackUrl: url + '#/' + urlParams
        }
        apiRedemptionFn(params).then((res: any) => {
            let localParams = {
                reqSerial: res.reqSerial,
                amount: query.amount,
                prdIndexId: query.prdIndexId
            }
            let url = res.successUrl //获取银行url地址
            session.set('localParams', localParams)
            // return;
            window.location.replace(url)
        }).catch((e: errorType) => {
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
}

export default Index.default({ Config, Item, Handle, Store })
