import PgBankDispatch from 'Common/pages/PgBankDispatch'
import {session} from 'Common/utils/store'
import {BanksH5URL} from "Common/config/index";
import Store from './store'
import {INNER_CODE} from "Common/config/params.enum";
import {Toast} from "antd-mobile";
import { commonStore } from "Common/pages/store"
class BankDispatch extends PgBankDispatch {
    Store = Store
    apiBank = this.Store.apiBank
    // @ts-ignore
    Config = {
        ...this.Config,
        orgName: '',
    }
    orgId = null
    checkOpenBankStatus = true

    /**
     * =============================比财页面对接 start ==================================
     */
    /**
     * 去比财的更新身份证页面
     * @param params
     */
    goBcUpdateIDCard(params?: Record<string, any> | undefined) {

        this.props.history.replace('/updateIdCard')
    }

    /**
     * 3 去比财的活体页面
     * @param params
     */
    goBcFaceDiscern(params: Record<string, any>) {
        let {userName='',identNo=''}:any = commonStore.query() || {}
        this.props.history.replace(`/faceDiscern?userName=${userName}&identNo=${identNo}`)
    }

    /**
     * ==============================比财页面 end ==================================
     */

    componentWillMount(): void {
        // 针对地址url传参数做处理
        let query: any = this.queryURL()
        let { toOpenBankData }: any = query || {}
        if (toOpenBankData) {
            let params = JSON.parse(decodeURIComponent(toOpenBankData))
            console.log('toOpenBankData>>>', params);
            let common = params.common || {}
            this.checkOpenBankStatus = common.checkOpenBankStatus
            window.sessionStorage.setItem('toOpenBankData', decodeURIComponent(toOpenBankData))
        }
    }

    goOpen(params?:any) {
        this.setTimeRepalce('/openFlow')
    }
    //延时跳转
    setTimeRepalce(path: string, time = this.Config.londingTime) {
        setTimeout(() => {
            let bankURL = `${BanksH5URL.bankUrl}/${this.orgId}/#${path}`
            console.log('将要跳转：》》', bankURL);
            // window.location.replace(bankURL)
            this.locationReplace(bankURL)
            // window.location.href = bankURL
        }, time)
    }

    beforeDispatch = async (type?: string, params?: { proInfo: any; }) => {
        console.log('-3:dispatchFromh5 ', type, params);
        if (type == 'buy') {
            // @ts-ignore
            let {proInfo} = params
            if (this.checkOpenBankStatus) {
                try {
                    await this.apiQryLoginStatusFn(true, proInfo && proInfo.proId, params)
                    return Promise.resolve()
                } catch (e) {
                    return Promise.reject()
                }
            }
            session.set('query',{// 兼容老板的跳转逻辑
                toPage:'buy',
                proId:proInfo && proInfo.proId
            })
        }
        return Promise.resolve()

    }
    // 判断是否开户
    apiQryLoginStatusFn = async (isBuy = false, proId = '', params?: { proInfo: any } | undefined) => {
        try {
            let res = await this.apiBank.apiQryLoginStatus({
                prdIndexId: proId + '',
            })
            let {hasOpenBank, openBankStatusDesc} = res
            //  判断是否开户
            // hasOpenBank  是否已开户(1：已开户 2：未开户 3：处理中)
            if (hasOpenBank == 1) {
                if (isBuy) {
                    // @ts-ignore
                    let {proCheck} = params
                    await this.proCheck(proCheck)
                    return await this.apiTradeCheckFn({
                        proId
                    })
                }
            } else if (hasOpenBank == 2) {
                //  开户校验
                return await this.openAccountCheckFn()
            } else {
                return Promise.reject(openBankStatusDesc)
            }

        } catch (e) {
            return Promise.reject(e)
        }
    }
    // 购买校验
    apiTradeCheckFn = async (data: { proId: any; }) => {
        // tradeType
        // 交易类型 用于支持交易前校验 10:充值 20：提现 30：购买 40：支取
        // prdIndexId
        // 产品id 购买 赎回必传
        let params = {
            tradeType: '30',
            prdIndexId: data.proId,
        }
        try {
            await this.apiBank.apiTradeCheck(params)
            return Promise.resolve()
        } catch (e) {
            return this.catchErr(e)

        }
    }


    // 实名校验
    openAccountCheckFn = async () => {
        try {
            let {userAuthStatus} = await this.apiBank.openAccountCheck()
            if (userAuthStatus == 1) {
                // 去开开户
                this.goOpen()
                return Promise.reject('已经实名')
            } else {
                this.goRealName(this.h5FormPage)
                return Promise.reject('未实名')
            }
        } catch (e) {
            return this.catchErr(e)
        }
    }

    // todo!
    catchErr(e:errorType) {
        if (e.innerCode === INNER_CODE.CancelAndUpdateIdCard) {
            this.goBcUpdateIDCard()
        }
        if (e.innerCode == INNER_CODE.CancelAndReAssess) {

        }
        if(e.innerCode == INNER_CODE.goSuidePage ){
            this.upDateIdCardGuidePage()
        }
        if(e.innerCode === INNER_CODE.goBcFaceDiscern){
            let {identNo,userName}:any = e.value.web || {}
            this.goBcFaceDiscern({
                userName,
                identNo
            })
        }
        Toast.info(e.popMsg || e.msg || JSON.stringify(e))
        return Promise.reject()
    }

    // 产品校验
    proCheck = async (params: { IS_SYNC_FLAG: any; AUTH_URL_FLAG: any; IS_REALTIME_DATA_PRD: any; IS_RZ_FLAG: any; H5_URL_ANDRIOD: any; H5_URL_IOS: any; authUrlFlag: any; isSyncFlag: any; isRealTimeDataPro: any; isRzFlag: any; h5Url: any; }) => {
        let {
            IS_SYNC_FLAG,
            AUTH_URL_FLAG,
            IS_REALTIME_DATA_PRD,
            IS_RZ_FLAG,
            H5_URL_ANDRIOD,
            H5_URL_IOS,
            authUrlFlag,
            isSyncFlag,
            isRealTimeDataPro,
            isRzFlag,
            h5Url,
        }  = params  // 获取产品的一些类型参数
        isSyncFlag = isSyncFlag || IS_SYNC_FLAG
        authUrlFlag = authUrlFlag || AUTH_URL_FLAG
        isRealTimeDataPro = isRealTimeDataPro || IS_REALTIME_DATA_PRD
        isRzFlag = isRzFlag || IS_RZ_FLAG
        h5Url = h5Url || H5_URL_ANDRIOD || H5_URL_IOS
        // 已经完成实名的了
        if (isSyncFlag == 0) {
            // 0：使用之前的逻辑
            if (h5Url) {
                setTimeout(() => {
                    window.location.replace(h5Url)
                }, 2000)
            } else {
                Toast.info('请配置银行直联跳转链接')
                setTimeout(() => {
                    this.props.history.go(-1)
                }, 2000)
            }
            return Promise.reject()

        } else {
            // 打通openApi 校验在本行的的校验
            return Promise.resolve()
        }
    }

}

export default BankDispatch
