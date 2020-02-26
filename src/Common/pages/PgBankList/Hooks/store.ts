import {observable, action, computed, decorate, runInAction} from "mobx";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import {apiBankAll} from 'Common/api/bank'

const apiBank = new apiBankAll.ApiBankV2()

class Store {
    @observable result:any = {}
    initData = async () => {
        const res = await apiBank.apiSupportBankCards({})
        if (res) {
            runInAction(()=>{
                this.result = res
            })
        }
    }
}

export default Store

