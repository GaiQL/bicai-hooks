import React, { useEffect } from 'react';
import './style.scss'
import { Headers } from 'Common/publicCommon/index'
import { BcButton, BcCopyBuyUrl, BcBanner } from 'Common/publicCommon/index'
import { Images } from "Common/config/index";
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { commonStore } from "Common/pages/store"
import IconSvg from './IconSvg'
import { buySuccessPage } from 'Common/Plugins/recordLogInfo'
import { session } from 'Common/utils/store';
import { observer } from 'mobx-react-lite'
import { InitCom } from './index'

function Render(): JSX.Element {

    let { Store } = InitCom.get()
    let { lookAssets, complete } = Store

    useEffect(() => {
        try { buySuccessPage(session.get('proId')) } catch (err) { }
    }, [])

    return <>
        <div className="buy-success">
            <Headers type="empty">存入结果</Headers>
            <BuySussess />
            <BcCopyBuyUrl />
            <BcButton wrapperClassName="buySuccessAssets" className="look-assets" onClick={() => lookAssets()}>查看我的持仓</BcButton>
            <BcButton wrapperClassName="buySuccessComplate" className="btn-complate" onClick={() => complete()}>再来一单</BcButton>
            {/* <BcBanner /> */}
            <BottomColumn type='long'></BottomColumn>
        </div>
    </>
}

// 购买成功模板
function BuySussess(): JSX.Element {
    let { stepList }: any = commonStore.query();
    let stepListRes: any = JSON.parse(stepList)

    return <>
        <ul className="process-box">
            <li className="item-step">
                <div className="line-top buyS-active"></div>
                <div className="line-bottom"></div>
                <IconSvg />
                <div className="step-detail">
                    <p className="default complate">{stepListRes.amountDesc}</p>
                    <p className="specific-info">{stepListRes.succDateDesc}</p>
                </div>
            </li>
            <li className="item-step">
                <div className="line-top"></div>
                <div className="line-bottom"></div>
                <img src={Images.shouyi} width="28" height="28" alt="" />
                <div className="step-detail">
                    <p className="default not-complate">{stepListRes.revenueDate}</p>
                    <p className="specific-info">{stepListRes.revenueDesc}</p>
                </div>
            </li>
            <li className="item-step">
                <img src={Images.money} width="28" height="28" alt="" />
                <div className="step-detail">
                    <p className="default not-complate">{stepListRes.redeemDate}</p>
                    <p className="specific-info">{stepListRes.redeemDateDesc}</p>
                </div>
            </li>
        </ul>
    </>
}

export default {
    Render: observer(Render),
    BuySussess,
}