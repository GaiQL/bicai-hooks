import React from 'react'
import * as Index from "Common/pages/PgOpenSuccess/hooks"
import StoreBase from "Common/pages/PgOpenSuccess/hooks/store"
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
//  新增重写
let Config = {

}

const Item = {
    // 新增Item


}
// 新增Handle
const Handle = {


}
class Store extends StoreBase {
    goNext = async () => {
        var url = window.location.href.split("#/")[0]
        if (url.indexOf("file:///") != -1) {
            url = url.replace("file:///", "https://www.bicai-android.com/")
        }
        try {
            apiBank.resetPayPwd({
                tranBackAdd: url + "#/openNative?type=OpenAccount",//密码设置/修改成功跳转URL
                tranBackExceptAdd: url + "#/openNative?type=OpenAccount",//操作类型(06设置密码/07修改密码)
                operateType: "06",//密码设置/修改失败跳转URL  
                fallbackUrl: url + "#/openNative?type=OpenAccount"
            }).then((data: any) => {
                let url = data.operateURL //获取银行url地址
                window.location.href = url
                // this.Store.Hash.history.push("/setDealCode?url="+url
                //     // { pathname: "/setDealCode", query: url  }
                //     )
            })
        } catch (error) {

        }



    }
}

export default Index.default({ Config, Item, Handle, Store })
