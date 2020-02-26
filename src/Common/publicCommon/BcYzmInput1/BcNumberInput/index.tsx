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
import React, { useState, useEffect } from 'react'
import BcCustomKeyboard from '../BcCustomKeyboard'
import './style.scss'

interface NumberInputProps {
    placeholder?: string,
    editInput?: boolean,
    disabled?: boolean,
    className?: string,
    maxLength?: number,
    fakeInputClassName?: string,
    children?: any,
    labelNumber?: number,
    extra?: any,
    onFocus?: (value: string) => void,
    onChange?: (value: string) => void,
    onBlur?: (value: string) => void,
    onExtraClick?: () => void,
    ref?: any
}
function BcYzmInput(props: NumberInputProps) {
    let fakeInput:any= null
    let {   placeholder = '请输入短信验证码',
            editInput = true,
            disabled = false,
            className = '',
            maxLength,
            fakeInputClassName = '',
            labelNumber = 1,
            children,
            extra,
            onFocus,
            onBlur,
            onChange,
            onExtraClick
    } = props
    let [value, setVal] = useState('')
    let [focus, setFocus] = useState(false)
    useEffect(() => {
        setVal(value)
    }, [])
    const preventKeyboard = disabled || !editInput
    function onFakeInputClick() {
        if (!preventKeyboard) {
            focusFn()
        }
    }
    // function listener(type: 'add' |'remove') {
    //     if (type == 'add') {
    //         document.addEventListener('click', doBlur, false);
    //     } else if (type == 'remove') {
    //         document.removeEventListener('click', doBlur, false);
    //     }
    // }
    function onChangeFn(value: string) {
        setVal(value)
        onChange && onChange(value)
    }
    function onInputBlur() {
        if (focus) {
            setFocus(false)
        }
    }
    // function doBlur(ev: MouseEvent) {
    //     if (ev.target !== fakeInput) {
    //         onInputBlur();
    //     }
    // }
    function focusFn() {
        // listener('remove')
        if (!focus) {
            setFocus(true)
        }
        onFocus && onFocus(value)
        // setTimeout(() => {
        //     listener('add')
        // }, 50)
    }
    function handleKeyboard(keyboardVal: string) {
        let valueAfterChange
        if (keyboardVal === 'delete') {
            valueAfterChange = value.substring(0, value.length - 1)
            onChangeFn(valueAfterChange)
        } else if (keyboardVal === 'complete') {
            valueAfterChange = value
            onChangeFn(valueAfterChange)
            setFocus(false)
            onBlur && onBlur(value)
        } else {
            if (maxLength !== undefined && maxLength >= 0 && (value + keyboardVal).length > maxLength) {
                valueAfterChange = (value + keyboardVal).substr(0, maxLength)
                onChangeFn(valueAfterChange)
            } else {
                valueAfterChange = value + keyboardVal
                onChangeFn(valueAfterChange)
            }
        }
    }
    return (
        <>
            <div className={`${className} fake-input-box`}>
                {children ? (<div style={{ width: 16 * labelNumber + 'px' }} className="label">{children}</div>) : ''}
                <div className='fake-input-container' onClick={ preventKeyboard ? () => { } : () => onFakeInputClick() }>
                    {value == '' && (<div className="fake-input-placeholder">{placeholder}</div>)}
                    <div
                        className={`${fakeInputClassName} fake-input ${focus ? 'focus' : ''}`}
                        role="textbox"
                        aria-label={value || placeholder}
                        ref={el => fakeInput = el}
                    > {value}
                    </div>
                </div>
                {extra && <div className="extra" dangerouslySetInnerHTML={{ __html: extra }} onClick={() => onExtraClick && onExtraClick()}></div>}
            </div>
            <BcCustomKeyboard className={focus ? 'key-board-show bottom0' : 'key-board-hidden bottom260'} onKeyboardClick={(val:any) => handleKeyboard(val)} />
        </>
    )
}
export default BcYzmInput
