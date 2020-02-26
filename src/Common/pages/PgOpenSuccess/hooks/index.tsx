/**
 * 该文件初去Config配置参数全部一样
 *
 */
import React from 'react'
// 导入公共初始化函数
import { Init, InitPage } from 'Common/pages/Init'
// 页面及页面基础组件
import ItemBase from './item'
// 依赖的交互函数
import HandleBase from './handle'
import * as type from './type'

/**
 * 页面基础配置
 * 初始静态页面状态配置参数，
 * 主要用于页面布局，固定交互，可配置文案
 * 原则是不依赖与数据动态改变的
 */
export let ConfigBase = {
    successText: "完成",
    successName: false,
    industryName: false,// 行业
    successAddress: true,
    successOpenbank: true,
    successCardInDate: true,
    successrBankCardPhone: true,
    successUserCardId: true,
    successUserName: true,

}
const Main=(Render:()=>JSX.Element):any=>{
    return (function () {
        return <Render/>
    })
}

export let InitCom = Init<type.InitComType>()

export default InitPage({ Main, InitCom, ConfigBase, ItemBase, HandleBase })

