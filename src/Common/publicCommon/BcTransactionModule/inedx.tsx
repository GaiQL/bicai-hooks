import './style.scss'
import React from 'react'
import help from 'Common/utils/Tool'
import { imgSrc } from 'Common/config/index'
import {toJS} from 'mobx'

// 充值提现电子账户信息
function RACashWElectronicAccount(props: { bankCardInfo?: any }): JSX.Element {
    let {bankCardInfo} = props
    return <>
         <div className='info-wrap'>
            <div className='info'>
                <img src={imgSrc + bankCardInfo.orgBgUrl} className="img" alt="" />
                <div className="info-content">
                    <div className="e-logo">
                        <img src={imgSrc + bankCardInfo.orgLogo} alt="" />
                    </div>
                    <div className="e-introduce">
                        <p className='e-name'>{bankCardInfo.orgName} | 电子账户<span>（尾号{help.fromatCardFour(bankCardInfo.bankElecAccountNum)}）</span></p>
                        <p>余额：{bankCardInfo.balanceDesc}元</p>
                    </div>
                </div>
            </div>
        </div>
    </>
}

// 购买支取头部信息
function ProductInformationExhibition(props: { productInformation: any }): JSX.Element {
    console.log(toJS(props.productInformation))
    let { productInformation } = props
    let { orgLogo, orgName, prdName } = productInformation || {}
    return <>
        <div className="buy-box-info-title">
            <div className="info-logo">
                <img src={imgSrc + orgLogo} alt="" />
            </div>
            <div className="production-content">
                <div className="info-text">
                    {orgName} | {prdName}
                </div>
                <div className="interest-rate">
                    满期利率：<span>4.125%</span>
                </div>
            </div>
        </div>
    </>
}

export {
    ProductInformationExhibition,
    RACashWElectronicAccount
}
