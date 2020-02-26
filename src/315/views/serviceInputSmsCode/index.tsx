import React from 'react'
import * as Index from "Common/pages/PgServiceSmsCode/Hooks"
import StoreBase from "Common/pages/PgServiceSmsCode/Hooks/store"
import * as Type from "Common/pages/PgServiceSmsCode/Hooks/type"
import { observable, runInAction } from "mobx";
import {SmsCodeType} from 'Common/config/params.enum'
import {apiBankAll} from 'Common/api/bank'
import { INNER_CODE } from "Common/config/params.enum";
import {commonStore} from "Common/pages/store"

const apiBank = new apiBankAll.ApiBankV2()

//  新增重写
const Config:Type.ConfigType ={
    status: 0
}

const InitCom = Index.InitCom

function ErrorFn(e: { innerCode: any; popMsg: string | JSX.Element | undefined; }) {
    switch (e.innerCode) {
        case INNER_CODE.ModifyInfo:
            commonStore.openAlert('绑卡失败', e.popMsg, [
                {
                    text: '修改信息', onPress: () => {
                        commonStore.Hash.history.replace('/changeBank?page=service')
                    }
                },
            ])
            break;
        case INNER_CODE.SubmitAndDoThing:
            commonStore.openAlert('绑定失败', e.popMsg, [
                {
                    text: '确定', onPress: () => {
                        commonStore.Hash.history.replace('/changeBank?page=service')
                    }
                },
            ])
            break;
    }
}


const Item = {
    ErrorFn
}
// 新增Handle
const Handle = {}

class Store extends StoreBase {
    @observable status = 0
}

export default Index.default({Config, Item, Handle, Store})
