import React, { useRef, useState, useCallback, useEffect, memo } from 'react';
import Headers from 'Common/publicCommon/Headers'
import { BcButton, BcImitateInput } from 'Common/publicCommon/index'
import { session } from "Common/utils/store";
import { BcDealInput } from 'bc-bank-design'
import help from 'Common/utils/Tool'
import BottomColumn from 'Common/publicCommon/BottomColumn';
import { InitCom } from './index'
import './style.scss'
import { commonStore } from "Common/pages/store"
import { observer } from "mobx-react-lite"
import selected from 'Common/assets/images/selected.png'
import refreshs from 'Common/assets/images/refreshs.png'
import select from 'Common/assets/images/select.png'
import BcVerificationCodeBox from 'Common/publicCommon/BcVerificationCodeBox/index'
import {ProductInformationExhibition} from 'Common/publicCommon/BcTransactionModule/inedx'
import { toJS } from 'mobx';
import { logBuyRechargeBtn } from 'Common/Plugins/recordLogInfo'


let MProductInformationHeader = observer(ProductInformationHeader)
let MElectronicAccountDisplay = observer(ElectronicAccountDisplay)
let MVerificationCodeBox = observer(VerificationCodeBox)
let MShowArgument = observer(ShowArgument)
let MMoneyInputBox = observer(MoneyInputBox)
let MBuyExtraCopy = observer(BuyExtraCopy)


function Render(): JSX.Element {
    let { Store, Config } = InitCom.get()
    let { isShowArgument } = Config
    let { ModificationOfCopyRightType, amount, changeMoney, getApiBandCard, getApiBuyAgreement, getapiQueryPrdInfo } = Store
    let { isExtraCopy = false } = Config
    let query: any = commonStore.query()

    const getProductAgreement = useCallback(async (): Promise<any> => {
        getApiBuyAgreement(query.proId)
    }, [])

    const getproductInformation = useCallback(async (): Promise<any> => {
        session.set('proId', query.proId)
        getapiQueryPrdInfo(query.proId)
    }, [])

    const getBankCardList = useCallback(async (): Promise<any> => {
        getApiBandCard({
            transAmt: amount,
            proId: query.proId
        })
    }, [])

    const upDataOuterChainParameters = useCallback((res?): void => {
        if (res) {
            if (res.amount > 0) {
                changeMoney(res.amount)
            }
        }
    }, [])

    const getOuterChainParameters = useCallback((): void => {
        if (session.get('buyParams')) {
            let res: any = session.get('buyParams')
            upDataOuterChainParameters(res)
        } else {
            upDataOuterChainParameters()
        }
    }, [])

    useEffect(() => {
        let FuncList = { getBankCardList, getproductInformation, getProductAgreement, getOuterChainParameters }
        initFunc(FuncList)
    }, [])



    let { showErrType, confirmBuy, isShowVerificationCodeBox, productInformation } = Store
    return <>
        <div className="buy-box" >
            <Headers>{session.get('comBuyParams') ? ((session.get('comBuyParams').groupPrdFlag == '1' && amount) ? '平衡存入' : ModificationOfCopyRightType.HeadCopy) : ModificationOfCopyRightType.HeadCopy}</Headers>
            <MProductInformationHeader/>
            <MMoneyInputBox />
            <MElectronicAccountDisplay />
            <MShowArgument />
            <BcButton className={isShowArgument ? 'buy-btn' : 'buy-btn mt36px'} isDisabled={
                isDisabledFn(amount, showErrType)
                // false
            } onClick={() => {
                confirmBuy()
            }}>{ModificationOfCopyRightType.BtnCopy}</BcButton>
            {isExtraCopy ? <MBuyExtraCopy /> : null}
            {isShowVerificationCodeBox ? <MVerificationCodeBox /> : null}
            <MBottomColumn type='long' />
        </div>
    </>
}

// 初始化执行函数，可重写
async function initFunc(FuncList:Record<string,Function>) {
    let { getBankCardList, getproductInformation, getProductAgreement, getOuterChainParameters } = FuncList
    await getBankCardList()
    await getproductInformation()
    await getProductAgreement()
    await getOuterChainParameters()
}

// 是否有额外文案【购买按钮下面，类似支取提示】
function BuyExtraCopy(): JSX.Element {
    return <div className="info-tip"></div>
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
}

// 电子账户展示模块
function ElectronicAccountDisplay(): JSX.Element {
    let [isRefreshBalance, setisRefreshBalance] = useState(false)
    let { Store } = InitCom.get()
    let { bankCardInfo, productInformation, checkTheBalance } = Store
    let { bankElecAccountNum, balance } = bankCardInfo || {}
    let { orgName } = productInformation || {}
    let refresh = useRef(null)

    // 刷新电子账户余额
    const refreshBalance = useCallback(async () => {
        if (!isRefreshBalance) {
            try {
                setisRefreshBalance(true)
                await checkTheBalance()
                setTimeout(() => {
                    setisRefreshBalance(false)
                }, 1800)
            } catch (err) {
            }
        }
    }, [])

    const goRecharge = () => {
        try {
            logBuyRechargeBtn()
        }catch(err) {}
        session.set('SOURCEOFRECHARGE', 'BUY')
        commonStore.Hash.history.push('/recharge')
    }

    return <>
        <div className="two-card-box">
            <div className="two-card-box-logo">
                <img src={require('Common/assets/images/cardlogo.png')} alt="" />
            </div>
            <div className="two-card-box-wrap">
                <span>{orgName}电子账户({help.fromatCardFour(bankElecAccountNum)})</span>
                <div className='account'>
                    <span className='balance-contant'>可用余额：{help.formatNum(balance)}元</span>
                    <div className='refresh-loding' ref={refresh} onClick={() => {
                        refreshBalance()
                    }}>
                        <img src={refreshs} style={{ animation: isRefreshBalance ? 'refresh 1s linear' : '' }} alt="" />
                    </div>
                </div>
            </div>
            <div className="go-recharge" onClick={() => { goRecharge() }}>
                充值
            </div>
        </div>
    </>
}

// 产品信息头部展示
function ProductInformationHeader(): JSX.Element {
    let { Store } = InitCom.get()
    console.log(Store)
    let {productInformation} = Store
    console.log(toJS(productInformation))
    return <>
        <ProductInformationExhibition productInformation={productInformation}/>
    </>
}

// 金钱输入框
function MoneyInputBox(): JSX.Element {
    let [isShowTips, setisShowTips] = useState(false)
    let { Store, Config } = InitCom.get()
    let { isEdit = true } = Config
    let { productInformation, changeMoney, amount, balance } = Store
    let { buyMinLimitAmt, buyMinIncreAmt } = productInformation || {}
    let { showErrType, ModificationOfCopyRightType } = Store
    let inputRef: any = useRef(null)
    useEffect(() => {
        inputRef.onInputFocus = function() {
            setisShowTips(true)
        }
        inputRef.onInputBlur = function() {
            setisShowTips(false)
        }
    }, [])

    const getAllMoney = () => {
        changeMoney(balance)
    }

    return <>
        <div className="buy-money">
            <div className="input-box">
                <p className="buy-words">{ModificationOfCopyRightType.PurchaseCopy}</p>
                <MBcDealInput
                    refs={(el:React.RefObject<HTMLInputElement>) => inputRef = el}
                    extra='全部充入'
                    placeholder={`${buyMinLimitAmt || 0}元起存，${buyMinIncreAmt || 0}元递增`}
                    value={amount}
                    handleExtra={() => { getAllMoney() }}
                    isEdit={isEdit}
                    handleChange={(val:React.ChangeEvent<HTMLInputElement>) => {
                        changeMoney(val)
                    }}
                />
            </div>
            {
                showErrType
                ?
                <ShowErrHtml />
                :
                (isShowTips ? <div className='err-info default-info'><span></span><div>{`${buyMinLimitAmt}元起存，${buyMinIncreAmt}元递增`}</div></div> : '')
            }
        </div>

    </>
}

// 显示错误的信息
function ShowErrHtml(): JSX.Element {
    let { Store } = InitCom.get()
    let { bankCardInfo, showErrType } = Store
    let errItem = ''
    if (bankCardInfo.buyMaxLimitAmt) {
        if (bankCardInfo.buyMaxLimitAmt * 1 / 10000 >= 1) {
            errItem = `存入金额大于最高购买限额${bankCardInfo.buyMaxLimitAmt / 10000}万元，请调整存入金额`
        } else {
            errItem = `存入金额大于最高购买限额${bankCardInfo.buyMaxLimitAmt / 1000}千元，请调整存入金额`
        }
    }
    let errInfo = ['', '存入金额小于起存金额，请调整存入金额', errItem, '请输入递增金额的整数倍', '存入金额大于最高购买限额20万元，请调整存入金额', '存入金额大于电子账户余额，请调整存入金额']
    return (
        <div className='err-info'>
            <span></span>
            <div>{errInfo[showErrType]}</div>
        </div>
    )
}

// 判断按钮是否可以点击
function isDisabledFn(money: string, showErrType: number): boolean {
    if (money == null || showErrType || money == '' || help.clearComma(money) * 1 == 0) {
        return true
    } else {
        return false
    }
}

// 中关村添加，第一次购买显示协议，再次购买不需要协议出现  isShowArgument  继承组件传递参数，是否有该需求 true为有 不传则没有
function ShowArgument(): JSX.Element|null {
    let { Store, Config } = InitCom.get()
    let { isRead, setTabIsRead, selectFlag, agreementList } = Store
    let { isSpecialAgreement, isShowArgument }: any = Config

    const goAgreement = (item:Record<string,any>) => {
        if (item.agreeAttr == '0') {
            commonStore.Hash.history.push(`/analysisText?itemAgreement=${JSON.stringify(item)}`)
        } else {
            commonStore.Hash.history.push(`/agreement?url=${item.agreementUrl}`)
        }
    }

    if (isSpecialAgreement) {
        if (!selectFlag) {
            return <div className={isShowArgument ? 'agreementers' : 'none'}>
                <i className='icer' onClick={() => setTabIsRead(!isRead)}><img src={isRead ? selected : select} alt="" /></i>
                <p>
                    本人已阅读并同意
                    {
                        agreementList.length ?
                            agreementList.map((ele, index) => {
                                return <em key={index} onClick={() => { goAgreement(ele) }}>{ele.agreementTitle}</em>
                            }) : ''
                    }
                </p>
            </div>
        } else {
            return null
        }
    } else {
        return <div className={isShowArgument ? 'agreementers' : 'none'}>
            <i className='icer' onClick={() => setTabIsRead(!isRead)}><img src={isRead ? selected : select} alt="" /></i>
            <p>
                本人已阅读并同意
                {
                    agreementList.length
                        ?
                        agreementList.map((ele, index) => {
                            return (
                                <em key={index} onClick={() => { goAgreement(ele) }}>
                                    {ele.agreementTitle}
                                    {index + 1 == agreementList.length ? null : <i>、</i>}
                                </em>
                            )
                        })
                        : ''
                }
            </p>
        </div>
    }
}



let MBcDealInput = memo(BcDealInput)
let MBottomColumn = memo(BottomColumn)



export default {
    MElectronicAccountDisplay,
    MProductInformationHeader,
    Render: observer(Render),
    MBuyExtraCopy,
    MShowArgument,
    isDisabledFn,
    initFunc,
}
