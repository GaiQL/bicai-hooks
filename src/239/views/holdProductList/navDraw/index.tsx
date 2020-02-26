import React, { Component } from 'react'
import './style.scss'
import { commonStore } from "Common/pages/store"
import src from 'public/static/images/what.png'
const NavHold = (props: any, fn: any, params: any, extraParams: {}, showModule?: (arg0: any) => void) => {
    let obj: any = extraParams || {}
    const { dynamicList, orgName, prdIndexName, prdIndexId, prdName, status, bankName, reqSerial, buyDate, bankTransNo }: any = props
    // let reqSerial = reqSerial
    let amount = dynamicList['amount'].fieldValue
    return (
        <ul className="pro-box">
            <li className="item-pro">
                <div className="pro-name">
                    <p>
                        <b>{prdName && prdName}</b>
                        {/* {status == '1' ? <span className="loding">处理中</span> : (status == '2' ? <span className="loding">已支取</span> : null)} */}
                        {/* {nowTime < RaiseTime ? null : <span className="loding">处理中</span>} */}
                    </p>
                    <p>{orgName ? orgName : '所属银行'}</p>
                </div>
                <div className='dayList pd'>
                    {
                        Object.keys(dynamicList).map((item, index) => {
                            if (item == 'reqSerial') {
                                return ''
                            } else if (item == 'rate') {
                                return (
                                    <p className={`item-details ${index == dynamicList.length - 1 ? 'last-details' : ''}`}
                                        key={index}>
                                        <span className='waht'><b>{dynamicList[item].fieldName}</b> {dynamicList[item].fieldUrl == '' ? null : <img src={src} alt="" onClick={() => { showModule && showModule(dynamicList[item].fieldUrl) }} />} </span>
                                        <span>{dynamicList[item].fieldValue}</span>
                                    </p>
                                    // <div></div>
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
            </li>
        </ul>
    )
}
export default NavHold
