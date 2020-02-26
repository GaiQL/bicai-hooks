import React, { FC } from 'react';
import { Init, InitPage } from 'Common/pages/Init'
import ItemBase from 'Common/pages/PgHoldProductList/Hooks/item'
import * as type from './type'

export let ConfigBase = {
    navList: ['持有中', '已支取'],
    className: 'head',
    leftColor: '#fff',
    alertText: '维护信息',
    navTopStr:''
}

const Main=(Render:()=>JSX.Element):FC=>{
    return function () {
        return <Render/>
    }
}
export let InitCom = Init<type.InitComType>()

export default InitPage({ Main, InitCom, ConfigBase, ItemBase })
