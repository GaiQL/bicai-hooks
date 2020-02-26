import React, { useEffect, useState, useContext } from 'react'
import { Picker, List, TextareaItem, Modal, Accordion, PickerView } from 'antd-mobile';
import { Headers } from 'Common/publicCommon/index'
import { BcButton } from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { InitCom } from "./index";
import { observer } from "mobx-react-lite"
import { RenderOccupation, RenderChangeOccupation } from './component'
import IconSvg, { IconCheck } from './IconSvg'
import { chooseProfessionBtn, choseBankCardBtn } from 'Common/Plugins/recordLogInfo'
import { descFn } from '../../../publicCommon/util'
import { BIZ_TYPE } from "Common/config/params.enum";
import { Images, imgSrc } from 'Common/config/index'
import { commonStore } from "Common/pages/store"
import { session } from "Common/utils/store"

import "./style.scss"
export let Render = (props:any) => {
    let { Config, Store, RenderState } = InitCom.get()
    let { IAddress, Idisabled, IBank, ILiveAddress, typeOccupation, isJump, btnText, isIndustryVal } = Config
    let {
        address,
        EchoDisplayInitData,
        realName,
        userCardId,
        bindCardList,
        bankName,
        newDutyList,
        dutyVal,
        industryVal,
        nextStep,
        getLiveAddress,
        DutyList,
        residentAddress,
        cardExpireDate,
        isDisabled,
        result,
        bankLogoUrl
    }: any = Store

    let { getAddress, getNewBank }: any = Store
    let [flagText, setFlagText] = useState(false)
    let [bankCardFlag, setBankCardFlag] = useState(false)
    let [bankInd, setBankInd] = useState(null)

    let [data, setData] = useState([])
    let [flag, setFlag] = useState(1)
    let [btnColor, setBtnColor] = useState("#cccccc")
    let [index, setIndex] = useState(-1)
    let [autoFocusInst, setSAutoFocusInst] = useState(null)
    useEffect(() => {
        EchoDisplayInitData()
        getNewBank(props.location.state)
        document.getElementById("PopupBox")!.style.display = "none"
        document.getElementById("PopupBox1")!.style.display = "none"
        return () => {
            session.remove("data")
        }
    }, [])
    return <div className='openPerfection'>
        <div>
            <Headers>完善开户信息</Headers>
            <p className='openPerfection-tit'>
                <img style={{ width: '10px', height: 'auto', marginRight: '3px', position: 'relative', top: '1px' }} src={require('Common/assets/images/tishi@2x.png')} alt="" />核实个人信息</p>
            {/* 个人信息 */}
            <div className='openPerfection-info'>
                <div className='openPerfection-info-default'>
                    <RenderState
                        name="姓名"
                        val={realName}
                        flag={Config.isRealName}
                    />
                    <RenderState
                        name="身份证有效期"
                        val={cardExpireDate}
                        flag={Config.isIDdate}
                    />
                    <RenderState
                        name="身份证号码"
                        val={userCardId}
                        flag={Config.isRealName}

                    />
                    <RenderStateAddress
                        Idisabled={Idisabled}
                        setFlagText={setFlagText}
                        flagText={flagText}
                        flag={IAddress}
                        address={address}
                        getAddress={getAddress}
                        isJump={isJump}
                        result={result}
                    />
                    {/*居住地址*/}
                    <RenderLiveAddress
                        ILiveAddress={ILiveAddress}
                        autoFocusInst={autoFocusInst}
                        setFlagText={setFlagText}
                        getLiveAddress={getLiveAddress}
                        residentAddress={residentAddress}
                    />
                    {/*居住地址自动填入联系地址*/}
                    {renderLiveAddressRadio(ILiveAddress)}
                    <RenderChangeOccupation
                        name="职业"
                        dutyVal={dutyVal}
                    />
                    {isIndustryVal ? <RenderChangeOccupation
                        name="行业"
                        dutyVal={dutyVal}
                    /> : null
                    }


                </div>
            </div>
            {/* 职业 */}
            <div className="PopupBox" id="PopupBox">
                <RenderOccupation
                    data={data}
                    setData={setData}
                    newDutyList={newDutyList}

                    flag={flag}
                    setFlag={setFlag}
                    btnColor={btnColor}
                    setBtnColor={setBtnColor}
                    index={index}
                    setIndex={setIndex}
                    name="职业"
                />

            </div>
            {/* 行业 */}
            <div className="PopupBox" id="PopupBox1">
                <RenderOccupation
                    data={data}
                    setData={setData}
                    newDutyList={DutyList}
                    flag={flag}
                    setFlag={setFlag}
                    btnColor={btnColor}
                    setBtnColor={setBtnColor}
                    index={index}
                    setIndex={setIndex}
                    name="行业"
                />

            </div>
            <p className='openPerfection-tit'><img style={{width: '10px', height: 'auto', marginRight: '3px', position: 'relative', top: '1px'}} src={require('Common/assets/images/tishi@2x.png')} alt="" />绑定一张常用储蓄卡，作为转入本产品的付款方式</p>
            <RenderStateBank flag={IBank} setBankCardFlag={setBankCardFlag} bankName={bankName} bankLogoUrl={bankLogoUrl}/>
            {/* 选择银行卡弹框 */}
            {renderBankModal(bankCardFlag, setBankCardFlag, setBankInd, { list: bindCardList, selectId: bankInd })}
            <div className='openPerfection-confirm' >
                <BcButton isDisabled={dutyVal == '请选择' || bankName == '请选择' || (isIndustryVal && industryVal == "请选择")} onClick={() => nextStep()}>{btnText}</BcButton>
            </div>
            <BottomColumn type='long' />
        </div>

    </div >
}
export let RenderLiveAddress = (props: { ILiveAddress: any; autoFocusInst: any; setFlagText: any; getLiveAddress: any; residentAddress: any; }) => {
    let { Store } = InitCom.get()
    let { autoEnterResidentAddressFlag }: any = Store
    let { ILiveAddress, autoFocusInst, setFlagText, getLiveAddress, residentAddress } = props
    return ILiveAddress ? <div className='openPerfection-info-address' >
        <span style={{ paddingTop: "12px" }}>居住地址</span>
        <span style={{ paddingTop: "7px", paddingBottom: "7px" }}>
            <TextareaItem
                count={50}
                className="text-area"
                value={comAddRess(residentAddress)}
                placeholder='请填写'
                data-seed="logId"
                ref={(el: any) => autoFocusInst = el}
                autoHeight
                disabled={autoEnterResidentAddressFlag ? true : false}
                onClick={() => {
                    setFlagText(true)
                }}
                onChange={(val) => {
                    getLiveAddress(val)
                }}
            />
        </span>
    </div> : null
}
export let renderLiveAddressRadio = (flag: any) => {
    let { Config, Store, RenderState } = InitCom.get()
    let { changeAutoEnterResidentAddress, autoEnterResidentAddressFlag = true }: any = Store
    return flag ? <div className="openPerfection-info-addressRadio">
        <span>与身份证地址相同</span>
        <i onClick={() => changeAutoEnterResidentAddress()}><img src={autoEnterResidentAddressFlag ? Images.selected : Images.select} alt="" /></i>
    </div> : null
}
//姓名 身份证众多模版
export let RenderState = (props: { name: any; val: any; flag: any; }) => {
    let { name, val, flag } = props
    return (
        flag ? <p><span>{name}</span><span>{val}</span></p> : null
    )
}
//性别选择组件
export let RenderPickerSex = (props: { flag: any; defaultVal: any; onChangeSex: any; }) => {
    let { flag, defaultVal, onChangeSex } = props
    let sexList = [
        {
            label: '女',
            value: '女',
        },
        {
            label: '男',
            value: '男',
        },
    ]
    return flag ? <Picker
        data={sexList}
        value={[defaultVal]}
        cols={1}
        onChange={(val) => {
            onChangeSex(val)
        }
        }
    >
        <List.Item arrow="horizontal">性别</List.Item>
    </Picker> : null
}
//选择民族组件
export let RenderPickerNation = (props: { flag: any; nationList: any; onChangeNation: any; nationVal: any; }) => {
    let { flag, nationList, onChangeNation, nationVal } = props
    return flag ? <Picker
        data={nationList}
        value={nationVal}
        cols={1}
        onChange={(val) => onChangeNation(val)}
    >
        <List.Item arrow="horizontal">民族</List.Item>
    </Picker> : null
}
//地址
export let RenderStateAddress = (props: { flag: any; Idisabled: any; setFlagText: any; flagText: any; address: any; getAddress: any; isJump: any; result: any }) => {
    let { flag, Idisabled, setFlagText, flagText, address, getAddress, isJump, result } = props
    let { Store } = InitCom.get()
    let { EditAddress } = Store
    if (Idisabled) {
        return flag ? <div className='openPerfection-info-address' style={{ alignItems: "flex-start" }} onClick={() => {
            isJump ? commonStore.Hash.history.push(`/editAddress?address=${result.address}&EditAddress=${EditAddress}`) : null
        }}>
            <span style={{ paddingTop: "9px", lineHeight: "26px", paddingBottom: "9px" }}>联系地址</span>
            <span style={{ textAlign: "right", width: "250px", padding: "10px 0", lineHeight: "22px", color: "#333" }}>
                {address}
                <IconSvg wid='17' hte='17' />
            </span>
        </div> : null
    } else {
        return flag ? <div className='openPerfection-info-address'>
            <span style={{ paddingTop: "12px" }}>联系地址</span>
            <span style={{ paddingTop: "7px", paddingBottom: "7px" }}>
                <TextareaItem
                    className="text-area"
                    value={comAddRess(address, flagText)}
                    placeholder='请填写联系地址'
                    data-seed="logId"
                    autoHeight
                    onClick={() => {
                        setFlagText(true)
                    }}
                    onChange={(val) => {
                        getAddress(val)
                    }}
                />
            </span>
        </div> : null
    }
}
//地址截取地址长度
function comAddRess(len: string, flagText?: undefined) {
    if (len.length <= 13) {
        return len
    } else {
        return flagText ? len : len.slice(0, 10) + "..."
    }
}
//选择银行卡组件
export let RenderStateBank = (props: { flag: any; setBankCardFlag: any; bankName: any; bankLogoUrl: any}) => {
    let { flag, setBankCardFlag, bankName, bankLogoUrl } = props
    return flag ? <div className='openPerfection-job'>
        <p>
            <span>银行卡</span>
            <span onClick={(e) => {
                showModal(setBankCardFlag)
                // @ts-ignore
            }} style={{
                color: (bankName != '请添加')?'#333':''
            }}>
                {bankName !== '请选择' && <img style={{width: '18px', height: 'auto', position:'relative', top: '3px', right: '5px'}} src={imgSrc + bankLogoUrl} alt="" />}
                {bankName}
                <i style={{ position: "relative", top: "1px" }}><IconSvg /></i>
            </span>
        </p>
    </div> : null
}
//银行卡模版
export let renderBankModal = (show: boolean, setBankCardFlag: React.Dispatch<React.SetStateAction<boolean>>, setBankInd: any, { list, selectId }: { list: any; selectId: null; }) => {
    return <Modal
        className='bank-card'
        popup
        visible={show}
        transparent
        animationType="slide-up"
        title={<div className='bank-card-tit add-tit'>
            <span onClick={() => { onCloseBank(setBankCardFlag) }}>
                <img src={require('Common/assets/images/close.png')} alt="" />
            </span>
            <span>选择绑定卡</span>
            <span></span></div>}
        maskClosable={false}
        onClose={() => { onCloseBank(setBankCardFlag) }}
    >
        <div style={{ height: '100%' }}>
            <div className='bank-card-list'>
                {
                    list.map((item: { supportFlag: any; bankLogoUrl?: any; bankName?: any; bankCardNum?: any; bankCardQuotaDescDto?: any; }, ind: string | number | null | undefined) => {
                        let {
                            bankCardQuotaDescDto
                        } = item
                        let { dayDesc, monthDesc, availableDesc } = descFn(BIZ_TYPE.open, bankCardQuotaDescDto)
                        return <div style={{ opacity: item.supportFlag == '0' ? 0.5 : 1 }} key={ind as number}
                            className={'bank-card-item'}
                            onClick={() => {
                                onCloseBank(setBankCardFlag,
                                    item, ind, setBankInd)
                            }}
                        >
                            <p><img src={imgSrc + item.bankLogoUrl} alt="" /></p>
                            <p>
                                <span>{item.bankName}储蓄卡({item.bankCardNum.substring(item.bankCardNum.length - 4)})</span>
                                {
                                    item.supportFlag == 0 ? <span>{availableDesc}</span> : null
                                }
                                {
                                    item.supportFlag == 1 && dayDesc ? <span>{dayDesc}</span> : null
                                }
                                {
                                    item.supportFlag == 1 && monthDesc ? <span>{monthDesc}</span> : null
                                }

                            </p>
                            <p>
                                <i style={{ display: selectId == ind ? "block" : "none" }}>
                                    <img style={{width: '16px', height: 'auto'}} src={require('Common/assets/images/ziyuan@2x.png')} alt="" />
                                </i>
                            </p>
                        </div>
                    })
                }
            </div>
            <div className="add-bank-card" onClick={() => { addNewBank() }}>
                <p>
                    <span><img src={require('Common/assets/images/bankImg2x.png')} alt="" /></span>
                    <span style={{color: '#333'}}>绑定新银行卡</span>
                    <IconSvg wid='17' hte='17' />
                </p>
            </div>
        </div>
    </Modal>
}
//公共打开弹框
export let showModal = (setBankCardFlag: Function) => {
    try {
        chooseProfessionBtn()
        choseBankCardBtn()
    } catch (err) {

    }
    setBankCardFlag(true)
    ModalHelper().afterOpen('open-modal')
}
//关闭
export let onCloseBank = (
    setBankCardFlag: { (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; },
    val?: { supportFlag: any; bankLogoUrl?: any; bankName?: any; bankCardNum?: any; bankCardQuotaDescDto?: any; } | undefined,
    ind?: string | number | null | undefined, setBankInd?: { (value: React.SetStateAction<null>): void; (arg0: number): void; } | undefined
) => {
    if (val && val.supportFlag == 0) return // 不支持
    if (typeof ind == 'number') {
        setBankInd && setBankInd(ind)
    }
    setBankCardFlag(false)
    let { Store } = InitCom.get()
    let { getBank }: any = Store
    if (val) {
        getBank(val)
    }
    ModalHelper().beforeClose('open-modal')
}
function ModalHelper() {
    var scrollTop: number;
    return {
        afterOpen(bodyCls: string) {
            scrollTop = document.scrollingElement!.scrollTop;
            document.body.classList.add(bodyCls);
            document.body.style.top = -scrollTop + 'px';
        },
        beforeClose(bodyCls: string) {
            document.body.classList.remove(bodyCls);
            document.scrollingElement!.scrollTop = scrollTop;
        }
    };
}

function addNewBank() {
    let { Store } = InitCom.get()
    let { realName, userCardId, loginPhoneNum } = Store
    ModalHelper().beforeClose('open-modal')
    commonStore.Hash.history.push(`/addNewBank?type=openAddBank&name=${realName}&idCard=${userCardId}&loginPhoneNum=${loginPhoneNum}`)
}
export default {
    Render: observer(Render),
    RenderState,
    RenderPickerSex: observer(RenderPickerSex),
}
