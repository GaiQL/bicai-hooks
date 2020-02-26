
import React, { useState, useCallback, useImperativeHandle, useRef, Ref, memo, forwardRef, useEffect } from 'react'
import './style.scss'
import BcMobileKeyboard from '../BcMobileKeyboard'

interface Rules {
    className?: string,
    placeholder?: string,
    isShowBoard?: boolean,
    max: number,
    refs?: Function,
    notifyComplate?: Function,
    onRef?: any,
    ref?: Ref<any>
}
declare const window:any


function BcImitateInputer(props: Rules, ref: Ref<any>) {
    let [curNum, setCurNum] = useState<Array<any>>([])
    let [selectedInd, setSelectedInd] = useState<any>()
    let [isShowBoard, setisShowBoard] = useState<boolean>(true)

    // 拿到键盘点击的数字
    const setNumberHandle = useCallback((num) => {
        let flag = curNum.some((item) => { return item == 'only' }) // 数据存在only,就表示光标在中间存在过
        let max = flag ? props.max + 1 : props.max // 光标只有一次，所有她的最大值也加1
        if (curNum.length >= max) return false
        if (selectedInd != null) { // 表示光标在中间存在过 增删内容
            curNum.splice(selectedInd, 0, num) // 添加内容
            setCurNum([
                ...curNum,
                num
            ])
            setSelectedInd(selectedInd + 1) // 光标位置也随之增加
        } else { // 表示正常流程走下来。
            setCurNum([
                ...curNum,
                num
            ])
        }
    }, [selectedInd, curNum])

    // 删除键盘点击的数字
    const delNumberHandle = useCallback(() => {
        if (curNum.length) {
            if (selectedInd - 1 >= 0) { // 表示从中间删除内容
                curNum.splice(selectedInd - 1, 1)
                setCurNum([
                    ...curNum
                ])
                setSelectedInd(selectedInd + 1) // 光标位置也随之增加
            } else if (selectedInd == null) { // 表示正常的删除内容
                curNum.pop()
                setCurNum([
                    ...curNum
                ])
            }
        }
    }, [curNum, selectedInd])

    // 点击键盘中的完成
    const complateHandle = useCallback(() => {
        for (let i = 0; i < curNum.length; i++) {
            if (curNum[i] == 'only') {
                curNum.splice(i, 1)
                break;
            }
        }
        props.notifyComplate && props.notifyComplate(curNum.join('')) // 准确的把当前的数据通知出去
    }, [curNum])

    // 高仿的input的点击事件
    const inputClickHandle = useCallback((e) => {
        // 这里是为了点击div的任何地方  如果不在数字的中间，那么我们要让光标回到最后的位置
        if (curNum.length && selectedInd != null) {
            for (let i = 0; i < curNum.length; i++) {
                if (curNum[i] == 'only') {
                    curNum.splice(i, 1)
                    break;
                }
            }
            setSelectedInd(null)
        }
    }, [curNum, selectedInd])


    // 点击当前的span获取当前光标的位置
    const curNumHandle = useCallback((ind, e) => {
        if (e) { // 为了阻止冒泡
            e.stopPropagation();
            e.preventDefault();
        } else {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        for (let i = 0; i < curNum.length; i++) {
            if (curNum[i] == 'only') {
                curNum.splice(i, 1)
                break;
            }
        }
        curNum.splice(ind, 0, 'only')
        setCurNum([
            ...curNum
        ])
        setSelectedInd(ind)
    }, [curNum, selectedInd] )

    // 初始化数据  就是为了关闭这个弹窗的时候，数据不可以保留
    const initCodeNum = useCallback(() => {
        setCurNum([])
        setSelectedInd(null)
    }, [])

    const setClass = useCallback(() => {
        // 这里的class是为了用伪类来实现一些光标
        if (selectedInd == null && !curNum.length) return 'not'
        if (selectedInd != null) return ''
        if (selectedInd == null && curNum.length) return 'yes'
    }, [curNum, selectedInd])

    useImperativeHandle(ref, () => {
        return {
            initCodeNum: initCodeNum
        }
    })

    const { placeholder = '输入验证码', className } = props
    return (
        <div>
            <div className={`${setClass()} ${className} imitate-input`} placeholder={placeholder} onClick={inputClickHandle}>
                {
                    curNum.length ? curNum.map((ele, index) => {
                        return <span key={index} className={`${ele == 'only' ? 'yes' : ''}`}
                            onClick={(e) => { curNumHandle(index, e) }}>
                            {ele == 'only' ? '' : ele}
                        </span>
                    }) : ''
                }
            </div>
            {/* 就是上文的组件 */}
            <BcMobileKeyboard
                maskClosable={true}
                visible={isShowBoard}
                getNumber={setNumberHandle}
                complate={complateHandle}
                delNumber={delNumberHandle}>
            </BcMobileKeyboard>
        </div>
    )
}
let BcImitateInput = memo(forwardRef(BcImitateInputer))
export default BcImitateInput


// class BcImitateInputs extends React.Component<Rules, any>{
//     constructor(props) {
//         super(props)
//         this.state = {
//             curNum: [], // 用来记录当前div里面的所有值
//             selectedInd: null // 当前点击的光标的位置
//         }
//     }
//     // 拿到键盘点击的数字
//     setNumberHandle = (num) => {
//         let { curNum, selectedInd } = this.state
//         let flag = curNum.some((item) => { return item == 'only' }) // 数据存在only,就表示光标在中间存在过
//         let max = flag ? this.props.max + 1 : this.props.max // 光标只有一次，所有她的最大值也加1
//         if (curNum.length >= max) return false
//         if (selectedInd != null) { // 表示光标在中间存在过 增删内容
//             curNum.splice(selectedInd, 0, num) // 添加内容
//             this.setState({
//                 curNum,
//                 selectedInd: selectedInd + 1 // 光标位置也随之增加
//             })
//         } else { // 表示正常流程走下来。
//             curNum.push(num)
//             this.setState({
//                 curNum
//             })
//         }
//     }
//     // 删除键盘点击的数字
//     delNumberHandle = () => {
//         let { curNum, selectedInd } = this.state
//         if (curNum.length) {
//             if (selectedInd - 1 >= 0) { // 表示从中间删除内容
//                 curNum.splice(selectedInd - 1, 1)
//                 this.setState({
//                     curNum,
//                     selectedInd: selectedInd - 1 // 当然光标随之减少
//                 })
//             } else if (selectedInd == null) { // 表示正常的删除内容
//                 curNum.pop()
//                 this.setState({
//                     curNum
//                 })
//             }
//         }
//     }
//     // 点击键盘中的完成
//     complateHandle = () => {
//         let curNum = this.state.curNum
//         for (let i = 0; i < curNum.length; i++) {
//             if (curNum[i] == 'only') {
//                 curNum.splice(i, 1)
//                 break;
//             }
//         }
//         this.props.notifyComplate(curNum.join('')) // 准确的把当前的数据通知出去
//     }
//     // 高仿的input的点击事件
//     inputClickHandle = (e) => {
//         // 这里是为了点击div的任何地方  如果不在数字的中间，那么我们要让光标回到最后的位置
//         let { curNum, selectedInd } = this.state
//         if (curNum.length && selectedInd != null) {
//             for (let i = 0; i < curNum.length; i++) {
//                 if (curNum[i] == 'only') {
//                     curNum.splice(i, 1)
//                     break;
//                 }
//             }
//             this.setState({
//                 selectedInd: null
//             })
//         }
//     }
//     // 点击当前的span获取当前光标的位置
//     curNumHandle = (ind, e) => {
//         if (e) { // 为了阻止冒泡
//             e.stopPropagation();
//             e.preventDefault();
//         } else {
//             window.event.returnValue = false;
//             window.event.cancelBubble = true;
//         }
//         let { curNum } = this.state
//         for (let i = 0; i < curNum.length; i++) {
//             if (curNum[i] == 'only') {
//                 curNum.splice(i, 1)
//                 break;
//             }
//         }
//         curNum.splice(ind, 0, 'only')
//         this.setState({
//             curNum,
//             selectedInd: ind
//         })
//     }
//     // 初始化数据  就是为了关闭这个弹窗的时候，数据不可以保留
//     initCodeNum = () => {
//         this.setState({
//             curNum: [],
//             selectedInd: null
//         })
//     }
//     setClass = () => {
//         // 这里的class是为了用伪类来实现一些光标
//         let { curNum, selectedInd } = this.state
//         if (selectedInd == null && !curNum.length) return 'not'
//         if (selectedInd != null) return ''
//         if (selectedInd == null && curNum.length) return 'yes'
//     }

//     componentWillUnmount() {
//         this.setState = () => {
//             return
//         }
//     }
//     render() {
//         const { curNum } = this.state
//         const { placeholder = '输入验证码', className, isShowBoard } = this.props
//         return (
//             <div>
//                 <div className={`${this.setClass()} ${className} imitate-input`} placeholder={placeholder} onClick={this.inputClickHandle}>
//                     {
//                         curNum.length ? curNum.map((ele, index) => {
//                             return <span key={index} className={`${ele == 'only' ? 'yes' : ''}`}
//                                 onClick={(e) => { this.curNumHandle(index, e) }}>
//                                 {ele == 'only' ? '' : ele}
//                             </span>
//                         }) : ''
//                     }
//                 </div>
//                 {/* 就是上文的组件 */}
//                 <BcMobileKeyboard
//                     visible={isShowBoard}
//                     getNumber={this.setNumberHandle}
//                     complate={this.complateHandle}
//                     delNumber={this.delNumberHandle}>
//                 </BcMobileKeyboard>
//             </div>
//         )
//     }
//     UNSAFE_componentWillMount(): void { // 把this 传递父级，可以做更多的事情
//         this.props.onRef(this)
//     }
// }
