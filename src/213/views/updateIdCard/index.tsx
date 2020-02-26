import React from 'react'
import * as Index from "Common/pages/PgUpdateIdCard/Hooks"
import StoreBase from "Common/pages/PgUpdateIdCard/Hooks/store"
import {Toast} from "antd-mobile";
import { commonStore } from "Common/pages/store"
import { session } from 'Common/utils/store'
import { INNER_CODE } from "Common/config/params.enum";
import { Native } from "Common/utils/appBridge"
//  新增重写
let Config = {
    //
}

const Item = {
    // 新增Item
    // TwoCardTemplate(){
    //     return <div>1111</div>
    // }
}
// 新增Handle
const Handle ={
}
class Store extends StoreBase{
    apiUpdateIdCardFn = async (openErr?: string | undefined) => {
        commonStore.changeAlertTitle('更新失败')
        try {
            const params = this.apiUpdateIdCardParams(openErr)
            const res = await this.newApiUpdateIdCard(params)
            const { proId, fromApp }: any = commonStore.query() || {}
            let {bankCardPhone}:any = session.get('bankInfo') || {}
            session.set('updateIdCardResult', res) // 将更新成功后的数据保存，返回开户第一步可能需要
            if (openErr == INNER_CODE.CancelAndUpdateIdCard) { // 开户失败过来的
                session.set("carIdBase64", { // 更新成功统一将base64保存，开户时需要
                    idcardFrontPhoto: encodeURIComponent(this.figureImgBase),   //正面base64
                    idcardBackPhoto: encodeURIComponent(this.emblemImgBase),    //反面base64
                })
            }
            if (proId) { // 购买成功更新身份证
                commonStore.Hash.history.push('/buy?proId=' + proId)
            } else {
                if (Native.isApp() && fromApp == 1) { // 说明应该时从app直接跳转来的
                    try {
                        await Native.closeWebView() // app端更新完直接关闭
                    } catch (e) {
                        Toast.info(e)
                    }
                } else {
                    if (!openErr || openErr == "undefined") {// 交易
                        commonStore.Hash.history.push('/bankDetail')
                    } else { // 开户流程的
                        commonStore.Hash.history.push(`/openInputSmsCode?bankCardPhone=${bankCardPhone}`)

                    }
                }
            }

        } catch (e) {
            session.remove('IdCardFrontPhoneOcrData') //  保存身份证反显信息 开户时需要
            if (e.innerCode == INNER_CODE.CancelAndUpdateIdCard) {
                commonStore.openAlert('更新失败', e.popMsg, [
                    {
                        text: '更新身份证',
                        onPress: () =>
                            commonStore.Hash.history.push('/updateIdCard?openErr' + openErr)
                    }
                ])
            }
            if (e.innerCode == INNER_CODE.SubmitOnly) {
                commonStore.openAlert('更新失败', e.popMsg, [
                    {
                        text: '确定',
                        onPress: () =>
                            commonStore.Hash.history.push('/updateIdCard?openErr' + openErr)
                    }
                ])
            }
        }

    }
}
export const InitCom = Index.InitCom
export default Index.default({Config,Item,Handle,Store})


// import PgUpdateIdCard from 'Common/pages/PgUpdateIdCard'
// import Store from "./store"
// import {observer, inject} from 'mobx-react'

// class UpdateIdCard extends PgUpdateIdCard {
//     Store=Store
// }

// export default UpdateIdCard
