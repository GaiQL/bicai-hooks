import PgTradingCode from 'Common/pages/PgTradingCode'
import { BIZ_TYPE } from 'Common/config/params.enum'
import { session } from 'Common/utils/store'
import { commonStore } from "Common/pages/store"
import { TradeRequestMethod } from "Common/pages/store"
let { apiRechargeFn } = TradeRequestMethod
class DealSendCode extends PgTradingCode {



    isAdditionalVerificationCode = true


    // 额外验证码请求参数【比如遇到特殊充值接口【金城，哈密】银行特殊】
    additionalVerificationCode = async (bizType: BIZ_TYPE, amount: any) => {
        if (bizType == BIZ_TYPE.recharge) {

            let { query }: any = this.state
            await this.rechargeVerificationCode(query.bankCardNum, query.bankName, query.phoneNum, amount)
            return
        }
    }

    // 充值请求验证码
    rechargeVerificationCode = async (bankCardNum: any, bankName: any, phoneNum: any, amount: any) => {
        let params = {
            bankCardNum,
            bankName,
            amount,
            phoneNum,
            reqType: '1'
        }
        // todo page 页面中不要请求接口。抽离到store里
        let data: any = {}

        try {
            data = await this.apiBank.apiRecharge(params)
            // 添加到本地存储，防止validateCodeSerialNum参数丢失报错\
            this.setState({
                sendCodeFlag: true
            })
            if (data.validateCodeSerialNum) {
                session.set('validateCodeSerialNum', data.validateCodeSerialNum)
            }
            if (data.reqSerial) {
                session.set('reqSerial', data.reqSerial)
            }
            return Promise.resolve(data)
        } catch (err) {
            this.setState({
                sendCodeFlag: false
            })
            return Promise.reject()
        }

    }
    // 抽离充值，方便特殊情况重写
    RechargeExternalFun = (query: any, code: any, phone: any) => {
        let { defaultCard }: any = commonStore.query()
        // 额外参数【如需添加其他参数，直接写到该对象中，到那边直接合并】
        let additionalParameters = {
            reqType: '2'
        }
        apiRechargeFn(query, additionalParameters, code, phone, defaultCard ? JSON.parse(defaultCard) : null)
    }
}

export default DealSendCode

