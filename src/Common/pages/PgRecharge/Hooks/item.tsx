import React, { useState, useCallback, useEffect, useRef } from 'react'
import './style.scss'
import Headers from 'Common/publicCommon/Headers'
import help from 'Common/utils/Tool'
import { BcButton, BcImitateInput, BcSelectCard, BcBankInfo } from 'Common/publicCommon/index'
import BcNumberInput from 'Common/publicCommon/BcNumberInput'
import { Images } from 'Common/config/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { BcDealInput } from 'bc-bank-design'
import { BIZ_TYPE } from "Common/config/params.enum";
import { commonStore } from "Common/pages/store"
import { largeintoBtn, rechargeMoneyInputBtn } from 'Common/Plugins/recordLogInfo'
import { observer } from 'mobx-react-lite'
import { InitCom } from './index'
import Help from 'Common/utils/Tool'
import { Modal } from 'antd-mobile'
import { RACashWElectronicAccount } from 'Common/publicCommon/BcTransactionModule/inedx'
import BcVerificationCodeBox from 'Common/publicCommon/BcVerificationCodeBox/index'

let MPaymentAccountAInformation = observer(PaymentAccountAInformation)
let MHandlingTheBulletBox = observer(HandlingTheBulletBox)
let MExhibitionAgreement = observer(ExhibitionAgreement)
let MVerificationCodeBox = observer(VerificationCodeBox)
let MElectronicAccount = observer(ElectronicAccount)
let MTopUpTransferIn = observer(TopUpTransferIn)
let MRechargeInput = observer(RechargeInput)
let MShowErrHtml = observer(ShowErrHtml)

export function Render(): JSX.Element {
    let { Store, Config } = InitCom.get()
    let { selectCardTitle, isShowHandleBtn, isShowMonthDesc, upperLimitOfBankCard } = Config
    let { bankCardInfo, initStatus, isShowProcessingSh } = Store

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

    let { showSelectCardFn, isShowSelectCard, selectedIndex, switchBankCard, nextStep, isShowVerificationCodeBox } = Store


    return <>
        <div className='recharge'>
            <Headers>充值</Headers>
            <MElectronicAccount bankCardInfo={bankCardInfo} />
            <MRechargeInput />
            <MPaymentAccountAInformation />
            <BcSelectCard
                title={selectCardTitle}
                isShowHandleBtn={isShowHandleBtn}
                isShowMonthDesc={isShowMonthDesc}
                bizType={BIZ_TYPE.recharge}
                name={bankCardInfo.realName}
                idCard={bankCardInfo.userCardId}
                bindMutiCardsFlag={bankCardInfo.bindMutiCardsFlag}
                cardList={bankCardInfo.cardList}
                visible={isShowSelectCard}
                telList={bankCardInfo.custServiceHotLine}
                closeModal={() => showSelectCardFn(false)}
                curPage="recharge"
                selectedIndex={selectedIndex}
                history={commonStore.Hash.history}
                defaultPhone={bankCardInfo.bankCardPhone}
                notifyBankInfo={(index:number, selectedBank:Record<string,any>) => switchBankCard(index, selectedBank)}
                upperLimitOfBankCard={upperLimitOfBankCard}
            >
            </BcSelectCard>
            <MExhibitionAgreement />
            {isShowProcessingSh ? <MHandlingTheBulletBox /> : null}
            {isShowVerificationCodeBox ? <MVerificationCodeBox /> : null}
            <BcButton isDisabled={isDisabledFn()} onClick={() => nextStep()}>充值</BcButton>
            <MTopUpTransferIn />
            <BottomColumn type='long' />
        </div>
    </>
}

// 验证码弹框
function VerificationCodeBox(): JSX.Element {
    let { Store } = InitCom.get()
    let { bankCardInfo, onClose, completeHandles, seconds, retrieve, setValidateCode, setverificationCodeRef } = Store
    let props:any = { bankCardPhone: bankCardInfo.bankCardPhone, onClose, completeHandles, seconds, retrieve, setValidateCode }
    let verificationCodeRef = useRef(null)
    useEffect(() => {
        setverificationCodeRef(verificationCodeRef.current)
    }, [])
    return <> <BcVerificationCodeBox ref={verificationCodeRef} {...props} /> </>
}

// 充值协议
function ExhibitionAgreement(): JSX.Element  {

    let { Store } = InitCom.get()
    let { showRechargeOnoff, getApiRechargeAgreement } = Store
    let { tabIsRead, isRead, agreementList } = Store


    const getChargeAgreement = useCallback(() => {
        if (showRechargeOnoff) {
            getApiRechargeAgreement()
        }
    }, [])

    useEffect(() => {
        getChargeAgreement()
    }, [])

    if (showRechargeOnoff) {
        return (
            <div className={'recharge-agree'}>
                <div>
                    <i onClick={() => tabIsRead()}><img src={isRead ? Images.selected : Images.select} alt="" /></i>
                    <p>本人已阅读并同意
                        {
                            agreementList.length && agreementList.map(ele => {
                                return <span key={ele} onClick={() => { commonStore.Hash.history.push('/agreement?url=' + ele.agreementUrl) }}>{ele.agreementTitle}</span>
                            })
                        }
                    </p>
                </div>
            </div>
        )
    } else {
        return <> </>
    }
}

// 充值处理中等待提示
function HandlingTheBulletBox(): JSX.Element {
    let { Store } = InitCom.get()
    let { processingSh } = Store
    return <>
        <Modal
            className='mq-module'
            visible={true}
            transparent
            maskClosable={false}
            title={<div className='handling-count-down'><div className="scecond"><span>{processingSh}</span><span>s</span></div></div>}
        // footer={[{ text: '我知道了', onPress: () => { closeTip(false) } }]}
        >
            <div className='conent'>
                <p className='handling-conent-m'>正在等待对方银行返回结果</p>
                <p className='handling-conent-t'>结果返回前请不要重复提交</p>
            </div>
        </Modal>
    </>
}

// 充值输入金钱
function RechargeInput(): JSX.Element {
    let { Store, Config } = InitCom.get()
    let { placeholder } = Config
    let RechargeInput: any = useRef(null)
    let { showErrType, amount, verificationAmount } = Store

    useEffect(() => {
        RechargeInput.onInputFocus = () => {
            try {
                rechargeMoneyInputBtn()
            } catch (err) { }
        }
    }, [])

    return <>
        <div className='info-cash'>
            <div className="input-box">
                <p className="buy-words">充值金额</p>
                <BcDealInput
                    value={amount}
                    placeholder={placeholder}
                    handleChange={(val:string) => verificationAmount(val)}
                    refs={(el:any) => RechargeInput = el}
                />
            </div>
            {showErrType ? <MShowErrHtml /> : ''}

        </div>

    </>
}

// 付款账户详情
function PaymentAccountAInformation(): JSX.Element {
    let { Store, Config } = InitCom.get()
    let { isShowArrow } = Config
    let { defaultCard, showSelectCardFn, bankCardInfo } = Store
    return <>

        <div className="payment-account">
            <div className="payment-title">
                付款账户
            </div>
            <BcBankInfo
                bizType={BIZ_TYPE.recharge}
                className={'is-border-top'}
                isShowArrow={isShowArrow == false ? false : true}
                isShowMonthDesc={false}
                defaultBank={defaultCard}
                name={bankCardInfo.realName}
                curPage="recharge"
                telList={bankCardInfo.custServiceHotLine}
                history={commonStore.Hash.history}
                idCard={bankCardInfo.userCardId}
                defaultPhone={bankCardInfo.bankCardPhone}
                onClick={isShowArrow == false ? false : () => showSelectCardFn(true)}>
            </BcBankInfo>
        </div>
    </>
}

// 电子账户详情
function ElectronicAccount(props:Record<string,any>): JSX.Element {
    return <>
        <RACashWElectronicAccount {...props} />
    </>
}

// 底部大额转入文案
function TopUpTransferIn(): JSX.Element {
    let { Store } = InitCom.get()
    let { bankCardInfo } = Store
    return (
        <>
            {
                (bankCardInfo.cardList ? bankCardInfo.cardList.length : 0) > 0 ?
                    <p className="info-tip">单笔额度太小?
                    <span
                            className='gobig'
                            onClick={() => {
                                try {
                                    largeintoBtn()
                                } catch (err) { }
                                commonStore.Hash.history.push('/largeIntoHome')
                            }}
                        >
                            试试大额转入吧
                    </span></p> : ''
            }
        </>
    )
}

// 充值金额实时错误
function ShowErrHtml(): JSX.Element {
    let { Store } = InitCom.get()
    let { showErrType, bankCardInfo } = Store
    let errInfo = ['', '充值金额大于付款账户每笔限额规定，请调整充值金额', `充值金额需大于等于${bankCardInfo.chargeMinLimitAmt}元，请调整充值金额`, `请添加一张银行卡，作为充值的付款账户`]
    return (
        <div className='err-info'>
            <span />
            <div>{errInfo[showErrType]}</div>
        </div>
    )
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
async function ininFunc(FuncList:Record<string,any>): Promise<any> {
    let { getBankCardList } = FuncList
    await getBankCardList()
}

export default {
    MPaymentAccountAInformation,
    Render: observer(Render),
    MExhibitionAgreement,
    MTopUpTransferIn,
    MElectronicAccount,
    MRechargeInput,
    isDisabledFn,
    MShowErrHtml,
    ininFunc
}
