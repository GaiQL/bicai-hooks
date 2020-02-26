import React, {useEffect, useState, useContext} from 'react'
import './style.scss'
import {imgSrc} from "Common/config/index";

import {Headers} from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer} from "mobx-react-lite"
// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";
import {descFn} from 'Common/publicCommon/util'

// 主渲染函数 Render名字必须存在
export let Render=() =>{
    let {Store} = InitCom.get()
    let { result ,initData} = Store
    useEffect(()=>{
        initData()
    },[])
    let { supportBankList, supportBankRemarks } = result
    return <div className='BankList'>
        {/* 头部 */}
        <Headers>支持银行</Headers>
        <div className='BankList-list'>
            {
                supportBankList && supportBankList.map((bank:Record<string,any>, index:number) => {
                    let {bankCardQuotaDescDto} = bank
                    let {dayDesc,monthDesc} = descFn(3,bankCardQuotaDescDto)
                    let withdrawDesc = descFn(4,bankCardQuotaDescDto)
                    return <div className='BankList-list-item' key={index}>
                        <p>
                            <img src={imgSrc + bank.bankLogoUrl} alt="" />
                        </p>
                        <p>
                            <span>{bank.bankName}</span>
                            {/*有的话就展示*/}
                            {
                                dayDesc
                                    ? <span>{dayDesc} </span>
                                    : null
                            }
                            {
                                monthDesc
                                    ? <span>{monthDesc} </span>
                                    : null
                            }
                            {/*提现有的话就展示*/}
                            {
                                withdrawDesc.dayDesc
                                    ? <span>{withdrawDesc.dayDesc} </span>
                                    : null
                            }
                            {
                                withdrawDesc.monthDesc
                                    ? <span>{withdrawDesc.monthDesc} </span>
                                    : null
                            }
                        </p>
                    </div>
                })
            }

        </div>
        {
            supportBankRemarks ? <div className="footer" dangerouslySetInnerHTML={{ __html: supportBankRemarks }} /> : null
        }
        <BottomColumn type='long'/>
    </div>
}

export default {
    Render: observer(Render),
}

