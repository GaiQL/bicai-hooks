import React, { createContext } from 'react'
import ItemBase from './item' //
import HandleBase from './handle' //
import StoreBase from './store' //
import * as type from './type'
import { Init, InitPage } from 'Common/pages/Init'
//配置项


interface ConfigInterface {
    [propsName:string]:any
}
export let ConfigBase:ConfigInterface= {
    // nextType:'openInputSmsCode', // 该变量某些情况会动态改变 放到store里了
    ISex: true,
    showFlag: false,
    IBank: true, // 银行卡
    IProf: true, //职业
    Industry: false, // 行业
    isRealName: true,
    INation: true,//民族
    IAddress: true,
    Idisabled: true,//
    ILiveAddress: false, // 居住地址
    ifUploadIDCardImgBase64:false, //
    isIDdate:false, //身份证有效期
    isJump:true,//联系地址跳不跳转
    btnText:"立即开户",
    isIndustryVal:false //有没有行业
}



const Main = (Render: ()=>JSX.Element): any => {
    return (function (props:any) {
        return <Render {...props}/>
    })
}
export let InitCom = Init<type.InitComType>() //

export default InitPage({ Main, InitCom, ConfigBase, ItemBase, HandleBase })



