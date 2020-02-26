import React from 'react'
import * as Index from "Common/pages/PgOpenSuccess/hooks"
import StoreBase from "Common/pages/PgOpenSuccess/hooks/store"
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
//  新增重写
let Config = {

}

const Item = {
    // 新增Item


}
// 新增Handle
const Handle = {


}
class Store extends StoreBase {
}

export default Index.default({ Config, Item, Handle, Store })
