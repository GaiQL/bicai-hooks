import React from 'react'
import * as Index from "Common/pages/PgOpenPerfection/Hooks/index" // mian
import StoreBase from "Common/pages/PgOpenPerfection/Hooks/store"
import { commonStore } from "Common/pages/store"
import { perfectOpenInfoBtn } from 'Common/Plugins/recordLogInfo'
import { apiBankAll } from 'Common/api/bank'
import { runInAction } from 'mobx'
const apiBank = new apiBankAll.ApiBankV2()
let Config = {
    // nextType:"openSuccess"
    nextType:'openInputSmsCode',
    ifUploadIDCardImgBase64:true,
    isIndustryVal:true //有没有行业
}

const Item = {
    // 新增Item


}

const Handle = {
    // 新增Handle
}

class Store extends StoreBase {
    nextStep = async () => {
        try {
            perfectOpenInfoBtn()
        } catch (err) {}
        commonStore.Hash.history.push('/faceDiscern?fromPage=open')
    }
    addressCheck=async(adress: any)=>{
        let res=await apiBank.addressCheck({
            detailAddress:adress
        })
        runInAction(()=>{
            this.EditAddress=res.detailAddress
        })
    }
}
export const InitCom = Index.InitCom
export default Index.default({ Config, Item, Handle, Store })
