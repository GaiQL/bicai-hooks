/**
 * 银行卡form表单
 */
import {useCallback, useState} from "react";
import {BcPhoneInput, BcBankInput} from 'Common/publicCommon/index'
import {imgSrc} from "Common/config/index";
import React from "react";
import {apiBankAll} from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import Tool from 'Common/utils/Tool'
import './style.scss';

export interface PersonInfoInterface {
    realName:any,
    userCardId:any
}
export interface PhoneInputInterface {
    getPhone?:Function
}
export interface BankCardInfoIntertface {
    getCardNo?:Function,
    getCardInfo?:Function, // 成功回显后
}

/**
 * 顶部个人信息组件
 */

export let PersonInfo = (props:PersonInfoInterface)=>{
    let {realName,userCardId} = props
    return  <p className='addNewBank-tit'>
        <span>{realName && ('*' + realName.substr(1))}</span>
        <span>{(() => {
            let useId = userCardId
            if (!useId) return ''
            return useId.substr(0, 1) + '****************' + useId.substr(-1)
        })()}</span>
    </p>
}


/**
 * 银行卡输入框
 * @constructor
 */

export function BankCardInfo(props:BankCardInfoIntertface){
    let {getCardNo,getCardInfo} = props
    let [flag,setFlag] = useState(false)
    let [show,setShow] = useState(false)
    let [result,setResult]:any = useState({})
    let [cardNo,setCardNo] = useState('')
    let [errTip,setErrTip] = useState('')

    const getImgData = async (val:string) => {
        let res: any = await apiBank.apiBankCardScan({
            bankCardNum: '',
            bankCardPhoto: encodeURIComponent(val.split(',')[1]),
            transcoding: "1"
        })
        setFlag(true)
        setShow(true)
        setResult(res)
        setCardNo(res.bankCardNum)
        getCard(res.bankCardNum);
    }
    // ocr识别银行卡
    const ocrApi =async (cardNo:unknown,success:successType,failed:failedType)=>{
        try {
            if (cardNo != Object) {
                let result: any = await apiBank.apiBankCardScan({
                    bankCardNum: cardNo,
                    // bankCardPhoto: '',
                    // transcoding: 0
                })
                success && success(result)
            }
        } catch (e) {
            failed && failed(e)
        }
    }
    // ocr接口：进行节流，useCallback用于缓存
    const throttleOcrApi = useCallback(debounce((cardNo:string,success:successType,failed:failedType)=>ocrApi(cardNo,success,failed),1000),[])

    const getCard =  (val:string) => {
        setCardNo(val)
        if (val == '') {
            setFlag(false)
            setShow(false)
            setResult({})
            setCardNo('')
            setErrTip('')
        }
        if (val.length >= 10) {
            throttleOcrApi(val,(result:object)=>{
                getCardInfo && getCardInfo(result)
                getCardNo && getCardNo(val,true)
                setFlag(true)
                setShow(true)
                setResult(result)
                setCardNo(val)
            },(e:errorType)=>{
                getCardNo && getCardNo(val,false)
                setFlag(false)
                setShow(true)
                setErrTip(e.popMsg || '')
            })
            return
        }
        getCardNo && getCardNo(val,false)

    }

    return  <BcBankInput tip={{
        flag, //设置当前文本框是否输入正确
        errTip,
        show, //设置当前提示信息是否显示
        logo: imgSrc + result.bankLogoUrl,
        value: result.bankName,
        value1: result.bankCardQuotaDescDto ? result.bankCardQuotaDescDto.singleDedctDesc : '',
        value2: result.bankCardQuotaDescDto ? result.bankCardQuotaDescDto.dayDedctDesc : ''
    }}
                         className='border'
                         getImgBase={(val:string) => getImgData(val)}
                         defaultValue={cardNo}
                         change={(e:string) => {
                             getCard(e)
                         }}> </BcBankInput>


}

/**
 * 手机号input框封装函数
 * @constructor
 */
export function PhoneInput(props:PhoneInputInterface){
    // let {Store} = InitCom.get()
    let {
        getPhone,
    } = props
    return <BcPhoneInput
        onChange={(e:string) =>{
            // true为校验成功
            let flag = Tool.Regular.bcphone.test(e)
            getPhone && getPhone(e,flag)
        }
        }
    > </BcPhoneInput>
}

// /**
//  * 节流函数
//  * @param fn
//  * @param timer
//  */
// export function throttle(fn,timer) {
//     let canRun = true; // 通过闭包保存一个标记
//     return function (..._args) {
//         if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
//         canRun = false; // 立即设置为false
//         setTimeout(() => { // 将外部传入的函数的执行放在setTimeout中
//             fn.apply(this, _args);
//             // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
//             canRun = true;
//         }, timer);
//     };
// }

/**
 * 防抖函数
 * @param fn
 * @param timer
 */
export function debounce(fn:Function,timer:number) {
    var timeout:any;
    return function(..._args:any) {
        if(timeout !== null)   clearTimeout(timeout);
        timeout = setTimeout(() => { // 将外部传入的函数的执行放在setTimeout中
            // @ts-ignore
            fn.apply(this, _args);
        }, timer);
    }
}
