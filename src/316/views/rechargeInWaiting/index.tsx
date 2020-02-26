// import React from 'react'
// import PgInWaiting from 'Common/pages/PgInWaiting'


// const RechargeWaiting = Component =>{
//     return class extends PgInWaiting {
//         render(): any {
//             return <Component {...this.props} status={2}/>
//         }
//     }
// }

// export default RechargeWaiting(PgInWaiting)

import React from 'react'
import * as Index from "Common/pages/PgInWaiting/Hooks/index"
import StoreBase from "Common/pages/PgInWaiting/Hooks/store"
import { session } from 'Common/utils/store'
import { action, computed, observable } from "mobx"; // mian

//  新增重写
let Config = {
    status: 2,
    btnText: `${session.get('SOURCEOFRECHARGE') ? '继续存入' : '查看余额' }`
}

const Item = {
    // 新增Item


}
const Handle = {
    // 新增Handle

}
class Store extends StoreBase {

}

export default Index.default({ Config, Item, Handle, Store })