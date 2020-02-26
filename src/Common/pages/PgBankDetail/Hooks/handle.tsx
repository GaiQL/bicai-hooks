import React,{useEffect, useState,useContext} from "react";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import {commonStore} from "Common/pages/store"
import {session} from 'Common/utils/store'
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import {InitCom} from './index'

// 身份证状态校验
const idCardStatusFn = async () => {
    return apiBank.idCardStatus()
}

// 充值提现校验
const apiTradeCheckFn = (params:any) => {
    return apiBank.apiTradeCheck(params)
}
let Handle ={
    idCardStatusFn,
    apiTradeCheckFn
}
export default Handle
