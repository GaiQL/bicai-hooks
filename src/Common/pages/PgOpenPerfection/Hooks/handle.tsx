import React, { useEffect, useState, useContext } from "react";
import { BIZ_TYPE, INNER_CODE } from 'Common/config/params.enum'
import { commonStore } from "Common/pages/store"
import { session } from 'Common/utils/store'
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import { InitCom } from "./index";
/**
 * 信息回显
 */
function catchFunction(this: any, e:errorType) {
    switch (e.innerCode) {
        case INNER_CODE.SubmitAndDoThing:
            commonStore.openAlert('开户失败', e.popMsg, [
                { text: '确定', onPress: () => console.log('确定') },
            ])
            break;
        case INNER_CODE.ModifyOpenInfo:
            commonStore.openAlert('开户失败', e.popMsg, [
                {
                    text: '修改开户信息', onPress: () => {
                        commonStore.Hash.history.replace('/openFlow')
                    }
                },
            ])
            break;
        case INNER_CODE.CancelAndUpdateIdCard:
            commonStore.openAlert(this.alterTitle, e.popMsg, [
                { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                {
                    text: '更新身份证', onPress: () => {
                        commonStore.Hash.history.push('/updateIdCard?openErr=' + INNER_CODE.CancelAndUpdateIdCard)
                    }
                },
            ])
            break;
    }
}
let Handle = {
}
export default Handle
