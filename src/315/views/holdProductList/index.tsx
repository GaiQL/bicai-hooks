// import PgHoldProductList from 'Common/pages/PgHoldProductList'
// import React from 'react'
// import Store from './store'
// import { commonStore } from "Common/pages/store"
// import './style.scss'
// import HoldRow from './navHold'
// import NavDraw from './navDraw'
// import * as Index from "Common/pages/PgRedeem/Hooks"
// import StoreBase from "Common/pages/PgRedeem/Hooks/store"

// class Recharge extends PgHoldProductList {
//     Store = Store
//     Config = {
//         navList: ['持有中', '已支取'],
//         template: [HoldRow, NavDraw],
//         module: module,
//         interest: false
//     }
// }

// export default Recharge
import React from 'react'
import * as Index from "Common/pages/PgHoldProductList/Hooks";
import StoreBase from "Common/pages/PgHoldProductList/Hooks/store";
import { templateInter } from 'Common/pages/PgHoldProductList/Hooks/type';
// import {action, computed, observable} from "mobx"; // mian
//  新增重写
let Config = {
    extraText: `全部支取`,
    tipText: '预计收益仅供参考，实际收益以银行到账为准'
}
// 新增Item
const Item = {

    HoldTemplate : function( data:templateInter ){
        let { list, fn, extraParams, showModule } = data
        const { dynamicList, orgName, prdIndexName, prdIndexId, prdName, status, bankName, reqSerial, buyDate,expireDate}: any = list
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

                                console.log( dynamicList )
                                fn({
                                    tradeType: 40,
                                    reqSerial,
                                    amount,
                                    prdIndexId,
                                    prdIndexName,
                                    fieldValue: amount,
                                    buyDate: buyDate,
                                    expireDate: expireDate,
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
    
}
// 新增Handle
const Handle ={
    

}
class Store extends StoreBase{

}

export default Index.default({Config,Item,Handle,Store})

