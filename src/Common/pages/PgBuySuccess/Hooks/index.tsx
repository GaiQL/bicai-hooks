import React, { FC } from 'react';
import { Init, InitPage } from 'Common/pages/Init'
import ItemBase from './item'
import * as type from './type'

export let ConfigBase = {

}

const Main = (Render:()=>JSX.Element): FC => {
    return (function () {
        return <Render/>
    })
}
export let InitCom = Init<type.InitComType>()

export default InitPage({ Main, InitCom, ConfigBase, ItemBase })
