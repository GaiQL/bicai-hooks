import { observable, flow, runInAction } from 'mobx'
import { BIZ_TYPE } from 'Common/config/params.enum'
import { apiBankAll } from 'Common/api/bank'
import { session } from "Common/utils/store";
import help from 'Common/utils/Tool'
import { TradeRequestMethod } from 'Common/pages/store'
import { Toast } from 'antd-mobile';
import { commonStore } from "Common/pages/store"
import { paymentAccountBtn, rechargePageBtn } from 'Common/Plugins/recordLogInfo'
import { InitCom } from './index'
const apiBank = new apiBankAll.ApiBankV2()



export class Store {
    @observable bankCardInfo: any = {}
    @observable showRechargeOnoff: boolean = false // 是否有充值协议；
    @observable agreementList: Array<any> = []
    @observable showErrType: number = 0
    @observable defaultCard: any = {}
    @observable selectedIndex: number = 0 // 默认选中的第一张卡
    @observable isShowSelectCard: boolean = false // 是否显示收银台
    @observable isRead: boolean = true // 协议是否已阅读；
    @observable isShowVerificationCodeBox: boolean = false
    @observable needMsgCode: boolean = true

    @observable seconds: number = 60

    @observable amount: string | number = ''
    @observable validateCode: string = '' // 验证吗

    @observable verificationCodeRef: any = null

    @observable processingSh: string = '05'
    @observable isShowProcessingSh: boolean = false

    initStatus = () => {
        runInAction(() => {
            this.amount = ''
            this.isShowVerificationCodeBox = false
            this.showErrType = 0
            this.isShowSelectCard = false
        })
    }

    setverificationCodeRef = (current:any) => {
        runInAction(() => {
            this.verificationCodeRef = current
        })
    }

    timers:any = null
    processingTimeFn = () => {
        this.onClose()
        runInAction(() => { this.isShowProcessingSh = true})
        let time = Number(this.processingSh)
        this.timers = setInterval(() => {
            if (time <= 0) {
                window.clearInterval(this.timers)
                runInAction(() => { this.isShowProcessingSh = false})
                runInAction(() => {this.processingSh = '5'})
                this.reChangeNextNOSMS("processingTime")
                return;
            }
            time--
            runInAction(() => {this.processingSh = '0' + time})
        }, 1000)
    }

    // 获取卡列表信息
    getApiBandCard = flow(function* (): IterableIterator<any> {
        yield apiBank.apiBandCard({
            bizType: BIZ_TYPE.recharge,
            // @ts-ignore
            transAmt: this.amount,
            queryType: "0",
        }).then((res:Record<string,any>) => {
            runInAction(() => {
                // @ts-ignore
                this.bankCardInfo = res
                // @ts-ignore
                this.defaultCard = res.cardList.length > 0 ? res.cardList[this.selectedIndex] : {};
            })
        })
    })

    // 获取充值协议
    getApiRechargeAgreement = flow(function* (): IterableIterator<any> {
        apiBank.getChargeAgreement().then((res:Record<string,any>) => {
            runInAction(() => {
                // @ts-ignore
                this.agreementList = res.agreementList
            })
        })
    })

    // 对充值金额的验证
    verificationAmount:anyFnType = (amount) => {
        runInAction(() => { this.amount = amount })
        let { defaultCard: { bankCardQuotaDescDto }, bankCardInfo }: any = this

        if (amount == '') {
            runInAction(() => { this.showErrType = 0 })
            return;
        }
        if (JSON.stringify(this.defaultCard) == '{}') {
            runInAction(() => { this.showErrType = 3; })
            return;
        }
        if (bankCardQuotaDescDto.singleDedct == 0) {
            runInAction(() => { this.showErrType = 0 })
            return;
        }
        if (amount - 0 > bankCardQuotaDescDto.singleDedct - 0 && bankCardQuotaDescDto.singleDedct != '-1') {
            runInAction(() => { this.showErrType = 1 })
            return;
        }
        if (amount < bankCardInfo.chargeMinLimitAmt * 1) {
            runInAction(() => { this.showErrType = 2; })
            return;
        }
        runInAction(() => { this.showErrType = 0 })
    }

    // 处理收银台的显示隐藏
    showSelectCardFn:anyFnType = (flag) => {
        // 点位： 付款账户点击
        try { paymentAccountBtn() } catch (err) { }

        runInAction(() => {
            if (flag) {
                this.getApiBandCard()
            }
            this.isShowSelectCard = flag
        })
    }

    // 切换卡
    switchBankCard:anyFnType = (index, selectedBank) => {
        runInAction(() => {
            this.selectedIndex = index
            this.defaultCard = selectedBank
            this.isShowSelectCard = false
            this.showErrType = 0
        })
    }

    // 协议选中
    tabIsRead = () => {
        runInAction(() => {
            this.isRead = !this.isRead;
        })
    }

    nextStep = () => {
        try { rechargePageBtn() } catch (err) { }
        const { changeAlertTitle } = commonStore
        changeAlertTitle('充值失败')

        if (!this.isRead) { Toast.info(`请先同意${this.agreementList[0].agreementTitle}`, 1); return; }
        if (this.needMsgCode) {
            this.reChangeNextNeedSMS()
        } else {
            this.reChangeNextNOSMS()
        }
    }



    // 关闭弹框
    onClose = () => {
        runInAction(() => { this.isShowVerificationCodeBox = false })
    }

    // 获取验证码
    setValidateCode = (value:string): void => {
        runInAction(() => { this.validateCode = value })
    }

    getVerificationCodeFun = (params:Record<string,any>) => {
        apiBank.apiSendPhoneCode(params).then((res:Record<string,any>) => {
            if (res.validateCodeSerialNum) {
                session.set('validateCodeSerialNum', res.validateCodeSerialNum)
            }
            // 针对营口的侧业务订单号
            if (res.orderNumber) {
                session.set('orderNumber', res.orderNumber)
            }
            // 针对振兴行的是否签约字段
            if (res.preBankAccountNo) {
                session.set('preBankAccountNo', res.preBankAccountNo)
            }
            this.verificationCodeRef.verificationCodeStart(this.seconds)
        }).catch(() => {
            this.verificationCodeRef.verificationCodeStart(0)
        })
    }

    // 重新获取验证码
    retrieve = () => {
        this.getSendCode()
    }

    // 获取验证码
    getSendCode = () => {
        let { Config } = InitCom.get()
        let { amount, selectedIndex, getVerificationCodeFun } = this
        let { bankCardInfo }: any = this
        let params: any = {
            bizType: BIZ_TYPE.recharge,
            // @ts-ignore
            amount: help.clearComma(amount) * 1,
            bankCardPhone: bankCardInfo.cardList[(selectedIndex == null ? 0 : selectedIndex)].bankCardPhone,
            status: Config.status,
            bankCardNum: (bankCardInfo.cardList[(selectedIndex == null ? 0 : selectedIndex)].bankCardNum), // 振兴行特殊字段，验证码需传递银行卡账号
            userName: bankCardInfo.realName,
            userCardId: bankCardInfo.userCardId,
        }
        getVerificationCodeFun(params)
    }

    reChangeNextNeedSMS = () => {
        runInAction(() => { this.isShowVerificationCodeBox = true })
        this.getSendCode()
    }

    reChangeNextNOSMS = (processingTimeFlag = '') => {
        let { amount, defaultCard, bankCardInfo, processingTimeFn } = this
        var otherObj = {}
        if (processingTimeFlag) {
            otherObj = {processingTimeFn: processingTimeFn}
        }
        let params = {
            bizType: BIZ_TYPE.recharge,
            amount: amount,
            bankCardNum: defaultCard.bankCardNum,
            bankName: defaultCard.bankName,
            bankCardPhone: defaultCard.bankCardPhone,
            phoneNum: bankCardInfo.bankCardPhone,
            twoCardNo: bankCardInfo.bankElecAccountNum,
            bankCode: defaultCard.bankNo || '', //一类户行号(只针对新疆汇合)
            ...otherObj
        }
        TradeRequestMethod.apiRechargeFn(params)
    }

    completeHandles = () => {
        let { amount, defaultCard, validateCode, processingTimeFn} = this
        let params = {
            bankCardNum: defaultCard.bankCardNum, // 银行卡号（I类卡号）
            bankName: defaultCard.bankName, // 银行名称
            amount: amount, // 金额
            validateCode: validateCode || '', // 验证码
            validateCodeSerialNum: session.get('validateCodeSerialNum') || session.get('validateCodeSerialNum'),// 验证码流水号
            phoneNum: defaultCard.phoneNum,
            bankSerialNum: session.get('orderNumber') || '', // 针对业务订单号
            bankElecAccountNum: defaultCard.bankElecAccountNum || '', // 二类户电子卡号
            bankCode: defaultCard.bankCode, //一类户行号(只针对新疆汇合)
            preBankAccountNo: session.get('preBankAccountNo') || '', // 针对振兴行的是否签约字段
            processingTimeFn: processingTimeFn
        }
        TradeRequestMethod.apiRechargeFn(params)
    }
}

export default Store
