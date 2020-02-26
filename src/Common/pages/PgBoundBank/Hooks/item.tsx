import React, {useEffect,useState,useContext} from 'react'
import './style.scss'
import { imgSrc } from "Common/config/index";
import { Modal } from 'antd-mobile'
import {commonStore} from "Common/pages/store"
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import { Headers } from 'Common/publicCommon/index'
import { BcButton } from 'Common/publicCommon/index'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {InitCom,ConfirmTit_Enum} from "./index";
import { observer,useLocalStore } from "mobx-react-lite"
import IconSvg from './IconSvg';

export let Render = ()=>{
    console.log(InitCom.get())
    let {Store,useChangeBankCard,BankCardList, BankCardBtn,Config} = InitCom.get()
    useEffect(()=>{
        Store.getCardInfo()
    },[])
    let {bandCardInfo} = Store
    let {bankCardPhone,cardList = []}:any= bandCardInfo || {}
    let { confirmTit, unbindFlag, bottomText, BoundBankState }: any = Config
    return <div className='BoundBank'>
        {/* 头部 */}
        <Headers>绑定银行卡</Headers>
        <BankCardList {...{cardList,BoundBankState,unbindFlag,BankCardList}}/>
        <BankCardBtn onClick={
            ()=>{
                // 该方法可以重写
                useChangeBankCard({bandCardInfo,bankCardPhone})
            }
        }/>

        {/* <BcButton wrapperClassName='BoundBank-confirm' onClick={() =>{
            useChangeBankCard({bandCardInfo,bankCardPhone})
        }
        }>{
            cardList.length == 0 ? ConfirmTit_Enum.add : confirmTit
        }</BcButton>
        {/* 继承组件中传 bottomText = false 不提示 '提示' 这段话 */}
        {
            bottomText && confirmTit == ConfirmTit_Enum.update ?
                <p className='BoundBank-tip'>提示：更换绑定银行卡前，请确认已转出所有的投资资金并提现</p> : null
        }
        <BottomColumn type='long' />
    </div>
}
// view 银行卡列表
export let BankCardList = (props: { cardList: any; BoundBankState: any; })=>{
    const {cardList,BoundBankState} = props
    let {Store,Config} = InitCom.get()
    Store = useLocalStore(()=>Store)
    //carList为空的显示（目前只有中关村有显示）
    let [len,setLen] = useState(0)
    let [bankInformation,setBankInformation] = useState({})
    let [phone,setPhone] = useState({})
    let [bankCardPhone,setBankCardPhone] = useState({})
    let [bankCardNum,setBankCardNum] = useState({})
    let [bankName,setBankName] = useState({})
    let [flag,setFlag] = useState(false)
    let [popupList,setPopupList] = useState<any>([])

    /**
     * 解绑银行卡（wsq）(判断是一张卡还是多张卡  提示框显示不同)
     * @param cardList
     * @param item
     */
    const unBindCar = async (cardList: string | any[], item: Record<string,any>) => {
        setLen(cardList.length)
        setBankInformation(item.item)
        setPhone(item)
        setBankCardPhone(item.bankCardPhone)
        setBankCardNum(item.bankCardNum)
        setBankName(item.bankName)
        if (cardList.length == 1) {
            setPopupList(Config.onePopupList)
        } else {
            setPopupList(Config.defaultPopupList)
        }
    }
    //设置卡的状态(默认卡)
    function cardStatus(bank: Record<string, any>) {
        if (bank.supportFlag == 1) {
            return bank.defaultCardFlag == 1 ? <p className='BoundBank-item-default'>默认卡</p> : null
        } else {
            return <p className='BoundBank-item-default'>暂不支持</p>
        }
    }
    function BoundBankView() {
        return (<div className='BoundBank-title'>
            <img src={require("../../../../../public/static/images/kong@3x.png")} alt="" />
            <div className="Bound-tit">目前您还未绑定银行卡</div>
            <div>可点击下方按钮进行快速绑定</div>
        </div>)
    }

    return <>
        <RenderState {...{flag,popupList,bankInformation,Config,len,isShow:(fla: React.SetStateAction<boolean>)=>{setFlag(fla)}}}/>
        {
            cardList && cardList.length <= 0
                ?
                BoundBankState ?
                    BoundBankView() : null
                :
                cardList && cardList.map((bank: Record<string, any>, index: string | number | undefined) => {
                    return <div className='BoundBank-list' key={index}
                                onClick={() => {
                                    !Config.unbindFlag ? null : setFlag(true)
                                    unBindCar(cardList, bank)
                                }}>
                        <div className='BoundBank-list-item' style={{ opacity: bank.supportFlag == 1 ? 1 : 0.5 }}>
                            <img src={imgSrc + bank.bankBgUrl} alt="" />
                            <p className='BoundBank-item-logo'>
                                <img src={imgSrc + bank.bankLogoUrl} alt="" />
                            </p>
                            <p className='BoundBank-item-text'>
                                {bank.bankCardName}
                            </p>
                            <p className='BoundBankCard-text'>
                                储蓄卡
                            </p>
                            {
                                cardStatus(bank)
                            }
                            <p className='BoundBank-item-num'>
                                <span>****</span>
                                <span>****</span>
                                <span>****</span>
                                <span>{bank.bankCardNum && bank.bankCardNum.substr(-4)}</span>
                            </p>
                        </div>
                    </div>
                })
        }

    </>

}

// view 绑定卡按钮
export let BankCardBtn = (props: { onClick: any; }) => {
    let {onClick}  = props
    let {Config} = InitCom.get()
    let {bankCardText} = Config;
    return <>
        <div className='bank-card-box'>
            <div className='bank-card-content'>
                <div className='bank-card-title'>
                    <img src={require('Common/assets/images/bankImg2x.png')} alt="" />
                    <span className='boundCardText'>{bankCardText}</span>
                </div>
                <p className='rightIcon' onClick={()=>{
                    onClick && onClick()
                }}>
                    <IconSvg wid='22' hte='22' />
                </p>
            </div>
        </div>
    </>
}

// view 弹框封装 view
export let RenderState = (props: any) => {
    let { Config} = InitCom.get()
    let { setDefaultBindCard, flag, popupList,bankInformation,len,isShow}:any = props
    const defaultCardPop = () => {
        const {openAlert} = commonStore
        if (len <= Config.minBankCardNum) {
            openAlert('绑定银行卡', '最少需要绑定一张一类户银行卡', [
                {text: '确定', onPress: () => console.log('确定')},
            ])
        } else {
            Config.isTodoCode ?
                commonStore.Hash.history.replace(`/serviceInputSmsCode?bindFlg=${"2"}&queryData=` + JSON.stringify(bankInformation))
                :
                untieBindCard()
        }
    }
    /**
     * 解绑银行卡
     */
    const untieBindCard = async () => {
        let {bankCardNum, bankCardPhone, bankNo, bankName}: any = bankInformation
        await apiBank.untieBindCard({
            bankCardNum,//银行卡
            bankCardPhone, //预留手机号
            bankNo,
            bankName
        })
        //刷新
        apiBandCardFn()

    }
    /**
     * 设置默认卡
     */
    setDefaultBindCard = async () => {
        let {bankCardNum}: any = bankInformation
        await apiBank.setDefaultBindCard({
            bankCardNum//银行卡
        })
        // 刷新
        apiBandCardFn()
    }
    return <Modal
        popup
        visible={flag}
        onClose={()=>{isShow(false)}}
        animationType="slide-up"
    >
        <div className="popupList">
            {popupList.map((i: { type: any; typeName: React.ReactNode; }, index: string | number | undefined) => {
                // 0是设为默认卡
                // 1是解绑卡
                // 2是取消
                return <div key={index} className="popupList-child"
                            onClick={() => {
                                switch (i.type) {
                                    case 0:
                                        setDefaultBindCard()

                                        isShow(false)
                                        break;
                                    case 1:
                                        isShow(false)
                                        defaultCardPop()
                                        break;
                                    case 2:
                                        isShow(false)
                                        break;
                                    default:
                                        break;
                                }
                            }}>{i.typeName}</div>
            })}

        </div>
    </Modal>
}
// api 初始化银行卡列表数据
export let apiBandCardFn = async ()=>{
}

export default {
    BankCardList,
    BankCardBtn,
    Render:observer(Render),
    RenderState:observer(RenderState),
    apiBandCardFn
}

