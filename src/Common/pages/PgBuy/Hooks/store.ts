import {observable, flow, runInAction, toJS, action} from "mobx";
import {apiBankAll} from 'Common/api/bank'
import {session} from "Common/utils/store";
import {multiplication, Modulo} from 'Common/pages/public/calculate'
import {BIZ_TYPE} from 'Common/config/params.enum'
import {InitCom} from './index'
import {Toast} from 'antd-mobile';
import help from 'Common/utils/Tool'
import {TradeRequestMethod} from 'Common/pages/store'
import {commonStore} from "Common/pages/store"

const apiBank = new apiBankAll.ApiBankV2()

interface getBankCardParams {
    transAmt: string,
    proId: string
}

class Store {
    @observable bankCardInfo: any = {}
    @observable productInformation: any = {}
    @observable agreementList: Array<any> = []
    @observable isRead: boolean = false
    @observable selectFlag: number = 0
    @observable showErrType: number = 0
    @observable isShowVerificationCodeBox: boolean = false
    @observable needMsgCode: boolean = true
    @observable balance: string = ''

    @observable amount = ''

    @observable seconds = 60
    @observable validateCode = ''

    @observable ModificationOfCopyRightType = {
        HeadCopy: '存入',
        PurchaseCopy: '存入金额',
        BtnCopy: '存入'
    }

    @observable verificationCodeRef: any = null


    setverificationCodeRef = (current: any) => {
        runInAction(() => {
            this.verificationCodeRef = current
        })
    }

    // 获取验证码
    setValidateCode = (value: string): void => {
        runInAction(() => {
            this.validateCode = value
        })
    }

    // 获取卡列表信息
    @action.bound
    getApiBandCard = flow(function* (params: getBankCardParams): IterableIterator<any> {
        let {transAmt, proId} = params
        try {
            let info: any = yield apiBank.apiBandCard({
                bizType: BIZ_TYPE.buy,
                transAmt,
                queryType: "0",
                prdIndexId: session.get('proId') || proId
            })

            // @ts-ignore
            this.bankCardInfo = info
            // @ts-ignore
            this.balance = info.balance
        } catch (err) {

        }

    })

    // 获取产品信息
    @action.bound
    getapiQueryPrdInfo = flow(function* (proId): IterableIterator<any> {
        try {
            let ProductInformation = yield apiBank.apiQueryPrdInfo({
                prdIndexId: proId
            })
            session.set('proInfo', ProductInformation)
            // @ts-ignore
            this.productInformation = ProductInformation
        } catch (error) {

        }


    })

    // 获取产品协议
    @action.bound
    getApiBuyAgreement:any = flow(function* (this:Record<string,any>,proId?: string) {
        let {Config} = InitCom.get()
        let {agreementPrdIndexId, defaultIsRead} = Config
        let params = agreementPrdIndexId ? {prdIndexId: proId} : {}
        try {
            let argumentObj: any = yield apiBank.buyAgreement(params)

            if (argumentObj.selectFlag != 0) {
                this.agreementList = argumentObj.agreementList
                this.isRead = defaultIsRead
                this.selectFlag = argumentObj.selectFlag
            } else {
                this.agreementList = argumentObj.agreementList
            }
        } catch (error) {

        }

    })

    // 修改是否选中协议
    setTabIsRead = (flag: boolean) => {
        runInAction(() => {
            this.isRead = flag
        })
    }

    // 获取输入金额错误信息
    changeMoney = (money:any) => {
        runInAction(() => {
            this.amount = money
        })
        let {buyMinLimitAmt, buyMinIncreAmt}: any = this.productInformation

        if (money == '') { // 当输入的值为空的时候
            runInAction(() => {
                this.showErrType = 0
            })
            return;
        }
        if (money < buyMinLimitAmt * 1) { // 当输入的金额小于最小购买金额时
            runInAction(() => {
                this.showErrType = 1
            })
            return;
        }
        if (this.bankCardInfo.buyMaxLimitAmt * 1 && money > this.bankCardInfo.buyMaxLimitAmt * 1) { // 用户输入的金额超出最大化
            runInAction(() => {
                this.showErrType = 2
            })
            return;
        }
        if (buyMinIncreAmt * 1 > 0) { // 是否符合购买最小递增
            if (multiplication(money, 100) < multiplication(buyMinIncreAmt, 100) ? true : Modulo(multiplication(money, 100), multiplication(buyMinIncreAmt, 100)) == 0 ? false : true) {
                runInAction(() => {
                    this.showErrType = 3
                })
                return;
            }
        }
        // console.log(money, this.balance)
        if (Number(money) > Number(this.balance)) {
            runInAction(() => {
                this.showErrType = 5
            })
            return;
        }
        runInAction(() => {
            this.showErrType = 0
        })
    }

    // 购买前验证是否同意协议
    agreementOrNot = () => {
        let {isRead, agreementList} = this
        if (!isRead) {
            let agreement = ''
            agreementList.forEach((ele, index) => {
                agreement += ele.agreementTitle
                agreement += index + 1 == agreementList.length ? '' : '、'
            })
            Toast.info(`请先同意${agreement}`, 1);
            return false
        }
        return true

    }


    // 获取验证吗
    getVerificationCodeFun = (params: any) => {
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
        }).catch( ()=> {
            this.verificationCodeRef.verificationCodeStart(0)
        })
    }

    // 重新获取验证码
    retrieve = () => {
        this.getSendCode()
    }

    // 获取验证码
    getSendCode = () => {
        let {Config} = InitCom.get()
        let {amount, getVerificationCodeFun} = this
        let {bankCardInfo}: any = this
        let params: any = {
            bizType: BIZ_TYPE.buy,
            amount: help.clearComma(amount) * 1,
            bankCardPhone: bankCardInfo.bankCardPhone,
            status: Config.status,
            bankCardNum: bankCardInfo.cardList[0].bankCardNum, // 振兴行特殊字段，验证码需传递银行卡账号
            userName: bankCardInfo.realName,
            userCardId: bankCardInfo.userCardId,
        }
        getVerificationCodeFun(params)
    }
    // 关闭弹框
    onClose = () => {
        runInAction(() => {
            this.isShowVerificationCodeBox = false
        })
    }

    completeHandles = () => {
        let {bankCardInfo} = this
        let params = {
            prdIndexId: session.get('proId'),
            amount: this.amount,
            validateCode: this.validateCode || '',
            validateCodeSerialNum: session.get('validateCodeSerialNum') || '',// 验证码流水号
            // tranBackAdd: query.tranBackAdd,
            phoneNum: bankCardInfo.phoneNum,
            expandJson: session.get('expandJson') || window.sessionStorage.getItem('buyParams') || '',
            bankSerialNum: session.get('orderNumber') || '', // 针对营口的侧业务订单号
            bankElecAccountNum: bankCardInfo.bankElecAccountNum || '', // 二类户电子卡号
        }
        TradeRequestMethod.apiBuyFn(params)
    }

    // 点击购买按钮
    confirmBuy = () => {
        if (!this.agreementOrNot()) {
            return;
        }
        if (this.needMsgCode) {
            this.reChangeNextNeedSMS()
        } else {
            this.reChangeNextNOSMS()
        }
    }

    // 不需要验证码操作
    reChangeNextNOSMS = () => {
        let {bankCardInfo, amount} = this
        if (typeof amount == 'string') {
            amount = help.clearComma(amount)
        }
        let query: any = commonStore.query()
        let bankCardRes: any = bankCardInfo
        // let bankPhone = bankCardRes.cardList.length ? (bankCardRes.cardList[(selectedCardInd == null ? 0 : selectedCardInd)].bankCardPhone) : bankCardRes.bankCardPhone // 银行卡的手机号
        let bankPhone = bankCardRes.bankCardPhone
        let params: any = {
            prdIndexId: session.get('proId'),
            amount: amount,
            tranBackAdd: window.location.href.split("?")[0],
            bizType: BIZ_TYPE.buy, // 1表示为购(买
            bankCardPhone: bankPhone,
            phoneNum: bankCardRes.bankCardPhone, // 二类户的手机号
            expandJson: window.sessionStorage.getItem('buyParams'),
            bankElecAccountNum: bankCardRes.bankElecAccountNum, // 二类户的卡号
            prdPeriod: query.prdPeriod,
            userName: bankCardRes.realName, // 用户名
            userCardId: bankCardRes.userCardId, // 身份证号
        }
        TradeRequestMethod.apiBuyFn(params)
    }

    // 需要验证码操作
    reChangeNextNeedSMS = () => {
        runInAction(() => {
            this.isShowVerificationCodeBox = true
        })
        this.getSendCode()

    }

    // 更新电子账户余额
    checkTheBalance = () => {
        apiBank.apiQryEleAccount().then((res: { balance: string; }) => {
            runInAction(() => {
                this.balance = res.balance
            })
        })
    }

}

export default Store

