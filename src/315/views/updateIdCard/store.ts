// import { updateIdCard } from 'Common/pages/PgUpdateIdCard/store'
// import { observable, runInAction } from "mobx";
// import { commonStore } from "Common/pages/store"
// import { session } from 'Common/utils/store'
// import { INNER_CODE } from "Common/config/params.enum";
// import { Native } from "Common/utils/appBridge"
// import { Modal, Toast } from 'antd-mobile';
//
// class PgupdateIdCard extends updateIdCard {
//     submitFn = async () => {
//         let { openErr }: any = commonStore.query() || {} //
//         // 100004
//         commonStore.Hash.history.push('/faceDiscern?fromPage=updateIdCard&openErr=' + openErr)
//     }
//     apiUpdateIdCardFn = async (openErr?) => {
//         commonStore.changeAlertTitle('更新失败')
//         try {
//             const params = this.apiUpdateIdCardParams(openErr)
//             const res = await this.newApiUpdateIdCard(params)
//             const { proId, fromApp }: any = commonStore.query() || {}
//             let {bankCardPhone}:any = session.get('bankInfo') || {}
//             session.set('updateIdCardResult', res) // 将更新成功后的数据保存，返回开户第一步可能需要
//             if (openErr == INNER_CODE.CancelAndUpdateIdCard) { // 开户失败过来的
//                 session.set("carIdBase64", { // 更新成功统一将base64保存，开户时需要
//                     idcardFrontPhoto: encodeURIComponent(this.figureImgBase),   //正面base64
//                     idcardBackPhoto: encodeURIComponent(this.emblemImgBase),    //反面base64
//                 })
//             }
//             if (proId) { // 购买成功更新身份证
//                 commonStore.Hash.history.push('/buy?proId=' + proId)
//             } else {
//                 if (Native.isApp() && fromApp == 1) { // 说明应该时从app直接跳转来的
//                     try {
//                         await Native.closeWebView() // app端更新完直接关闭
//                     } catch (e) {
//                         Toast.info(e)
//                     }
//                 } else {
//                     if (!openErr || openErr == "undefined") {// 交易
//                         this.Store.Hash.history.push('/bankDetail')
//                     } else { // 开户流程的
//                         this.Store.Hash.history.push(`/openInputSmsCode?bankCardPhone=${bankCardPhone}`)
//
//                     }
//                 }
//             }
//
//         } catch (e) {
//             session.remove('IdCardFrontPhoneOcrData') //  保存身份证反显信息 开户时需要
//             if (e.innerCode == INNER_CODE.CancelAndUpdateIdCard) {
//                 commonStore.openAlert('更新失败', e.popMsg, [
//                     {
//                         text: '更新身份证',
//                         onPress: () =>
//                             commonStore.Hash.history.push('/updateIdCard?openErr' + openErr)
//                     }
//                 ])
//             }
//             if (e.innerCode == INNER_CODE.SubmitOnly) {
//                 commonStore.openAlert('更新失败', e.popMsg, [
//                     {
//                         text: '确定',
//                         onPress: () =>
//                             commonStore.Hash.history.push('/updateIdCard?openErr' + openErr)
//                     }
//                 ])
//             }
//         }
//
//     }
// }
// export default new PgupdateIdCard()
