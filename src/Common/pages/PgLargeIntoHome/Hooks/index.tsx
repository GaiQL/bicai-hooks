/**
 * 该文件初去Config配置参数全部一样
 *
 */
import React, {FC} from 'react'
// 导入公共初始化函数
import {Init,InitPage} from 'Common/pages/Init'
// 页面及页面基础组件
import ItemBase from './item'
import * as type from './type'

/**
 * 初始静态页面状态配置参数，
 * 主要用于页面布局，固定交互，可配置文案
 * 原则是不依赖与数据动态改变的
 */
export let ConfigBase = {
    /*
        1 - 电子账号可绑定多张银行卡  添加
        2 - 电子账号只能绑定1张银行卡  更换
        3 - 电子账号只能绑定1张银行卡且不可更换银行卡
    */
    tiedcardType : 2,
}
const Main=(Render:()=>JSX.Element):FC=>{
    return function () {
        return <Render/>
    }
}
/**
 * 初始化页面公共资源，方便每个模块统一调用。
 * 设置方法：InitCom.set(init)：
 *     init包含：Config、Store实例，Handle和Item扁平化
 *     init = {
 *              Config:{},
 *              Store:new Store(),
 *              ...Handle,
 *              ...Item
 *             }
 * (主要)获取方法：InitCom.get()：组件或者方法调用是通过返回initCom
 *        const {Config,Store,...Handle,...Item} = initCom
 *        文件handle.tx和Item.tsx里的暴露的函数或者组件，直接引入
 *        为了方便引入智能认证编写type.d.ts文件
 * InitComType：ts配置文件，方便引入时提示
 */
export let InitCom = Init<type.InitComType>()


/**
 * 初始化页面，将InitCom，ConfigBase，ItemBase，HandleBase初始化并挂载到页面主体Main上
 * 返回整体的Main页面函数
 */
export default InitPage({Main,InitCom,ConfigBase,ItemBase})








