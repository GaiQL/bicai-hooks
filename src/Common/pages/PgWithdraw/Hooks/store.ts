import { observable, flow, runInAction } from 'mobx'
import { apiBankAll } from 'Common/api/bank'
import { InitCom } from './index'
import { BIZ_TYPE } from 'Common/config/params.enum'
import { session } from "Common/utils/store";
import { commonStore, publicStore } from "Common/pages/store"
import { withdrawalBtn } from 'Common/Plugins/recordLogInfo'
import { TradeRequestMethod } from 'Common/pages/store'
import help from 'Common/utils/Tool'
const apiBank = new apiBankAll.ApiBankV2()

class Store {

    @observable isShowSelectCard: boolean = false
    @observable bankCardInfo: any = {}
    @observable selectedIndex: number = 0
    @observable defaultCard: any = {}
    @observable balanceData: any = {}
    @observable isShowVerificationCodeBox: boolean = false

    @observable amount: string | number = ''
    @observable showErrType: number = 0

    @observable seconds: number = 60
    @observable needMsgCode: boolean = true

    @observable validateCode: string = '' // 验证吗

    @observable verificationCodeRef:any

    setverificationCodeRef = (current: any) => {
        runInAction(() => {
            this.verificationCodeRef = current
        })
    }

    initStatus = () => {
        runInAction(() => {
            this.amount = ''
            this.showErrType= 0
            this.isShowSelectCard=false
        })
    }

    // 获取卡列表信息
    getApiBandCard = flow(function* (): IterableIterator<any> {
        yield apiBank.apiBandCard({
            bizType: BIZ_TYPE.withdraw,
            queryType: "0",
        }).then((res: { cardList: string | any[]; }) => {
            runInAction(() => {
                // @ts-ignore
                this.bankCardInfo = res
                // @ts-ignore
                this.defaultCard = res.cardList.length > 0 ? res.cardList[this.selectedIndex] : {};
            })
        })
    })

    // 打开卡列表弹框
    showSelectCardFn = (flag: boolean) => {
        runInAction(() => { this.isShowSelectCard = flag })
    }

    // 切换卡
    switchBankCard = (index: number, selectedBank: any) => {
        runInAction(() => {
            this.selectedIndex = index
            this.defaultCard = selectedBank
            this.isShowSelectCard = false
        })
    }

    // 关闭弹框
    onClose = () => {
        runInAction(() => { this.isShowVerificationCodeBox = false })
    }

    // 对提现金额的验证
    changeMoney = (money: string | number) => {
        let { bankCardInfo }: any = this
        runInAction(() => { this.amount = money })

        if (JSON.stringify(this.defaultCard) == '{}') {
            runInAction(() => { this.showErrType = 4 })
            return;
        }
        if (money == '') {
            runInAction(() => { this.showErrType = 0 })
            return;
        }
        // @ts-ignore
        if (money- 0 > bankCardInfo.balance - 0) { // 验证
            runInAction(() => { this.showErrType = 1 })
            return;
        }
        if (money && money < bankCardInfo.withdrawMinLimitAmt * 1) {
            runInAction(() => { this.showErrType = 2 })
            return;
        }
        if (bankCardInfo.withdrawMaxLimitAmt - 0 && money > bankCardInfo.withdrawMaxLimitAmt - 0) {
            runInAction(() => { this.showErrType = 3 })
            return;
        }
        runInAction(() => { this.showErrType = 0 })
    }

    // 获取全部余额
    getAllMoney = () => {
        let { Config }: any = InitCom.get()
        let { getBalanceOnoff } = Config
        let { bankCardInfo, balanceData }: any = this
        let money = getBalanceOnoff ? balanceData.withdrawalAmount : bankCardInfo.balance
        this.changeMoney(money)
    }

    // 更新电子账户余额
    queryTheBalance = flow(function* (): IterableIterator<any> {
        apiBank.apiQryEleAccount().then((res: any) => {
            runInAction(() => {
                // @ts-ignore
                this.balanceData = res })
        })
    })

    nextStep = () => {
        try {withdrawalBtn()} catch (err) { }
        this.needMsgCode ? this.reChangeNextNeedSMS() : this.reChangeNextNOSMS()
    }

    // 获取验证码
    setValidateCode = (value: string): void => {
        runInAction(() => { this.validateCode = value })
    }

    completeHandles = () => {
        let {defaultCard, validateCode, amount, bankCardInfo} = this
        let withDrawType = (bankCardInfo.balance * 1 > Number(amount)) ? 0 : 1 // 0：部分提取 1：全部提取
        let params = {
            bankCardNum: defaultCard.bankCardNum, // 银行卡号
            bankName: defaultCard.bankName,     // 银行卡名称（银行卡号对应的银行名称）
            amount: amount,          // 交易额
            validateCode: validateCode || '',    // 验证码
            validateCodeSerialNum: session.get('validateCodeSerialNum') || '',// 验证码流水号
            withDrawType: withDrawType,  // 0:部分提取,1:全部
            phoneNum: defaultCard.phoneNum,
            bankSerialNum: session.get('orderNumber') || '', // 针对营口的侧业务订单号
            bankElecAccountNum: defaultCard.bankElecAccountNum || '', // 二类户电子卡号
            bankCode: defaultCard.bankCode // 一类户行号(只针对新疆汇合)
        }
        TradeRequestMethod.apiCashFn(params)
    }

    reChangeNextNeedSMS = () => {
        runInAction(() => { this.isShowVerificationCodeBox = true })
        this.getSendCode()
    }

    reChangeNextNOSMS = () => {
        let data: any = commonStore.query();
        let page: any = data && data.type || ''
        let { amount, bankCardInfo, defaultCard } = this
        let withDrawType = (bankCardInfo.balance * 1 > Number(amount)) ? 0 : 1 // 0：部分提取 1：全部提取
        let params = {
            amount: Number(amount),
            withDrawType,
            bizType: BIZ_TYPE.withdraw,
            bankElecAccountNum: bankCardInfo.userCardId, // II类户
            bankName: defaultCard.bankName,
            bankCardNum: defaultCard.bankCardNum,  // I类户
            phoneNum: bankCardInfo.bankCardPhone,
            bankCardPhone: defaultCard.bankCardPhone,
            bankCode: defaultCard.bankNo || '', // //一类户行号(只针对新疆汇合)
            page: page
        }
        TradeRequestMethod.apiCashFn(params)
    }

    getVerificationCodeFun = (params: any) => {
        apiBank.apiSendPhoneCode(params).then((res: { validateCodeSerialNum: any; orderNumber: any; preBankAccountNo: any; }) => {
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
            // @ts-ignore TODO
            amount: help.clearComma(amount) * 1,
            bankCardPhone: bankCardInfo.cardList[(selectedIndex == null ? 0 : selectedIndex)].bankCardPhone,
            status: Config.status,
            bankCardNum: (bankCardInfo.cardList[(selectedIndex == null ? 0 : selectedIndex)].bankCardNum), // 振兴行特殊字段，验证码需传递银行卡账号
            userName: bankCardInfo.realName,
            userCardId: bankCardInfo.userCardId,
        }
        getVerificationCodeFun(params)
    }
}

export default Store
