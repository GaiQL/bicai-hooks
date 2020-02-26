import React, { FC } from 'react';
import { Init, InitPage } from 'Common/pages/Init'
import ItemBase from 'Common/pages/PgBuy/Hooks/item'
import * as type from './type'

export let ConfigBase = {
    isShowArgument: true,
    isSpecialAgreement: false,
    agreementPrdIndexId: true,
    isExtraCopy: false,
    isEdit: true,
    status : 0 , // 0：银行发 1：比财发（3.0）
    defaultIsRead:'' // TODO ??这个参数是干啥的？
}
const Main = (Render:()=>JSX.Element): FC => {
    return (function () {
        return <Render  />
    })
}

export let InitCom = Init<type.InitComType>()

export default InitPage({ Main, InitCom, ConfigBase, ItemBase })
