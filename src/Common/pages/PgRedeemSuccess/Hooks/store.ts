import { commonStore } from "Common/pages/store"
import { session } from 'Common/utils/store'
import { Native } from "Common/utils/appBridge"
import { Toast } from 'antd-mobile';//ui组件
import goBC from "Common/utils/goBC"
class Store {
    goOpenHome = () => {
        try {
            Native.goOpenHome({
                data: { routeKey: 'appHomeActivity', index: "0" }
            })
        } catch (e) {
            Toast.info(e)
        }
    }
    repurchase = async() => {
        if (Native.isApp()) {
            try {
                this.goOpenHome()  //产品下架跳转
            } catch (e) {
                Toast.info(e)
            }
        } else {
            goBC({
                name: 'ProductList',
                type: 'push',
                params: {
                    CHANNEL_ID: session.get('channelId'),
                }
            })
        }
    }
    lookAssets = () => {
        commonStore.Hash.history.replace('/bankDetail')
    }
}

export default Store