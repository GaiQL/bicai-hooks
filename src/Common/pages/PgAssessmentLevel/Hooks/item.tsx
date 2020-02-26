import React, {useEffect, useState, useContext} from 'react'
import './style.scss'
import {Modal, Toast} from 'antd-mobile'
import {imgSrc} from "Common/config/index";
import {commonStore} from "Common/pages/store"
import {apiBankAll} from 'Common/api/bank'
const { openAlert } = commonStore
import { session } from "Common/utils/store";
import { Native } from "Common/utils/appBridge"

const apiBank = new apiBankAll.ApiBankV2()
import {Headers} from 'Common/publicCommon/index'
import {BcButton} from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer,useLocalStore, useObserver} from "mobx-react-lite"
import {GetPrdInfo} from 'Common/pages/public/getPrdInfo/store'

// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";
// 主渲染函数 Render名字必须存在
export let Render = () => {
    let {continueBuyBtn,anewAppraisalBtn} = InitCom.get()
    return (
        <div className='riskContent'>
            {/* 头部 */}
            <Headers>风险测评</Headers>
            {/* 内容区 */}
            <section>
                <div className='appraisalContent'>
                    <p className='appraisal_title'>您的测评级别</p>
                    {
                        // TODO 这个从3.0迁移一下
                        // this.renderState()
                    }
                    {/* 继续购买 */}
                    <div className='continue-confirm'>
                        <BcButton isDisabled='' onClick={continueBuyBtn}>继续购买</BcButton>
                    </div>
                    {/* 重新测评 */}
                    <div className='anew-confirm'>
                        <BcButton isDisabled='' className='ant-btn-dashed' onClick={anewAppraisalBtn}>重新测评</BcButton>
                    </div>
                </div>

            </section>
            <BottomColumn type="long" />
        </div>
    )
}

const  continueBuyBtn = async()=> {
    if (Native.isApp()) {
        try {
            // todo 需要判断app是购买开户来的还是其他情况。
            // 分三种
            // 购买开户去购买：
            // 银行资产开户去电子账户 ？
            // 二类户去开户关掉页面 ？
            Native.closeWebView()
            // Native.openInfoSuccess({closeState:1,orgId:ORG_ID})
        } catch (e) {
            Toast.info('app测评完成后跳转页')
        }

    } else {
        if (session.get('proInfo') && session.get('proInfo').ID) {
            let params = {
                prdIndexId: session.get('proInfo').ID
            }
            console.log('成功')

            await apiBank.apiQryLoginStatus(params).then((res: any) => {
                if (res.hasGrade == 101) {
                    openAlert('购买失败', '您的风险评估类型不符合该产品风险等级要求，无法购买', [
                        { text: '取消', onPress: () => { console.log("cancel") } },
                        { text: '重新测评', onPress: () => { commonStore.Hash.history.replace('/riskAppraisal') } },
                    ])
                } else {
                    if (session.get('proInfo')) {
                        commonStore.Hash.history.push(`/buy?proId=${session.get('proInfo').ID}`)
                    } else {
                        if (session.get('proId')) {
                            // TODO 本地用 ???
                            let {initData} = new GetPrdInfo()
                            initData({ ID: session.get('proInfo') })
                            commonStore.Hash.history.push(`/buy?proId=${session.get('proInfo')}`)
                        } else {
                            // 其他情况去银行资产
                            commonStore.Hash.history.push(`/bankDetail`)
                        }
                    }
                }
            })
        } else {
            commonStore.Hash.history.push(`/bankDetail`)
        }
        console.log('进行中')

    }

}
const anewAppraisalBtn=() =>{
    for (let item in window.sessionStorage) {
        if (item.includes('itemNum')) {
            session.remove(item)
        }
    }
    commonStore.Hash.history.push('/riskAppraisal')
}
export default {
    continueBuyBtn,
    anewAppraisalBtn,
    Render: observer(Render),
}

