
import React from 'react'
import * as Index from "Common/pages/PgTranscribe"
import * as Type from "Common/pages/PgTranscribe/type"
import StoreBase from "Common/pages/PgTranscribe/store"

//  新增重写
let Config:Type.ConfigType = {

}

const Item:Type.ItemType = {
    // 新增Item


}
// 新增Handle
const Handle:Type.HandleType ={


}
class Store extends StoreBase{

}
export const InitCom = Index.InitCom
export default Index.default({Config,Item,Handle,Store})
