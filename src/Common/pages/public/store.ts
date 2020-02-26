import { observable,runInAction } from "mobx";
import {StoreExtends} from 'Common/Plugins/store.extends'
import { commonStore } from 'Common/pages/store'
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()

class Public extends StoreExtends{
    @observable bandCardInfo:any = {}
    @observable openBank:string = ''

    Store = commonStore

    //qxx-查询登录用户某机构绑定卡信息
    apiBandCardFn = async(data?:Record<string,any>) =>{
        const res = await this.apiBank.apiBandCard(data)
        if (res) {
            runInAction(()=>{
                this.bandCardInfo = res
            })
        }
        return Promise.resolve(res)
    }

    // 查询用户余额
    apiQryEleAccountFn = async()=> {
        return await this.apiBank.apiQryEleAccount()
    }

    //  发送验证
    apiSendPhoneCodeFn = async(data:Record<string,any>) => {
        return await this.apiBank.apiSendPhoneCode(data)
    }

    //  业务查询
     apiQueryBizStatusFn  = async (data:Record<string,any>) => {
        return await this.apiBank.apiQueryBizStatus(data)
    }
    //绑定银行卡
    handelBank = () =>{
        this.Store.Hash.history.push('/boundBank?page='+'service')
    }
    //绑定手机号
    handelPhone = async () =>{
        this.Store.Hash.history.push('/changePhone?bandCardInfo='+JSON.stringify(this.bandCardInfo))
    }
}

export const publicStore = new Public()
export default Public
