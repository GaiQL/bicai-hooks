import {observable, action, computed, decorate, runInAction} from "mobx";


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
        this.num++
        console.log(this.num)
    }

    @action.bound
    add_b() {
        this.num++
    }

    @action.bound
    async getMook(name: any) {
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

