// import { PgOpenSuccess } from 'Common/pages/PgOpenSuccess/store'
// import { commonStore } from "Common/pages/store"
//
// class OpenSuccess extends PgOpenSuccess {
//     goNext = async () => {
//         var url = window.location.href.split("#/")[0]
//         if (url.indexOf("file:///") != -1) {
//             url = url.replace("file:///", "https://www.bicai-android.com/")
//         }
//         try {
//             this.apiBank.resetPayPwd({
//                 tranBackAdd: url + "#/openNative?type=OpenAccount",//密码设置/修改成功跳转URL
//                 tranBackExceptAdd: url + "#/openNative?type=OpenAccount",//操作类型(06设置密码/07修改密码)
//                 operateType: "06",//密码设置/修改失败跳转URL
//                 fallbackUrl:url + "#/openNative?type=OpenAccount"
//             }).then((data: any) => {
//                 let url = data.operateURL //获取银行url地址
//                 window.location.href = url
//                 // this.Store.Hash.history.push("/setDealCode?url="+url
//                 //     // { pathname: "/setDealCode", query: url  }
//                 //     )
//             })
//         } catch (error) {
//
//         }
//
//
//
//     }
//     Store = commonStore
// }
//
// export default new OpenSuccess()
