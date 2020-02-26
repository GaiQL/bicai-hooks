/**
 * 银行卡form表单
 */
import {useEffect, useState} from "react";
import { BcButton} from 'Common/publicCommon/index'
import React from "react";
import {commonStore} from "Common/pages/store"
import {PersonInfoInterface,BankCardInfoIntertface, PhoneInputInterface, BankCardInfo, PersonInfo, PhoneInput} from './componet'

export interface MainInterface {
    next: Function,
    phone?: string, // 暂时没有用
    getValue?:Function, // 将表单所有数据抛出
    Ext_BankCardInfo?: (props?: any) => JSX.Element, // 用于组件重新
    Ext_PhoneInput?: (props: PhoneInputInterface) => JSX.Element // 用于组件重写
}

type mainType = PersonInfoInterface & PhoneInputInterface & MainInterface & BankCardInfoIntertface
export default function Main(props: mainType) {
    let { userCardId, realName,next, Ext_BankCardInfo, Ext_PhoneInput,getValue} = props
    let [canClick,setCanClick] = useState(false)
    let [bankCardInfo,setBankCardInfo] = useState({}) // 银行卡号
    let [cardNo,setCardNo] = useState('') // 银行卡号
    let [cardNoFlag,setCardNoFlag] = useState(false) // 银行卡号 true为通过
    let [phoneNo,setPhoneNo] = useState(false) // 手机号
    let [phoneNoFlag,setPhoneNoFlag] = useState(false) // 手机号校验 true为通过
    // 获取银行卡
    function getCardNo(val: React.SetStateAction<string>, flag: React.SetStateAction<boolean>) {
        setCardNoFlag(flag)
        setCardNo(val)
    }
    //
    function getCardInfo(bank: React.SetStateAction<{}>) {
        console.log(bank)
        setBankCardInfo(bank)
    }
    // 获取手机号
    function getPhone(val: React.SetStateAction<boolean>, flag: React.SetStateAction<boolean>){
        setPhoneNoFlag(flag)
        setPhoneNo(val)
    }
    // 用于校验文本框
    useEffect(()=>{
        // 用于数据会传
        getValue && getValue({
            cardNo,
            phoneNo,
            bankCardInfo
        })
        let ifCanClick = cardNoFlag && phoneNoFlag
        if(ifCanClick){
            setCanClick(true)
        }else {
            setCanClick(false)
        }
    },[cardNo,phoneNo])

    // 组装props参数
    let comProps = {
        ...props,
        getCardNo,
        getPhone,
        getCardInfo
    }

    return <>
        {/*个人信息  */}
        <PersonInfo userCardId={userCardId} realName={realName}/>
        {/*表单 银行卡 + */}
        <div className='addNewBank-card'>
            {
                Ext_BankCardInfo ? <Ext_BankCardInfo {...comProps}/> : <BankCardInfo {...comProps}/>
            }
            {
                Ext_PhoneInput ? <Ext_PhoneInput {...comProps}/> : <PhoneInput {...comProps}/>
            }
        </div>
        <p className='addNewBank-check-bank'><span onClick={() => {
            commonStore.Hash.history.push('/bankList')
        }}>查看支持银行</span></p>
        {/* 下一步 */}
        <div className='AddNewBank-confirm'>
            <BcButton
                isDisabled={!canClick}
                onClick={() => {
                    next({
                        cardNo,
                        phoneNo,
                        bankCardInfo
                    })
                }}
            >下一步</BcButton>
        </div>
    </>
}


