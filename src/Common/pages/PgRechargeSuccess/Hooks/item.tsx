import React from 'react';
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import { BcButton } from 'Common/publicCommon/index'
import { Images } from "Common/config/index";
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { commonStore } from "Common/pages/store"
import { observer } from 'mobx-react-lite'
import { InitCom } from './index'
import { session } from 'Common/utils/store'


let MSuccessTemplate = observer(SuccessTemplate)
let MButtonTemplate = observer(ButtonTemplate)

function Render(): JSX.Element {
    return <>
        <div className='recharge-success'>
            <Headers type="empty">充值结果</Headers>
            <MSuccessTemplate />
            <MButtonTemplate />
            <BottomColumn type='long'></BottomColumn>
        </div>
    </>
}

// 按钮模板
function ButtonTemplate(): JSX.Element {
    let SOURCEOFRECHARGE = session.get('SOURCEOFRECHARGE')
    let { Store } = InitCom.get()
    let { sub, goBackProductList, continueToDeposit } = Store
    if (SOURCEOFRECHARGE == 'BUY') {
        return <>
            <BcButton onClick={() => continueToDeposit()} >继续存入</BcButton>
        </>
    } else {
        return <>
            <BcButton onClick={() => goBackProductList()} >立即购买</BcButton>
            <BcButton className="ant-btn-dashed" onClick={() => sub()} >查看余额</BcButton>
        </>
    }
}

// 成功模板
function SuccessTemplate(): JSX.Element {
    let { amountDesc = '1,000.00' }: any = commonStore.query() || {}
    return <>
        <div className='success'>
            <img src={Images.newsussess} alt="充值成功" className="icon-success" />
            <p className="text">充值成功</p>
            <p className='money'>{amountDesc}</p>
        </div>
    </>
}

export default {
    Render: observer(Render),
    MSuccessTemplate,
    MButtonTemplate
}