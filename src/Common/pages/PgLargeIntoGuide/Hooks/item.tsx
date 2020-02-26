import React, {useEffect, useState, useContext} from 'react'
import './style.scss'
import {Headers} from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {observer} from "mobx-react-lite"
import { PhoneImage,Arrows,BackTop } from '../IconSvg';
import { InitCom as PgLargeIntoHome } from 'Common/pages/PgLargeIntoHome/Hooks/index';

// 页面共享模块 用于引入 Config,Store,Handle,Item
import {InitCom} from "./index";

// 主渲染函数 Render名字必须存在
export const Render = () => {

    let { Store,LargeIntoGuidePullDownModel,FooterButton } = InitCom.get();

    useEffect(()=>{ Store.initData() },[]);

    let { backTopOnoff,backTop,guidPageData } = Store;

    return (
        <div className="largeIntoGuideWrapper">
            <Headers>大额转入指引</Headers>
            <div className="largeIntoGuidePaddingSection">
                <section>
                    <PhoneImage />
                    <span>手机转账</span>
                </section>
                <section>
                    {
                        guidPageData.infoList && guidPageData.infoList.map(( data: any, index: string | number | undefined )=>{
                            return ( <LargeIntoGuidePullDownModel data={ data } key={ index }/> )
                        })
                    }
                </section>
            </div>
            <FooterButton />
            <BackTop className="largeIntoGuideBackTop" style={{ display:backTopOnoff?'block':'none' }} onClick={backTop}/>
            <BottomColumn type="long"/>
        </div>
    )
}

const LargeIntoGuidePullDownModel = ( props: { data: any } ) => {

    const { Store } = InitCom.get();
    const [ showContentOnoff,setShowContentOnoff ] = useState(false);
    const switchShowContentOnoff = () => { setShowContentOnoff(!showContentOnoff); }
    const { data } = props;
    const { guidPageData } = Store;
    return (
        <div className="largeIntoGuidePullDownModel">
            <div>
                <p style={{display:data.order=="1"?'block':'none'}}>{ guidPageData.title }</p>
                <p>{ data.order }.{ data.type2_TITLE }</p>
                <p>{ data.content_DESCRIPTION }</p>
            </div>
            <div style={{ height:showContentOnoff?'auto':'0' }} >
                <div dangerouslySetInnerHTML={{ __html:data.text }}></div>
            </div>
            <footer onClick={ switchShowContentOnoff }>
                <Arrows style={{ transform: `rotate(${showContentOnoff?180:0}deg)` }}/>
                <p>{ showContentOnoff?'点击收起':'查看图文教程' }</p>
            </footer>
        </div>
    )

}

const FooterButton = () => {
    let { Store } = InitCom.get();
    let { accountInfo } = Store;

    return (
        <footer className="largeIntoGuideFooterButton">
            <p>复制后，去其他银行的手机App转入资金到{ accountInfo.orgName }电子账号</p>
            <div onClick={ ()=>{ PgLargeIntoHome.get().copyAccountNum( accountInfo.accountNum ) } }>复制电子账号</div>
        </footer>
    )
}

export default {
    Render:observer(Render),
    LargeIntoGuidePullDownModel,
    FooterButton
}

