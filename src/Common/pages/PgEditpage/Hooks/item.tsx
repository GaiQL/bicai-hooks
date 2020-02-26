import React, { useEffect, useState, useContext, useCallback } from 'react'
import { Modal } from 'antd-mobile'
import { observer, useLocalStore, useObserver } from "mobx-react-lite"
import { Headers } from 'Common/publicCommon/index'
import IconSvg, { IconCheck } from './IconSvg'
// 页面共享模块 用于引入 Config,Store,Handle,Item
import { InitCom } from "./index";
import { Picker, List, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import arrayTreeFilter from 'array-tree-filter';
import "./style.scss"
import { commonStore } from "Common/pages/store"
// 主渲染函数 Render名字必须存在

export let Render = () => {
    let { Config, Store } = InitCom.get()
    let { newDutyList, initData, result }: any = Store
    let [data, setData] = useState([])
    let [cols, setCols] = useState(1)
    let [asyncValue, setAsyncValue] = useState<Record<string,any>[]>([])
    let {EditAddress}=commonStore.query()

    let [adressValue, setadressValue] = useState(EditAddress)
    console.log(EditAddress,"EditAddress")

    const onPickerChange = useCallback((val:Record<string,any>[]) => {
        setCols(val.length)
        const d = [...data];
        const asyncValue = [...val];
        d.forEach((i:Record<string,any>) => {
            if (i.value == val[val.length - 1]) {
                if (!i.children) {
                    i.children = [...i.children];
                    asyncValue.push(val)
                } else {
                    i.children.forEach((j:Record<string,any>) => {
                        j.children = [...j.children];
                        asyncValue.push(val)

                    })
                }
                asyncValue.push(val)
            }
        })
        setData(d)
        setAsyncValue(asyncValue)
    }, [data])
    useEffect(() => {
        initData()
    }, [])
    return (
        <div>
            <Headers>编辑身份证地址</Headers>
            <div className="editpage">
                <div className="RenderOccupation">
                    <RenderOccupation
                        data={data}
                        cols={cols}
                        asyncValue={asyncValue}
                        onPickerChange={onPickerChange}
                        newDutyList={newDutyList}
                        setData={setData}
                        adressValue={adressValue}
                        setadressValue={setadressValue}
                        result={result}
                    /></div>
            </div>
        </div>
    )
}

export let RenderOccupation:anyFnType = (props) => {
    let { data, cols, asyncValue, onPickerChange, setData, newDutyList, setadressValue, adressValue, result } = props
    return (
        <div className="addressBox">
            <div className="region">
                <List style={{ backgroundColor: 'white', width: "100%", }} className="picker-list">
                    <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                        <div style={{ width: "100%" }} >
                            <Picker
                                data={data}
                                cols={undefined}
                                value={asyncValue}
                                onOk={v => console.log(v)}
                                onPickerChange={onPickerChange}
                            >
                                <List.Item arrow="horizontal" onClick={() => {
                                    setData(result)
                                }}>所在地区</List.Item>
                            </Picker>
                        </div>
                        <IconSvg wid='17' hte='17' />
                    </div>
                </List>
            </div>

            <div className="address">
                <List>
                    <span>详细地址</span><input type="text" placeholder="请输入正确的身份证地址" value={adressValue} onChange={(e) => {
                        let reg = /^[a-zA-Z]+([\s][a-zA-Z]+)([\s][0-9]){1,4}$/
                        console.log(reg.test(e.target.value), "000")
                        setadressValue(e.target.value)
                    }} />

                </List>
            </div>
        </div>
    )
}
export default {
    Render: observer(Render),
}

