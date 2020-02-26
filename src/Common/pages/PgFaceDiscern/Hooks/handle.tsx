import React,{useEffect, useState,useContext} from "react";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import {commonStore} from "Common/pages/store"
import {session} from 'Common/utils/store'
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import {InitCom} from './index'
import {Toast} from "antd-mobile";

// 识别验证成功
const checkContrastSuccess = () => {
    console.log('识别验证成功的操作，重写');
}
// 识别验证 不匹配 / 未知 / 接口请求失败
const checkContrastFailed = (e?:unknown) => {
    console.warn('视频上传识别失败后操作，建议重写：' + e)
    if (e) {
        // 这种情况就是接口 请求失败逻辑
    }
}

// 信息比对具体业务逻辑
const checkContrast = (res:Record<string,any>):void => {
    console.log(res,"res")
    const {checkContrastSuccess, Config} = InitCom.get()
    // console.log(res, "0000")
    // 可重写改方法。成功逻辑 和 失败逻辑
    // 验证状态 10=未知 20=识别验证匹配30=验证不匹配
    // txSN 交易流水号
    // traceNo CFCA交易跟踪号
    let {verification, image} = res
    //存储活体base64厦门国家更换绑定卡验证验证码的时候要用
    session.set('faceDiscernImg', image)
    if (verification == 30) {
        session.set('checkContrastSuccess', false) //
        Toast.info('活体检测失败,请重新录制后上传', 2)
    } else if (verification == 20) {
        // Toast.info('识别验证成功', 1)
        session.set('checkContrastSuccess', true) //
        checkContrastSuccess && checkContrastSuccess()
    } else {
        session.set('checkContrastSuccess', false) //
        Toast.info('未知', 1)
    }
}
let Handle ={
    checkContrastSuccess,
    checkContrastFailed,
    checkContrast
}
export default Handle
