// import { updateIdCard } from 'Common/pages/PgUpdateIdCard/store'
// import { session } from 'Common/utils/store'
// import { runInAction, observable, computed } from "mobx";
// import { commonStore } from "Common/pages/store"
// import { Toast } from "antd-mobile";
// import { Native } from "Common/utils/appBridge"
// import realNameApi from 'Common/api/realname'
// import { INNER_CODE } from "Common/config/params.enum";
// import { Images } from "Common/config/index";
// import { pleaseCertificationBtn, realNameUpdateBtn } from 'Common/Plugins/recordLogInfo'
//
// class pgUpdateIdCard extends updateIdCard {
//     @observable frontSessionId = ""          //Sessionid
//     @observable age = ""                     //年龄
//     @observable province = ""                //省
//     @observable city = ""                    //市
//     @observable area = ""                    //区、省
//     @observable isOcrName = ""               //ocr反显名字
//     @observable isOcrNumber = ""             //ocr反显身份证号
//     //
//     initData = () => {
//         // 人脸认证调接口
//         this.detectionFace()
//     }
//
//     uploadCardImg = async (params) => {
//         const res: any = await realNameApi.idcardOcr(params)
//         console.log(res)
//         runInAction(() => {
//             this.realName = res.idName //名字
//             this.userCardId = res.idNumber //身份证号
//             this.signOrg = res.issuingAuthority //签发机关
//             this.gender = [res.gender]  //性别
//             this.address = res.address  //地址
//             this.nationVal = res.nation //名族
//             this.validityPeriod = res.validityPeriod // 有效期
//             this.frontSessionId = res.frontSessionId //ocr识别frontSessionId
//             this.age = res.age // 年龄
//             this.birthday = res.birthday // 生日
//             this.province = res.province // 省
//             this.city = res.city // 市
//             this.area = res.area // 区、县
//             this.isOcrName = res.idName // ocr反显名字
//             this.isOcrNumber = res.idNumber // ocr反显身份证
//         })
//         // this.getData(res)  //民族
//         this.formtBirthday(res.birthday)  // 出生日期
//         this.formtDate(res.validityPeriod) //
//         session.set('IdCardFrontPhoneOcrData', res) //  保存身份证反显信息
//         return res
//     }
//     // 调更新身份证api
//     apiUpdateIdCardFn = async () => {
//         try {
//             realNameUpdateBtn()
//         } catch(err){}
//
//         this.validityPeriod = this.addZero(this.pickerValueStart).join(',').replace(/\,/g, '.') + "-" + (this.longRange[0] == "长期" ? "长期" : this.addZero(this.pickerValueEnd).join(',').replace(/\,/g, '.'))
//
//         let birthdayDate = this.birthday[2] < 10 ? '0' + this.birthday[2] : this.birthday[2]
//         let birthdayMonth = this.birthday[1] < 10 ? '0' + this.birthday[1] : this.birthday[1]
//
//         let birthday = this.birthday[0] + '.' + birthdayDate + '.' + birthdayMonth
//         Toast.info('比财更新身份证')
//         commonStore.changeAlertTitle('更新失败')
//         try {
//             const params = { // 参数
//                 transcoding: '1', // 1:转码 2:不转码
//                 idcardFrontPhoto: encodeURIComponent(this.figureImgBase), // 身份证人像面图片
//                 idcardBackPhoto: encodeURIComponent(this.emblemImgBase), // 身份证国徽面图片
//                 idName: this.realName, // 姓名
//                 idNumber: this.userCardId, // 身份证号
//                 nation: this.nationVal, // 民族
//                 validityPeriod: this.validityPeriod, // 有效期
//                 issuingAuthority: this.signOrg, // 签发机关
//                 frontSessionId: this.frontSessionId, // ocr识别frontSessionId
//                 age: this.age, // 年龄
//                 birthday: birthday, // 生日
//                 address: this.address, // 地址
//                 province: this.province, // 省地址
//                 city: this.city, //  市地址
//                 area: this.area, // 区/县地址
//                 updateFlag: this.realName != this.isOcrName || this.userCardId != this.isOcrNumber ? 1 : 0  //身份证,姓名是否修改标识(1:修改 0:未修改)
//             }
//             await realNameApi.bcUpdateIdCard(params)
//             if (Native.isApp()) { // 说明应该时从app直接跳转来的
//                 try {
//                     await Native.BCUpdateIDCardSucceed()
//                     await Native.closeWebView() // app端更新完直接关闭
//                 } catch (e) {
//                     Toast.info(e)
//                 }
//             } else {
//                 commonStore.Hash.history.go(-1)
//             }
//         } catch (e) {
//             session.remove('IdCardFrontPhoneOcrData') //  保存身份证反显信息 开户时需要
//             if (e.innerCode == INNER_CODE.CancelAndUpdateIdCard) {
//                 commonStore.openAlert('更新失败', e.popMsg, [
//                     {
//                         text: '更新身份证',
//                         onPress: () =>
//                             commonStore.Hash.history.push('/updateIdCard')
//                     }
//                 ])
//             }
//         }
//     }
//
//     // 更新身份证 + 人脸认证的判断==》高亮
//     @computed get observeConfirm() {
//         if(this.isShowFace != 0) { // 需要活体认证
//             if (this.realName != '' && this.userCardId != '' && this.signOrg != "" && this.pickerValueStart.length != 0 && this.pickerValueEnd.length != 0 && this.dateOfIssue != '' && this.isLiveStatus != 0) {
//                 return false
//             } else {
//                 return true
//             }
//         } else { // 不需要活体认证
//             if (this.realName != '' && this.userCardId != '' && this.signOrg != "" && this.pickerValueStart.length != 0 && this.pickerValueEnd.length != 0 && this.dateOfIssue != '') {
//                 return false
//             } else {
//                 return true
//             }
//         }
//     }
//
//
//     /**
//      * 是否需要加活体
//      */
//     detectionFace = async () => {
//         try {
//             const res: any = await realNameApi.bcDetectionFace()
//             runInAction(() => {
//                 this.isShowFace = res.needDetection
//             })
//             this.queryAuthInfo()
//         } catch (e) {
//
//         }
//     }
//
//     /**
//      * 查询认证信息  （liveStatus 是否做活体，0-未做，1-已做）
//      */
//     queryAuthInfo = async () => {
//         let checkContrastSuccess = session.get('checkContrastSuccess') //
//         // if(checkContrastSuccess){
//         //     runInAction(()=>{
//         //         this.isLiveStatus = 1
//         //     })
//         // }else{
//         //     runInAction(()=>{
//         //         this.isLiveStatus = 0
//         //     })
//         // }
//         try {
//             const data: any = await realNameApi.bcAuthInfoInquire()
//             runInAction(() => {
//                 this.isLiveStatus = data.liveStatus
//             })
//         } catch (err) {
//
//         }
// }
//     // 请认证跳人脸页面
//     attestationInfo = async () => {
//         try {
//             pleaseCertificationBtn()
//         } catch(err) {}
//
//         console.log(this.realName, "dsdsdasd")
//         if (this.realName == "" && this.userCardId == "") {
//             Toast.info('请上传身份证')
//
//         } else {
//             commonStore.Hash.history.push(`/faceDiscern?userName=${this.realName}&identNo=${this.userCardId}&isH5=1`)
//
//         }
//     }
// }
//
// export default new pgUpdateIdCard()
