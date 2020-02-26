import React from 'react';
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import { BcButton } from 'Common/publicCommon/index'
import { Images } from "Common/config/index";
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { observer } from 'mobx-react-lite'
import { InitCom } from './index'
import { commonStore } from "Common/pages/store"


let MSuccessTemplate = observer(SuccessTemplate)
let MButtonTemplate = observer(ButtonTemplate)

function Render(): JSX.Element {
    return <>
        <div className='redeem-success'>
            <Headers type="empty">支取结果</Headers>
            <MSuccessTemplate />
            <MButtonTemplate />
        </div>
    </>
}

// 按钮模板
function ButtonTemplate(): JSX.Element {
    let { Store } = InitCom.get()
    let { repurchase, lookAssets } = Store
    return <>
        <BcButton className="repurchase" onClick={() => repurchase && repurchase()}>收益不错，再来一单</BcButton>
        <BcButton className="look-assets" onClick={() => lookAssets && lookAssets()}>查看我的资产</BcButton>
        <BottomColumn type='long'></BottomColumn>
    </>
}
interface SuccessTemplateInter {
    amountDesc?: String,
    profitDesc?: String
}
// 成功模板
function SuccessTemplate(): JSX.Element {
    let { amountDesc, profitDesc }:SuccessTemplateInter = commonStore.query()
    return <>
        <div className='success'>
            <img src={Images.newsussess} alt="充值成功" className="icon-success" />
            <p className="text">支取成功</p>
            <p className='money'>{amountDesc}</p>
        </div>
        <div className="info">
            <span>支取利息</span>
            <span>{profitDesc}</span>
        </div>
    </>
}

export default {
    Render: observer(Render),
    MSuccessTemplate,
    MButtonTemplate
}
