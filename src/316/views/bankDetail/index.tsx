
import React from 'react'
import * as Index from "Common/pages/PgBankDetail/Hooks"
import * as Type from "Common/pages/PgBankDetail/Hooks/type"
import StoreBase from "Common/pages/PgBankDetail/Hooks/store"
// import {action, computed, observable} from "mobx"; // mian

//  新增重写
let Config:Type.ConfigType = {
    //
}

const Item:Type.ItemInterface = {
    // 新增Item
    // TwoCardTemplate(){
    //     return <div>1111</div>
    // }
}
// 新增Handle
const Handle:Type.HandleInterface ={
}
class Store extends StoreBase{
}

export default Index.default({Config,Item,Handle,Store})
