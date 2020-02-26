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
    noUpdateCardId = () => {
        session.set("carIdBase64", { // 更新成功统一将base64保存，开户时需要
            idcardFrontPhoto: encodeURIComponent(this.figureImgBase),   //正面base64
            idcardBackPhoto: encodeURIComponent(this.emblemImgBase),    //反面base64
        })
        commonStore.Hash.history.push('/openPerfection')
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
