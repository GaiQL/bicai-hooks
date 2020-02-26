import React, { useEffect, useRef, useState, } from 'react'
import './style.scss'
import { Headers } from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { observer } from "mobx-react-lite"
import { Modal } from 'antd-mobile';

// 页面共享模块 用于引入 Config,Store,Handle,Item
import { InitCom } from "./index";
import { BcYzmInput } from 'bc-bank-design'
import Main from 'Common/publicCommon/BcSMSCodeForm'
// 主渲染函数 Render名字必须存在
import { SmsCodeType } from 'Common/config/params.enum'
import { $Bus, BusName } from 'Common/Plugins/index'

let MSuccessMessage = observer(SuccessMessage)

function Render() {
    let {Store,confirm,sendCodeFn} = InitCom.get()
    let {initData, phone, isShow} = Store
    const childRef = useRef<any>(null)
    const initSendCode= sendCodeFn('init')
    const againSendCode= sendCodeFn('again')
    useEffect(() => {
        $Bus.addListener(BusName.resetSms, (flag) => {
            childRef.current ? childRef.current.resetFlag(flag) : null
        })
        initData()
        // $Bus.emit(BusName.resetSms,true)
        initSendCode()// 进入页面发送验证码
    }, [])
    return <div className='securityCode'>
        {/* 头部 */}
        <Headers>输入验证码</Headers>
        <Main {...{
            submit: confirm,
            sendCode: againSendCode,
            phone: phone,
            time: 60,
            ref: childRef
        }
        } />
        <MSuccessMessage isShow={isShow}/>
        <BottomColumn type='long' />
    </div>
}

// 成功提示框
function SuccessMessage(props: { isShow: boolean }): JSX.Element {
    let {isShow} = props;
    let {Store} = InitCom.get()
    let { modalType, modalContent, time} = Store
    console.log(time, 'timd333333333time')
    return <>
        <Modal
            className='success-module'
            visible={isShow}
            transparent
            maskClosable={false}
            title={<img src={require('Common/assets/images/tijiaochenggong@2x.png')} alt=""/>}
        >
            <div className='success-conent'>
                <p className='title'>{modalType && modalContent[modalType].title}</p>
                <p className='text'><span>{time}</span>{modalType && modalContent[modalType].text}</p>
            </div>
        </Modal>
    </>
}
const changeBankSuccess = (res: any, next: any)=>{
    let {Store} = InitCom.get()
    let {changeModleState, changeModalType} = Store
    changeModalType('changeBank') // 更改modal内容显示
    changeModleState(next) // 显示modal，3秒后自动关闭，并执行传入的函数，可不传
}

const changePhoneSuccess = (res: any, next: any)=>{
    let {Store} = InitCom.get()
    let {changeModleState, changeModalType} = Store
    changeModalType('changePhone') // 更改modal内容显示
    changeModleState(next) // 显示modal，3秒后自动关闭，并执行传入的函数，可不传
}


function ErrorFn() {
    
}

/**
 * 方便重写
 * @param bankInfo
 * @param bankCardType 对page字段的判断  是添加还是换绑
 */
export const bankHandle = (bankInfo: { newBank: string; oldCardInfo?: string; validateCodeSerialNum?: any; yzm: any }, bankCardType: SmsCodeType) => {
    let { changeBank,addBank} = InitCom.get()
    if (bankCardType == SmsCodeType.changeBankCard) {
        changeBank(bankInfo, {extra:()=>({}), success: changeBankSuccess, error: ErrorFn})
    }
    if (bankCardType == SmsCodeType.updatePhone) {
        addBank(bankInfo)
    }
}
const confirm = (yzm: any) => {
    let {Store, bankHandle, changePhone} = InitCom.get()
    let {type, bankInfo} = Store.getQuery()
    bankInfo.validateCodeSerialNum = Store.validateCodeSerialNum || ''
    bankInfo.yzm = yzm
    if (!yzm) return 'yzm is not'
    if (type == SmsCodeType.updatePhone) {

        changePhone(bankInfo, {extra:()=>({}),success: changePhoneSuccess})

    } else {
        bankHandle(bankInfo, type)
    }
}

/**
 *
 * @param type:init为进入页面时请求的接口。again指的是重复发送的。
 * 大多银行两者是一个接口。但是有的进入页面前就已经发送完成验证码了。该函数就可以重写
 */
function sendCodeFn(type: 'init' | 'again') {
    console.log(type, "0000")
    let { Store } = InitCom.get()
    let { bizType } = Store.getQuery()
    console.log(bizType, "bizTypebizType")
    return function () {
        Store.apiSendPhoneCodeFn(bizType)
    }
    // Eg:
    // if(type == 'init'){
    //     // 初始如不需要发送
    //     $Bus.emit(BusName.resetSms,true)
    //     return
    // }
    // if(type == 'again'){
    //     return function () {
    //         Store.apiSendPhoneCodeFn(bizType)
    //     }
    // }

}


export default {
    Render: observer(Render),
    confirm,
    bankHandle,
    sendCodeFn
}

