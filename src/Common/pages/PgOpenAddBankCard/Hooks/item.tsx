import React, {useEffect} from 'react'
import './style.scss'
import { Headers } from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer} from "mobx-react-lite"
import Main from "Common/publicCommon/BcBankCardForm";
// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";
import {commonStore} from "Common/pages/store"
import { bindingCardBtn } from 'Common/Plugins/recordLogInfo'


/**
 * 主渲染函数 Render名字必须存在
 * @constructor
 */
interface INext {
    phoneNo:string,
    bankCardInfo:string
}
const Render = ()=>{
    let {Store} = InitCom.get()
    async function next(result:INext) {
        try {
            bindingCardBtn()
        } catch(err) {}
        commonStore.Hash.history.replace({
            pathname: '/openPerfection', state: {
                bankCardPhone: result.phoneNo,
                bankInfo: result.bankCardInfo
            }
        })
    }
    let {idCard,name}:any = commonStore.query() || {}
    return <div className='addNewBank'>
        {/* 头部 */}
        <Headers>绑定银行卡</Headers>
        <Main {...{
            next,userCardId:idCard,realName:name
        }}/>
        <BottomColumn type='long' />
    </div>
}


export default {
    Render: observer(Render),
}

