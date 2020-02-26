import {observable, toJS, runInAction} from "mobx";
import {commonStore} from "Common/pages/store"
import {session, StoreKey} from "Common/utils/store";
import {BIZ_TYPE} from 'Common/config/params.enum'
import {Native} from "Common/utils/appBridge"
import {InitCom} from "./index";
import {apiBankAll} from 'Common/api/bank'
import {$Bus, BusName} from 'Common/Plugins/index'
const apiBank = new apiBankAll.ApiBankV2()
// 重写 ：更改银行卡:
interface OptionsType {
    extra:(queryData: any)=>Object
    error?:Function
    success?:(res: any, next?: any)=>any
}

// 申请添加银行卡
const addBank =  async (queryData: { newBank: string; yzm: any; }, options?:OptionsType) => {
    // @ts-ignore
    let {extra,success,error} = options
    let {phone}: any = queryData
    let newBank =queryData.newBank ? JSON.parse(queryData.newBank) : {}
    try {
        let res = await apiBank.addBindCard({
            bankCardNum: newBank.bankCardNum, //一类银行卡号
            bankCardPhone: phone,//卡银行预留手机号
            bankName: newBank.bankName,// 银行名称
            bankNo: newBank.bankNo,// 开户行编号
            newBankNo: newBank.bankNo,// 开户行编号
            validateCode: queryData.yzm,   // 短信验证码
            validateCodeSerialNum: session.get("reqSerial").validateCodeSerialNum, //短信验证码编
            reqSerial: session.get("reqSerial").reqSerial,  // 原请求流水号：添加银行卡后台返回reqSeria
            preBankAccountNo: session.get("reqSerial").preBankAccountNo,
            ...extra(queryData) // 额外参数 至于最后
        })
        success ? success(res,successGoBack):successGoBack()
    } catch (e) {
        error && error()
        // Toast.info(e.popMsg)
    }
}

const changeBank = async (queryData: { newBank: string; oldCardInfo?: string; validateCodeSerialNum?: any; yzm: any }, options?: OptionsType) => {
    let {extra=() => ({}),success,error} = options || {}
    let {phone}: any = queryData
    let newBank =queryData.newBank ? JSON.parse(queryData.newBank) : {}
    let oldCardInfo = queryData.oldCardInfo ? JSON.parse(queryData.oldCardInfo) : {}
    try {
        const newBindCard = newBank.bankCardNum
        const newTelPhone = phone || ''
        const newBankName = newBank.bankName || ''
        const newBankNo = newBank.bankNo || ''
        const oldBindCard = oldCardInfo.bankCardNum || ''
        const oldTelPhone = oldCardInfo.bankCardPhone ||''
        const bankNo = oldCardInfo.bankNo || ''
        const validateCodeSerialNum = queryData.validateCodeSerialNum
        const validateCode = queryData.yzm
        let res = await apiBank.changeBindCard({
            newBindCard,//绑定新银行
            newTelPhone, //新手机号
            newBankName, //新银行名称
            newBankNo, //新银行行号
            oldBindCard,//绑定旧银行
            oldTelPhone,//旧手机号
            bankNo,// 旧银行行号
            validateCodeSerialNum,
            validateCode, //验证码
            ...extra(queryData) // 额外参数 至于最后
        })
        success ? success(res,successGoBack):successGoBack()
    } catch (e) {
        error && error(e)
        $Bus.emit(BusName.resetSms,false)
        console.log(e)
    }
}


// 更换手机号
const changePhone = async (queryData: { validateCodeSerialNum: any; yzm: any; }, options?:OptionsType) => {
    let {oldPhone, newPhone, name, idCardNo}: any = queryData
    let {extra=() => ({}),success,error} = options|| {}
    let {Config} = InitCom.get()
    let {status} = Config;

    try {
        const res = await apiBank.changeBindCardPhone({
            oldTelPhone: oldPhone,
            newTelPhone: newPhone,
            validateCodeSerialNum: queryData.validateCodeSerialNum,
            validateCode: queryData.yzm,
            bizType: 1,
            status: status,
            realName: name,
            preBankAccountNo: session.get("reqSerial").preBankAccountNo,
            bankCardNo: session.get("moreServer").bankCardNum,
           ...extra(queryData)  // 额外参数，置于最后

        })
        success ? success(res, changePhoneSuccessGoBack) : changePhoneSuccessGoBack()
    } catch (e) {
        console.log(e,"----")
        error && error(e)
    }
    // runInAction(() => {
    //     this.newPhone = '',
    //         this.idCard = ''
    // })
}

const changePhoneSuccessGoBack = () => {
    commonStore.Hash.history.replace('/moreService')
}

//对于页面的判断 是从交易来的还是直接进入更多服务
const successGoBack = () => {
    let changeBankOriginPage = session.get(StoreKey.changeBankOriginPage)
    if (changeBankOriginPage == 'comBuying') {
        if (Native.isApp()) {
            Native.closeWebView()
        } else {
            alert('go comBuying !不在app内')
        }
        return
    }
    if (changeBankOriginPage) {
        commonStore.Hash.history.replace('/' + changeBankOriginPage)
        session.remove(StoreKey.changeBankOriginPage) // jie
    } else {
        commonStore.Hash.history.replace('/boundBank?page=service')
    }
}

let Handle ={
    addBank,
    changeBank,
    changePhone
}
export default Handle
