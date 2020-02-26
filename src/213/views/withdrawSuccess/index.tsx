// import PgWithdrawSuccess from 'Common/pages/PgWithdrawSuccess'

// class WithdrawSuccess extends PgWithdrawSuccess {}

// export default WithdrawSuccess

import React from 'react'
import * as Index from "Common/pages/PgWithdrawSuccess/Hooks/index"
import StoreBase from "Common/pages/PgWithdrawSuccess/Hooks/store"
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