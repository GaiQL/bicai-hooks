/*
 * @Author: 张政
 * @LastEditors: OBKoro1
 * @Description: 持有中【固定变量status】
 * @Date: 2019-04-26 10:04:43
 * @LastEditTime: 2019-06-18 09:48:01
 */
import React, { Component } from 'react'
import './style.scss'
import { commonStore } from "Common/pages/store"
import src from 'public/static/images/what.png'
const NavHold = (props = '1', fn: (arg0: { tradeType: number; reqSerial: any; amount: any; prdIndexId: any; prdIndexName: any; fieldValue: any; buyDate?: any; expireDate?: any; prdDrawMode?: any }) => void, params: any, extraParams: {}, showModule?: (arg0: any) => void) => {
    // console.log(props, props)
    let obj: any = extraParams || {}
    const { dynamicList, orgName, prdIndexName, prdIndexId, prdName, status, bankName, reqSerial, buyDate, groupPrdFlag = '0' ,groupTradeProductId}: any = props
    // let reqSerial = reqSerial
    let amount = dynamicList['amount'].fieldValue
    let prdDrawMode = dynamicList['prdDrawMode'].fieldValue
    const element = <><span className="loding1">存款组合</span><span className="loding2">电子记账</span></>

    function returnColor(dictReturnPlanStatus: any) {
        switch (dictReturnPlanStatus) {
            case "0":
                return '待支付'
                break;
            case "1":
                return '处理中'
                break;
            case "2":
                return '支付成功'
                break;
            case "3":
                return '支付失败'
                break;
            case "3":
                return '撤销'
                break;
            case "5":
                return '已流标'
                break;
            case "6":
                return '待匹配'
                break;
            case "7":
                return '已匹配'
                break;
        }
    }
    return (
        <ul className="pro-box">
            <li className="item-pro">
                <div className="pro-name">
                    <p>
                        <b className={groupPrdFlag == '1' ? 'w' : ''}>{prdName && prdName}</b>
                        {status == '1' ? <span className="loding">支取中</span> : (status == '2' ? <span className="loding">已支取</span> : null)}
                        {groupPrdFlag == '1' ? element : null}
                    </p>
                    <p>{orgName}</p>
                </div>
                <div className='dayList'>
                    {
                        Object.keys(dynamicList).map((item, index) => {
                            if (item == 'prdDrawMode') {
                                return ''
                            } else if (item == 'reqSerial') {
                                return ''
                            } else if (item == 'rate') {
                                return (
                                    <p className={`item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`}
                                        key={index}>
                                        <span className='waht'><b>{dynamicList[item].fieldName}</b> {dynamicList[item].fieldUrl == '' ? null : <img src={src} alt="" onClick={() => {showModule && showModule(dynamicList[item].fieldUrl) }} />} </span>
                                        <span>{dynamicList[item].fieldValue}</span>
                                    </p>
                                )
                            } else if (item == 'orderStatus') {
                                return (
                                    <p className={`item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`}
                                        key={index}>
                                        <span>{dynamicList[item].fieldName}</span>
                                        <span>{returnColor(dynamicList[item].fieldValue)}</span>
                                    </p>
                                )
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
                {groupPrdFlag == '1' ?
                    <div className="pro-btns ">
                        <button className="detailBtn" onClick={() => {
                            obj.goDetail(groupTradeProductId)
                        }}>查看组合详情
                    </button>
                    </div>
                    : <div className="pro-btns ">
                        {/* "btn-first" */}
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
                                    expireDate: dynamicList.endDate.fieldValue,
                                    prdDrawMode
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
                }

            </li>
        </ul>
    )
}
export default NavHold


































//  import './style.scss'
// import React, { Component } from 'react'


// const NavHold = (props, fn, params, extraParams, showModule?) => {
//     // const {props, prdIndexId, prdIndexName, reqSerial, status, minRedmptAmt, minRedmptAmtMsg} = props.list
//     let obj: any = extraParams || {}
//     const { props, orgName, prdIndexName, prdIndexId, prdName, status, bankName, reqSerial }: any = props
//     return (
//         <ul className="pro-box">
//             <li className="item-pro">
//                 <div className="pro-name">
//                     <div className="pro-title">
//                         <b>{prdIndexName && prdIndexName}</b>
//                         {status ? null : <span>处理中</span>}
//                     </div>
//                     <div className='pro-bank'>{bankName}</div>
//                 </div>
//                 {
//                     dynamicList.map((item, index) => {
//                         return (
//                             <p className={`item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`}
//                                 key={index}>
//                                 <span>{item.fieldName}</span>
//                                 <span>{item.fieldValue}</span>
//                             </p>
//                         )
//                     })
//                 }
//                 {
//                     /*status ? <div className="pro-btns">
//                         <button
//                             onClick={props.drow.bind(this, prdIndexId, reqSerial, dynamicList[0].fieldValue)}>撤单
//                         </button>
//                         <button onClick={props.buy.bind(this, prdIndexId)}>追加投资</button>
//                     </div> : null*/
//                 }
//                 {
//                     status ? <div className="pro-btns">
//                         {
//                             props.productType ? <button
//                                 onClick={props.drow.bind(this, prdIndexId, reqSerial, dynamicList)}>
//                                 提前支取
//                         </button> : <button
//                                     onClick={props.drow.bind(this, prdIndexId, reqSerial, dynamicList)}>
//                                     撤单
//                         </button>
//                         }
//                         <button onClick={props.buy.bind(this, prdIndexId, dynamicList)}>追加投资</button>
//                     </div> : null
//                 }


//             </li>
//         </ul>
//     )
// }
// export default NavHold
