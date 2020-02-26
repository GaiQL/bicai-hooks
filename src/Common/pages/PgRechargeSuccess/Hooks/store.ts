import { commonStore } from "Common/pages/store"
import goBC from 'Common/utils/goBC'
import { session } from 'Common/utils/store'
import { Native } from "Common/utils/appBridge"
import { Toast } from 'antd-mobile';//ui组件
class Store {
    sub() {
        commonStore.Hash.history.replace("/bankDetail")
    }
    continueToDeposit() {
        session.remove('SOURCEOFRECHARGE')
        commonStore.Hash.history.replace(`/buy?proId=${session.get('proId')}`)
    }
    async goBackProductList() {
        if (Native.isApp()) {
            try {
                await Native.goBankList({
                    data: { routeKey: 'bankProductList', orgId: require('Common/config/index').ORG_ID, orgName: require('Common/config/index').ORG_NAME }
                }, false)
            } catch (e) {
                Toast.info(e)
            }
        } else {
            goBC({
                name: 'ProductList',
                type: 'push',
                params: {
                    CHANNEL_ID: session.get('channelId')
                }
            })
        }
    }
}

export default Store