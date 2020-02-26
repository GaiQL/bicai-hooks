// import React from 'react'
// import PgInWaiting from 'Common/pages/PgInWaiting'


// const WithdrawWaiting = Component =>{
//     return class extends PgInWaiting {
//         render(): any {
//             return <Component {...this.props} status={3}/>
//         }
//     }
// }

// export default WithdrawWaiting(PgInWaiting)

import React from 'react'
import * as Index from "Common/pages/PgInWaiting/Hooks/index"
import StoreBase from "Common/pages/PgInWaiting/Hooks/store"
import { action, computed, observable } from "mobx"; // mian

//  新增重写
let Config = {
    status: 3,
    btnText: '查看余额'
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