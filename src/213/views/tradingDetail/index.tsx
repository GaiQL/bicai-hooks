// import React from 'react'
// import PgTradingDetail from 'Common/pages/PgTradingDetail'
import help from 'Common/utils/Tool'
import './style.scss'
// import Store from './store'

// const defaultTemplate = (data) => {
//     return (
//         <section className="details-list">
//             <h5>{help.fromatDateYear(data.title)}</h5>
//             <ul>
//                 {
//                     data.lists.map((item, index) => {
//                         return (
//                             <li key={index} >
//                                 <p className="titles">
//                                     <span className="title">
//                                         {/* {item.transTypeName} */}
//                                         {/* {item.transType == 1 ? '出金' : '入金'} */}
//                                         {item.transTypeName}
//                                     </span>
//                                     <span className="describe">

//                                         {item.transStatus == 1 ? '成功' : (item.transStatus == 2 ? '失败' : '处理中') }
//                                     </span>
//                                 </p>
//                                 <p>
//                                     <span className="date">{item.operaTime}</span>
//                                     {/* 1 充值 2 提现 3 购买 4赎回 5入息 */}
//                                     <span className={`money ${(item.transType == 1 ? 'add-money' : 'reduce-money')}`}>
//                                         {
//                                             (item.transType == 2 ? '-' : '+') + item.transAmt
//                                         }
//                                     </span>

//                                 </p>

//                             </li>
//                         )
//                     })
//                 }
//             </ul>
//         </section>
//     )
// }
const defaultTemplate = (data: { title: string; lists: any[] }) => {
    console.log(data)
    // 读取状态
    const typeCheckingFn = (transType: any): string | undefined=> {
        switch (Number(transType)) {
            case 0:
                return '开户'
                break;
            case 1:
                return '充值'
                break;
            case 2:
                return '提现'
                break;
            case 3:
                return '存入'
                break;
            case 4:
                return '提前支取'
                break;
            case 5:
                return '到期支取'
                break;
            case 6:
                return '交易密码设置'
                break;
            case 7:
                return '交易密码修改'
                break;
            case 8:
                return '交易密码验证'
                break;
        }
    }
    return (
        <section className="trading-details-list">
            <h5>{help.fromatDateYear(data.title)}</h5>
            <ul>
                {
                    data.lists.map((item, index) => {
                        return (
                            <li key={index} className={item.transType == 4 || item.transType == 5 ? '' : 'lineheight'}>
                                <p>
                                    <span className="title">
                                        {typeCheckingFn(item.transType)}
                                    </span>
                                    <span className="desc">{item.transTypeName}</span>
                                </p>
                                <p>
                                    <span className="date">{item.operaDate}</span>
                                    {/* 1 充值 2 提现 3 购买 4赎回 5入息 */}
                                    {/* {交易类型 1：入金 3：出金} */}
                                    <span className={`money ${item.transType == 2 || item.transType == 3 ? 'reduce-money' : 'add-money'}`}>
                                        {
                                            (item.transType == 2 || item.transType == 3 ? '-' : '+') + item.transAmt
                                        }
                                    </span>
                                </p>
                                {item.transType == 4 || item.transType == 5 ? <p>收益：+{item.inComeDesc}</p> : null}
                            </li>
                        )
                    })
                }
            </ul>
        </section>
    )
}
// const DepositDetails = Component => {
//     return class DepositDetails extends PgTradingDetail {
//         render(): any {
//             return <Component {...this.props}
//                 headerArr={['交易明细']}
//                 isTabdsiable={false}
//                 defaultTemplate={defaultTemplate}
//                 Store={Store}
//             />
//         }
//     }
// }

// export default DepositDetails(PgTradingDetail)

import React from 'react'
import * as Index from "Common/pages/PgTradingDetail/Hooks/index"
import StoreBase from "Common/pages/PgTradingDetail/Hooks/store"
import { action, computed, observable ,runInAction} from "mobx"; // mian

//  新增重写
let Config = {

}

const Item = {
    // 新增Item
    defaultTemplate: defaultTemplate

}
const Handle = {
    // 新增Handle

}
class Store extends StoreBase {
    @observable testTime = { // 测试时间数据
        startDate: "2020-01-01",
        endDate: "2022-12-15",
        queryType: "0",
        currentPage: "1",
        pageSize: "10"
    }
    @observable defaultType = '1'
    @observable initListType = '1'
    @observable useTestTime = false // // 是否使用测试时间数据


    pageTurningCondition = (dataList: string | any[]) => {
        if (!dataList || !dataList.length) {
            runInAction(() => {
                this.bankTradeNo = ''                // 查询下页必传【乌当】
                this.createDate = ''                 // 查询下页必传【乌当】
                this.tradeDate = ''
            })
        } else {
            let conditionFn1 = () => { // 获取最后一条记录的交易日期【工商】
                let temporaryData = dataList[dataList.length - 1]
                if (temporaryData.operaDate) {
                    runInAction(() => {
                        this.bankTradeNo = temporaryData.bankSerialNum                // 查询下页必传【乌当】
                        this.createDate = temporaryData.createDate               // 查询下页必传【乌当】
                        this.tradeDate = temporaryData.tradeDate
                    })
                } else {
                    runInAction(() => {
                        this.bankTradeNo = ''                // 查询下页必传【乌当】
                        this.createDate = ''                 // 查询下页必传【乌当】
                        this.tradeDate = ''
                    })
                }
            }
            conditionFn1()
        }
    }
}

export default Index.default({ Config, Item, Handle, Store })
