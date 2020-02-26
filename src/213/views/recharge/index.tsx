
import React from 'react'
import * as Index from "Common/pages/PgRecharge/Hooks/index"
import StoreBase from "Common/pages/PgRecharge/Hooks/store"
import { action, computed, observable } from "mobx"; // mian

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
    @observable seconds = 60
}

export default Index.default({ Config, Item, Handle, Store })
