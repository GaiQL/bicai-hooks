import React from 'react'
import * as Index from "Common/pages/PgBoundBank/Hooks/index"
import StoreBase from "Common/pages/PgBoundBank/Hooks/store"
import * as Type from "Common/pages/PgBoundBank/Hooks/type"
import {action, computed, observable} from "mobx";
import {InitCom} from "Common/pages/PgBoundBank/Hooks/index";
import {commonStore} from "Common/pages/store"; // mian

/**
 * 点击换绑卡
 */
let useChangeBankCard = async () => {
    const {openAlert} = commonStore
    openAlert('提示', '请到自贡银行APP端进行更换绑定银行卡的操作', [
        {text: '确定', onPress: () => console.log('确定')},
    ])
    return false
}
//  新增重写
let Config: Type.ConfigType = {
    inspectBankCardBalance: true, // 是否需要开启中台校验

}

const Item: Type.ItemInterface = {
    // 新增Item

}
const Handle: Type.HandleInterface = {
    // 新增Handle
    useChangeBankCard
}

class Store extends StoreBase {

}

export default Index.default({Config, Item, Handle, Store})
