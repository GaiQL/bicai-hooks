// import AssessmentLevel from 'Common/pages/PgAssessmentLevel'
import {Native} from "Common/utils/appBridge"
import {Toast, Modal} from 'antd-mobile';
import {session} from "Common/utils/store";
import {commonStore} from "Common/pages/store"
import {GetPrdInfo} from 'Common/pages/public/getPrdInfo/store'
const {openAlert} = commonStore
const continueBuyBtn = async () => {
    if (Native.isApp()) {
        try {
            // todo 需要判断app是购买开户来的还是其他情况。
            // 分三种
            // 购买开户去购买：
            // 银行资产开户去电子账户 ？
            // 二类户去开户关掉页面 ？
            Native.closeWebView()
            // Native.openInfoSuccess({closeState:1,orgId:ORG_ID})
        } catch (e) {
            Toast.info('app测评完成后跳转页')
        }

    } else {
        if (session.get('proInfo') && session.get('proInfo').ID) {
            let params = {
                prdIndexId: session.get('proInfo').ID
            }
            console.log('成功')

            // await this.apiBank.apiQryLoginStatus(params).then((res: any) => {
            // alert(res)
            let {grade}: any = commonStore.query() || {}
            if (grade == 1) {
                openAlert('购买失败', '您的风险评估类型不符合该产品风险等级要求，无法购买', [
                    {
                        text: '取消', onPress: () => {
                            console.log("cancel")
                        }
                    },
                    {
                        text: '重新测评', onPress: () => {
                            commonStore.Hash.history.replace('/riskAppraisal')
                        }
                    },
                ])
            } else {
                if (session.get('proInfo')) {
                    commonStore.Hash.history.push(`/buy?proId=${session.get('proInfo').ID}`)
                } else {
                    if (session.get('proId')) {
                        //  本地用
                        let {initData} = new GetPrdInfo()
                        initData({ID: session.get('proInfo')})
                        commonStore.Hash.history.push(`/buy?proId=${session.get('proInfo')}`)
                    } else {
                        // 其他情况去银行资产
                        commonStore.Hash.history.push(`/bankDetail`)
                    }
                }
            }
            // })
        } else {
            commonStore.Hash.history.push(`/bankDetail`)
        }
        console.log('进行中')

    }

}


import React from 'react'
import * as Index from "Common/pages/PgAssessmentLevel/Hooks"
import * as Type from "Common/pages/PgAssessmentLevel/Hooks/type"
import StoreBase from "Common/pages/PgAssessmentLevel/Hooks/store"
// import {action, computed, observable} from "mobx"; // mian

//  新增重写
let Config: Type.ConfigType = {}

const Item: Type.ItemInterface = {
    // 新增Item
    continueBuyBtn
}
// 新增Handle
const Handle: Type.HandleInterface = {}

class Store extends StoreBase {

}

export default Index.default({Config, Item, Handle, Store})

