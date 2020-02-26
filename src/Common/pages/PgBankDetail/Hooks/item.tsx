import React, {useEffect, useState, useContext} from 'react'
import './style.scss'
import { Toast} from 'antd-mobile'
import {imgSrc} from "Common/config/index";
import {commonStore} from "Common/pages/store"
import {apiBankAll} from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import {Headers} from 'Common/publicCommon/index'
import {BcButton} from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer} from "mobx-react-lite"

// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";
import IconSvg, {IconCloseEyes, IconOpenEyes, IconSet} from "./IconSvg";
import { session } from "Common/utils/store";
import copy from 'copy-to-clipboard';
import { Native } from "Common/utils/appBridge"
import { INNER_CODE } from "Common/config/params.enum";
const { openAlert, changeAlertTitle } = commonStore || {}

// 主渲染函数 Render名字必须存在
export const Render = ():JSX.Element => {
    let {Store,TwoCardTemplate} = InitCom.get()
    console.log(Store)
    let {apiQryAssetResult:result,isHide, setHide,closeType} = Store
    useEffect(()=>{
         Store.initData()
    },[])
    let userAccount = splitCardNo(result.bankElecAccountNum)
    console.log(result)
    const toHoldProductList = (item:any) => {
        commonStore.Hash.history.push(`/holdProductList?depositTypeId=${item.depositTypeId}&prdType=${item.prdType}&prdTypeName=${item.prdTypeName}`)
    }
    async function goBuyOther(){
        if (Native.isApp()) {
            try {
                await Native.goBankList({
                    data: {
                        routeKey: 'bankProductList',
                        orgId: require('Common/config/index').ORG_ID,
                        orgName: require('Common/config/index').ORG_NAME
                    }
                }, false)   //银行列表

            } catch (e) {
                Toast.info(e)
            }
        } else {
            Toast.info('不再app内')
        }

    }
    return  <div className={'BankDetail'}>
        {/* 头部 */}
        <Headers type={closeType ? "close" : "back"}>{result.bankName || ' '}</Headers>
        {/*userCardIdCheck 身份证审核状态（2审核未通过 1通过）*/}
        {/*cardStatusMsg 身份证过期状态描述(资产首页顶部错误描述)*/}
        {/*userCardIdExpire 身份证过期状态（0正常 1过期）*/}
        {console.log(result.userCardIdExpire)}
        {
            (result.userCardIdCheck == 2 || result.userCardIdExpire == 1)
                ? <p
                    onClick={() => {
                        commonStore.Hash.history.push('/updateIdCard?type=bankDetail')
                    }}
                    className='BankDetail-tip'><span>{result.cardStatusMsg}</span><IconSvg color='#F4AA39' /></p>
                : null
        }
        <TwoCardTemplate {...{result, isHide, setHide, userAccount}}/>
        <div className='BankDetail-property'>
            <div className='BankDetail-property-detail'>
                <p>
                    <span>总资产</span>
                    <span>(元)</span>
                </p>
                <p>
                            <span onClick={() => {
                                commonStore.Hash.history.push({
                                    pathname: '/tradingDetail', query: {
                                        a: 1,
                                        b: 2
                                    }
                                })
                            }}>明细</span>
                    <IconSvg wid='11' hte='11' />
                </p>
            </div>
            <p className='BankDetail-property-money'><span>{isHide ? result.totalAssetDesc : "***********"}</span>
            </p>
            <div className='BankDetail-property-earnings'>
                <p>
                    <span>昨日收益</span>
                    <span>{isHide ? ((result.ysdIncome >= 0 ? '+' : '') + (result.ysdIncomeDesc || '0.00')) : "*****"}</span>
                </p>
                <p>
                    <span>累计收益</span>
                    <span>{isHide ? (((result.totalIncome && result.totalIncome >= 0) ? '+' : '') + (result.totalIncomeDesc || '0.00')) : "********"}</span>
                </p>
            </div>
        </div>
        <div className='BankDetail-product-list'>
            <div className='BankDetail-product-tit'>
                <p>持有产品</p>
            </div>
            {
                result.prodList && result.prodList.map((item:Record<string,any>, index:number) => {
                    return <p
                        onClick={() => {
                            // holdProductList deposit
                            toHoldProductList(item)
                            // Native.goChiC({prdTypeId:item.prdType,depositTypeId:item.depositTypeId,pId:''})
                        }}
                        key={index}>
                                <span><svg width={4} height={4} className='circle'>
                                    <circle cx="2" cy="2" r="2" fill="#508CEE" />
                                </svg>
                                    {item.prdTypeName}</span>
                        <span>{isHide ? '¥' + item.holdAmountDesc : "****"}</span>
                    </p>
                })
            }
        </div>
        {
            session.get('isBicaiApp') == '1' ?
                <p className='BankDetail-prod-check' onClick={()=>{goBuyOther()}}>
                    <span>查看本行全部产品</span>
                    <IconSvg />
                </p> : null
        }
        {/* <BottomColumn type="tran"/> */}
        <BottomColumn type='long' />
    </div>
}



// 只做日切判断
const judgeFnDate = async (type:judgeType, apiTradeCheckFn:Function) => {
    let {Store} = InitCom.get()
    changeAlertTitle('维护信息')
    try {
        if (type == '充值') {
            await apiTradeCheckFn({ tradeType: 10 })
            commonStore.Hash.history.push('/recharge')
        }
        if (type == '提现') {
            await apiTradeCheckFn({ tradeType: 20 })
            session.set('withdrawType', 'bankDetail')
            commonStore.Hash.history.push('/withdraw')
        }
    } catch (err) {
        switch (err.innerCode) {
            case INNER_CODE.CancelAndUpdateIdCard:
                openAlert(type + '失败', err.popMsg, [
                    {
                        text: '取消', onPress: () => {
                            console.log('取消');
                        }
                    },
                    {
                        text: '更新身份证', onPress: () => {
                            commonStore.Hash.history.push('/updateIdCard')
                        }
                    },
                ])
                break;
            case INNER_CODE.PasswordNotSet:
                openAlert('提示', err.popMsg, [
                    {
                        text: '立即设置', onPress: async () => {
                            let url = window.location.href.split("#/")[0]
                            try {
                                await apiBank.resetPayPwd({
                                    tranBackAdd: url + "#/bankDetail",
                                    tranBackExceptAdd: url + "#/bankDetail",
                                    fallbackUrl: url + "#/bankDetail",
                                    operateType:"06"
                                }).then((data: any) => {
                                    let url = data.operateURL //获取银行url地址
                                    Store.setCloseType(false)
                                    window.location.href = url
                                })
                            } catch (error) {

                            }
                        }
                    },
                ])
                break;
            case INNER_CODE.goBcFaceDiscern: // 比财活体暂时跳过，到下一页判断吧
                openAlert('提示', err.popMsg, [
                    {text: '取消', onPress: () => console.log('取消'), style: {color: "#999999"}},
                    {
                        text: '确定', onPress: () => {
                            commonStore.Hash.history.push(`/faceDiscern?type=back&backPath=${window.location.hash.split('?')[0].substr(1)}`)
                        }
                    },
                ])
                break;
        }
    }
}
type judgeType = '充值' | '提现'
// 做身份验证和日切判断
const judgeFn = async (type:judgeType, idCardStatusFn:Function, apiTradeCheckFn:(params:Record<string,any>)=>any) => {
    changeAlertTitle('维护信息')
    try {
        await idCardStatusFn()
        try {

            if (type == '充值') {
                await apiTradeCheckFn({ tradeType: 10 })
                commonStore.Hash.history.push('/recharge')
            }
            if (type == '提现') {
                await apiTradeCheckFn({ tradeType: 20 })
                session.set('withdrawType', 'bankDetail')
                commonStore.Hash.history.push('/withdraw')
            }
        } catch (err) {

        }

    } catch (err) {
        if (err.innerCode && err.innerCode == INNER_CODE.CancelAndUpdateIdCard) {
            openAlert(type + '失败', err.popMsg, [
                { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                {
                    text: '更新身份证', onPress: () => {
                        commonStore.Hash.history.push('/updateIdCard')
                    }
                },
            ])
        }
    }
}

function splitCardNo(num:string) {
    let arr:string[] = []
    if (num) {
        let bankNoArr: any = num.split('')
        for (let i = 0, j = 0; i < bankNoArr.length; i++) {
            if (!arr[j] && arr[j] !== '') arr[j] = ''
            if (i / 4 < j + 1) {
                arr[j] += bankNoArr[i]
            } else {
                arr[j + 1] = ''
                arr[j + 1] += bankNoArr[i]
                j++
            }
        }
    }
    return arr
}
function  TwoCardTemplate ({result,isHide,setHide,userAccount}:{
    result:Record<string,any>;
    isHide:boolean;
    setHide:Function;
    userAccount:string[]
}):JSX.Element{
    let {idCardStatusFn,apiTradeCheckFn} = InitCom.get()
    const topUp = (type:judgeType) => {
        // this.judgeFn(type, idCardStatusFn, apiTradeCheckFn)
        // 身份证状态； 0正常，1过期
        // 身份证审核状态； 0审核中，1审核成功，2审核失败
        judgeFnDate(type, apiTradeCheckFn)
    }
    return <div className='BankDetail-card'>
        <div className='BankDetail-card-bg'>
            {/* <img className="BankDetail-card-bg-img" src={imgSrc + result.logBackgroundUrl} alt="" /> */}
            {
                result.bankBgUrl ?
                    <img className="BankDetail-card-bg-img" src={imgSrc + result.bankBgUrl} alt="."
                         onClick={() => {
                             return false
                         }} /> : <img className="BankDetail-card-bg-img"
                                      src='https://finsuit-test.oss-cn-beijing.aliyuncs.com/ORG/5f61d266-e7af-41fe-99e8-3bb529e71b6c.jpg'
                                      alt="." onClick={() => {
                        return false
                    }} />
            }
            <p className='BankDetail-card-logo'>
                <img src={imgSrc + result.bankLogo} alt="" />
            </p>
            <p className='BankDetail-card-bankName'>
                <span>{result.bankName}</span>
            </p>
            <p className='BankDetail-card-iconHide' onClick={() => setHide()}>
                {
                    isHide ? <IconOpenEyes /> : <IconCloseEyes />
                }
            </p>
            <p className='BankDetail-card-iconSet' onClick={() => {
                commonStore.Hash.history.push('/moreService')
            }}>
                <IconSet />
            </p>

            <p className={'BankDetail-card-bankNum'}>
                {
                    userAccount.map((num, index) => {
                        return <span key={index}>{isHide ? num : num.replace(/\d/g, '*')}</span>;
                    })
                }
            </p>
            <p className={'BankDetail-card-copy'} onClick={() => {
                copy(result.bankElecAccountNum);
                Toast.info('复制成功')
            }}>
                <span>复制</span>
            </p>

            <div className='BankDetail-card-oper'>
                <p>
                    <span>账户余额</span>
                    <span>{isHide ? result.balanceDesc : "******"}</span>
                </p>
                <p>
                    <span onClick={()=>{topUp( '充值')}}>充值</span>
                    <span onClick={()=>{topUp('提现')}}>提现</span>
                </p>
            </div>
        </div>
    </div>
}


export default {
    Render:observer(Render),
    judgeFnDate,
    judgeFn,
    TwoCardTemplate
}

