
import React from 'react'
import './style.scss'
import { Headers, BcButton } from '../../../Common/publicCommon'
import { Toast } from "antd-mobile";
import { session } from "Common/utils/store";
import goBC from "Common/utils/goBC";
import { Images } from "../../../Common/config";
import { ORG_ID } from "Common/config/index";
import BottomColumn from '../../../Common/publicCommon/BottomColumn'
import { commonStore } from "../../../Common/pages/store"
import { Native } from "Common/utils/appBridge";
import {InitCom} from './index'

export let Render = () => {
    let {Config}=InitCom.get()
    let { title, orderMsgTitle, orderMsgContent } = Config;

    return (
        <div className="buy-results">
            <Headers type="empty">{title}</Headers>
            <section>
                <img src={Images.openWaiting} alt="" width="80" height="80" />
                <div className="status">{orderMsgTitle}</div>
                <div className="result" dangerouslySetInnerHTML={{ __html: orderMsgContent }}></div>
            </section>
            <BcButton onClick={complate}>完成</BcButton>
            <BottomColumn type='long' />
        </div>
    )
}

function complate() {
    if (Native.isApp()) {
        try {
            // todo 需要判断app是购买开户来的还是其他情况。
            // 分三种
            // 购买开户去购买：
            // 银行资产开户去电子账户 ？
            // 二类户去开户关掉页面 ？
            // Native.closeWebView()
            Native.openInfoSuccess({ closeState: 1, orgId: ORG_ID })

        } catch (e) {
            Toast.info('app开户成功后跳转页')
        }
    } else {
        if (session.get('h5FormPage')) {
            window.location.replace(session.get('h5FormPage'))
            return
        }
        if (session.get('query')) {
            //  老代码！有实际去掉
            let { toPage, proId } = session.get('query')
            switch (toPage) {
                case 'buy':
                     commonStore.Hash.history.replace('buy?proId=' + proId)
                    break;
                // case 'open':
                //     this.props.history.replace('openFlow')
                //     break;
                case 'order':
                    Toast.info('产品已经下架')
                    break;
                case 'bankAssets':
                     commonStore.Hash.history.replace('bankDetail')
                    break;
                case 'BankAccount':
                    goBC({
                        name: 'BankAccount',
                        type: 'replace',
                        params: {
                            CHANNEL_ID: session.get('channelId'),
                        }
                    });
                    break;
                default:
                     commonStore.Hash.history.replace('bankDetail')
            }
        } else {
             commonStore.Hash.history.replace('bankDetail')
        }
    }
}
export default {
    Render
}