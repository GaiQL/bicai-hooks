import React, {useEffect} from 'react'
import './style.scss'
import { Headers } from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer} from "mobx-react-lite"
import Main from "Common/publicCommon/BcBankCardForm";
// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";

/**
 * 主渲染函数 Render名字必须存在
 * @constructor
 */
const Render = ()=>{
    let {Store} = InitCom.get()
    let {
        initData,
        userCardId,
        realName,
        next,
    } = Store
    useEffect(()=>{
        initData() // 初始化数据
    },[])

    return <div className='addNewBank'>
        {/* 头部 */}
        <Headers>绑定银行卡</Headers>
        <Main {...{
            next,userCardId,realName,
        }}/>
        <BottomColumn type='long' />
    </div>
}


export default {
    Render: observer(Render),
}

