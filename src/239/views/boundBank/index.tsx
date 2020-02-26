
import React from 'react'
import * as Index from "Common/pages/PgBoundBank/Hooks/index"
import StoreBase from "Common/pages/PgBoundBank/Hooks/store"
import * as Type from "Common/pages/PgBoundBank/Hooks/type"
import {action, computed, observable} from "mobx"; // mian

//  新增重写
let Config:Type.ConfigType = {
    inspectBankCardBalance:true, // 是否需要开启中台校验

}

const Item:Type.ItemInterface = {
    // 新增Item

}
const Handle:Type.HandleInterface ={
    // 新增Handle

}
class Store extends StoreBase{

}

export default Index.default({Config,Item,Handle,Store})
