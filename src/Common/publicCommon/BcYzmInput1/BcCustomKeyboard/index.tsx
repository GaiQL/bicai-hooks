/**
 * @author  Mr.ma
 * @use     自定义的键盘
 * @date    2019-07-26
 * @params
 */
import React from 'react';
import TouchFeedback from 'rmc-feedback';
import IconSvg from './iconSvg'
import './style.scss'
const numArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0']
interface KeyboardItemProps {
    children?: any,
    className?: string,
    click?: Function
}
function KeyboardItem(props: KeyboardItemProps) {
    let { click, children,className } = props
    let value = (className == 'delete' ? className : children)
    return (
        <TouchFeedback activeClassName={`${className == 'delete' || children == '' ? '' : 'keyboard-active'}`}>
            <li
                onClick={e => click && click(e, value as string)}
                className={`${children == '' ? 'not-bg' : className}`}
            >
                {children}
            </li>
        </TouchFeedback>
    )
}
function BcCustomKeyboard(props:any) {
    let { onKeyboardClick, className} = props
    function onKeyboardClickFn(value?: string, e?:any ) {
        e.nativeEvent.stopImmediatePropagation();
        onKeyboardClick(value)
    }
    function renderKeyboardItem(item: string, index:number){
        return (
            <KeyboardItem key={`item-${item}-${index}`} className={`${item}`} click={(e:any) => onKeyboardClickFn(item, e)}>{item}</KeyboardItem>
        )
    }
    return (
        <div className={`keyboard-box ${className}`}>
            <div className="custom-header">
                <div className="complete" onClick={(e) => onKeyboardClickFn('complete', e)}>完成</div>
            </div>
            <ul className={`number-keyboard`}>
                {
                    numArray.map((item, index) => renderKeyboardItem(item, index))
                }
                <KeyboardItem className="delete" key={`item-${10}`} click={(e:any) => onKeyboardClickFn('delete', e)}>
                    <i><IconSvg color="#3F434A;"/></i>
                </KeyboardItem>
            </ul>
        </div>
    )
}
export default BcCustomKeyboard
