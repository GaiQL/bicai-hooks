
// import PgBuySuccess from 'Common/pages/PgBuySuccess'
// import Store from './store'


// class BuySuccess extends PgBuySuccess {
// 	Store = Store
// }
// export default BuySuccess

import React from 'react'
import * as Index from "Common/pages/PgBuySuccess/Hooks/index"
import StoreBase from "Common/pages/PgBuySuccess/Hooks/store"

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