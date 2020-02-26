import { observable, runInAction } from "mobx";
import { commonStore } from 'Common/pages/store'
import {BIZ_TYPE, SmsCodeType} from "Common/config/params.enum";
import { session } from "Common/utils/store";
import {apiBankAll} from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import {$Bus,BusName} from 'Common/Plugins/index'

interface IBankInfo {
    bankCardPhone:any,
    bankInfo:any,
    type:any
}
interface ModalContent {
    [index:string]: {
        title: string,
        text: string
    }
}
export class Store {
    @observable type = '' // 用于判断是银行卡相关过来的还是手机号相关过来的
    @observable flag = false
    @observable bankInfo!: IBankInfo // 银行卡相关的所有信息
    @observable validateCodeSerialNum = ''
    @observable phone = '' // 验证码展示的手机号
    @observable status = 1
    @observable bankCardNum = ''
    bankNamePY = '';
    @observable isShow = false
    @observable modalContent: ModalContent = {
        changeBank: {
            title: '绑定银行卡成功',
            text: '秒后自动跳转到银行卡管理页面'
        },
        changePhone: {
            title: '更换手机号成功',
            text: '秒后自动跳转到账户管理页面'
        }
    }
    @observable time = 3
    @observable modalType: string = ''

    getQuery = () =>{
        let { queryData, type}: any = commonStore.query()
        let bankInfo: any = queryData ? JSON.parse(queryData) : {}
        let bizType;
        if (type == SmsCodeType.addBankCard) {
            bizType = BIZ_TYPE.changeBankCard
        }
        if (type == SmsCodeType.changeBankCard) {
            bizType = BIZ_TYPE.changeBankCard

        }
        if (type == SmsCodeType.updatePhone) {
            bizType = BIZ_TYPE.changePhone
        }
        return {
            type,
            bankInfo,
            bizType
        }
    }

    initData = () => {
        let {bankInfo , type} = this.getQuery()
        console.log(bankInfo,"banInfo")
        let { newPhone, phone, bankCardPhone } = bankInfo

        runInAction(() => {
            this.bankInfo = bankInfo
            this.type = type  // addBank changeBank changePhone
            this.phone = newPhone || phone || bankCardPhone
            session.set("messagePhone", (newPhone || phone))
        })
    }

    changeModleState = (closeFn?:any) => {
        runInAction (() => {
            this.isShow = true
        })
        let timer = setInterval(() => {
            if ( this.time <= 0) {
                runInAction(() => {
                    this.time = 3
                    this.isShow = false
                })
                clearInterval(timer)
                closeFn && closeFn()
            } else {
                runInAction(()=>{
                    this.time = this.time-1
                })
            }
        }, 1000)
    }
    changeModalType = (type: string) => {
        runInAction (() => {
            this.modalType = type
        })
    }
    //
    /**
     * 发送验证码接口。可重写 更换手机号建议重写
     * @param bizType
     */
    async apiSendPhoneCodeFn(bizType: BIZ_TYPE | undefined, errFn?: undefined) {
        let { phone, newBank, oldCardInfo}: any = this.bankInfo || {}
        console.log(newBank,"newBank")
        const oldInfo = oldCardInfo?JSON.parse(oldCardInfo) : {}
        const newInfo = newBank ? JSON.parse(newBank) : {}
        // console.log('oldInfo',oldInfo)
        // console.log('newInfo',newInfo)
        let {bankCardPhone} = oldInfo
        let {bankCardNum} = newInfo
        console.log(bankCardNum,"bankCardNum")
        const params = {
            bizType,
            oldTelephone: bankCardPhone,
            bankCardPhone: phone || bankCardPhone || '', //手机号
            status: this.status, // 发送验证码的类型
            bankCardNum: bankCardNum,//  新增的银行卡号。
            bankNamePY: this.bankNamePY, //
            // userName: realName, //姓名
            // userCardId: userCardId,// 银行卡
        }
        // console.log('apiSendPhoneCodeFn>>>',params);
        // setTimeout(()=>{
        //     errFn && errFn()
        //     $Bus.emit(BusName.resetSms)
        // },2000)
        try {
            //短信验证接口
            let res: any = await apiBank.apiSendPhoneCode(params)
            let { validateCodeSerialNum } = res
            session.set("reqSerial", res)
            $Bus.emit(BusName.resetSms,true)
            runInAction(() => {
                this.validateCodeSerialNum = validateCodeSerialNum
            })
        } catch (e) {
            $Bus.emit(BusName.resetSms,false)
            console.log(e)
        }
    }

}
export default Store
