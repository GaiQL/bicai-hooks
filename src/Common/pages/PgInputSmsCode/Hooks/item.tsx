import React, {useEffect, useRef, useState,} from 'react'
import './style.scss'
import {Headers} from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer} from "mobx-react-lite"
// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";
import {BcYzmInput} from 'bc-bank-design'
import Main from 'Common/publicCommon/BcSMSCodeForm'
// 主渲染函数 Render名字必须存在
import {$Bus, BusName} from 'Common/Plugins/index'

function Render() {
    let {Store,Config} = InitCom.get()
    let {initUseDefaultGetCode} = Config
    let {initData, phoneNum,confirm,apiSendPhoneCodeFn,firstGetYzm} = Store
    const childRef:React.RefObject<any> = useRef(null)
    useEffect(() => {
        $Bus.addListener(BusName.resetSms, (flag) => {
            childRef.current ? childRef.current.resetFlag(flag) : null
        })
        initData()
        console.log('initUseDefaultGetCode',initUseDefaultGetCode);
        initUseDefaultGetCode ? apiSendPhoneCodeFn() : firstGetYzm()// 进入页面发送验证码
    }, [])
    return <div className='securityCode'>
        {/* 头部 */}
        <Headers>输入验证码</Headers>
        <Main {...{
            submit: confirm,
            sendCode:apiSendPhoneCodeFn,
            phone: phoneNum,
            time: 60,
            ref: childRef
        }
              }/>
        <BottomColumn type='long'/>
    </div>
}


export default {
    Render: observer(Render),
    confirm,

}

