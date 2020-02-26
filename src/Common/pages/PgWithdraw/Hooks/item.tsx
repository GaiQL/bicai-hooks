import './style.scss'
import { InitCom } from './index'
import help from 'Common/utils/Tool'
import {observer} from 'mobx-react-lite'
import { BcDealInput } from 'bc-bank-design'
import { commonStore } from "Common/pages/store"
import Headers from 'Common/publicCommon/Headers'
import { imgSrc, Images } from 'Common/config/index'
import { BIZ_TYPE } from "Common/config/params.enum";
import BottomColumn from 'Common/publicCommon/BottomColumn'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import {RACashWElectronicAccount} from 'Common/publicCommon/BcTransactionModule/inedx'
import { BcButton, BcImitateInput, BcSelectCard, BcBankInfo } from 'Common/publicCommon/index'
import BcVerificationCodeBox from 'Common/publicCommon/BcVerificationCodeBox/index'

let MElectronicAccount = observer(ElectronicAccount)
let MShowErrHtml = observer(ShowErrHtml)
let MWithdrawalInput = observer(WithdrawalInput)
let MPaymentAccountAInformation = observer(PaymentAccountAInformation)
let MVerificationCodeBox = observer(VerificationCodeBox)

function Render() : JSX.Element {

    let { Store, Config } = InitCom.get()
    let { selectCardTitle, isShowDesc, upperLimitOfBankCard, isShowTip, tipShow, outhorTipShow } = Config
    let { isShowSelectCard, bankCardInfo, selectedIndex, showSelectCardFn, switchBankCard, nextStep, isShowVerificationCodeBox, initStatus } = Store
    const getBankCardList = useCallback(async (): Promise<any> => {
        Store.getApiBandCard()
    }, [])

    useEffect(() => {
        let FuncList = { getBankCardList }
        ininFunc(FuncList)
        return () => {
            initStatus()
        };
    }, [])

    return <>
        <div className='withdraw'>
            <Headers>提现</Headers>
            <MElectronicAccount bankCardInfo={bankCardInfo}/>
            <MWithdrawalInput />
            <MPaymentAccountAInformation />

            <BcSelectCard
                title={selectCardTitle}
                bizType={BIZ_TYPE.withdraw}
                visible={isShowSelectCard}
                history={commonStore.Hash.history}
                name={bankCardInfo.realName}
                idCard={bankCardInfo.userCardId}
                bindMutiCardsFlag={bankCardInfo.bindMutiCardsFlag}
                curPage='withdraw'
                telList={bankCardInfo.custServiceHotLine}
                selectedIndex={selectedIndex}
                closeModal={() => showSelectCardFn(false)}
                cardList={bankCardInfo.cardList}
                defaultPhone={bankCardInfo.bankCardPhone}
                isShowDesc={isShowDesc}
                notifyBankInfo={switchBankCard}
                upperLimitOfBankCard={upperLimitOfBankCard}
            >
            </BcSelectCard>
            {isShowVerificationCodeBox ? <MVerificationCodeBox /> : null}
            <BcButton isDisabled={isDisabledFn()} onClick={() => nextStep()} >提现</BcButton>
            {isShowTip ? <p className='info-tip'>{tipShow}<br />{outhorTipShow}</p> : ''}
            <BottomColumn type='long'></BottomColumn>
        </div>

    </>
}


// 电子账户详情
function ElectronicAccount(props: JSX.IntrinsicAttributes & { bankCardInfo?: any }): JSX.Element {
    return <>
        <RACashWElectronicAccount {...props}/>
    </>
}

// 输入提现金钱
function WithdrawalInput(): JSX.Element {
    let { Store, Config } = InitCom.get()
    let { getBalanceOnoff } = Config
    let { showErrType, amount, changeMoney, getAllMoney, balanceData, bankCardInfo } = Store

    return <>
        <div className='info-cash'>
            <div className="input-box">
                <p className="buy-words">提现金额</p>
                <BcDealInput
                    extra={'全部'}
                    value={amount}
                    handleExtra={() => getAllMoney()}
                    placeholder={`可转出到卡${(getBalanceOnoff ? balanceData.withdrawalAmountDesc : bankCardInfo.balanceDesc) || '0.00'}元`}
                    handleChange={(val: any) => changeMoney(val)}
                />
            </div>
            {showErrType ? <MShowErrHtml /> : ''}

        </div>

    </>
}

// 充值金额实时错误
function ShowErrHtml(): JSX.Element {
    let { Store } = InitCom.get()
    const { bankCardInfo, showErrType }: any = Store
    let maxMoney = bankCardInfo.withdrawMaxLimitAmt * 1
    let errItem = ''
    if (maxMoney / 10000 >= 1) {
        errItem = `单笔最大限额为${maxMoney / 10000}万元，请调整提现金额`
    } else {
        errItem = `单笔最大限额为${maxMoney / 1000}千元，请调整提现金额`
    }
    const errInfo = ['', '提现金额大于卡内余额，请调整提现金额', `每笔提现最低${bankCardInfo.withdrawMinLimitAmt}元，请调整提现金额`, errItem, `请添加一张银行卡，作为提现的入账账户`]
    return (
        <div className="err-info">
            <span></span>
            <div>{errInfo[showErrType]}</div>
        </div>
    )
}

// 入账账户详情
function PaymentAccountAInformation(): JSX.Element {
    let { Store, Config } = InitCom.get()
    let { isShowArrow } = Config
    let { defaultCard, showSelectCardFn, bankCardInfo } = Store
    return <>

        <div className="payment-account">
            <div className="payment-title">
                入账账户
            </div>
            <BcBankInfo
                bizType={BIZ_TYPE.withdraw}
                className={'is-border-top'}
                isShowArrow={isShowArrow == false ? false : true}
                isShowMonthDesc={false}
                defaultBank={defaultCard}
                name={bankCardInfo.realName}
                curPage="withdraw"
                telList={bankCardInfo.custServiceHotLine}
                history={commonStore.Hash.history}
                idCard={bankCardInfo.userCardId}
                defaultPhone={bankCardInfo.bankCardPhone}
                onClick={isShowArrow == false ? false : () => showSelectCardFn(true)}>
            </BcBankInfo>
        </div>
    </>
}

// 验证码弹框
function VerificationCodeBox(): JSX.Element {
    let { Store } = InitCom.get()
    let { bankCardInfo, onClose, completeHandles, seconds, retrieve, setValidateCode, setverificationCodeRef } = Store
    let props:any = {bankCardPhone: bankCardInfo.bankCardPhone, onClose, completeHandles, seconds, retrieve, setValidateCode}
    let verificationCodeRef = useRef(null)
    useEffect(() => {
        setverificationCodeRef(verificationCodeRef.current)
    }, [])
    return <> <BcVerificationCodeBox ref={verificationCodeRef} {...props}/> </>

    return <> <BcVerificationCodeBox {...props}/> </>
}

// 充值按钮是否可点击
function isDisabledFn(): boolean {
    let { Store } = InitCom.get()
    let { amount, showErrType, defaultCard } = Store
    if (amount == '' || Number(amount) * 1 == 0 || amount == null || showErrType || defaultCard.supportFlag == 0 && defaultCard.bankCardQuotaDescDto.availableType != 4) {
        return true
    } else {
        return false
    }
}

// 充值页面初始化函数
async function ininFunc(FuncList: { getBankCardList: any }): Promise<any> {
    let { getBankCardList } = FuncList
    await getBankCardList()
}

export default {
    ininFunc,
    isDisabledFn,
    MShowErrHtml,
    MWithdrawalInput,
    MElectronicAccount,
    MVerificationCodeBox,
    Render: observer(Render),
    MPaymentAccountAInformation,
}
