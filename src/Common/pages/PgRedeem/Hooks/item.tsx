
import React, { useState, useCallback,useRef, useEffect } from 'react';
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import help from 'Common/utils/Tool'
import { BcButton, BottomColumn, BcYzmInput1, BcDealInput } from 'Common/publicCommon/index'
import { imgSrc } from 'Common/config/index'
import { observer } from 'mobx-react-lite'
import { InitCom } from './index'
import { commonStore } from "Common/pages/store"
import BcVerificationCodeBox from 'Common/publicCommon/BcVerificationCodeBox/index'

let MElectronicAccount = observer(ElectronicAccount)
let MRedeemInput = observer(RedeemInput)
let MVerificationCodeBox = observer(VerificationCodeBox)
let MShowErrHtml = observer(ShowErrHtml)
let MShowRateHtml = observer(ShowRateHtml)
let MTipTextHtml = observer(TipTextHtml)
let MElectronicAccountCard = observer(ElectronicAccountCard)

// 支取页面初始化函数 可重写
async function initFunc(FuncList: { setParams: any; apiBandCardFn: any; apiQueryPrdInfoFn: any; }): Promise<any> {
    let { setParams, apiBandCardFn, apiQueryPrdInfoFn } = FuncList
    await setParams()
    await apiQueryPrdInfoFn()
    await apiBandCardFn()
}
export function Render(): JSX.Element  {
    let { Store, Config } = InitCom.get()
    let { bankInfo, money, showErrType, prePageParam, isEditInput, rateInfo, isRequestRate, isShowVerificationCodeBox, proInfo } = Store
    let { changeMoney, nextStep, setParams, apiBandCardFn, apiQueryPrdInfoFn, initStatus } = Store
    let { extraText, tipText } = Config
    let query: any = commonStore.query()
    // 上方电子账户的参数
    let accountObj = { ...proInfo, ...prePageParam }
    // 键盘的参数， 支取的键盘所需要的参数
    let inputObj = { amount: query.amount ,showErrType, isEditInput, money, extraText, ...bankInfo, changeMoney, ...rateInfo, isRequestRate }
    useEffect(() => {
        let FuncList = { setParams, apiBandCardFn, apiQueryPrdInfoFn }
        initFunc(FuncList)
        return(() => {
            initStatus()
        })
    }, [])
    function isDisabledFn(){
        if (money == '' || money == null || money == undefined || showErrType) {
            return true
        } else {
            return false
        }
    }
    return (
        <div className='redeem'>
            <Headers>支取</Headers>
            <ElectronicAccount {...accountObj} />
            <MRedeemInput {...inputObj}/>
            <TipTextHtml tipText={tipText}/>
            <ElectronicAccountCard {...bankInfo}/>
            <BcButton isDisabled={isDisabledFn()} onClick={() => nextStep()} >确定支取</BcButton>
            <BottomColumn type='long'/>
            {isShowVerificationCodeBox ? <VerificationCodeBox /> : null}
            {/* {
                activityTip
                ?<Module moduleFlag={moduleFlag} onClose={onClose} goBack={goBack} activityData={activityData} goNextRedeem={goNextRedeem} />
                :null
            } */}
        </div>
    )
}
// 最上方的电子账户
interface ElectronicAccountInter {
    orgLogo: string
    bankElecAccountNum: string
    orgName: string,
    amount: string,
    prdName: string,
}
function ElectronicAccount(props: Partial<ElectronicAccountInter>): JSX.Element {
    let { orgLogo, orgName, bankElecAccountNum, amount, prdName } = props
    return (
        <div className="product-info">
            <div className="product-logo">
                <img src={imgSrc + orgLogo} alt=""/>
            </div>
            <div className="product-content">
                <p className="product-name">{orgName}&nbsp;|&nbsp;{prdName}</p>
            <p>可支取金额:{amount}元</p>
            </div>
        </div>
    )
}
// 支取的输入框
interface RedeemInputInter {
    showErrType: number | string,
    amount?: number,
    isEditInput?: boolean,
    money?: number | string,
    extraText?: string,
    redeemMinLimitAmt?: string | number,
    redeemMinIncreAmt?: string | number,
    redeemRetainedAmt?: string | number,
    profitDesc?: string | number,
    rate?: string | number,
    changeMoney?: Function,
    isRequestRate?: boolean
}
function RedeemInput(props: Partial<RedeemInputInter>): JSX.Element {
    let { isEditInput, amount, money, extraText, showErrType, redeemMinLimitAmt, redeemRetainedAmt, redeemMinIncreAmt, profitDesc, rate, isRequestRate } = props
    let [val, setVal] = useState(money)
    useEffect(() => {
        props.changeMoney && props.changeMoney(val)
    }, [val])
    return (
        <div className='info-cash'>
            <div className="input-box">
                <p className="buy-words">支取金额</p>
                <BcDealInput
                    placeholder={'请输入支取金额'}
                    extra={isEditInput ? extraText : ''}
                    value={isEditInput ? val : amount}
                    isEdit={isEditInput}
                    handleExtra={() => setVal(amount)}
                    handleChange={(val: React.SetStateAction<string | number | undefined>) => setVal(val)}
                />
            </div>
            { showErrType ? ShowErrHtml({showErrType, redeemMinLimitAmt, redeemMinIncreAmt, redeemRetainedAmt}) : '' }
            { isRequestRate ? ShowRateHtml({profitDesc, rate, showErrType }) : '' }
        </div>
    )
}
// 验证码弹框
function VerificationCodeBox(): JSX.Element {
    let { Store } = InitCom.get()
    let { bankInfo, onClose, completeHandles, seconds, retrieve, setValidateCode, setverificationCodeRef } = Store
    let props:any = {bankCardPhone: bankInfo.bankCardPhone, onClose, completeHandles, seconds, retrieve, setValidateCode}
    let verificationCodeRef = useRef(null)
    useEffect(() => {
        setverificationCodeRef(verificationCodeRef.current)
    }, [])
    return <> <BcVerificationCodeBox ref={verificationCodeRef} {...props}/> </>
}
// 用户输入金额，进行限制的异常文案。
interface ShowErrHtmlInter {
    showErrType?: number |string,
    redeemMinLimitAmt?: string | number,
    redeemMinIncreAmt?: string | number,
    redeemRetainedAmt?: string | number,
}
function ShowErrHtml(props:ShowErrHtmlInter): JSX.Element {
    let { redeemMinLimitAmt, showErrType, redeemRetainedAmt } = props
    const errInfo = ['', `支取金额需大于${redeemMinLimitAmt}元`, '请输入递增金额的整数倍', '支取金额大于存款本金，请调整支取金额', `根据行方规定，留存金额需高于${redeemRetainedAmt}元`]
    return (
        <div className="err-info">
            <span></span>
            <div>请输入递增金额的整数倍</div>
        </div>
    )
}
interface ShowRateHtmlInter {
    profitDesc?: string | number,
    rate?: string | number,
    showErrType?: number | string
}
// 显示利率的文案
function ShowRateHtml(props: ShowRateHtmlInter): JSX.Element {
    let { profitDesc, rate, showErrType} = props
    return (
        <div className={`profit ${showErrType ? 'redeem-active' : ''}`}>
            <p>预计收益: { profitDesc ? <i>{'¥' + profitDesc}</i> : null}</p>
            { rate ? <p>利率: <i>{rate + '%'}</i></p> : '' }
        </div>
    )
}

interface TipTextHtmlInter {
    tipText?: string,
}
// 显示提示文案的信息
function TipTextHtml(props: TipTextHtmlInter): JSX.Element {
    let { tipText } = props
    return (
        <>
            { tipText ? <p className="tip"  dangerouslySetInnerHTML={{ __html: tipText }}></p> : '' }
        </>
    )
}
// 支取到电子账户里面
function ElectronicAccountCard(props: any): JSX.Element {
    let { orgName, bankElecAccountNum, orgLogo }:any = props
    return (
        <div className="card-content">
            <p>取出至</p>
            <div className="card-bank">
                <div className="card-logo">
                    <img src={imgSrc + orgLogo} alt=""/>
                </div>
                <div>{orgName}电子账户（{help.fromatCardFour(bankElecAccountNum)}）</div>
            </div>
        </div>
    )
}

export default {
    Render: observer(Render),
    MRedeemInput,
    MElectronicAccount,
    MShowErrHtml,
    MShowRateHtml,
    MTipTextHtml,
    MVerificationCodeBox,
    MElectronicAccountCard
}





