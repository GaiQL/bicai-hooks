import React, { useEffect } from 'react'
import './style.scss'
import { commonStore } from "Common/pages/store"
import { apiBankAll } from 'Common/api/bank'

const apiBank = new apiBankAll.ApiBankV2()
import { Headers } from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { observer, useLocalStore, useObserver } from "mobx-react-lite"
// 页面共享模块 用于引入 Config,Store,Handle,Item
import { InitCom } from "./index";
import IconSvg from "../IconSvg";
import { BIZ_TYPE } from 'Common/config/params.enum'

// 主渲染函数 Render名字必须存在
export let Render = () => {
    let { Config, Store, RenderPassWord, RenderBank } = InitCom.get()
    let { bindPhone, bindBank, bindSales, password } = Config
    useEffect(() => {
        Store.apiBandCardFn({
            bizType: BIZ_TYPE.moreService,
            transAmt: "",
            queryType: Config.bindCardDescType == 1 ? "3" : "0",
            prdIndexId: ""
        })
    }, [])
    return <div className='Service'>
        {/* 头部 */}
        <Headers>更多服务</Headers>
        <div className='Service-list'>
            {
                RenderBank(bindBank)
            }
            {
                renderPhone(bindPhone)
            }
            {
                renderSales(bindSales)
            }
            <RenderPassWord/>
            {/* {
                renderPassWord(password)
            } */}
            {/*新增用于某些银行多余拓展，直接重写该方法extendRenderDiv，一直放置到底部*/}
            {
                extendRenderDiv()
            }

        </div>
        <BottomColumn type='long' />
    </div>
}

//绑定银行卡管理模块
function RenderBank(flag: any) {
    let { Store, Config } = InitCom.get()
    let { bankCardName } = Store
    let { isShowBankCard } = Config
    return flag ? null : <p onClick={() => {
        handelBank()
    }}>
        <span>绑定银行卡管理</span>
        {
            bankCardName && isShowBankCard ?
                <span className="service-lineRight" >
                    {renderBindCardDesc()}
                    <IconSvg color='#999' />
                </span>
                :
                <span className="service-lineRight" onClick={() => {
                    handelBank()
                }}>
                    <IconSvg color='#999' />
                </span>
        }
    </p>
}
// 绑定银行卡
const handelBank = () => {
    commonStore.Hash.history.push('/boundBank?page=' + 'service')
}

//更换绑定手机号
function renderPhone(flag: boolean) {
    return (
        !flag ? null : <p onClick={() => {
            handelPhone()
        }}><span>更换绑定手机号</span>
            <span className="service-lineRight">
                <IconSvg color='#999' />
            </span>
        </p>)
}

//绑定销户管理模块
function renderSales(flag: boolean) {
    let { Store, Config } = InitCom.get()
    let { bankElecAccountNum } = Store
    let { isShowText } = Config
    bankElecAccountNum = bankElecAccountNum && bankElecAccountNum.substr(bankElecAccountNum.length - 4)
    return flag ? <p onClick={() => { cancelAccount() }}>
        <span>电子账户销户</span>
        <span>
            {
                isShowText ? `已开户：${bankElecAccountNum}` : null
            }

            <i className='iconfont pdl8' >&#xe633;</i>
        </span>
    </p> : null
}
//交易密码模版
/*
TODO
*/
export let RenderPassWord = (props: { flag?: any ;password?:boolean}) => {
    let { flag } = props
    let { Store } = InitCom.get()
    let { isSetPassword, isPassword } = Store
    console.log(isSetPassword)
    return flag ? <p onClick={() => {
        isPassword(isSetPassword)
    }}>
        <span>交易密码管理</span>
        {
            <span className="service-lineRight" >
                {Number(isSetPassword) ? "修改交易密码" : "设置交易密码"}
                <IconSvg color='#999' />
            </span>
        }
    </p> : null
}


// 新增用于某些银行多余拓展，直接重写该方法extendRenderDiv。可以参考 203 金城银行
function extendRenderDiv() {

}

function renderBindCardDesc() {
    let { Store, Config } = InitCom.get()
    let { bankCardName, bankCardLen } = Store
    let { bindCardDescType } = Config
    if (bindCardDescType == 1) {
        return <span color='#999'>已绑定{bankCardName}</span>
    }
    if (bindCardDescType == 2) {
        return <span color='#999'>已绑定{bankCardLen}张银行卡</span>
    }
}

// 绑定手机号
const handelPhone = async () => {
    let { Store } = InitCom.get()
    await handelPhoneCheck()
    commonStore.Hash.history.push('/changePhone?bandCardInfo=' + JSON.stringify(Store.bandCardInfo))
}
// 绑定手机号校验 如需要校验重写。如不需要校验不用重写
const handelPhoneCheck = () => {
    return Promise.resolve()
}

/**
 * @param val 底部弹框电话跳转
 */

const cancelAccount = () => {
    let state = {
        hotLine: '400-0088-692',
        serviceTime: '工作时间：9:00-24:00'
    }
    const callPhone = (val: string) => {
        window.location.href = `tel:${val}`;
    }
    commonStore.openAlert('提示', '电子账户销户请致电比财客服', [
        { text: <span style={{ color: "#999999" }}>取消</span>, onPress: () => console.log('取消') },
        { text: '立即拨打', onPress: () => callPhone(state.hotLine) },
    ])
}
export default {
    Render: observer(Render),
    RenderBank,
    RenderPassWord
}

