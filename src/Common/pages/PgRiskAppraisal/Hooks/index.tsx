import React from 'react'
// 导入公共初始化函数
import {Init,InitPage} from 'Common/pages/Init'
import './style.scss'
// 页面及页面基础组件
import ItemBase from './item'
// 依赖的交互函数
import HandleBase from './handle'
import * as type from './type'

//配置项

export let ConfigBase = {
}



const Main=(Render:()=>JSX.Element):any=>{
  return (function () {
    return <Render/>
  })
}
export let InitCom = Init<type.InitComType>() //

export default InitPage({ Main, InitCom, ConfigBase, ItemBase, HandleBase })



