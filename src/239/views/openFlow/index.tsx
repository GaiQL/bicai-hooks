// import PgOpenFlow from 'Common/pages/PgOpenFlow'
// import Store from './store'
// class OpenFlow extends PgOpenFlow{
//     Store = Store
// }

// export default OpenFlow



import React from 'react'
import * as Index from "Common/pages/PgOpenFlow/Hooks"
import StoreBase from "Common/pages/PgOpenFlow/Hooks/store"
// import {action, computed, observable} from "mobx"; // mian

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
}

export default Index.default({Config,Item,Handle,Store})
