import React from 'react'
import * as Index from "Common/pages/PgRedeem/Hooks"
import StoreBase from "Common/pages/PgRedeem/Hooks/store"
import { session } from "Common/utils/store";
import { actions, tradingStatus } from 'Common/utils/errorAlert' // 对于失败的弹框统一处理
import { commonStore } from "Common/pages/store"
import { INNER_CODE } from "Common/config/params.enum";
// import {action, computed, observable} from "mobx"; // mian
//  新增重写
let Config = {
    extraText: `全部支取`,
    needMsgCode: true,
    tipText: '预计收益仅供参考，实际收益以银行到账为准'
}
// 新增Item
const Item = {

}
// 新增Handle
const Handle = {

}
class Store extends StoreBase {

}

export default Index.default({ Config, Item, Handle, Store })
