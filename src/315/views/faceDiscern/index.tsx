import * as Index from "Common/pages/PgFaceDiscern/Hooks"
import * as Type from "Common/pages/PgFaceDiscern/Hooks/type"
import StoreBase from "Common/pages/PgFaceDiscern/Hooks/store"
import {commonStore} from "Common/pages/store"
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import {InitCom as openPerfectionInitCom} from '../openPerfection'
import {InitCom as updateIdCardInitCom} from '../updateIdCard'


const checkContrastSuccess = () => {
    const {Store} = openPerfectionInitCom.get()
        let data: any = commonStore.query()
        let openErr = data.openErr
        //正常开户流程
        if (data.fromPage == "open") {
            Store.submit()
            Store.changeNextType('openInputSmsCode')
            // openPerfectionInitCom.get().Config.nextType = "openInputSmsCode"
        }
        // fromPage == open  正常开户
        // fromPage == updateIdCard 更新身份证
        // errCode  100004 ==> 开户失败跳转更新身份证
        // errCode  '' ==> 交易失败跳转更新身份证

        //开户去更新身份证
        if (data.fromPage == "updateIdCard") {
            updateIdCardInitCom.get().Store.apiUpdateIdCardFn(openErr)

            // updateIdCard.newApiUpdateIdCard = apiBank.apiUpdateIdCard
            // updateIdCardInitCom.
            // console.log(updateIdCard, "PgupdateIdCard")
            // updateIdCard.apiUpdateIdCardFn(openErr)
        }

    }
//  新增重写
let Config:Type.ConfigType = {

}

const Item:Type.ItemType = {

}


// 新增Handle
const Handle:Type.HandleType ={
    checkContrastSuccess
}
class Store extends StoreBase{

}

export default Index.default({Config,Item,Handle,Store})

