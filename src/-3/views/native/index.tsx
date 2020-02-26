import React from 'react'
import PgNative,{Base64,Props} from 'Common/pages/PgNative'
import {commonStore} from "Common/pages/store"
import {observer, inject} from 'mobx-react'
import './style.scss'
import {session,} from 'Common/utils/store'
import {Toast} from 'antd-mobile';
import Headers from 'Common/publicCommon/Headers'
import {BanksH5URL} from "Common/config/index";
import Tool from 'Common/utils/Tool'
class Native extends PgNative {
    /**
     * 这个文件重写（-3），专门处理比财相关页面
     * @param val
     **/
    async sendParam(val: any) {
        let res: any = JSON.parse(Base64.decode(val)); //查询登录用户某机构绑定卡信息接口apiBandCard
        let {
            type, // buy 购买 open 开户 bankAssets 银行资产 redeem
            common,
            head,
            params
        }: Props = res
        console.log('paramsCCC>>>', res);
        // await this.initCommon(common)
        await this.initHead(head)
        if (!type) return Toast.info('target不能为空')
        console.log(params);
        console.log(type);
        this.pageDispatch(type,params)
    }

    goBcUpdateIDCard=()=>{
        commonStore.Hash.history.replace("/updateIdCard?fromApp=1")
    }
    // goBcFaceDiscern(params) {
    //     console.log(params);//
    //     let {userName, identNo} = params
    //     this.windowRepalce(BanksH5URL.bcFaceDiscern + `?userName=${userName}&identNo=${identNo}`)
    // }
    goBcFaceDiscern(params: Record<string, any>) {
        let {userName, identNo}:any = params || {}
        if (Tool.Regular.cardID.test(identNo)) {
            commonStore.Hash.history.replace(`/faceDiscern?userName=${userName?userName:''}&identNo=${identNo?identNo:''}`)
        } else {
        commonStore.Hash.history.replace(`/faceDiscern?userName=${identNo?identNo:''}&identNo=${userName?userName:''}`)

        }
    }
    goBcRealNameModifyAddress=(params: { preAddressData: string })=>{
        let preAddressData;
        if(typeof params.preAddressData == 'string'){
            preAddressData = JSON.parse(params.preAddressData)
        }else {
            preAddressData = params.preAddressData
        }
        session.set('bcRealNameModifyAddressParams',preAddressData)
        commonStore.Hash.history.replace("/bcRealNameModifyAddress")
    }
    render(): React.ReactNode {
        return (
            <div className="banklonding">
                <Headers type={'none'}>{" "}</Headers>
                {/*<p>正在跳转</p>*/}
                {/*<button onClick={()=>{this.goBcUpdateIDCard()}}>212121</button>*/}
            </div>
        )
    }
}
export default Native
