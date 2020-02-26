
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import BcNumberInput from 'Common/publicCommon/BcNumberInput'
import { BcButton } from 'Common/publicCommon/index'
import Help from 'Common/utils/Tool'
import { Modal } from 'antd-mobile';
import './style.scss'

interface IVerificationCodeBox {
    bankCardPhone: string,
    seconds: Number,
    onClose: Function,
    retrieve: Function,
    completeHandles: Function,
    setValidateCode: (arg0: string | any[]) => void
}


// 验证码弹框
function BcVerificationCodeBox(props: Partial<IVerificationCodeBox>, ref: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined): JSX.Element {
    let initHeight = -document.documentElement.clientHeight / 2
    let { bankCardPhone, onClose, completeHandles, retrieve, setValidateCode } = props
    let [bottom, setbottom] = useState<number>(initHeight)
    let [seconds, setseconds] = useState<Number>(props.seconds || 60)
    let [isDisabled, setisDisabled] = useState<boolean>(true)
    let [show, setShow] = useState<boolean>(false)
    let childRef = useRef(null)
    let wrapRef = useRef(null)
    let otherBottom = useRef<any>(null)
    let timer:any = null

    useEffect(() => {
        setTimeout(() => { setbottom(0) }, 100)
        return () => {
            window.clearInterval(timer)
        }
    }, [])

    const onFocus = () => {
        let height = otherBottom.current.keyBorderRef.keyBorderRef.offsetHeight
        setTimeout(() => { setbottom(height) }, 200)
    }

    const onBlur = () => {
        setbottom(0)
    }

    const onChange = (value: string | any[]) => {
        setValidateCode && setValidateCode(value)
        value.length >= 6 ? setisDisabled(false) : setisDisabled(true)
    }

    const onCloseMoudle = () => {
        otherBottom.current.closeKeyWorld()
        setbottom(initHeight)
        setTimeout(() => { onClose && onClose(childRef.current) }, 500)
    }

    const closeTip = (or: boolean) => {
        setShow(or)
    }

    const verificationCodeStart = (time: number) => {
        timer = setInterval(() => {
            time--
            if (time <= 0) {
                window.clearInterval(timer)
            }
            setseconds(time)
        }, 1000)
    }

    useImperativeHandle(ref, () => {
        return {
            verificationCodeStart: verificationCodeStart
        }
    })

    return <>

        <div className="code-mask"></div>
        <div className='code-modal common-modal' ref={wrapRef} style={{ bottom: bottom }}>
            <Modal
                className='mq-module'
                visible={show}
                transparent
                maskClosable={false}
                title="收不到短信验证码？"
                footer={[{ text: '我知道了', onPress: () => { closeTip(false) } }]}
            >
                <div className='conent'>
                    <p>1.由于<b>网络原因</b>，短信可能会延迟到达</p>
                    <p>2.请确认当前手机号是否为<b>银行预留手机号</b></p>
                    <p>3.请确认当前手机号是否<b>欠费停机</b></p>
                    <p>4.请确认短信是否被<b>安全软件拦截</b></p>
                    <p>5.获取更多帮助，可联系银行客服<b>95128</b></p>
                </div>
            </Modal>

            <div className='common-tit' style={{ border: '1px solid #DDDDDD' }}>
                <span></span>
                <span>输入短信验证码</span>
                <span style={{ marginRight: '15px' }}><img src={require('Common/assets/images/close.png')} alt="" onClick={() => {
                    onCloseMoudle()
                }} /></span>
            </div>
            <div className='msg-content'>
                <p>短信已发送至{Help.fromatMobileFilter(bankCardPhone || '')} <span className='noMsg' onClick={() => { closeTip(true) }}>收不到短信验证码？</span></p>
                <div className="code-box">
                    <BcNumberInput ref={otherBottom} className="input" onFocus={onFocus} onChange={onChange} onBlur={onBlur} maxLength={6}/>
                    <div className={seconds <= 0 ? 'seconds isEdit' : 'seconds isSeconds'} onClick={ () => seconds <= 0 ? retrieve && retrieve() : null}>{seconds <= 0 ? '重新获取' : `${seconds}秒后重发`}</div>
                </div>
                <BcButton className='msg-btn buy-btn' isDisabled={isDisabled} onClick={() => {
                    completeHandles && completeHandles()
                }}>确定</BcButton>
            </div>
        </div>
    </>
}

export default forwardRef(BcVerificationCodeBox)
