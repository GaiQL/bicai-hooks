/**
 * 人脸识别。
 */
import React from 'react'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {Headers} from 'Common/publicCommon'
import apiRealName from "Common/api/realname"
import {Images} from "Common/config/index";
import {Toast} from 'antd-mobile'
import "./style.scss"
import {session} from "Common/utils/store";
import {commonStore} from "Common/pages/store"
import {  TextareaItem } from 'antd-mobile';

const {openAlert} = commonStore

export default class BcRealNameModifyAddress extends React.Component<any, any> {
    state = {
        obj:{
            addrCheck: "",
            address: "山西省怀仁县何家堡乡郝家寨村491号",
            addressRegular: "^[\u4E00-\u9FA5][a-zA-Z0-9\-_#\u4E00-\u9FA5\uFF08\uFF09]*$",
            area: "怀仁县",
            birthday: "1997.10.5",
            city: "朔州市",
            detailAddress: "何家堡乡郝家寨村491号",
            gender: "男",
            idName: "张政",
            idNumber: "140624199710052039",
            issuingAuthority: "朔州市怀仁县公安局",
            nation: "汉",
            province: "山西省",
            validityPeriod: "2014.08.18-2024.08.18",
        }
    }
    componentDidMount(): void {
        // this.autoFocusInst.focus();
    }

    toChange = () => {
        let reg = this.state.obj.addressRegular
        console.log(reg)
    }
    public render(): React.ReactNode {
        let {detailAddress, addressRegular,} = this.state.obj
        return <div className="wrap">
            <Headers>修改地址</Headers>
            <div className="content">
                <div className="Location">
                    <div className="Location-left">
                        <div className="Location-content">
                            <div className="Location-region">
                                所在地区
                            </div>
                            <div className="Location-address">
                                山西省忻州市原平市
                            </div>
                        </div>
                        {/* <div className="Location-error">
                                所在地区有误，请重新选择
                            </div> */}
                    </div>
                    <div className="Location-right">
                        >
                    </div>
                </div>
                <div className="detailed">
                    <div className="detailed-section">
                        {/* <div className="detailed-left">
                            详细地址
                        </div> */}
                        <TextareaItem
                        title="详细地址"
                        placeholder="auto focus in Alipay client"
                        data-seed="logId"
                        // ref={el => this.autoFocusInst = el}
                        autoHeight
                    />
                    </div>
                    {/* <div className="detailed-error">
                            详细地址包含特殊字符，请重新输入
                        </div> */}
                </div>

            </div>
            <div className='bth-address'>确定</div>
        </div>
    }
}




