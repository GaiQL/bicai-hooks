import * as React from 'react';
import "../style.scss"
import { session } from "Common/utils/store";
import { imgSrc } from 'Common/config/index'

export let ChangeBackground = (props: { num: any; bankName: any; }) => {
    let { num, bankName } = props
    let { orgLogo,orgName}: any = JSON.parse(session.get("bankData"))
    return (
        <div className="box" >
            <div className="bgBox">
                <img src={imgSrc + orgLogo} alt="" className="orgLogo" />

                <span>{orgName}</span>
            </div>
            <p className="bgNum">{num}</p>
        </div>
    )
}
