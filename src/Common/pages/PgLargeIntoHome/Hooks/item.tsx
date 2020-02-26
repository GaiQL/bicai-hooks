import React, {useEffect, useState, useContext} from 'react'
import './style.scss'
import {imgSrc} from "Common/config/index";
import {apiBankAll} from 'Common/api/bank'
import {Headers} from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer} from "mobx-react-lite"
import { publicStore } from 'Common/pages/store';

// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";
import { First, Second, DarkSpot } from './IconSvg';
import Help from 'Common/utils/Tool'

// 主渲染函数 Render名字必须存在
export const Render = () => {
    let { Store,HeadCard,BindCardList,AccountInfo,OperationCard } = InitCom.get();

    useEffect(()=>{ Store.initData() },[]);

    return (
        <div className='large-amounts-transfer'>
            <Headers>大额转入</Headers>
            <HeadCard />
            <Notice />
            <div>
                <AccountInfo />
                <BindCardList />
            </div>
            <OperationCard />
            <BottomColumn type='long'></BottomColumn>
        </div >
    )
}

const HeadCard = () => {
    let { bandCardInfo } = publicStore;
    return (
        <div className="bg">
            <div className="info">
                <img src={imgSrc + bandCardInfo.orgBgUrl} className="img" alt="" />
                <h4>
                    <i><img src={imgSrc + bandCardInfo.orgLogo} alt="" /></i>
                    <span>{bandCardInfo.orgName}</span>
                    <b>***的账户</b>
                </h4>
                <p>{Help.BankNo_Filter(bandCardInfo.bankElecAccountNum)}</p>

            </div>
        </div>
    )
}

const Notice = () => {
    return (
        <p className="largeReminder"> 当您通过绑定卡向电子账户充值时，由于限额而导致购买不便时，可以通过以下手机银行汇款的方式： </p>
    )
}

const BindCardList = () => {
    let { Store } = InitCom.get();
    let { bandCardInfo } = publicStore;
    return (
        <div className="largeCardList">
            {bandCardInfo.cardList && bandCardInfo.cardList.length ? <p className="largeCardListTitle">已绑定银行卡</p> : null}
            {

                bandCardInfo.cardList && bandCardInfo.cardList.map((e: { bankLogoUrl: any; bankName: React.ReactNode; }, index: string | number | undefined) => {
                    return (
                        <div className="largeCardListContent" key={index}>
                            <div onClick={Store.goLargeIntoGuide}>
                                <div></div>
                                <img src={imgSrc + e.bankLogoUrl} />
                                <p>{e.bankName}</p>
                                <div>
                                    <p>详细步骤</p>
                                    <div><span></span><span></span></div>
                                </div>
                                <img src={imgSrc + bandCardInfo.orgLogo} />
                                <p>{bandCardInfo.orgName}电子账号</p>
                            </div>
                        </div>
                    )
                })

            }
        </div>
    )
}

const AccountInfo = () => {
    let { Store,Config } = InitCom.get();
    let { tiedcardType } = Config;
    let { copyAccountNum } = Store;
    let { bandCardInfo } = publicStore;
    let { orgName } = bandCardInfo;
    return (
        <div className="largeWhiteSection">

            <p className="largeWhiteSectionHeader"><First style={{ display: tiedcardType == 3 ? 'none' : 'block' }} /><span>使用已绑定卡转入</span></p>
            <div className="largeWhiteSectionBox">
                <div>
                    <DarkSpot />
                    <div>
                        <p>{orgName}电子账号：{bandCardInfo.bankElecAccountNum}</p>
                        <p>开户行：{orgName}</p>
                    </div>
                </div>
                <div>
                    <DarkSpot />
                    <div>
                        <p>复制{orgName}电子账号，去已绑定银行卡的手机银行APP将资金转入到{orgName}本人电子账号</p>
                    </div>
                </div>
            </div>
            <div
                className="largeWhiteSectionButton"
                onClick={() => { copyAccountNum() }}
            ><p>复制电子账号</p></div>
            <div></div>

        </div>
    )
}

const OperationCard = () => {
    let { Store,Config } = InitCom.get();
    let { tiedcardType } = Config;
    let { supBank, changeCard } = Store;
    let { bandCardInfo } = publicStore;
    let { orgName } = bandCardInfo;
    return (
        <div className="largeWhiteSection" style={{ display: tiedcardType == 3 ? 'none' : 'block' }}>

            <p className="largeWhiteSectionHeader"><Second /><span>使用新卡转入</span></p>
            <div className="largeWhiteSectionBox">
                <div>
                    <DarkSpot />
                    <div>
                        <p>您也可以添加一张新的银行卡，向{orgName}本人电子账号转入资金，请先添加这张银行卡</p>
                        <p style={{ color: '#508CEE' }} onClick={supBank}>查看支持银行</p>
                    </div>
                </div>
            </div>
            <div className="largeWhiteSectionButton" onClick={changeCard}>
                <p>{tiedcardType == 1 || bandCardInfo.cardList && !bandCardInfo.cardList.length ? '添加绑定卡' : '更换绑定卡'}</p>
            </div>
            <div></div>

        </div>
    )
}

export default {
    Render:observer(Render),
    HeadCard,
    BindCardList,
    AccountInfo,
    OperationCard
}

