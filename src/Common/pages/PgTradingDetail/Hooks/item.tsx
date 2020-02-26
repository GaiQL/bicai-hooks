
import './style.scss'
import { InitCom } from './index'
import IconSvg from './IconSvg'
import { observer } from 'mobx-react-lite'
import { Native } from "Common/utils/appBridge"
import { commonStore } from "Common/pages/store"
import Headers from 'Common/publicCommon/Headers'
import { DatePicker, ListView } from 'antd-mobile';
import React, { useState, useEffect, useRef } from 'react';
import BottomColumn from 'Common/publicCommon/BottomColumn'
import checkuserAgent from 'Common/utils/util.checkuserAgent'




declare var document: { title: any }
const months = ['近一个月', '近两个月', '近三个月']

let MMouthTemplate = observer(MouthTemplate)
let MHeadTempFn = observer(HeadTempFn)

function Render(): JSX.Element {
    let { Store } = InitCom.get()

    let { initFn } = Store

    let { confirmDatePicker, cancelDatePicker, onEndReached, dataSource, isLoading, height, date, minDate, maxDate, isShowDate, pageList, switchingTemplate, currentPageStatus }:any = Store

    useEffect(() => {
        // @ts-ignore
        initFn && initFn()
    }, [])

    let { defaultTemplate = initdefaultTemplate, otherTemplate = initotherTemplate } = InitCom.get()

    return <>
        <div className="deposit-detail">
            <MHeadTempFn />
            <MMouthTemplate />

            <DatePicker
                visible={isShowDate}
                mode="date"
                value={date}
                minDate={new Date(minDate)}
                maxDate={new Date(maxDate)}
                onOk={confirmDatePicker}
                onDismiss={cancelDatePicker}
            />

            <ListView
                className={!pageList.length ? 'bg-color' : ''}
                dataSource={dataSource}
                renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
                    {isLoading ? '正在加载中...' : currentPageStatus && !pageList.length ? '暂无数据' : '已全部加载完成'}
                </div>)}
                renderRow={switchingTemplate ? otherTemplate : defaultTemplate}
                style={{ height: height, overflow: 'auto', }}
                onEndReached={onEndReached}
                onEndReachedThreshold={25}
            >
                <BottomColumn type='long'></BottomColumn>
            </ListView>

        </div>
    </>
}

function MouthTemplate(): JSX.Element {
    let screenMonth = useRef<any>(null)
    let screenDate = useRef<any>(null)
    let { Store } = InitCom.get()
    let { monthInd, isShowNav, selectMonths, handleSort, dateArr, selectedDate, setMDRef } = Store

    useEffect(() => {
         // @ts-ignore
        setMDRef(screenMonth.current, screenDate.current)
    }, [])


    return <>
        <ul className={`screen-month border-line`} ref={(el) => screenMonth.current = el}>
            {
                months.map((item, index) => {
                    return <li className={index == monthInd ? 'current' : ''} key={index} onClick={() => { selectMonths(index) }}>{item}</li>
                })
            }
            <li className={`${isShowNav ? 'screen-icon-selected' : 'screen-icon'}`} onClick={() => {  handleSort() }}></li>
        </ul>
        <ol className={`screen-date ${isShowNav ? '' : 'none-opacity'}`} ref={(el) => screenDate.current = el}>
            {
                dateArr.map((ele, index:number) => {
                    return <li key={index} onClick={() => { selectedDate(index) }}>{ele}<i></i></li>
                })
            }
        </ol>
    </>
}

function initotherTemplate(): JSX.Element {
    return <> </>
}

function initdefaultTemplate(): JSX.Element {

    return <> </>
}

// 头部模板切换
function HeadTempFn(props: { children?: any }):JSX.Element {
    let headerRef = useRef(null)
    let { Store, Config } = InitCom.get()
    let [detailedTabSelect, setdetailedTabSelect] = useState(0)
    let [isShow, setisShow] = useState(false)
    let { setHeaderRef } = Store

    useEffect(() => {
        let isE = checkuserAgent()
        if (isE.isApp || isE.isWeixin || isE.isWeibo || isE.isDingTalk || Native.isApp()) {
            setisShow(false)
        } else {
            setisShow(true)
        }
        setHeaderRef(headerRef.current)
    }, [])

    let detailedTab = (item: string, index: number) => {
        document.title = item
        let { detailedTab } = Store
        Native.apiNavBarStyleClose('back')
        Native.updateTitle(props.children || ' ')
        setdetailedTabSelect(index)
        detailedTab(index)
    }

    let { headerArr = ['交易明细'], isTabdsiable = false } = Config


    if (isTabdsiable) {
        return <div className='header' ref={headerRef}>
            {!isShow ? <Headers type='empty' refs={(el: null) => headerRef.current = el}>明细</Headers> : null}
            <div className='headers-barers'>
                <p
                    className='headers-bar-backer'
                    onClick={() => {
                        commonStore.Hash.history.go(-1)
                    }}>
                    <IconSvg />
                </p>
                {headerArr.map((item, index) => {
                    return <p className={index == detailedTabSelect ? 'tard-actived' : 'tard-active'} onClick={() => {
                        detailedTab(item, index)
                    }} key={index}>{item}</p>
                })}
            </div>
        </div>
    } else {
        return <Headers refs={(el: null) => headerRef.current = el}>{headerArr[0]}</Headers>
    }
}

export default {
    Render: observer(Render),
    defaultTemplate: initdefaultTemplate,
    otherTemplate: initotherTemplate
}
