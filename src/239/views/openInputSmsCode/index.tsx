//
// import PgInputSmsCode from 'Common/pages/PgInputSmsCode'
// import Store from './store'
//
// class InputSmsCode extends PgInputSmsCode {
//   Store = Store
//   Config = { ...this.Config, getCode: true }//继承
//
// }
//
//
// export default InputSmsCode
import React from 'react'
import * as Index from "Common/pages/PgInputSmsCode/Hooks"
import StoreBase from "Common/pages/PgInputSmsCode/Hooks/store"
import * as Type from "Common/pages/PgInputSmsCode/Hooks/type"

import {apiBankAll} from 'Common/api/bank'
import {$Bus, BusName} from 'Common/Plugins/index'

const apiBank = new apiBankAll.ApiBankV2()

//  新增重写
const Config:Type.ConfigType ={
}
const Item = {
}
// 新增Handle
const Handle = {}

class Store extends StoreBase {

}

export default Index.default({Config, Item, Handle, Store})
