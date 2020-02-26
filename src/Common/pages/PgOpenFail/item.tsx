import React, {useEffect, useState, useContext} from 'react'
import './style.scss'
import {observer,useLocalStore, useObserver} from "mobx-react-lite"
import { Images, imgSrc } from 'Common/config/index'
import { BcButton } from 'Common/publicCommon/index'
// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";
import { Headers } from 'Common/publicCommon/index'
import { commonStore } from "Common/pages/store"

// 主渲染函数 Render名字必须存在
export let Render = () => {
    let {Store} = InitCom.get()
    Store = useLocalStore(()=>Store)
    useEffect(()=>{
        // Store.getMook()
    },[])
    return (
       <div className="openFail">
           <Headers type="empty">开户失败</Headers>
           <img src={Images.shibai} alt="" style={{width:"80px",height:"80px"}}/>
           <div className="title">
            <p className="fail">开户失败</p>
            <p className="failCont">失败原因：XXXXXXXXXX</p>
           </div>
           <BcButton onClick={() => {
                commonStore.Hash.history.replace('/openPerfection')
               
        }

        } className='openFlow-confirm'>重新开户</BcButton>
       </div>
    )
}


export default {
    Render,
}

