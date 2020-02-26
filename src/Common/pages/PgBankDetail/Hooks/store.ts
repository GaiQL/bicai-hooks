import {observable, action, computed, decorate,runInAction} from "mobx";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import { apiBankAll } from 'Common/api/bank'
import {Toast} from "antd-mobile";
const apiBank = new apiBankAll.ApiBankV2()
class Store {
    @observable apiQryAssetResult: any = {} // 页面
    @observable isHide:any = false // 眼睛按钮
    @observable closeType:boolean = true // 控制头部样式


    @action.bound
    setCloseType =  (type: boolean)=>{
        runInAction(() => {
            this.closeType = type
        })
    }

    @action.bound
    initData = async ()=> {
        const res: any = await apiBank.apiQryAsset()
        if (res) {
            runInAction(() => {
                this.apiQryAssetResult = res
                this.isHide = res.visibleState == 1
            })
        }
    }

    @action.bound
    setHide = async () => {
        let type = 2
        try {
            const res: any = await apiBank.bankHomeMessageStatus({ type })
            runInAction(() => {
                this.isHide = res.visibleState == 1 //
            })
        } catch (e) {
            Toast.info('网络异常，请稍后再试', 3)
        }
    }
}

export default Store

