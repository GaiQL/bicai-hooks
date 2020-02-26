import React from 'react'
import './style.scss'
import {Init,InitPage} from 'Common/pages/Init'
import ItemBase from './item' //
import HandleBase from './handle'
import * as type from './type'

export enum ConfirmTit_Enum {
    update = '更新绑定银行卡',
    add = '绑定新银行卡'
}
export let ConfigBase = {
    minBankCardNum: 1,// 允许留存最低卡数
    maxBankCardNum: 5, // 允许绑定最多卡数
    bottomText: true, //
    confirmTit: ConfirmTit_Enum.update, // 配置底部按钮文字
    unbindFlag: false,
    BoundBankState: false,//carList为空的显示（目前只有中关村有显示）
    inspectBankCardBalance:false, // 是否需要开启中台校验
    bankCardText: '更新绑定银行卡',
    onePopupList: [ //当一张卡时底部展示当选项
        {
            type: 1,
            typeName: '解绑银行卡',
        }, {
            type: 2,
            typeName: '取消',
        }
    ],
    defaultPopupList: [ // 当多张卡时底部展示当选项
        {
            type: 0,
            typeName: '设为默认卡',
        },
        {
            type: 1,
            typeName: '解绑银行卡',
        }, {
            type: 2,
            typeName: '取消',
        }
    ],
    isTodoCode:false,
}

const Main=(Render:()=>JSX.Element):any=>{
    return (function () {
        return <Render/>
    })
}
export let InitCom = Init<type.InitComType>() //


export default InitPage({Main,InitCom,ConfigBase,ItemBase,HandleBase})

