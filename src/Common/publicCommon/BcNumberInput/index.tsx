/**
 * @author  Mr.ma
 * @use     针对所有验证码的页面，模仿的input和自定义的键盘
 * @date    2019-07-30
 * @params  placeholder         类似input的placeholder
 *          editInput           是否编辑input
 *          disabled            是否禁用input
 *          value               input的值
 *          className           外围可配置的className
 *          maxLength           最大的可输入长度
 *          fakeInputClassName  高仿的input的className
 *          children            子类
 *          labelNumber         传入的子类可占据的位置
 *          extra               右侧可配置的文字 / 注释
 *          onExtraClick        右侧注释的点击回调函数
 *          onChange            input的change事件
 *          onBlur              input的blur事件
 */
import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import BcCustomKeyboard from '../BcCustomKeyboard'
import './style.scss'

interface NumberInputProps {
    placeholder?: string,
    editInput?: boolean,
    disabled?: boolean,
    value?: any,
    className?: string,
    maxLength?: number,
    fakeInputClassName?: string,
    children?: any,
    labelNumber?: number,
    extra?: any,
    onChange?: (value: string) => void,
    onBlur?: (value: string) => void,
    onExtraClick?: () => void,
    onFocus?: () => void
}

function BcNumberInput(props:Record<string,any>, ref:any): JSX.Element {
    let [value, setvaluue] = useState('')
    let [focus, setfocus] = useState(false)
    const fakeInput = useRef(null)
    // 伪造的input的点击事件
    const onFakeInputClick = () => {
        onfocus()
    }
    const onfocus = () => {
        removeBlurListener()
        if (!focus) {
            onInputFocus()
        }
        setTimeout(() => {
            addBlurListener()
        }, 50)
    }
    const onChange = (value: any) => {
        // this.setState({ value })
        setvaluue(value)
        props.onChange(value)
    }
    const onInputFocus = () => {
        setfocus(true)
        props.onFocus && props.onFocus()
    }
    const onInputBlur = (value: string) => {
        if (focus) {
            setfocus(false)
            props.onBlur && props.onBlur(value)
        }
    }
    const doBlur = (ev: MouseEvent) => {
        if (ev.target !== fakeInput.current) {
            onInputBlur(value);
        }
    }
    const addBlurListener = () => {
        document.addEventListener('click', doBlur, false);
    }
    const removeBlurListener = () => {
        document.removeEventListener('click', doBlur, false);
    }

    const handleKeyboard = (keyboardVal: string) => {
        const { maxLength } = props
        let valueAfterChange
        if (keyboardVal === 'delete') {
            valueAfterChange = value.substring(0, value.length - 1)
            onChange(valueAfterChange)
        } else if (keyboardVal === 'complete') {
            valueAfterChange = value
            onChange(valueAfterChange)
            setfocus(false)
            props.onBlur()
        } else {
            if (maxLength !== undefined && maxLength >= 0 && (value + keyboardVal).length > maxLength) {
                valueAfterChange = (value + keyboardVal).substr(0, maxLength)
                onChange(valueAfterChange)
            } else {
                valueAfterChange = value + keyboardVal
                onChange(valueAfterChange)
            }
        }
    }
    let keyBorderRef = useRef(null)

    const closeKeyWorld = () => {
        handleKeyboard('complete')
    }

    useImperativeHandle(ref,()=>{//第一个参数，要暴露给哪个(ref)？第二个参数要暴露出什么？
        return {
            keyBorderRef: keyBorderRef.current,
            closeKeyWorld: closeKeyWorld
        }
    });
    const {
        placeholder = '输入验证码',
        editInput = true,
        disabled = false,
        className = '',
        fakeInputClassName = '',
        labelNumber = 1,
        children,
        extra,
        onExtraClick
    } = props
    const preventKeyboard = disabled || !editInput
    return <>
        <div className={`${className} fake-input-box`} >
            {children ? (<div style={{ width: 16 * labelNumber + 'px' }} className="label">{children}</div>) : ''}
            <div className='fake-input-content' onClick={preventKeyboard ? () => { } : onFakeInputClick}>
                {value == '' && (<div className="fake-input-placeholder">{placeholder}</div>)}
                <div
                    className={`${fakeInputClassName} fake-input ${focus ? 'focus' : ''}`}
                    role="textbox"
                    aria-label={value || placeholder}
                    ref={fakeInput}
                >
                    {value}
                </div>
            </div>
            {extra && <div className="extra" dangerouslySetInnerHTML={{ __html: extra }} onClick={onExtraClick}></div>}
        </div>
        <BcCustomKeyboard ref={keyBorderRef} className={focus ? '' : 'none'} style={{bottom: focus ? 0 : -document.documentElement.clientHeight / 2}} onKeyboardClick={handleKeyboard} />
    </>
}

export default forwardRef(BcNumberInput)
