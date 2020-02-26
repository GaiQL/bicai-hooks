
import React from 'react'
import * as Index from "Common/pages/PgMoreService/Hooks"
import * as Type from "Common/pages/PgMoreService/Hooks/type.d"
import StoreBase from "Common/pages/PgMoreService/Hooks/store"

// Config = { ...this.Config, bindPhone: true ,isShowBankCard: true ,bindSales:false,password:true}

//  新增重写
let Config: Type.ConfigType = {
    password: false,
    bindPhone: true,
    bindSales:true
}

const Item: Type.ItemInterface = {
    // 新增Item
  
}
// 新增Handle
const Handle = {
}
class Store extends StoreBase {

}

export default Index.default({ Config, Item, Handle, Store })
