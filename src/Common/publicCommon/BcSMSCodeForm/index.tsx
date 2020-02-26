import React, {useEffect, useImperativeHandle, useState, forwardRef} from "react";
import {BcButton} from 'Common/publicCommon/index'
import {BcYzmInput} from 'bc-bank-design'
import { Modal } from 'antd-mobile';
import './style.scss';

// 需要默认值的可选非必填参数
const mainDefaultProps = {
    phone: '',
    time:60
}

type Props = {
    sendCode: Function // 点击重新获取时发送的验证码
    submit: (yzm:string) => void
} & Partial<typeof mainDefaultProps>

export default forwardRef(function Main(props: Props, ref: any) {
    let {phone, sendCode, submit,time} = props
    let [flag, setFlag] = useState(false)
    let [yzm, setYzm] = useState('')
    let [show, setShow] = useState<boolean>(false)
    // 给父组件暴露方法
    useImperativeHandle(ref, () => ({
        resetFlag
    }));

    // 手机号脱敏函数
    function masking(str:string) {
        if (!str) return ''
        return str.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")
    }

    function confirm() {
        submit && submit(yzm)
    }

    function againGetYzm(callback?:Function) {
        //判断接口验证码标识发送成功执行
        if (flag) {
            callback && callback();
        }
        // setFlag(true)
        sendCode && sendCode()
    }

    function resetFlag(flag:boolean) {
        console.log(flag);
        setFlag(flag)
    }

    const closeTip = (or: boolean) => {
        setShow(or)
    }

    return <>
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
        <div className='securityCode-info'>
            <p>我们已发送<span>验证码</span>短信到您的手机</p>
            <p>{masking(phone || '')}</p>
        </div>
        <BcYzmInput resetFlag={resetFlag} countDownFlag={flag} timer={time} click={() => {
            againGetYzm()
        }}
                    change={(e:string) => setYzm(e)}> </BcYzmInput>
        <BcButton isDisabled={yzm.length != 6} className='securityCode-confirm'
                  onClick={() => confirm()}>确定</BcButton>
        <p style={{fontSize: '14px', color: '#2373EB', marginLeft: '14px', marginTop: '12px'}} onClick={()=>closeTip(true)}>收不到短信验证码?</p>
    </>
})
