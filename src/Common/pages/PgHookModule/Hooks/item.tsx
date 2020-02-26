import React, {useEffect, useState, useContext} from 'react'
import './style.scss'
import {Modal} from 'antd-mobile'
import {imgSrc} from "Common/config/index";
import {commonStore} from "Common/pages/store"
import {apiBankAll} from 'Common/api/bank'

const apiBank = new apiBankAll.ApiBankV2()
import {Headers} from 'Common/publicCommon/index'
import {BcButton} from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer,useLocalStore, useObserver} from "mobx-react-lite"

// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";

// 主渲染函数 Render名字必须存在
export let Render = () => {
    let {Store} = InitCom.get()
    Store = useLocalStore(()=>Store)
    useEffect(()=>{
        // Store.getMook()
    },[])
    return (
        <div>
            <div>
                <span>a:{Store.a}</span>
                <button onClick={() => {
                    Store.add_a()
                }}>add_a:+
                </button>
            </div>
            <div>
                <span>b:{Store.b}</span>
                <button onClick={() => {
                    Store.add_b()
                }}>add_b:+
                </button>
            </div>
            <p>a+b:{Store.num}</p>
            <p>watch:{Store.watch}</p>

            <div>
                <p>{Store.result.toString()}</p>
                {/*<button onClick={() => {*/}
                    {/*// Store.getMook()*/}
                {/*}}>ajax*/}
                {/*</button>*/}
            </div>
        </div>
    )
}


export default {
    Render: observer(Render),
}

