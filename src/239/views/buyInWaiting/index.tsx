// import React from 'react'
// import PgInWaiting from 'Common/pages/PgInWaiting'


// const BuyWaiting = Component => {
//     return class extends PgInWaiting {
//         render(): any {
//             return <Component {...this.props} status={1} />
//         }
//     }
// }

// export default BuyWaiting(PgInWaiting)


import React from 'react'
import * as Index from "Common/pages/PgInWaiting/Hooks/index"
import StoreBase from "Common/pages/PgInWaiting/Hooks/store"
import { action, computed, observable } from "mobx"; // mian

//  新增重写
let Config = {
    status: 1,
    btnText: '查看我的资产'
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
