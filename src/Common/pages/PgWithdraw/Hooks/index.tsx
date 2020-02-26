import React, { FC } from 'react';
import { Init, InitPage } from 'Common/pages/Init'
import ItemBase from './item'
import * as type from './type'

export let ConfigBase = {
    upperLimitOfBankCard: 5, // 最大绑定银行卡数，可配置
    getBalanceOnoff: false,
    isShowArrow: true,
    selectCardTitle: '选择银行卡',
    isShowDesc: false,
    isShowTip: true,
    tipShow: "预计2小时内到账，实际到账时间以银行最终处理时间为准",
    outhorTipShow: "",
    status : 0  // 0：银行发 1：比财发（3.0）
}

const Main = (Render: ()=>JSX.Element): FC => {
    return (function () {
        return <Render />
    })
}
export let InitCom = Init<type.InitComType>()

export default InitPage({ Main, InitCom, ConfigBase, ItemBase })
