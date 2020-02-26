import React, {useEffect, useState} from 'react'
import './style.scss'
import {Headers} from 'Common/publicCommon/index'
import {observer} from "mobx-react-lite"
import {InitCom} from './index'
import { commonStore } from "Common/pages/store"
// 主渲染函数 Render名字必须存在
export let Render = () => {
    let [protoolText,setProtoolText] = useState('')
    let { openAnAccountAgreementContentFn } = InitCom.get().Store
    useEffect(()=>{
        let query:any = commonStore.query()
        openAnAccountAgreementContentFn && openAnAccountAgreementContentFn( { agreementCode: JSON.parse(query.itemAgreement).agreeOnlineFlag }).then( res => {
            setProtoolText(res.data.protoolText)
        })
    },[])
    return (
        <div>
            <div className='PgDeal'>
                <Headers>服务协议</Headers>
                <div className='PgDeal-txt' dangerouslySetInnerHTML={{__html:`<div>${protoolText}</div>`}}></div>
            </div>
        </div>
    )
}


export default {
    Render: observer(Render),
}

