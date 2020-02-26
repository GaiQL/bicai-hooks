import { fetch } from '../bank'
import { apiSendPhoneCodeParams } from './api.type'

type paramsType = Record<string,any>
type showHideType= 'show' | 'hide'
export class ApiBankV2  {
    Fetch = fetch
    /**
     *  获取公共底部信息
     */
    apiOrgHotLineAndServerTime = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/apiOrgHotLineAndServerTime', params)
    }
    /**
     * 获取用户登录后信息
     * @param params
     */
    apiQryLoginStatus = (params:paramsType) => {
        return fetch.post('/openapi/account/v2/queryLoginStatus', params);
    }
    /**
     * 开户校验
     * @param params
     */
    openAccountCheck = (params:paramsType) => {
        return fetch.post('/openapi/account/v2/openAccountCheck', params);
    }
    /**
     * 获取支持行列表
     * @param params
     */
    apiSupportBankCards = (params:paramsType) => {
        return fetch.post('/openapi/comm/v2/apiSupportBankCards', params);
    }
    /**
     * 获取用户开户协议
     * @param params
     */
    openAnAccountAgreement = (params?:paramsType) => {
        return fetch.post('/openapi/account/v2/accountAgreement', params)
    };
    /**
     * 查询登录用户某机构绑定卡信息(公共放到public)
     * @param params
     */
    apiBandCard = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/apiQueryOrgBindCard', params)
    };
    /**
     * 查询用户余额(公共放到public)
     * @param params
     */
    apiQryEleAccount = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/apiQueryUserBalance', params, { hideLoding: "hide" })
    };
    /**
     * 获取持有中的列表数据
     * @param params
     */
    apiQryHoldInfo = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/apiQueryHoldInfo', params)
    }
    /**
     * 获取已支取的列表数据
     * @param params
     */
    getMyInvestOver = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/apiQueryInvestOver', params)
    }
    /**
     * 银行卡OCR
     * @param params
     */
    apiBankCardScan = (params:paramsType) => {
        return fetch.post('/openapi/comm/v2/apiBankCardOcr', { transcoding: 1, ...params })
    }
    /**
     * 用户注册信息回显接口
     * @param params
     */
    apiRegisterBackShow = (params?:paramsType) => {
        return fetch.post('/openapi/account/v2/registInfoShowBack', params)
    }
    /**
     * 金城充值获取验证码接口
     * @param params
     */
    apiRechargejc = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiRecharge', params)
    }
    /**
     * 充值接口
     * @param params
     */
    apiRecharge = (params?:paramsType, hideAlert?:showHideType, hideToast?:showHideType) => {
        return fetch.post('/openapi/biz/v2/apiRecharge', params, { hideAlert, hideToast })
    }
    /**
     * 金城充值确认接口
     * @param params
     * @param hideAlert 控制白色提示弹框展示隐藏
     */
    apiRechargeConfirm = (params:paramsType, hideAlert?:showHideType) => {
        return fetch.post('/openapi/biz/v2/apiRechargeConfirm', params, { hideAlert: hideAlert })
    }
    /**
     * 提现接口
     * @param params
     */
    apiCash = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiCash', params)
    }
    /**
     * 购买接口
     * @param params
     */
    apiBuy = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiBuy', params)
    }
    /**
     * 查询业务状态3：充值4：提现6：购买
     * @param params
     */
    apiQueryBizStatus = (params?:paramsType) => {
        return fetch.post('/openapi/biz/apiQueryBizStatus', params)
    }
    /**
     *  收益预算-杨振太
     * @param params
     */
    apiInterestCalculation = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/interestCalculatioin', params)
    }
    /**
     *  获取单个银行汇总数据-黄新  资金明细
     * @param params
     */
    apiQryAsset = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/apiQueryBankCenter', params)
    }
    /**
     *  用户开户第一步（用户及绑卡信息）
     * @param params
     */
    apiOpenAccountSubmit = (params?:paramsType) => {
        return fetch.post('/openapi/account/v2/openAccountSubmit', params)
    }

    /**
     * 开户第二步
     * @param params
     */
    apiOpenAccount = (params?:paramsType) => {
        return fetch.post('/openapi/account/v2/openAccount', params)
    }
    /**
     *  发送短信验证码
     * @param params
     */
    apiSendPhoneCode = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/apiSendPhoneCode', params)
    }
    /**
     *  验证短信验证码
     * @param params
     */
    apiRigesisterShortCodeVerify = (params?: apiSendPhoneCodeParams) => {
        return fetch.post('/openapi/account/apiRigesisterShortCodeVerify', params)
    }
    /**
     *  身份证OCR
     * @param params
     */
    apiIdCardFrontPhoneOcr = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/apiIdCardOcr', { transcoding: 1, ...params })
    }
    /**
     * 更换银行卡
     * @param params
     */
    changeBindCard = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/changeBindCard', params)
    }
    /**
     * 是否允许换绑银行卡校验
     * @param params
     */
    changeBankCardFlag = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/changeBinkCardCheck', params)
    }
    /**
     * 更换手机号信息校验
     * @param params
     */
    changeBindCardPhoneCheck = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/changeBindCardPhoneCheck', params)
    }
    /**
     * y-更换手机号 /openapi/hth/infochange/changeAccountMobile
     * @param params
     */
    changeBindCardPhone = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/changeBindCardPhone', params)
    }
    /**
     * 交易明细
     * @param params
     */
    apiQryEleTransDetail = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/apiQueryTradeDetail', params)
    }
    /**
     * 资产明细
     */
    apiQryPrdTransDetail = (params?:paramsType) => {
        return fetch.post('/openapi/bank/apiQryPrdTransDetail', params)
    }
    /**
     *  更新身份证
     * @param params
     */
    apiUpdateIdCard = (params:showHideType, hideAlert?: 'show' | 'hide') => {
        return fetch.post('/openapi/comm/v2/apiUpdateIdCard', params, { hideAlert })
    }
    /**
     *  查看产品是否下架
     * @param params
     */
    apiIsShelves = (params?:paramsType) => {
        return fetch.post('/openapi/comm/apiIsShelves', params)
    }
    /**
     *  查看用户身份证状态
     */
    idCardStatus = () => {
        return fetch.post('/openapi/hth/infochange/idCardStatus')
    }
    /**
     * 赎回接口
     * @param params
     */
    apiRedemption = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiRedemption', params)
    }
    /**
     * 支取校验
     */
    apiRedemptionValid = (params?:paramsType) => {
        return fetch.post('/openapi/bank/apiRedemptionValid', params)
    }

    /**
    * 提现校验
    */
    apiCashQuotaCheck = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiCashQuotaCheck', params)
    }
    /**
     *  存入的协议
     */
    buyAgreement = (params:showHideType) => {
        return fetch.post('/openapi/biz/v2/buyAgreement', params)
    }
    /**
     * 获取线上协议
     */
    openAnAccountAgreementContent = (params?:paramsType) => {
        return fetch.post('/openapi/account/v2/openAnAccountAgreementContent', params)
    }
    /**
     *  银行首页信息可见状态
     */
    // bankHomeMessageStatus = (params?:paramsType) => {
    //     return fetch.post('/openapi/comm/bankHomeMessageStatus', params)
    // }
    /**
     *  银行首页信息可见状态
     */
    bankHomeMessageStatus = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/bankHomeMessageStatus', params)
    }
    /**
     * 交易通用校验
     */
    apiTradeCheck = (params:showHideType) => {
        return fetch.post('/openapi/biz/v2/apiTradeCheck', params)
    }
    /**
     * 已派发收益
     */
    apiIncomeList = (params:showHideType) => {
        return fetch.post('/openapi/bank/v2/apiIncomeList', params)
    }
    /**
     * 获取产品信息
     */
    apiQueryPrdInfo = (params:showHideType) => {
        return fetch.post('/openapi/comm/v2/apiQueryPrdInfo', params)
    }
    /**
     * 添加银行卡
     */
    addBindCard = (params: { newBankNo: any; validateCodeSerialNum: any; reqSerial: any; bankCardNum: any; bankNo: any; validateCode: any; bankName: any; preBankAccountNo: any; bankCardPhone: any }) => {
        return fetch.post('/openapi/comm/v2/addBindCard', params)
    }
    /**
     * 添加银行卡校验
     */
    addBindCardCheack = (params:showHideType) => {
        return fetch.post('/openapi/comm/v2/addBindCardCheack', params)
    }
    /**
    * 解绑银行卡（wsq）
    */
    untieBindCard = (params:showHideType) => {
        return fetch.post('/openapi/comm/v2/untieBindCard', params)
    }
    /**
    *  设置默认银行卡（wsq）
    */
    setDefaultBindCard = (params:showHideType) => {
        return fetch.post('/openapi/comm/v2/setDefaultBindCard', params)
    }

    /**
     * 修改默认银行卡 248 客商
     * @param params
     */
    apiDefaultBankCard = (params:showHideType) => {
        return fetch.post('/openapi/comm/v2/apiDefaultBankCard', params);
    };

    /**
*  获取充值协议
*/
    getChargeAgreement = (params:showHideType) => {
        return fetch.post('/openapi/biz/v2/chargeAgreement', params)
    }

    /**
    *新安 244 提现查询接口
    * @param params
    */
    apiCashQuery = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiCashQuery', params)
    }

    /**
    * 新安 244  提现列表查询接口
    * @param params
    */
    apiCashListQuery = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiCashListQuery', params)
    }

    /**
    * 获取大额转入指引
    * @param params
    */
    getLargeDpositGuidePage = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/getLargeDpositGuidePage', params)
    }
    /**
    * 充值-签约申请【申请签约】
    * @param params
    */
    getApiRechargeSignApply = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiRechargeSignApply', params)
    }
    /**
    * 充值-签约验证【签约验证发送验证吗】
    * @param params
    */
    getApiRechargeSignVerif = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiRechargeSignVerif', params)
    }
    /**
   * 风控
   * @param params
   */
    getRiskAppraisalQuestions = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/riskAssessment', params)
    }
    /**
       *
       * @param params
       */
    riskAppraisalAnswer = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/riskSubmit', params)
    }
    /**
 * 将要撤单列表
 * @param params
 */
    getApiQueryCancelList = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/queryCancelList', params)
    }
    /**
     * 营口用户购买产品次数
     * @param params
     */
    getApiQueryPurchaseCount = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/queryPurchaseCount', params)
    }
    /**
     * 已撤单列表
     * @param params
     */
    getApiQueryCancelOrder = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/queryCancelOrder', params)
    }
    /**
     * 撤单na
     * @param params
     */
    getApiCancelOrder = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiCancelOrder', params)
    }
    /**
    * 新疆汇合支取标记
    * @param params
    */
    getApiRedeemptionMark = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/apiRedeemptionMark', params)
    }
    /**
     * 投资成功查询[辽宁振新]
     * @param params
     */
    getApiQuerySucessfulInvestmentOrders = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/querySucessfulInvestmentOrders', params)
    }
    /**
    * 已成项目查询[辽宁振新]
    * @param params
    */
    getApiQueryEstablishedProject = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/queryEstablishedProject', params)
    }
    /**
    * 回款计划查询[辽宁振新]
    * @param params
    */
    getApiQueryPaybackPlan = (params?:paramsType) => {
        return fetch.post('/openapi/bank/v2/queryPaybackPlan', params)
    }

    /**
   * 支取特殊弹框接口活动提示[晋中，新疆汇合]
   * @param params
   */
    getSpecialVerificationInterface = (params?:paramsType) => {
        return fetch.post('/openapi/biz/v2/SpecialVerificationInterface', params)
    }
    /**
   *  银行设置修改密码
   * @param params
   *
   */
    resetPayPwd = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/resetPayPwd', params)
    }

    /**
   *  银行设置修改密码
   * @param params
   *
   */
    bankInit = (params?:paramsType) => {
        return fetch.post('/openapi/comm/v2/bankInit', params)
    }
    /**
    *  查询全国省市县码表V2
    * @param params
    *
    */
    cityInfo = (params?:paramsType) => {
        return fetch.post('/openapi/auth/v2.0/user/cityInfo/v2', params)
    }
    /**
   *  查询全国省市县码表V2
   * @param params
   *
   */
    addressCheck = (params?:paramsType) => {
        return fetch.post('/openapi/auth/v2.0/idCard/addressCheck', params)
    }

}
