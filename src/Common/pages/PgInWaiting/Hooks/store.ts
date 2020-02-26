
import { Native } from "Common/utils/appBridge"
import { session } from "Common/utils/store";
import { Headers, BcButton, BcBankMark } from 'Common/publicCommon/index'
import { Images } from "Common/config/index";
import { commonStore } from 'Common/pages/store'
import { InitCom } from './index'

const rules:Map<number,any> = new Map([
    [1, ['存入结果', '/holdProductList']],
    [2, ['充值结果', '/bankDetail']],
    [3, ['提现结果', '/bankDetail']],
    [5, ['支取结果', '/holdProductList']]
])

class Store {
    complate() {
        let { Config } = InitCom.get()
        let { status } = Config
        let res: any = commonStore.query()
        let flag = status == 1 || status === 5 ? true : false
        let str = ''
        if (status == 2 ) {
            let SOURCEOFRECHARGE = session.get('SOURCEOFRECHARGE')
            if (SOURCEOFRECHARGE == 'BUY') {
                session.remove('SOURCEOFRECHARGE')
                commonStore.Hash.history.replace(`/buy?proId=${session.get('proId')}`)
                return;
            } else {
                commonStore.Hash.history.replace(flag ? `${rules.get(status)[1] + str}` : `${rules.get(status)[1]}`)
                return;
            }
        }
        if (flag) {
            if (status == 1) {
                // 判断是否为组合购买进入【平衡购买】
                let flags: boolean = session.get('comBuyParams') ? (session.get('comBuyParams').groupPrdFlag == '1' ? false : true) : true
                if (!flags) {
                    Native.closeWebView()
                    return
                }
            }
            str = `?depositTypeId=${res.depositTypeId}&prdType=${res.prdType}&prdTypeName=${res.prdTypeName}&toCancelPageType=500`
        }
        commonStore.Hash.history.replace(flag ? `${rules.get(status as number)[1] + str}` : `${rules.get(status as number)[1]}`)

    }
}

export default Store
