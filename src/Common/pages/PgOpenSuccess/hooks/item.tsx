import React, { useEffect, useState, useContext } from 'react'
import { Headers } from 'Common/publicCommon/index'
import { BcButton } from 'Common/publicCommon/index'
import { InitCom } from "./index";
import { Images} from "Common/config/index";
import { session } from "Common/utils/store";
import { BottomColumn } from 'Common/publicCommon/index';
import { ChangeBackground } from "./component"
import { observer, useLocalStore, useObserver } from "mobx-react-lite"
import "../style.scss"
// 主渲染函数 Render名字必须存在
export let Render = () => {
    let { Store, Config } = InitCom.get()
    let { orgLogo, orgName } = JSON.parse(session.get("bankData"))
    let { goNext }: any = Store
    let {
        successText,
        successUserName,
        successUserCardId,
        successCardInDate,
        successrBankCardPhone,
        successAddress,
        successName,
        successOpenbank
    } = Config
    let openSuccessData: any = session.get('openSuccessData')
    let {
        address,
        bankCardNum,
        bankCardPhone,
        bankElecAccountNum,
        bankName,
        cardExpireDate,
        realName,
        userCardId,
        occupation,
    }: any = openSuccessData || {}
    return (
        <div className='openSuccess'>
            {/* 头部 */}
            <Headers type="empty">开户成功</Headers>
            <div className='openSuccess-finish'>
                <p className='openSuccess-finish-img'><img src={Images.successBlue} alt="" /></p>
                <p className='openSuccess-finish-txt'>恭喜您，开户成功！</p>
                {/* <p className='openSuccess-finish-tit'>请妥善保管好您的电子账户信息</p> */}
                {/* <p className='openSuccess-finish-bankNum'>
                    <span>电子账户卡号</span>
                    <span>{bankElecAccountNum ? bankElecAccountNum.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ') : ''}</span>
                </p> */}
            </div>
            <div className='openSuccess-info'>
                < ChangeBackground
                    num={bankCardNum}
                    bankName={orgName}
                />
            </div>
            <BcButton className='openSuccess-finish-confirm'
                onClick={() => {
                    goNext()
                }}
            >
                {successText}
            </BcButton>
            <BottomColumn type='long' />
        </div>
    )
}

//姓名模块
export let RenderUserName = (props: { realname: any; flag?: boolean | undefined; }) => {
    let { realname, flag = true } = props
    return flag ? <p><span>姓名</span><span>{"" || (realname ? ('*' + realname.substr(1)) : "")}</span></p> : null
}

//身份证号模块
export let RenderUserCardId = (props: { userCardId: any; flag?: boolean | undefined; }) => {
    let { userCardId, flag = true } = props
    return flag ? <p>
        <span>身份证号</span><span>{userCardId ? (userCardId.substr(0, 1) + '****************' + userCardId.substr(-1)) : ''}</span>
    </p> : null
}

// //身份证有效期模块
export let RenderCardInDate = (props: { cardExpireDate: any; flag?: boolean | undefined; }) => {
    let { cardExpireDate, flag = true } = props
    return flag ? <p><span>身份证有效期</span><span>{cardExpireDate ? cardExpireDate : ''}</span></p> : null
}

//联系方式模块
export let RenderBankCardPhone = (props: { bankCardPhone: any; flag?: boolean | undefined; }) => {
    let { bankCardPhone, flag = true } = props
    return flag ? <p>
        <span>联系方式</span><span>{bankCardPhone ? (bankCardPhone.substr(0, 3) + '******' + bankCardPhone.substr(-2)) : ''}</span>
    </p> : null
}

//联系地址模块
export let RenderAdress = (props: { address: any; flag?: boolean | undefined; }) => {
    let { address, flag = true } = props
    return flag ?
        <p className='openPerfection-info-address'><span>联系地址</span><span>{address ? address : ''}</span></p> : null
}

//银行卡模块
export let RenderOpenBank = (props: { openBank: any; bankAccountNo: any; flag?: boolean | undefined; }) => {
    let { openBank, bankAccountNo, flag = true } = props
    return flag ?
        <p><span>银行卡</span><span>{openBank ? openBank + `(${bankAccountNo.substr(-4)})` : ''}</span></p> : null
}

//职业模块
export let RenderOccupation = (props: { occupation: any; flag?: boolean | undefined; }) => {
    let { occupation, flag = false } = props
    return flag ? <p><span>职业</span><span>{occupation ? occupation : ''}</span></p> : null
}



export default {
    Render: observer(Render),
    RenderUserName: observer(RenderUserName),
    RenderOccupation: observer(RenderOccupation),
    ChangeBackground: observer(ChangeBackground)
}

