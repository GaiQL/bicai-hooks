import React from 'react'
// import newFace from 'Common/pages/PgFaceDiscern'
// import { session } from "Common/utils/store";
// import { apiBank } from '../../api/bank'
// import { commonStore } from "Common/pages/store"
// import { Native } from "Common/utils/appBridge"
// import { Toast } from "antd-mobile";
// import apiRealName from "Common/api/realname"
// import { faceRecognitionPage } from 'Common/Plugins/recordLogInfo'
//
// const { openAlert } = commonStore
//
// export default class FaceDiscern extends newFace {
//     Config = {
//         // ...this.Config,
//         isBottomShow: false
//     }
//
//     apiOpenAccountSubmit = apiBank.apiOpenAccountSubmit
//
//     async componentWillMount() {
//         try {
//             faceRecognitionPage()
//         } catch (err) { }
//
//         session.set('faceDiscernSuccess', 0)
//         let { userName = '', identNo = '' }: any = commonStore.query() || {}
//         if (userName && identNo) {
//             this.setState({
//                 userName,
//                 identNo
//             })
//         } else {
//             let { idName, idNumber }: any = await apiRealName.BcSuccessIdcard({ isShowIdPhoto: false })
//             this.setState({
//                 userName: idName,
//                 identNo: idNumber
//             })
//         }
//
//     }
//
//     // 识别验证成功
//     checkContrastSuccess = () => {
//         session.set('faceDiscernSuccess', 1)//存储成功状态
//         Toast.info('活体识别成功')
//         setTimeout(() => {
//             let {isH5}: any = commonStore.query() || {}
//             console.log(isH5,"isH5")
//             if (isH5==1) { // 说明应该时从app直接跳转来的
//                 commonStore.Hash.history.replace("/updateIdCard")
//             } else {
//                 if(Native.isApp() ){
//                     try {
//                         Native.BCFaceDiscernResult('1') // app端更新完通知app（方法还没对接 ⚠️！！）
//                         Native.closeWebView()
//                     } catch (e) {
//                         Toast.info(e)
//                     }
//                 }else{
//                     commonStore.Hash.history.go(-1)
//                 }
//             }
//         }, 2000)
//     }
//     // 识别验证 不匹配 / 未知 / 接口请求失败
//     // checkContrastFailed = (e?) => {
//     //     let {isH5}: any = commonStore.query() || {}
//
//     //     session.set('faceDiscernSuccess', 0)// 存储失败状态
//     //     setTimeout(() => {
//     //         if (Native.isApp()&& isH5!=1) { // 说明应该时从app直接跳转来的
//     //             try {
//     //                 setTimeout(() => {
//     //                     Native.BCFaceDiscernResult('0') // app端更新完通知app（方法还没对接 ⚠️！！）
//     //                 }, 1000)
//     //             } catch (e) {
//     //                 Toast.info(e)
//     //             }
//     //         } else {
//     //             Toast.hide()
//     //             commonStore.Hash.history.go(-1)
//     //         }
//     //     }, 2000)
//     // }
//     // testFn = () => {
//     //     // Toast.info('活体失败通知app')
//     //     Native.BCFaceDiscernResult('0') // app端更新完通知app（方法还没对接 ⚠️！！）
//
//     // }
//     // testFn2 = () => {
//     //     // Toast.info('活体成功通知app')
//     //     Native.BCFaceDiscernResult('1') // app端更新完通知app（方法还没对接 ⚠️！！）
//     //     Native.closeWebView()
//     // }
// }
export default function () {
    return <div></div>
}
