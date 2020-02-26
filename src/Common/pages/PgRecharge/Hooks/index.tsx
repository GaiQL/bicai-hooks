import React, { FC } from 'react';
import { Init, InitPage } from 'Common/pages/Init'
import ItemBase from 'Common/pages/PgRecharge/Hooks/item'
import * as type from './type'

export let ConfigBase = {
    isShowArrow: true,
    selectCardTitle: "选择银行卡",
    isShowHandleBtn: true,
    isShowMonthDesc: true,
    placeholder: '请输入充值金额',
    upperLimitOfBankCard: 5,
    status : 0  // 0：银行发 1：比财发（3.0）
}

const Main = (Render:()=>JSX.Element): FC => {
    return (function () {
        return <Render />
    })
}
export let InitCom = Init<type.InitComType>()

export default InitPage({ Main, InitCom, ConfigBase, ItemBase })
