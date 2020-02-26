import React, { FC } from 'react';
import { Init, InitPage } from 'Common/pages/Init'
import ItemBase from 'Common/pages/PgRedeem/Hooks/item'
import * as type from './type'

export let ConfigBase = {
    isShowRate: true,
    extraText: "全部",
    amountPayable: '可支取金额',
    tipText: '',
    needMsgCode: true, // 是否需要发送短信验证码
    sendCodeType: 0 // 0：银行发 1：比财发（3.0）
}

const Main = (Render:()=>JSX.Element ): FC => {
    return (function () {
        return <Render/>
    })
}
export let InitCom = Init<type.InitComType>()

export default InitPage({ Main, InitCom, ConfigBase, ItemBase })
