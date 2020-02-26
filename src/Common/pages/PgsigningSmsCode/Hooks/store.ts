import { session } from 'Common/utils/store'
import { commonStore } from "Common/pages/store"
import { observable, runInAction } from "mobx";
import { Native } from "Common/utils/appBridge"
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
class Store {
    @observable sendCodeFlag = false
    @observable phone = ''
    @observable query = ''
    @observable validateCodeSerialNum = ''
    @observable timer = 60
    @observable preBankAccountNo = ''
    @observable bankCardNum = ''


    initState = (phoneNum:string, bankCardNum:string) => {
        runInAction(() => {
            this.phone = phoneNum,  // 手机号
            this.bankCardNum = bankCardNum // 银行卡号
        })
    }

    // 签约验证
    GetApiRechargeSignVerif(params:Record<string,any>) {
        return apiBank.getApiRechargeSignVerif(params)
    }

    // 签约申请
    GetApiRechargeSignApply = async() => {
        let { phoneNum, bankCardNum, bankName }: any = commonStore.query()
        let params = {
            phoneNum: phoneNum,
            bankCardNum: bankCardNum,
            bankName: bankName
        }
        await apiBank.getApiRechargeSignApply(params).then((res:Record<string,any>) => {
            runInAction(() => {
                this.preBankAccountNo = res.preBankAccountNo
                this.sendCodeFlag = true
                this.validateCodeSerialNum = res.validateCodeSerialNum || ''
            })
        })
    }
    confirm = (code:string) => {
        let { preBankAccountNo, bankCardNum, validateCodeSerialNum } = this;
        let params = {
            validateCode: code,
            preBankAccountNo,
            bankCardNum,
            validateCodeSerialNum
        }
        // let data: any = commonStore.query()
        // let UnderdeliveryParams = session.get('rechargeParams')
        let { source }  = commonStore.query()
        this.GetApiRechargeSignVerif(params).then(() => {
            commonStore.openAlert('签约成功', '点击确定继续完成您的操作', [
                {
                    text: '确定', onPress: () => {
                        if (source == 'buy') {
                            commonStore.Hash.history.replace(`buy?proId=${session.get('proId')}`)
                        } else if (source == 'groupBuy') {
                            Native.closeWebView()
                        } else {
                            // commonStore.Hash.history.replace(`/dealSendCode?params=${JSON.stringify(UnderdeliveryParams)}&defaultCard=${data.defaultCard}`)
                            commonStore.Hash.history.replace(`/recharge`)
                        }
                    }
                },
            ])

        })
    }

    //验证码内部倒计时为0的时候重置父组件传入的验证码倒计时状态
    resetFlag = (flag:boolean) => {
        runInAction(() => {
            this.sendCodeFlag = false
        })
    }

    //在一次发送验证码
    againGetYzm = (callback?:Function) => {
        if (this.sendCodeFlag) {callback && callback()}
        this.GetApiRechargeSignApply()
    }

    // 发送验证码
    apiSendPhoneCodeFn = async () => {
        await this.GetApiRechargeSignApply()
    }
}

export default Store
