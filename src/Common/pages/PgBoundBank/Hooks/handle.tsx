import React,{useEffect, useState,useContext} from "react";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import {commonStore} from "Common/pages/store"
import {session} from 'Common/utils/store'
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import {InitCom} from './index'
/**
 * 获取银行卡信息
 */
let useApiBankCard=()=>{
    let [bandCardInfo,setBandCardInfo] = useState({}) //
    useEffect( ()=>{
        (async ()=>{
            const data = {
                bizType: BIZ_TYPE.moreService,
                transAmt: "",
                queryType: '0',
                prdIndexId: ""
            }
            let res:any = await apiBank.apiBandCard(data)
            setBandCardInfo( res )
        })()
        return ()=>{

        }
    },[])


    return [{bandCardInfo}]
}

/**
 * 银行卡操作：前中台校验，校验账户是否能够去进行银行卡的操作。如：卡内有余额
 */
let changeBankCheck = async () => {
    let {Config} = InitCom.get()
    const {openAlert} = commonStore
    let {page}: any = commonStore.query() || {}
    if (!page) page = 'service'
    if (Config.inspectBankCardBalance) { // 是否需要开启中台校验
        try {
            // 校验接口
            await apiBank.changeBankCardFlag({})
            return Promise.resolve()
        } catch (err) {
            if (err.innerCode == INNER_CODE.CancelAndDoWithdraw) {
                session.set('withdrawType', 'boundBank')
                // 去提现
                openAlert('绑卡失败', err.popMsg, [
                    {text: '取消', onPress: () => console.log('取消'), style: {color: "#999999"}},
                    {text: '去提现', onPress: () => {
                            commonStore.Hash.history.push('/withdraw?page=boundBank&type=' + page)
                        }},
                ])
            }
            if (err.innerCode == INNER_CODE.CancelAndDoRedeem) {
                // 支取 去持有中支取吧
                openAlert('绑卡失败', err.popMsg, [
                    {text: '取消', onPress: () => console.log('取消'), style: {color: "#999999"}},
                    {text: '去支取', onPress: () => {
                            commonStore.Hash.history.push('/bankDetail?page=boundBank&type=' + page)
                        }},
                ])
            }
            return Promise.reject()
        }
    } else {
        return Promise.resolve()
    }

}

/**
 * 点击换绑卡
 */
let useChangeBankCard = async (props: { bandCardInfo: any; bankCardPhone: any; }) => {
    let {bandCardInfo,bankCardPhone} = props
    let {changeBankCheck,Config}= InitCom.get()
    const {openAlert} = commonStore
    await changeBankCheck()
    let {cardList}:any = bandCardInfo
    if (cardList.length >= Config.maxBankCardNum) {
        openAlert('提示', '您当前绑定的银行卡数量已达到上限，请解绑银行卡后再进行绑定', [
            {text: '确定', onPress: () => console.log('确定')},
        ])
    } else {
        // page
        commonStore.Hash.history.push('/changeBank?page=boundBank&bankCardPhone=' + `${bankCardPhone}` + "&showFlag=" + true );
    }
    return false
}



let Handle ={
    useApiBankCard,
    changeBankCheck,
    useChangeBankCard
}
export default Handle
