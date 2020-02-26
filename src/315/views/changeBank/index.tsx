
import React from 'react'
import * as Index from "Common/pages/PgChangeBank/Hooks/index"
import * as Type from "Common/pages/PgChangeBank/Hooks/type"
import StoreBase from "Common/pages/PgChangeBank/Hooks/store"
import {action, computed, observable} from "mobx"; // mian

//  新增重写
let Config:Type.ConfigType = {

}

const Item:Type.ItemType= {
    // 新增Item

}
const Handle:Type.HandleType ={
    // 新增Handle

}
class Store extends StoreBase{

}

export default Index.default({Config,Item,Handle,Store})
