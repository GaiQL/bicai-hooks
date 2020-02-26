import {observable, action, computed, decorate, runInAction} from "mobx";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import {apiBankAll} from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import { StoreExtends } from 'Common/Plugins/store.extends'
import { publicStore, commonStore } from "Common/pages/store"

class Store {
    Public = publicStore
    Store = commonStore
    openAnAccountAgreementContentFn = async (params?: any) => {
        return await apiBank.openAnAccountAgreementContent(params)
    }
}

export default Store

