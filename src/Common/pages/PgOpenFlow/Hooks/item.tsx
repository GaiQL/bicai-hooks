import React, {useState, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import './style.scss'
import {Headers} from 'Common/publicCommon/index'
import {BcButton} from 'Common/publicCommon/index'
import {imgSrc, imgSrcIcon, Images} from 'Common/config/index'
import {BottomColumn} from 'Common/publicCommon/index'
import Store from './store'
import {session} from "Common/utils/store"
import {InitCom} from "./index";


export const Render = () => {

    const {Store} = InitCom.get();

    let {
        pageData, //
        tabSelect,
        selectFlag,
        agree,
        pgHeader,
        pgCardBgText,
        pgAgreeText,
        pgBtnText,
        goAgreement
    } = Store
    let {
        bankBgUrl,
        bankLogo,
        bankName,
        title,
        content,
        logoList = [],
        agreementList
    } = pageData || {}
    const [selectImg] = useState(Images.select);
    const [selectedImg] = useState(Images.selected);

    useEffect(() => {
        //获取初始数据
        Store.initData()
    }, [])

    return <div className='openFlow'>
        {/* 头部 */}
        <Headers>{pgHeader}</Headers>
        {/* 银行卡 */}
        <div className='openFlow-card-bg'>
            <div className='openFlow-card'>
                <img src={imgSrc + bankBgUrl} alt=""/>
                <p className='openFlow-card-bankLogo'>
                    <img src={imgSrc + bankLogo} alt=""/>
                </p>
                <p className='openFlow-card-bankName'>
                    {bankName}
                    <span>{pgCardBgText}</span>
                </p>
                <p className='openFlow-card-bankNum'>
                    <span>****</span>
                    <span>****</span>
                    <span>****</span>
                    <span>****</span>
                </p>
            </div>
        </div>
        {/*产品信息  */}
        <div className='openFlow-product'>
            <p className='openFlow-product-tit'>{title}</p>
            <p className='openFlow-product-text'>{content}</p>
            <div className='openFlow-product-icon'>
                {
                    logoList && logoList.map((item: Record<string, any>, ind: string | number | undefined) => {
                        return <p key={ind}>
                            <i><img src={imgSrc + item.logoUrl} alt=""/></i>
                            <span>{item.logoName}</span>
                        </p>
                    })
                }
            </div>
        </div>
        {/* 下一步按钮 */}
        <BcButton onClick={() => {
            session.set("clearInit", true)
            agree()
        }

        } className='openFlow-confirm'>{pgBtnText}</BcButton>
        {/* 阅读同意 */}
        <div className='openFlow-agree'>
            <div>
                <i onClick={() => tabSelect(selectFlag)}><img src={selectFlag ? selectedImg : selectImg} alt=""/></i>
                <p>
                    {pgAgreeText}
                    {
                        agreementList.map((item: Record<string, any>, ind: number) => {
                            return <b key={ind} onClick={() => { // @ts-ignore
                                // @ts-ignore
                                goAgreement(item)
                            }}>{item.agreementTitle}
                                {
                                    ind + 1 == agreementList.length ? null : <i>、</i>
                                }
                            </b>
                        })
                    }
                </p>
            </div>
        </div>
        {/* 银行信息 */}
        {/* <div className='openFlow-info'>
        <p><i> <img src={imgSrc + result.bankLogo} alt="" /></i><span>{result.orgName}</span></p>
        <p>{result.footer}</p>
    </div> */}
        <BottomColumn type='long'/>
    </div>
}

export default {
    Render: observer(Render)
}
