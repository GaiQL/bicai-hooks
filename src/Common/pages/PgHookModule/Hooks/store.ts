import {observable, action, computed, decorate, runInAction} from "mobx";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import {apiBankAll} from 'Common/api/bank'

const apiBank = new apiBankAll.ApiBankV2()

class Store {
    @observable b = 0
    @observable a = 0
    @observable num = 0
    @observable result = {}

    @computed
    get watch() {
        console.log('get')
        return this.num * 30
    }

    @action.bound
    add_a() {
        console.log(this.num)
        this.num++
    }

    @action.bound
    add_b() {
        this.num++
    }

    @action.bound
    async getMook(name:string) {
        return Promise.resolve(() => {
            setTimeout(() => {
                runInAction(() => {
                    this.result = {
                        a: this.a,
                        b: this.b,
                        sum: this.a + this.b,
                        name
                    }
                })
            }, 1000)
        })
    }
}

export default Store

