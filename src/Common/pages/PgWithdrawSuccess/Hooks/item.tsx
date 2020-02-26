import React from 'react';
import './style.scss'
import { Headers, BcButton, BcBankMark } from 'Common/publicCommon/index'
import { Images } from "Common/config/index";
import { session } from 'Common/utils/store'
import { BottomColumn } from 'Common/publicCommon/index'
import { observer } from 'mobx-react-lite'
import { InitCom } from './index'
import { commonStore } from "Common/pages/store"

let MbuttonTemplate = observer(buttonTemplate)

function Render(): JSX.Element {
    return <>
        <div className='withdraw-success'>
            <Headers type="empty">提现结果</Headers>
            <SuccessTemplate />
            <MbuttonTemplate />
            <BottomColumn type='long'></BottomColumn>
        </div>
    </>
}

function buttonTemplate(): JSX.Element {
    let { Store } = InitCom.get()
    let { complate } = Store
    let res: any = commonStore.query()
    let type = session.get('withdrawType')
    if (type == 'boundBank') {
        return <>
            <BcButton onClick={() => complate(res.path)} >完成</BcButton>
        </>
    } else {
        return <>
            <BcButton onClick={() => complate(res.path)} >查看余额</BcButton>
        </>
    }
}

// 成功模板
function SuccessTemplate(): JSX.Element {
    let { amountDesc = '1,000.00' }: any = commonStore.query() || {}
    return <>
        <div className='success'>
            <img src={Images.newsussess} alt="提现成功" className="icon-success" />
            <p className="text">提现成功</p>
            <p className='money'>{amountDesc}</p>
        </div>
        <div className="info">
            <p>
                提现至<span>{'待定（9876)'}</span>
            </p>
        </div>
    </>
}

export default {
    Render: observer(Render),
    MbuttonTemplate,
    SuccessTemplate
}