import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite'
import './style.scss'
import {Headers} from 'Common/publicCommon'
import {ListView} from 'antd-mobile';
import {commonStore} from 'Common/pages/store'
import { InitCom } from './index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { templateInter } from './type'
declare var window:any

// let MAssetHead = observer(AssetHead)
// let MNavTopTip = observer(NavTopTip)
// let MNavList = observer(NavList)
// let MListContent = observer(ListContent)
// let MHoldTemplate = observer(HoldTemplate)
// let MDrawTemplate = observer(DrawTemplate)
// let MCancelTemplate = observer(CancelTemplate)
// let MShowRowContent = observer(ShowRowContent)

// 初始化执行函数，可重写
async function initFunc(FuncList:Record<string,Function>) {
    let { initStatus, getHoldInfo } = FuncList
    await initStatus()
    await getHoldInfo()
}

function Render() {
    useEffect(() => { console.log('aa') }, [])
    let { Store, Config } = InitCom.get()
    const { navList, className, leftColor,navTopStr } = Config
    const { totalIncomeDesc, totalHoldAmountDesc, list, navStatus, switchNav } = Store
    const { getHoldInfo, initStatus } = Store
    let query: any = commonStore.query()
    useEffect(() => {
        let FuncList = { initStatus, getHoldInfo }
        let flag = true
        const fv = async () => {
            if(!flag) return
            flag = false
            initFunc(FuncList)
            setTimeout(() => {
                flag = true
            }, 1000)
        }
        fv()
        window.onRestart = async function () {
            fv();
        } // 安卓初始化数据
        window.appear = function () {
            fv();
        }// ios初始化数据
        window.pageAppear = function () {
            fv()
        }// ios初始化数据
    }, [])
    return (
         <div className="deposit">
            <Headers className={className} leftColor={leftColor}>{query.prdTypeName}</Headers>
            <AssetHead totalHoldAmountDesc={totalHoldAmountDesc} totalIncomeDesc={totalIncomeDesc}/>
            { navTopStr ? <NavTopTip navTopStr={navTopStr}/> : ''}
            <NavList navArray={navList} switchNav={switchNav} navStatus={navStatus}/>
            <ListContent/>
            {/* {
                this.Config.interest
                    ? this.Config.module.prototype.isReactComponent ? <this.Config.module moduleFlag={moduleFlag}
                                                                                        onClose={onClose}/> : this.Config.module(moduleFlag, onClose, incomeUrl)
                    : null
            } */}
        </div>
    )
}
// 资产的头部
interface AssetHeadInter {
    totalHoldAmountDesc: string,
    totalIncomeDesc: string
}
function AssetHead(props: AssetHeadInter) {
    let { totalHoldAmountDesc, totalIncomeDesc} = props
    return (
        <div className="important-info">
            <div>
                <p>{totalHoldAmountDesc}</p>
                <p>总资产(元)</p>
            </div>
            <p className="line"/>
            <div>
                <p>{totalIncomeDesc}</p>
                <p>累计收益(元)</p>
            </div>
        </div>
    )
}
// nav上方的tip信息
interface NavTopTipInter {
    navTopStr: string
}
function NavTopTip(props: NavTopTipInter) {
    let { navTopStr } = props
    return  <p className="list_topNote">{navTopStr}</p>
}
// nav
interface NavListInter {
    navArray: Array<string>,
    switchNav: Function,
    navStatus: number
}
function NavList(props: NavListInter) {
    let { navArray, switchNav, navStatus } = props
    function changeNav(index:unknown) {
        switchNav(index)
    }
    return (
        <div className={navArray.length == 0 ? "nav noNav" : "nav"} id='nav'>
            {
                navArray.map((item, index) => {
                    return (
                        <span className={navStatus == index ? 'hold-active' : ''} onClick={() => changeNav(index)}
                        key={index}>{item}</span>
                    )
                })
            }
        </div>
    )
}
// 中间滚动部分
function ListContent() {
    let { Store } = InitCom.get()
    const { dataSource, isLoading, currentPageStatus, list, onEndReached } = Store
    return (
        <ListView
            className={!list.length ? 'list-box' : ''}
            dataSource={dataSource}
            renderFooter={() => (<div style={{padding: 10, textAlign: 'center'}}>
                {isLoading ? '正在加载中...' : (currentPageStatus ? '已全部加载完成' : '暂无数据')}
            </div>)}
            renderRow={ShowRowContent} // 控制每一行的样式 以及结构
            style={{flexGrow: 1}}
            onEndReached={() => onEndReached()} // 当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足这个距离时候请求接口
            onEndReachedThreshold={10} // 距`离底部滑动的距离
        >
            <BottomColumn type='long'/>
        </ListView>
    )
}

// 持有中的模板
function HoldTemplate(data: templateInter) {
    let { list, fn, extraParams, showModule } = data
    const { dynamicList, orgName, prdIndexName, prdIndexId, prdName, status, bankName, reqSerial, buyDate}: any = list
    let amount = dynamicList['amount'] && dynamicList['amount'].fieldValue
    // let prdDrawMode = dynamicList['prdDrawMode'].fieldValue
    return (
        <ul className="pro-box">
            <li className="item-pro">
                <div className="pro-name">
                    <p>
                        <b>{prdName && prdName}</b>
                        {status == '1' ? <span className="loding">支取中</span> : (status == '2' ? <span className="loding">已支取</span> : null)}
                    </p>
                    <p>{orgName}</p>
                </div>
                <div className='dayList'>
                    {
                        Object.keys(dynamicList).map((item, index) => {
                            return (
                                <p className={`item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`}
                                    key={index}>
                                    <span>{dynamicList[item].fieldName}</span>
                                    <span>{dynamicList[item].fieldValue}</span>
                                </p>
                            )
                        })
                    }
                </div>
                <div className="pro-btns ">
                    <button className={`btn-first ${status != 0 ? 'btn-first-no' : 'btn-first'}`}
                        onClick={status != 0 ? ()=>{} : () => {
                            fn({
                                tradeType: 40,
                                reqSerial,
                                amount,
                                prdIndexId,
                                prdIndexName,
                                fieldValue: amount,
                                buyDate: buyDate,
                                expireDate: dynamicList.profitEndTime.fieldValue,
                                // prdDrawMode
                            })
                        }}>提前支取
                    </button>
                    <button className="pro-last" onClick={() => {
                        fn({
                            tradeType: 30,
                            reqSerial,
                            amount,
                            prdIndexId,
                            prdIndexName,
                            fieldValue: amount,
                        })
                        }}>再次存入
                    </button>
                </div>
            </li>
        </ul>
    )
}
// 已支取的模版
function DrawTemplate(data: templateInter) {
    let { list, fn, extraParams, showModule } = data
    const { dynamicList, orgName, prdName }: any = list
    return (
        <ul className="pro-box">
            <li className="item-pro">
                <div className="pro-name">
                    <p>
                        <b>{prdName && prdName}</b>
                    </p>
                    <p>{orgName ? orgName : '所属银行'}</p>
                </div>
                <div className='dayList pd'>
                    {
                        Object.keys(dynamicList).map((item, index) => {
                            if (item == 'reqSerial') {
                                return ''
                            } else {
                                return (
                                    <p className={`item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`}
                                        key={index}>
                                        <span>{dynamicList[item].fieldName}</span>
                                        <span>{dynamicList[item].fieldValue}</span>
                                    </p>
                                )
                            }
                        })
                    }
                </div>
            </li>
        </ul>
    )
}
// 已撤单的模版
function CancelTemplate(data: templateInter) {
    let { list, fn, extraParams, showModule } = data
    const { dynamicList, orgName, prdName }: any = list
    return (
        <ul className="pro-box">
            <li className="item-pro pd">
                <div className="pro-name">
                    <p>
                        <b>{prdName && prdName}</b>
                    </p>
                    <p>{orgName}</p>
                </div>
                <div className='dayList'>
                    {
                        Object.keys(dynamicList).map((item, index) => {
                            return (
                                <p className={`item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`}
                                    key={index}>
                                    <span>{dynamicList[item].fieldName}</span>
                                    <span>{dynamicList[item].fieldValue}</span>
                                </p>
                            )
                        })
                    }
                </div>

            </li>
        </ul>
    )
}

function ShowRowContent(data:unknown):JSX.Element{
    let { Store,HoldTemplate,DrawTemplate,CancelTemplate } = InitCom.get()
    const { navStatus, apiTradeCheckFn, unPayProfit, totalIncome, showModule, goDetail} = Store
    // 针对异样的额外的参数, 不可以删除 只可以累加参数  goDetail组合购买按钮跳转路由
    const extraParams = {
        unPayProfit,
        totalIncome,
        goDetail
    }
    let templateList = [HoldTemplate, DrawTemplate, CancelTemplate]
    // data: 数据源, apiTradeCheckFn: 校验方法, extraParams： 格外参数, showModule
    let templateParams: templateInter = {
        list: data,
        fn: apiTradeCheckFn,
        extraParams,
        showModule,
    }
    return templateList[navStatus](templateParams)
}
export default {
    Render: observer(Render),
    AssetHead,
    NavTopTip,
    NavList,
    ListContent,
    HoldTemplate,
    DrawTemplate,
    CancelTemplate,
    ShowRowContent,
}
