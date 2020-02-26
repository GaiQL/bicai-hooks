
import React from 'react'
import * as Index from "Common/pages/PgBuy/Hooks/index"
import StoreBase from "Common/pages/PgBuy/Hooks/store"
import { action, computed, observable, runInAction } from "mobx"; // mian

//  新增重写
let Config = {

}

const Item = {

}
const Handle = {
    // 新增Handle

}

class Store extends StoreBase {
    @observable needMsgCode: boolean = true
}

export default Index.default({ Config, Item, Handle, Store })
