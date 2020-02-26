// /**
//  * @author  Mr.ma
//  * @use     支取成功的页面
//  * @date    2019-05-31
//  * @params  支取成功接口返回的字段信息展示
//  */
//
// import React from 'react'
// import './style.scss'
// import { Toast } from 'antd-mobile';
// import { Headers, BcButton, BcBankMark } from 'Common/publicCommon/index'
// import { observer, inject } from 'mobx-react'
// import { Images } from "Common/config/index";
// import BottomColumn from 'Common/publicCommon/BottomColumn'
// import Store from './store'
// import { commonStore } from "Common/pages/store"
//
// @observer
// class RedeemSuccess extends React.Component<any, any> {
//     Store = Store
//     Config:any = {
//         profitDescOnOff : true,
//         isReqSerial:false, //是否有交易流水号
//     }
//     render() {
//         let res: any = commonStore.query()
//         let { complate } = this.Store
//         return (
//             <div className=''>
//
//                 <div className='success'>
//                     <img src={Images.success} alt="支取成功" className="icon-success"/>
//                     <p className="text">支取成功</p>
//                 </div>
//
//
//             </div>
//         )
//     }
// }
// export default RedeemSuccess
