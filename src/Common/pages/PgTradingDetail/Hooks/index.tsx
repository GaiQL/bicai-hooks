import React, { FC } from 'react';
import * as type from './type'
import { Init, InitPage } from 'Common/pages/Init'
import ItemBase from 'Common/pages/PgTradingDetail/Hooks/item'

export let ConfigBase = {
    headerArr: ['交易明细'],
    isTabdsiable: false
}

const Main = (Render:()=>JSX.Element): FC => {
    return (function () {
        return <Render/>
    })
}
export let InitCom = Init<type.InitComType>()

export default InitPage({ Main, InitCom, ConfigBase, ItemBase })
