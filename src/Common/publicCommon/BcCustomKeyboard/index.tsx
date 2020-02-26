/**
 * @author  Mr.ma
 * @use     自定义的键盘
 * @date    2019-07-26
 * @params
 */
import React, {useImperativeHandle, useRef, forwardRef} from 'react';
import TouchFeedback from 'rmc-feedback';
import IconSvg from './iconSvg'
import './style.scss'
const numArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0']
interface KeyboardItemProps {
    children?: any,
    className?: string,
    onClick?: Function,
    style?: any
}
// class KeyboardItem extends React.Component<KeyboardItemProps, any> {
//     render() {
//         let value = (className == 'delete' ? className : children)
//         return (
//             <TouchFeedback activeClassName={`${className == 'delete' || children == '' ? '' : 'active'}`}>
//                 <li
//                     onClick={e => onClick(e, value as string)}
//                     className={`${children == '' ? 'not-bg' : className}`}
//                 >
//                     {children}
//                 </li>
//             </TouchFeedback>
//         )
//     }
// }
function KeyboardItem(props: KeyboardItemProps): JSX.Element {
    const { children, onClick, className = '' } = props
    let value = (className == 'delete' ? className : children)
    return <>
        <TouchFeedback activeClassName={`${className == 'delete' || children == '' ? '' : 'active'}`}>
            <li
                onClick={e => onClick && onClick(e, value as string)}
                className={`${children == '' ? 'not-bg' : className}`}
            >
                {children}
            </li>
        </TouchFeedback>

    </>
}
// class BcCustomKeyboard extends React.Component<any, any> {
//     // 每一个数字的点击事件
//     onKeyboardClick = (e?, value?: string) => {
//         e.nativeEvent.stopImmediatePropagation();
//         this.props.onKeyboardClick(value)
//     }
//     // 每一个键盘的render
//     renderKeyboardItem = (item: string, index: number) => {
//         return (
//             <KeyboardItem key={`item-${item}-${index}`} className={`${item}`} onClick={this.onKeyboardClick}>{item}</KeyboardItem>
//         )
//     }
//     render() {
//         const { className } = this.props
//         return (
//             <div className={`keyboard-box`} style={this.props.style}>
//                 <div className="custom-header">
//                     <div className="complete" onClick={(e) => this.onKeyboardClick(e, 'complete')}>完成</div>
//                 </div>
//                 <ul className={`number-keyboard`}>
//                     {
//                         numArray.map((item, index) => this.renderKeyboardItem(item, index))
//                     }
//                     <KeyboardItem className="delete" key={`item-${10}`} onClick={this.onKeyboardClick}>
//                         <i><IconSvg color="#3F434A;" /></i>
//                     </KeyboardItem>
//                 </ul>
//             </div>
//         )
//     }
// }


function BcCustomKeyboard(props:Record<string,any>, ref:any): JSX.Element {
    // 每一个数字的点击事件
    const onKeyboardClick = (e?:any, value?: string) => {
        e.nativeEvent.stopImmediatePropagation();
        props.onKeyboardClick(value)
    }
    // 每一个键盘的render
    const renderKeyboardItem = (item: string, index: number) => {
        return (
            <KeyboardItem key={`item-${item}-${index}`} className={`${item}`} onClick={onKeyboardClick}>{item}</KeyboardItem>
        )
    }
    let keyBorderRef = useRef(null)


    useImperativeHandle(ref,()=>{
        return {
            keyBorderRef: keyBorderRef.current
        }
    });
    return <>
        <div className={`keyboard-box`} style={props.style} ref={keyBorderRef}>
            <div className="custom-header">
                <div className="complete" onClick={(e) => onKeyboardClick(e, 'complete')}>完成</div>
            </div>
            <ul className={`number-keyboard`}>
                {
                    numArray.map((item, index) => renderKeyboardItem(item, index))
                }
                <KeyboardItem className="delete" key={`item-${10}`} onClick={onKeyboardClick}>
                    <i><IconSvg color="#3F434A;" /></i>
                </KeyboardItem>
            </ul>
        </div>
    </>
}
export default forwardRef(BcCustomKeyboard)
