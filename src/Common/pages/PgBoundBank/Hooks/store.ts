import {observable, action, computed, decorate,runInAction} from "mobx";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
class Store {
    @observable bandCardInfo = {}

    @action.bound
    async getCardInfo(){
        const data = {
            bizType: BIZ_TYPE.moreService,
            transAmt: "",
            queryType: '0',
            prdIndexId: ""
        }
         let res = await apiBank.apiBandCard(data)
        runInAction(()=>{
            this.bandCardInfo = res
        })
    }
}

export default Store

