import { observable, runInAction } from "mobx";
import { commonStore } from 'Common/pages/store'
import { BIZ_TYPE, INNER_CODE, SmsCodeType } from "Common/config/params.enum";
import { session } from "Common/utils/store";
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import { $Bus, BusName } from 'Common/Plugins/index'
import { openSmsSubmitBtn } from 'Common/Plugins/recordLogInfo'
import { InitCom } from "./index";


interface IBankInfo {
    bankCardPhone: any,
    bankInfo: any,
    type: any
}
export class Store {
    public alterTitle = '开户失败'

    @observable type = '' // 用于判断是银行卡相关过来的还是手机号相关过来的
    @observable flag = false
    @observable bankInfo!: IBankInfo // 银行卡相关的所有信息
    @observable validateCodeSerialNum = ''
    @observable phone = '' // 验证码展示的手机号
    @observable status = 1
    @observable bankCardNum = ''
    @observable preBankAccountNo = ''
    @observable phoneNum = ''
    @observable data = {}
    @observable phoneNumTxt = '' // 展示的验证码
    bankNamePY = '';
    //初始化说句
    initData = () => {
        let { Config } = InitCom.get()
        const val: any = commonStore.query() || ''
        let phone = val[Config.phoneType]
        runInAction(() => {
            this.phoneNumTxt = phone && phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
            this.phoneNum = phone
        })
    }
    // 第一次进入 不请求验证码接口 并 让验证码倒计时
    firstGetYzm = () => {
        $Bus.emit(BusName.resetSms, true) // 主动触发验证码倒计时
    }

    /**
     * 发送验证码接口。可重写 更换手机号建议重写
     * @param bizType
     */
    apiSendPhoneCodeFn = async () => {
        let { Config } = InitCom.get()
        let openSuccessData = session.get('openSuccessData') || {};
        let { identNo = '', userName = '' } = session.get('FaceDiscernData') || {}
        let bankCardNum = session.get('bankInfo') ? session.get('bankInfo').bankInfo.bankCardNum : ''
        console.log(bankCardNum,"bankCardNumbankCardNum")
        this.getSendNo({
            [Config.phoneType]: this.phoneNum,//手机号
            reqSerial: openSuccessData.reqSerial || '', // 开户第一步返回reqSerial
            bizType: BIZ_TYPE.open,
            // bankUserId: '',
            // bankAcctNo: '',
            status: Config.sendCodeStatus, // 0：银行发 1：比财发（3.0）
            // bankCardNum,
            userName: userName,
            userCardId: identNo,
            bankCardNum: session.get("bankCardNum")
        })
    }
    //获取到(老字段)sendNo/(新字段)validateCodeSerialNum
    getSendNo = async (params: Record<string, any>) => {
        try {
            const res: any = await apiBank.apiSendPhoneCode(params)
            runInAction(() => {
                this.validateCodeSerialNum = res.validateCodeSerialNum //新字段
                this.preBankAccountNo = res.preBankAccountNo
            })
            $Bus.emit(BusName.resetSms, true)
        } catch (e) {
            switch (e.innerCode) {
                case INNER_CODE.CancelAndUpdateIdCard:
                    commonStore.openAlert(this.alterTitle, e.popMsg, [
                        { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                        {
                            text: '更新身份证', onPress: () => {
                                commonStore.Hash.history.push('/updateIdCard?openErr=' + INNER_CODE.CancelAndUpdateIdCard)
                            }
                        },
                    ])
                    break;
            }
            $Bus.emit(BusName.resetSms, false)
        }
    }
    confirm = async (yzm: string) => {
        try {
            openSmsSubmitBtn()
            let { verifyIdentity = '', liveOrderNo = '' } = session.get('openSuccessData')
            await this.sedYzm({
                validateCodeSerialNum: this.validateCodeSerialNum, //短信验证码Token,获取调取短信接口时返回1
                validateCode: yzm,            // 手机收到短信验证码
                validatePhoneNum: this.phoneNum,
                verifyIdentity: verifyIdentity || '',
                preBankAccountNo: this.preBankAccountNo,
                liveOrderNo
            })
            commonStore.Hash.history.replace('/openSuccess')//页面跳转
        } catch (e) {
            console.log(e)
            this.catchAlert(e)
        }

        commonStore.changeAlertTitle('开户失败')

    }
    // 开户第二步：
    sedYzm = async (params: Record<string, any>) => {
        const res: any = await apiBank.apiOpenAccount(params)
        session.set('openSuccessData', res)
        runInAction(() => {
            this.data = res
        })
        return res
    }
    catchAlert = (err: any) => {
        if (err.popType == 300 && err.innerCode && err.innerCode != INNER_CODE.SubmitOnly) {
            if (!err.innerCode) return
            let { confirmTit, hist } = commonStore.errCode(err.innerCode)
            console.log(hist, "hist0000")
            commonStore.openAlert('开户失败', err.popMsg, [
                { text: confirmTit, onPress: () => hist ? commonStore.Hash.history.replace(hist) : null },
            ])

        }
    }

}
export default Store
