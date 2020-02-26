import React from 'react'
import PgNative from 'Common/pages/PgNative'
import { session, } from 'Common/utils/store'
import { apiBank } from '../../api/bank'

const Native = (Component:any) => {
    return class extends PgNative {
        /**
     * 7.去设置密码
     * @param params
     */
        goSetBankPassword = async () => {
            var url = window.location.href.split("#/")[0]
            if (url.indexOf("file:///") != -1) {
                url = url.replace("file:///", "https://www.bicai-android.com/")
            }
            try {
                await apiBank.resetPayPwd({
                    tranBackAdd: url + "#/openNative?type=detailsPage",//密码设置/修改成功跳转URL
                    tranBackExceptAdd: url + "#/openNative?type=detailsPage",//操作类型(06设置密码/07修改密码)
                    operateType: "06",//密码设置/修改失败跳转URL
                    fallbackUrl:url + "#/openNative?type=detailsPage"
                }).then((data: any) => {
                    let url = data.operateURL //获取银行url地址
                    this.HeaderAppBrige.apiNavBarStyleClose(2)
                    window.location.replace(url)
                    // this.Store.Hash.history.push("/setDealCode?url="+url
                    //     // { pathname: "/setDealCode", query: url  }
                    //     )
                })
            } catch (error) {

            }

        }
        /**
     * 去支取页
     * @param params
     */
        goRedeem(params: Record<string, any>) {
            // session.set('appToReed', '1') // app直接跳转支取，需要支取时判断，回到app持仓页
            // // if (!params.redeemParams) return Toast.info('redeemParams不能为空')
            // // let {prdIndexId, reqSerial, fieldValue, minRedmptAmt, minRedmptAmtMsg} = params.redeemParams
            // console.log(params.orderInfo)
            // // 从原生取字段
            // let { PRD_INDEX_ID,
            //     ORDER_NUM,
            //     minRedeemAmount,
            //     minRedeemAmountMsg,
            //     DP_DETAIL_INVEST_TOTAL_AMT,
            //     HOLD_AMOUNT,
            // } = params.orderInfo
            // let prdIndexId = PRD_INDEX_ID // 产品·id
            // let reqSerial = ORDER_NUM // 流水号
            // let amount = DP_DETAIL_INVEST_TOTAL_AMT || HOLD_AMOUNT // 持有中金额
            // minRedeemAmount = minRedeemAmount
            // let minRedmptAmt = minRedeemAmountMsg
            // this.props.history.replace(`/redeem?prdIndexId=${prdIndexId}&reqSerial=${reqSerial}&amount=${amount}&minRedmptAmt=${minRedmptAmt}&minRedmptAmtMsg=${minRedeemAmountMsg}`)
            session.set('appToReed', '1') // app直接跳转支取，需要支取时判断，回到app持仓页

            let orderInfo;
            if (typeof (params.proInfo) == 'string') { // 兼容 app那边如果传递的是 JSON
                orderInfo = JSON.parse(params.orderInfo)
            } else {
                orderInfo = params.orderInfo // 兼容 app 那边 如果传递的是 对象
            }


            // 从原生取字段
            // let {PRD_INDEX_ID, ORDER_NUM, minRedeemAmount, minRedeemAmountMsg,DP_DETAIL_INVEST_TOTAL_AMT} = orderInfo

            // let {PRD_INDEX_ID, ORDER_NUM, minRedeemAmount, minRedeemAmountMsg,DP_DETAIL_INVEST_TOTAL_AMT} = orderInfo
            let { PRD_TYPE_ID, PRD_INDEX_ID, VALUES } = orderInfo

            if (PRD_TYPE_ID == '2') {
                // 理财产品
                // Toast.info(VALUES.toString(), 200)
                // return
                let params = {
                    prdIndexId: PRD_INDEX_ID,
                    fieldValue: VALUES,
                    type: PRD_TYPE_ID
                }
                session.set('backUrl', `prdType=${PRD_TYPE_ID}&prdTypeName=理财产品`)
                this.props.history.replace({
                    pathname: '/cancelTheOrder',
                    state: params
                })
                // this.props.history.replace(`/cancelTheOrder?prdIndexId=${params.prdIndexId}&fieldValue=${JSON.stringify()}&toCancelPageType=0`)
                //this.props.history.replace(`/cancelTheOrder?prdIndexId=${PRD_INDEX_ID}&reqSerial=${ORDER_NUM}&fieldValue=${DP_DETAIL_INVEST_TOTAL_AMT}&minRedmptAmt=${minRedeemAmount}&minRedmptAmtMsg=${minRedeemAmountMsg}`)
            } else {
                // 存款产品
            }
        }
        render(): any {
            return <Component {...this.props} />
        }
    }
}
export default Native(PgNative)
