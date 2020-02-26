/**
 * 该文件初去Config配置参数全部一样
 *
 */
import React, {FC} from 'react'
// 导入公共初始化函数
import {Init,InitPage} from 'Common/pages/Init'
import './style.scss'
// 页面及页面基础组件
import ItemBase from './item'
// 依赖的交互函数
import HandleBase from './handle'
import * as type from './type'

/**
 * 初始静态页面状态配置参数，
 * 主要用于页面布局，固定交互，可配置文案
 * 原则是不依赖与数据动态改变的
 */
export let ConfigBase = {
    bindCardDescType: 1, // 1 显示绑卡数量 2 显示默认绑卡名称
    bindPhone: true, // 是否展示更换绑定手机号
    isShowBankCard: true,//是否显示已绑定银行卡文案
    bindBank: false,
    bindSales: false, //销户
    isShowText: true,
    password: false,//交易密码管理
    ifGetBankInit:false, // 11.28新增。额外选项拓展接口。用于动态渲染某些选项。（1128增加针对金城动态显示更新身份证入口）

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
export default InitPage({Main,InitCom,ConfigBase,ItemBase,HandleBase})

