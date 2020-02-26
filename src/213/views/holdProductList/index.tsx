// import PgHoldProductList from 'Common/pages/PgHoldProductList'
// import React from 'react'
// import Store from './store'
// import { commonStore } from "Common/pages/store"
// import './style.scss'
// import HoldRow from './navHold'
// import NavDraw from './navDraw'
// import * as Index from "Common/pages/PgRedeem/Hooks"
// import StoreBase from "Common/pages/PgRedeem/Hooks/store"

// class Recharge extends PgHoldProductList {
//     Store = Store
//     Config = {
//         navList: ['持有中', '已支取'],
//         template: [HoldRow, NavDraw],
//         module: module,
//         interest: false
//     }
// }

// export default Recharge
import React from 'react'
import * as Index from "Common/pages/PgHoldProductList/Hooks"
import StoreBase from "Common/pages/PgHoldProductList/Hooks/store"
// import {action, computed, observable} from "mobx"; // mian
//  新增重写
let Config = {
    extraText: `全部支取`,
    tipText: '预计收益仅供参考，实际收益以银行到账为准'
}
// 新增Item
const Item = {
    
}
// 新增Handle
const Handle ={

}
class Store extends StoreBase{

}

export default Index.default({Config,Item,Handle,Store})

