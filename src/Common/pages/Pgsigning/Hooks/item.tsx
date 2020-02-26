import './style.scss'
import help from 'Common/utils/Tool'
import { commonStore } from "Common/pages/store"
import Headers from 'Common/publicCommon/Headers'
import React, { useEffect, useState } from 'react'
import { BcButton, BottomColumn } from 'Common/publicCommon/index'




function Render(): JSX.Element {
    let [Card, setCard] = useState<any>({})
    let [source, setsource] = useState('')
    useEffect(() => {
        let query: any = commonStore.query()
        setCard(JSON.parse(query.defaultCard))
        setsource(query.source)
    }, [])

    const toGoNextStart = async() => {
        let query: any = commonStore.query()
        commonStore.Hash.history.replace(`/signingSmsCode?phoneNum=${Card.bankCardPhone}&bankName=${Card.bankName}&bankCardNum=${Card.bankCardNum}&defaultCard=${query.defaultCard}&source=${source}`)
    }
    return <>
        <div className="signing-wrap">
            <Headers>代收通道签约</Headers>
            <div className="signing-msg-content">
                <div className="signing-msg-bankname">
                    <div className="signing-msg-bankname-title">
                        付款账户
            </div>
                    <div className="signing-msg-bankname-details">
                        {Card.bankName}{Card.lastFourCardNo}
                    </div>
                </div>
                <div className="signing-msg-phone">
                    <div className="signing-msg-phone-title">
                        预留手机号
            </div>
                    <div className="signing-msg-phone-details">
                        {help.fromatMobileFilter(Card.bankCardPhone)}
                    </div>
                </div>
            </div>
            <BcButton isDisabled={false} onClick={() => {
                toGoNextStart()
            }} >下一步</BcButton>
            <BottomColumn type='long'></BottomColumn>
        </div>
    </>
}

export default {
    Render
}