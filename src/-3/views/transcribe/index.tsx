
import React from 'react'
import * as Index from "Common/pages/PgHookModule/Hooks"
import * as Type from "Common/pages/PgHookModule/Hooks/type"
import StoreBase from "Common/pages/PgHookModule/Hooks/store"
// import {action, computed, observable} from "mobx"; // mian

//  新增重写
let Config:Type.ConfigType = {

}

const Item:Type.ItemType = {
    // 新增Item


}
// 新增Handle
const Handle ={


}
class Store extends StoreBase{

}
export const InitCom = Index.InitCom
export default Index.default({Config,Item,Handle,Store})
