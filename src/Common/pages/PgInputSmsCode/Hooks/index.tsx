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
 * 页面基础配置
 * 初始静态页面状态配置参数，
 * 主要用于页面布局，固定交互，可配置文案
 * 原则是不依赖与数据动态改变的
 */

export let ConfigBase = {
    phoneType: 'bankCardPhone', // 验证码发给谁验证码
    sendCodeStatus: '0', // 0：银行发 1：比财发（3.0）
    sendCodeTimes: 60,
    initUseDefaultGetCode: true,// 初始化页面时是否使用默认的发送验证码 原来的getCode字段
    status:0
}

const Main=(Render:()=>JSX.Element):FC=>{
    return function () {
        return <Render/>
    }
}
/**
 * 初始化页面公共资源，方便每个模块统一调用。
 */
export let InitCom = Init<type.InitComType>()

/**
 * 初始化页面
 */
export default InitPage({Main,InitCom,ConfigBase,ItemBase,HandleBase})

