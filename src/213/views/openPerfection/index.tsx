import React from 'react'
import * as Index from "Common/pages/PgOpenPerfection/Hooks/index" // mian
import StoreBase from "Common/pages/PgOpenPerfection/Hooks/store"
import { commonStore } from "Common/pages/store"
import { perfectOpenInfoBtn } from 'Common/Plugins/recordLogInfo'
let Config = {
    // nextType:"openSuccess"
    nextType:'faceDiscern',
    ifUploadIDCardImgBase64:true
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
}
export const InitCom = Index.InitCom
export default Index.default({ Config, Item, Handle, Store })
