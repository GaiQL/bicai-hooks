import React from 'react';
import './style.scss'
import { Native } from "Common/utils/appBridge"
import { session } from "Common/utils/store";
import { Headers, BcButton, BcBankMark } from 'Common/publicCommon/index'
import { Images } from "Common/config/index";
import { commonStore } from 'Common/pages/store'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { InitCom } from './index'


const rules:Map<number,any> = new Map([
    [1, ['存入结果', '/holdProductList']],
    [2, ['充值结果', '/bankDetail']],
    [3, ['提现结果', '/bankDetail']],
    [5, ['支取结果', '/holdProductList']]
])


function Render(): JSX.Element {
    let { Store, Config } = InitCom.get()

    let { status, btnText } = Config
    let title = rules.get(status || 0)[0]
    let { complate } = Store
    return <>
        <div className="buy-results">
            <Headers type="empty">{title}</Headers>
            <ResultTemplate />
            <BcButton onClick={() => { complate && complate() }}>{btnText}</BcButton>
            <BottomColumn type='long' />
        </div>
    </>
}

function ResultTemplate(): JSX.Element {
    let query: any = commonStore.query()
    return <>
        <section>
            <img src={Images.newresult} alt="" width="88" height="102" />
            <div className="status">{query.orderMsgTitle}</div>
            <div className="result" dangerouslySetInnerHTML={{ __html: query.orderMsgContent }}></div>
        </section>
    </>
}

export default {
    Render
}
