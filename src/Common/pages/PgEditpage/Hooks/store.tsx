import { observable, action, computed, decorate, runInAction } from "mobx";
import { BIZ_TYPE, INNER_CODE } from 'Common/config/params.enum'
import { apiBankAll } from 'Common/api/bank'

const apiBank = new apiBankAll.ApiBankV2()

class Store {
    @observable b = 0
    @observable a = 0
    @observable num = 0
    @observable result = {}
    initData = async () => {
        let res = await apiBank.cityInfo()
        // let res1 = await apiBank.addressCheck({
        //     detailAddress:"辽宁省"
        // })
        // console.log(res1,"---")
        runInAction(() => {
            this.result = res
        })
    }



}

export default Store

