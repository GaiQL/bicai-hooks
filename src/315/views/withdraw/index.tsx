// import PgWithdraw from 'Common/pages/PgWithdraw'
// import Store from './store'

// class Withdraw extends PgWithdraw {
//     Store = Store
// }

// export default Withdraw

import React from 'react'
import * as Index from "Common/pages/PgWithdraw/Hooks/index"
import StoreBase from "Common/pages/PgWithdraw/Hooks/store"
import { action, computed, observable } from "mobx"; // mian

//  新增重写
let Config = {

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