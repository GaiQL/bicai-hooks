import {observable, action, computed, decorate, runInAction} from "mobx";
import {BIZ_TYPE, INNER_CODE,SmsCodeType} from 'Common/config/params.enum'
import {apiBankAll} from 'Common/api/bank'
import { commonStore } from "Common/pages/store"
import { session, StoreKey } from "Common/utils/store";
export type bankType = 'changeBank' | 'addBank'
import {InitCom} from "./index";

const apiBank = new apiBankAll.ApiBankV2()

class Store {
    @observable changeBindCardRes = {}
    @observable result: any = {}
    @observable cardNo = ''
    @observable flag: boolean = false
    @observable show: boolean = false
    @observable errTip = ''
    @observable timeEnd = null
    @observable validateCodeSerialNum = null
    @observable realName = ''
    @observable userCardId = ''
    @observable phone = ''
    @observable oldCardInfo: any = {}
    @observable defaultPhone = "";
    @observable HMBank_flag = false;

    bankHandleType = 'bankCardUpdate' //
    initData = async () => {
        // 初始化数据 多入口进入。
        let res: any = await apiBank.apiBandCard({
            bizType: BIZ_TYPE.moreService,
            transAmt: "",
            queryType: "0",
            prdIndexId: ""
        })
        runInAction(() => {
            this.defaultPhone = res.bankCardPhone
            this.realName = res.realName
            this.userCardId = res.userCardId
            if (res.cardList[0]) {
                this.oldCardInfo = {
                    bankCardNum: res.cardList[0].bankCardNum,
                    bankCardPhone: res.cardList[0].bankCardPhone,
                    cardList: res.cardList[0]
                }
            }
        })

    }

    next = async (value:Record<string,any>) => {
        let {bankCardInfo,phoneNo}  = value // 获取ocr扫描对银行信息
        console.log(value);
        let { userCardId } = this
        session.set("messagePhone", phoneNo)
        let {page}: any = commonStore.query() || {}
        // if (page) {
        //     session.set(StoreKey.changeBankOriginPage, page)
        // }
        let queryData = {
            page,// 从多个页面进入的字段（）
            phone:phoneNo,
            userCardId,
            newBank: JSON.stringify({ ...bankCardInfo }),
            oldCardInfo: JSON.stringify({ ...this.oldCardInfo })
        }
        this.goBoundBankYzm(queryData)
        runInAction(async () => {
            this.phone = ''
            this.cardNo = ''
        })
    }
    //对于单个银行跳转页面的判断
    goBoundBankYzm = (queryData:Record<string,any>)=> {
        // url 配置
        let {Config} = InitCom.get()
        // type => bankCardUpdate表示银行卡更新
        commonStore.Hash.history.push(`/serviceInputSmsCode?bizType=01&type=${Config.bankCardHandleType}&queryData=` + JSON.stringify(queryData))
    }
}

export default Store

