import {observable, action, computed, decorate, runInAction} from "mobx";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import {apiBankAll} from 'Common/api/bank'
import { commonStore } from "Common/pages/store"
import { session, StoreKey } from "Common/utils/store";
export type bankType = 'changeBank' | 'addBank'

const apiBank = new apiBankAll.ApiBankV2()

class Store {

}

export default Store

