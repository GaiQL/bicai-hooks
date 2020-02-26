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
    questionData: [
        {
            "questionNum": "1",
            "questionContent": "您的年龄介于：",
            "options": [
                {
                    "optionNum": "1",
                    "option": "18-30岁",
                    "score": "-2"
                },
                {
                    "optionNum": "2",
                    "option": "31-50岁",
                    "score": "0"
                },
                {
                    "optionNum": "4",
                    "option": "65岁以上",
                    "score": "-10"
                }
            ]
        },
        {
            "questionNum": "2",
            "questionContent": "您的家庭可支配年收入为（折合人民币）？：",
            "options": [
                {
                    "optionNum": "1",
                    "option": "5万元以下",
                    "score": "0"
                },
                {
                    "optionNum": "2",
                    "option": "5—20万元",
                    "score": "2"
                },
                {
                    "optionNum": "3",
                    "option": "20—50万元",
                    "score": "6"
                },
                {
                    "optionNum": "4",
                    "option": "50—100万元",
                    "score": "8"
                },
                {
                    "optionNum": "5",
                    "option": "100万元以上",
                    "score": "10"
                }
            ]
        },
        {
            "questionNum": "3",
            "questionContent": "在您每年的家庭可支配收入中，可用于金融投资（储蓄存款除外）的比例为？：",
            "options": [
                {
                    "optionNum": "1",
                    "option": "小于10%",
                    "score": "2"
                },
                {
                    "optionNum": "2",
                    "option": "10%至25%",
                    "score": "4"
                },
                {
                    "optionNum": "3",
                    "option": "25%至50%",
                    "score": "8"
                },
                {
                    "optionNum": "4",
                    "option": "大于50%",
                    "score": "10"
                }
            ]
        }
    ]
}



const Main=(Render:()=>JSX.Element):any=>{
    return (function () {
        return <Render/>
    })
}
export let InitCom = Init<type.InitComType>() //

export default InitPage({ Main, InitCom, ConfigBase, ItemBase, HandleBase })



