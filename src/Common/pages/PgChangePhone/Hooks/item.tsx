import React, {useEffect, useState, useContext} from 'react'
import './style.scss'
import {Modal} from 'antd-mobile'
import {imgSrc} from "Common/config/index";
import {commonStore} from "Common/pages/store"
import {apiBankAll} from 'Common/api/bank'

const apiBank = new apiBankAll.ApiBankV2()
import {BcInput, Headers} from 'Common/publicCommon/index'
import {BcButton} from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer} from "mobx-react-lite"

// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";
import Tool from 'Common/utils/Tool'


// 主渲染函数 Render名字必须存在
export let Render = () => {
    let {Store, ChangePhoneTitle} = InitCom.get()
    let { next, idCard, newPhone, showNote} = Store
    let query: {
        bandCardInfo:any
    }= commonStore.query()
    let bandCardInfo = JSON.parse(query.bandCardInfo)
    Store.initData(bandCardInfo)
    // let check = new RegExp(Tool.Regular.bcphone).test(newPhone) && new RegExp(Tool.Regular.cardID).test(idCard)
    let check = new RegExp(Tool.Regular.bcphone).test(newPhone)
    console.log('check',check);
    return <div className='ChangePhone'>
        {/* 头部 */}
        <Headers>更换手机号</Headers>
        <Main {
                  ...{
                      name:bandCardInfo.realName,
                    //   oldPhone:bandCardInfo.bankCardPhone
                    oldPhone: bandCardInfo.bankCardPhone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
                  }
              }/>
        {
            showNote ? ChangePhoneTitle() : null
        }
        <BcButton
            isDisabled={!check}
            className='ChangePhone-confirm' onClick={() => next()}>下一步</BcButton>
        <BottomColumn type='long'/>
    </div>
}

interface MainProps {
    name: string,
    oldPhone: string
}

const Main = observer((props: MainProps) => {
    console.log(props)
    let {Store} = InitCom.get()
    let {idCard, newPhone, handelName, handelNewPhone, handelOldPhone, showNote} = Store
    const FormMsg = {
        phoneErr: {
            val: "请输入11位手机号码",
            flag: "phone"
        },
        idCardErr: {
            val: "身份证号错误",
            flag: "idCard"
        },
        nameErr: {
            val: "姓名格式错误",
            flag: "name"
        },
        oldPhoneErr: {
            val: "姓名格式错误",
            flag: "name"
        }
    }
    let {name, oldPhone} = props
    return <div className='ChangePhone-identity'>
        {/* <BcInput
            title='真实姓名'
            errMsg={FormMsg.nameErr}
            placeholder='真实姓名'
            isDisabled={true}
            onFocus={() => true}
            value={name}
            max={18}
            type='text'
            className='BcInput_style'
            onChange={(val) => handelName(val)}
        > </BcInput> */}
        <BcInput
            title='原手机号'
            errMsg={FormMsg.oldPhoneErr}
            placeholder='原手机号'
            onFocus={() => true}
            isDisabled={true}
            value={oldPhone}
            type='number'
            max={11}
            className='BcInput_style'
            onChange={(val: any) => handelOldPhone(val)}
        > </BcInput>
        {/* <BcInput
            title='身份证号'
            errMsg={FormMsg.idCardErr}
            placeholder='请输入身份证号'
            onFocus={() => true}
            value={idCard}
            max={18}
            type='text'
            className='BcInput_style'
            onChange={(val) =(val)}
            allPlaceFocus={true}
        > </BcInput> */}
        <BcInput
            title='新手机号'
            errMsg={FormMsg.phoneErr}
            placeholder='请输入新手机号'
            onFocus={() => true}
            value={newPhone}
            type='number'
            className='border BcInput_style'
            max={11}
            onChange={(val: any) => handelNewPhone(val)}
            allPlaceFocus={true}
        > </BcInput>
    </div>
})
/**
 *
 * @constructor
 */
const ChangePhoneTitle = (): JSX.Element => {
    return <p className='ChangePhone-tip'>
        <span className="ChangePhone-title">温馨提示：</span>
        <span>更换手机号之前，请您确认新手机号与绑定银行卡的预留手机号相同，如果不同，请先更换绑定银行卡的预留手机号。</span>
    </p>
}

export default {
    Render: observer(Render),
    ChangePhoneTitle
}

