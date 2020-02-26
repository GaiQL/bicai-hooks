import { observable, runInAction } from "mobx";
import { commonStore } from "Common/pages/store"
import { TradeRequestMethod } from 'Common/pages/store'
import { BIZ_TYPE } from 'Common/config/params.enum'
import { redeemBtn } from 'Common/Plugins/recordLogInfo'
import { apiBankAll } from 'Common/api/bank'
import { InitCom } from './index'
import { session } from "Common/utils/store";
const apiBank = new apiBankAll.ApiBankV2()
import help from 'Common/utils/Tool'
class Store {
    @observable selectedIndex = 0 // 默认选中第一张卡
    @observable showErrType = 0 // 提示错误的type值 (表示的错误内容看showErrHtml方法)
    @observable isEditInput = true; // 是否可以编辑input
    @observable seconds = 60
    @observable validateCode = ''
    @observable proInfo = {} // 产品信息
    @observable money: string | number | undefined   // null
    @observable prePageParam = {} // 从持有中带来的数据
    @observable rateInfo = {} // 收益的信息
    @observable isRequestRate = true // 是否请求收益接口
    @observable bankInfo:Record<string,any> = {} // 机构绑定卡信息
    @observable isShowVerificationCodeBox: boolean = false
    @observable verificationCodeRef:any
    // /** 是否需要请求该产品的信息 */
    // @observable isRequestProInfo = false
    Store = commonStore
    @observable needMsgCode = true
    // 增加新疆汇合和晋中增加支取弹窗
    @observable isActivityPopup = false; //是否有活动弹窗接口
    @observable activityTip = false;  // 是否现实活动提示
    @observable moduleFlag = true
    @observable activityData = ''

    // 初始化可能缓存的状态
    initStatus = () => {
        runInAction(() => {
            this.showErrType = 0
            this.money = ''
            this.rateInfo = {}
        })
    }

    // 设置传递过来的参数
    setParams = () => {
        runInAction(() => {
            const obj:any = this.Store.query()
            obj.amount = help.clearComma(obj.amount)
            this.prePageParam = obj
            if (!this.isEditInput) {
                this.money = obj.amount;
                this.isRequestRate ? this.apiInterestCalculationFn() : null
            }
        })
    }
    setverificationCodeRef = (current: any) => {
        runInAction(() => {
            this.verificationCodeRef = current
        })
    }
    // 重新获取验证码
    retrieve = () => {
        this.getSendCode()
    }
    completeHandles = () => {
        let { prePageParam, validateCode, selectedIndex, bankInfo }:any = this
        let params = {
            bankElecAccountNum: bankInfo.bankElecAccountNum,  // 二类电子户卡号
            prdIndexId: prePageParam.prdIndexId, // 比财产品索引表ID
            reqSerial: prePageParam.reqSerial, // 购买时后台订单号
            amount: prePageParam.amount, // 金额
            bankSerialNum: prePageParam.bankSerialNum || '',
            validateCode: validateCode || '', // 验证码
            validateCodeSerialNum: session.get('validateCodeSerialNum') || '',// 验证码流水号
            phoneNum: bankInfo.cardList[(selectedIndex == null ? 0 : selectedIndex)].bankCardPhone,
            rate: prePageParam.rate ? prePageParam.rate : ''
        }
        this.apiRedeemFn(params)
    }
    apiRedeemFn = (params?: any) => {
        TradeRequestMethod.apiRedemptionFn(params)
    }
    onClose = () => {
        runInAction(() => { this.isShowVerificationCodeBox = false })
        window.clearInterval(this.timer)
        this.seconds = 60
    }
    // 获取验证码
    setValidateCode = (value: string): void => {
        runInAction(() => { this.validateCode = value })
    }
    // 公共接口，获取银行卡信息
    apiBandCardFn = async () => {
        let { prePageParam }: any = this
        let params = {
            bizType: BIZ_TYPE.redeem, // 排序类型 0-开户;3：充值，4：提现，6：存入，7：支取，8：更多服务
            queryType: "0", //查询类型 0-全部;1-卡列表;2-二类户;3-默认卡
            prdIndexId: prePageParam.prdIndexId
        }
        let res: any = await apiBank.apiBandCard(params)
        runInAction(() => {
            this.bankInfo = res
        })
    }
    // 产品信息
    apiQueryPrdInfoFn = async () => {
        const obj: any = commonStore.query()
        try {
            let res = await apiBank.apiQueryPrdInfo({
                prdIndexId: obj.prdIndexId
            })
            runInAction(() => {
                this.proInfo = res
            })
        }catch(err) {}
    }
    // 支取
    apiRedemptionFn = async (data: any) => {
        return await apiBank.apiRedemption(data)
    }
    //支取特殊活动弹框接口[晋中，新疆汇合]
    apiSpecialTipFn = async () => {
        const obj: any = commonStore.query()
        let params = {
            amount: this.money,
            prdIndexId: obj.prdIndexId
        }
        let res = await apiBank.getSpecialVerificationInterface(params)

        if (res && res.isPopup == '0') {
            runInAction(() => {
                this.activityTip = true;
                this.moduleFlag = true;
                this.activityData = res.data;
            })
        } else {
            runInAction(() => {
                this.activityTip = false;
                // this.redeemNext();
            })
        }
    }
    // 收益预算
    apiInterestCalculationFn = async () => {
        let { prePageParam, money }: any = this
        if (!this.isEditInput) {
            money = prePageParam.amount;
        }
        if (money == '') return
        try {
            let data = {
                amount: money.toString(), // '10000',  // money,   // 支取金额
                prdIndexId: prePageParam.prdIndexId, // '1000000229',   // prePageParam.prdIndexId, // 比财产品唯一标识
                reqSerial: prePageParam.reqSerial || '' // '2019062018212791426033'   // prePageParam.reqSerial // 订单号
            }
            let res = await apiBank.apiInterestCalculation(data)
            runInAction(() => {
                this.rateInfo = res
            })
        } catch {
            runInAction(() => {
                this.rateInfo = {}
            })
        }
    }
    timer:any = null
    // 节流时间在一定时间执行一次
    throttle() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            if (!this.showErrType) {
                let { money } = this
                this.apiInterestCalculationFn()// 调用获取利息
            }
        }, 1000);
    }

    // 针对最小递增的校验
    minMoneyRule = (val: string | number) => {
        let { proInfo }: any = this
        // @ts-ignore
        if (val * 1 < proInfo.redeemMinLimitAmt) {
            runInAction(() => {
                this.showErrType = 1 // 支取金额需大于${MIN_MONEY}元
                this.rateInfo = {}
            })
            return false
        }
        if (proInfo.redeemMinIncreAmt >= 1) {
            // @ts-ignore
            if ((val * 1) % proInfo.redeemMinIncreAmt != 0) {
                runInAction(() => {
                    this.showErrType = 2 // 请输入递增金额的整数倍
                    this.rateInfo = {}
                })
            }
            return false
        }
        return true
    }
    // 针对支取的最大金额的校验
    ruleRedeemMoney = (val: string | number) => {
        let { prePageParam }: any = this
        // @ts-ignore
        if (val - 0 > prePageParam.amount - 0) {
            runInAction(() => {
                this.showErrType = 3 // 支取金额大于存款本金，请调整支取金额
                this.rateInfo = {}
            })
            return false
        } else {
            runInAction(() => {
                this.showErrType = 0 // 支取金额大于存款本金，请调整支取金额
            })
        }
        return true
    }
    // 子组件调用的方法
    changeMoney = (val: string | number, showStatus: number) => {
        if (/^0\w$/.test(<string>val)) return runInAction(() => {
            this.money = 0
        })
        runInAction(() => {
            this.money = val
        })
        if (!val) {
            runInAction(() => {
                this.rateInfo = {}
                this.showErrType = 0;
            })
            return
        }
        let { prePageParam, proInfo }: any = this
        let nextFlag = showStatus == 1 ? (this.minMoneyRule(val) && this.ruleRedeemMoney(val)) : this.ruleRedeemMoney(val)
        if (nextFlag) {
            // @ts-ignore
            let redeemMoney: any = (prePageParam.amount - 0) - (val - 0);
            // @ts-ignore
            if (prePageParam.amount - 0 != val - 0) {
                if (redeemMoney < proInfo.redeemRetainedAmt - 0) {
                    runInAction(() => {
                        this.showErrType = 4
                        this.rateInfo = {}
                    })
                    return
                }
            }
            runInAction(() => {
                this.showErrType = 0
            })
            if (this.isRequestRate) {
                this.throttle();
            }
        }
    }
    // 获取所有金额
    getAllMoney = (showStatus: number) => {
        let { prePageParam }: any = this
        let money = prePageParam.amount
        let nextFlag = showStatus == 1 ? (this.minMoneyRule(money) && this.ruleRedeemMoney(money)) : this.ruleRedeemMoney(money)
        if (nextFlag) {
            runInAction(() => {
                this.money = money
                this.showErrType = 0
            })
            { this.isRequestRate ? this.apiInterestCalculationFn() : null } // 调用获取利息
        }
    }
    nextStep = () => {
        try {
            redeemBtn() // 打点
        } catch (err) { }
        let { Config } = InitCom.get()
        //支取特殊活动弹框接口[晋中，新疆汇合]
        // this.isActivityPopup ? this.apiSpecialTipFn() : this.redeemNext();
        if (Config.needMsgCode) {
            this.reChangeNextNeedSMS()
        } else {
            this.reChangeNextNOSMS()
        }
    }
    // 需要验证码的操作
    reChangeNextNeedSMS = () => {
        runInAction(() => { this.isShowVerificationCodeBox = true })
        this.getSendCode()
    }
    // 不需要验证码的操作
    reChangeNextNOSMS = () => {
        this.apiRedeemFn()
        // TradeRequestMethod.apiRedemptionFn()
    }
    // 获取验证码
    getSendCode = () => {
        let { Config } = InitCom.get()
        let data: any = commonStore.query();
        let page: any = data && data.type || ''
        let { money, prePageParam, bankInfo, rateInfo, selectedIndex, getVerificationCodeFun }: any = this
        let params = {
            bizType: BIZ_TYPE.redeem,
            amount:money - 0,
            status: Config.sendCodeType,
            prdIndexId: prePageParam.prdIndexId,
            reqSerial: prePageParam.reqSerial,
            bankSerialNum:  prePageParam.bankSerialNum || '',
            bankElecAccountNum:  bankInfo.bankElecAccountNum,
            bankCardPhone:  bankInfo.cardList[(selectedIndex == null ? 0 : selectedIndex)].bankCardPhone, // 银行卡的手机号
            phoneNum: bankInfo.bankCardPhone, // 二类户的手机号
            page: page,
            rate: rateInfo.rate ? rateInfo.rate : ''
        }
        getVerificationCodeFun(params)
    }
    getVerificationCodeFun = (params: any) => {
        apiBank.apiSendPhoneCode(params).then((res: { validateCodeSerialNum: any; }) => {
            if (res.validateCodeSerialNum) {
                session.set('validateCodeSerialNum', res.validateCodeSerialNum)
            }
            this.verificationCodeRef.verificationCodeStart(this.seconds)
        }).catch(() => {
            this.verificationCodeRef.verificationCodeStart(0)
        })
    }
}
export default Store
