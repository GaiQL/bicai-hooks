import {observable, action, computed, decorate,runInAction} from "mobx";
import {BIZ_TYPE, INNER_CODE} from 'Common/config/params.enum'
import { apiBankAll } from 'Common/api/bank'
import {session} from "Common/utils/store";
const apiBank = new apiBankAll.ApiBankV2()
class Store {
    // , bankCardName, bankCardLen
    @observable bandCardInfo: any = {}
    @observable openBank: string = ''
    @observable bankCardName: string = ''
    @observable bankCardLen: number = 0
    @observable bankElecAccountNum: string = ''
    /**
     * 密码设置状态：0-未设置密码；1-已设置密码
     */
    @observable isSetPassword = ""
    /**
     * 新增 选项初始化。json类型
     */
    @observable bankInitStr = ""

    //qxx-查询登录用户某机构绑定卡信息
    apiBandCardFn = async (data: any) => {
        const res = await apiBank.apiBandCard(data)
        console.log(res.isSetPassword)
        session.set("moreServer", { // 别删 客商有用
            bankElecAccountNum: res.bankElecAccountNum,
            bankUserId: res.bankUserId,
            bankCardNum: res.cardList[0] && res.cardList[0].bankCardNum
        })
        if (res) {
            runInAction(() => {
                this.bankElecAccountNum = res.bankElecAccountNum
                this.bandCardInfo = res
                this.isSetPassword = res.isSetPassword
                session.set('bandCardInfo', this.bandCardInfo)
                let bandCard = res.cardList
                this.bankCardName = bandCard ? (bandCard.length > 0 && bandCard[0].bankCardName) : ""
                this.bankCardLen = bandCard.length - 0 || 0
            })
        }
        return Promise.resolve(res)
    }

    isPassword = async (isSetPassword: any) => {
        var url = window.location.href.split("#/")[0]
        var urlParams = decodeURI(window.location.href.split('#/')[1])

        if (url.indexOf("file:///") != -1) {
            url = url.replace("file:///", "https://www.bicai-android.com/")
        }
        // alert(url)
        try {
            await apiBank.resetPayPwd({
                tranBackAdd: url + "#/moreService",//密码设置/修改成功跳转URL
                tranBackExceptAdd: url + "#/moreService",//操作类型(06设置密码/07修改密码)
                operateType: Number(isSetPassword) ? "07" : "06" ,//密码设置/修改失败跳转URL
                fallbackUrl:url + "#/moreService"

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

export default Store

