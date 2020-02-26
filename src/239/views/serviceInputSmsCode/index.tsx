import React from 'react'
import * as Index from "Common/pages/PgServiceSmsCode/Hooks"
import StoreBase from "Common/pages/PgServiceSmsCode/Hooks/store"
import * as Type from "Common/pages/PgInputSmsCode/Hooks/type"

import {apiBankAll} from 'Common/api/bank'
import {$Bus, BusName} from 'Common/Plugins/index'

const apiBank = new apiBankAll.ApiBankV2()

//  新增重写
const Config:Type.ConfigType ={
    // status:0
}

const InitCom = Index.InitCom
const Item = {

}
// 新增Handle
const Handle = {}

class Store extends StoreBase {

}

export default Index.default({Config, Item, Handle, Store})
