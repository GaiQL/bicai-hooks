import React, { useState, useCallback, useEffect } from 'react';
import './style.scss'
import BcNumberInput from './BcNumberInput'
//最后记得改css引入路径
/**
 * @param click 点击重新获取事件
 * @param timer 倒计时时间
 * @param change 获取value的回调
 */
interface Props {
    click: Function,
    timer: number,
    change: Function,
    getEventType?: Function,
    [propName: string]: any;
}
function BcYzmInput(props:Props ) {
    let endTime:any = null
    let { click, timer, change, getEventType } = props
    let [time, setTime] = useState(timer)
    let [val, setVal] = useState('')
    let [flagTime, setFlagTime] = useState(false)
    useEffect(() => {
        send()
    }, [])
    useEffect(() => {
        change && change(val)
    }, [val])
    function send() {
        setFlagTime(true)
        setInter();
    }
    function setInter() {
        clear()
        endTime = setInterval(() => actionCountDown(), 1000)
    }
    function actionCountDown() {
        if (time <= 0) {
            clear()
            setTime(timer)
            setFlagTime(false)
        } else {
            setTime(time)
            time--
            setFlagTime(true)
        }
    }
    function inputBlur(val:string){
        console.log(val);
        getEventType && getEventType('blur')
    }
    function inputFocus(val:string) {
        console.log(val);
        getEventType && getEventType('focus')
    }
    function clear(){
        clearInterval(endTime)
    }
    let obj = {
        maxLength: 6,
        className: 'yzm-input',
        onChange: (val:string) => setVal(val),
        onBlur: (val:string) => inputBlur(val),
        onFocus: (val:string) => inputFocus(val),
        extra: `<div class='count-down' id=${flagTime ? 'timer' : 'retrieve'}>${flagTime ? time + '秒后重发' : '重新获取'}</div>`,
        onExtraClick: (flagTime ? () => {} : () => click(setInter))
    }
    return (
        <div className="yzm-container">
            <BcNumberInput {...obj}></BcNumberInput>
        </div>
    )
}
export default BcYzmInput

