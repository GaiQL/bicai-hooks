import React from 'react'
import * as Index from "Common/pages/PgServiceSmsCode/Hooks"
import StoreBase from "Common/pages/PgServiceSmsCode/Hooks/store"
import * as Type from "Common/pages/PgInputSmsCode/Hooks/type"

import { apiBankAll } from 'Common/api/bank'
import { $Bus, BusName } from 'Common/Plugins/index'

const apiBank = new apiBankAll.ApiBankV2()

//  新增重写
const Config: Type.ConfigType = {
    status:0
}

const InitCom = Index.InitCom
const Item = {
    // 新增Item
    bankHandle: (bankInfo: any, bankCardType: any) => {
        let { changeBank } = InitCom.get()
        changeBank(bankInfo, {
            extra: () => {
                return {
                    // 新增参数
                    reqType: 2
                }
            }
        })
    },

    /**
     *
     * @param type:init为进入页面时请求的接口。again指的是重复发送的。
     * 大多银行两者是一个接口。但是有的进入页面前就已经发送完成验证码了。该函数就可以重写
     */
    // sendCodeFn(type: 'init' | 'again') {
    //     console.log(type)
    //     let {Store} = InitCom.get()
    //     let { bankInfo} = Store.getQuery()
    //     let {bizType} = Store.getQuery()
    //     let {changeBank} = InitCom.get()
    //     // Eg:
    //     if(type == 'init'){
    //         // 初始如不需要发送
    //         return function () {
    //             changeBank(bankInfo, {
    //                 extra: () => {
    //                     return {
    //                         // 新增参数
    //                         reqType: 1
    //                     }
    //                 },
    //                 success:()=>{
    //                     $Bus.emit(BusName.resetSms,true)
    //                 }
    //             })
    //         }

    //     }
    //     if(type == 'again'){
    //         return function () {
    //             changeBank(bankInfo, {
    //                 extra: () => {
    //                     return {
    //                         // 新增参数
    //                         reqType: 1
    //                     }
    //                 }
    //             })
    //         }
    //     }

    // }

}
// 新增Handle
const Handle = {}

class Store extends StoreBase {
    status = 0


}

export default Index.default({ Config, Item, Handle, Store })
