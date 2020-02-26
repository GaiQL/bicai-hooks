import { InitCom } from "./index";
import React, { useEffect, useState } from 'react'
import { session } from "Common/utils/store"
import IconSvg, { IconCheck } from './IconSvg'
import { observer } from "mobx-react-lite"
declare const document:any
import { inject } from 'mobx-react'
export let RenderOccupation = (props: {index?:any; setIndex?:any;newDutyList?: any; data?: any; setData?: any; towOccupationHTML?: any; flag?: any; setFlag?: any; setBtnColor?: any; btnColor?: any; name?: any; }) => {
    let {
        newDutyList,
        data,
        setData,
        towOccupationHTML,
        flag,
        setFlag,
        setBtnColor,
        btnColor,
        name,
    } = props
    let { Store } = InitCom.get()
    let { IndustryEventClick, OccupationEventClick,OccupationTowEventClick} = Store
    let { industryVal, dutyVal } = Store
    let [industryBtnColor, setIndustryBtnColor] = useState("#ccc")
    data = [...newDutyList]
    let occupation = dutyVal == "请选择" ? dutyVal : dutyVal
    let industry = industryVal == "请选择" ? industryVal : industryVal
    let OccupationName = name == "职业" ? occupation : industry
    let initIndex = data.findIndex((item:any) => item[name == "职业" ? 'dutyName' : 'industryName'] == OccupationName)
    let [checkedIndex, setCheckdIndex] = useState(initIndex !== undefined? initIndex :  -1)
    return (
        <div className="Popup">
            <p className="PopupTitle">
                <b></b>
                <b>{name == "职业" ? "选择职业" : "选择行业"}</b>
                <b style={{width: '14px',height: 'auto'}} onClick={() => {
                    name == "职业"
                        ?
                        document.getElementById("PopupBox").style.display = "none"
                        :
                        document.getElementById("PopupBox1").style.display = "none"

                }}>
                    <img style={{width: '100%',height: 'auto'}} src={require('Common/assets/images/close.png')} alt="" />
                </b>
            </p>
            {


                <div className="PopupLine">
                    <p className="PopupCont">
                        <b id="towOccupationHTML">{towOccupationHTML}</b>
                        &nbsp;&nbsp;&nbsp;
                      <span onClick={(e) => {
                            setData(newDutyList)
                            // setOccupationHTML('')
                            // setTowtowOccupationHTML('')
                        }}>{
                                name == "职业" ? occupation : industry
                            }</span></p>
                </div>
            }

            <div className="Occupation">
                {
                    data.map((item: { children: any; industryName: string; industryCode: any; dutyName: string; dutyCode: any; }, index: string | number | ((prevState: number) => number) | undefined) => {
                        return (
                            <p className={index === checkedIndex ? 'OccupationCont checked' : 'OccupationCont'} key={index as number} onClick={(e) => {
                                setBtnColor("#2373EB")
        
                                setCheckdIndex(index as number)
                                if (item.children) {
                                    setFlag(2)
                                    session.set("flagItem", "yes")
                                    session.set("itemChildren", item.children)
                                } else {
                                    setFlag(1)
                                    session.set("flagItem", "no")
                                    session.remove("itemChildren")
                                }
                                if (flag == 1) {
                                    if (name == "行业") {
                                        Store.IndustryEventClick(item.industryName,item.industryCode)
                                    } else {
                                        Store.OccupationEventClick(item.dutyName,item.dutyCode)
                                        session.set("dutyCode", item.dutyCode)
                                    }
                                } else {
                                    OccupationTowEventClick(item.dutyName)
                                    session.set("dutyCode", item.dutyCode)
                                }
                            }}>
                                {name == "行业" ? item.industryName : item.dutyName}
                            </p>
                        )

                    })
                }
            </div>
            {
                name == "职业" ? <button className="btn" onClick={() => {
                    commonFun(setData, name)
                }} style={{ background: occupation !== '请选择' ? '#2373EB' : '#ccc' }}>
                    确定
            </button> : <button className="btn" onClick={() => {
                        commonFun(setData, name)
                    }} style={{ background: industry !== '请选择' ? '#2373EB' : '#ccc' }}>
                        确定
            </button>
            }
        </div>
    )
}
export let commonFun = (setData: (arg0: any) => void, name: string) => {
    if (session.get("itemChildren")) {
        setData(session.get("itemChildren"))
    } else if (session.get("flagItem") == "no") {
        if (name == "职业") {
            document.getElementById("PopupBox").style.display = "none"

        } else {
            document.getElementById("PopupBox1").style.display = "none"

        }
    }
}
export let commonColor = () => {

}

export let RenderChangeOccupation = (props: { name: any; dutyVal:string}) => {
    let {name} = props
    let { Store } = InitCom.get()
    let { industryVal, dutyVal } = Store
    if (name == "职业") {
        let OccupationValue = dutyVal.length > 7 ? dutyVal.slice(0, 7) + "..." : dutyVal
        return (
            <div className='openPerfection-info-occupation' style={{ alignItems: "flex-start", borderTop: "1px solid #dddddd" }} onClick={() => {
                document.getElementById("PopupBox").style.display = "block"
                session.set("name", name)
            }}>
                <span style={{ paddingTop: "9px", lineHeight: "26px", paddingBottom: "9px" }}>{name}</span>
                <span style={{ textAlign: "right", width: "250px", padding: "10px 0", lineHeight: "22px", color: "#333" }}>
                    {OccupationValue}
                    <i style={{position: 'relative', top: '3px'}}>
                        <IconSvg wid='17' hte='17' />
                    </i>
                </span>
            </div>
        )
    } else {
        let industryValue = industryVal.length > 7 ? industryVal.slice(0, 7) + "..." : industryVal
        return (
            <div className='openPerfection-info-occupation' style={{ alignItems: "flex-start", borderTop: "1px solid #dddddd" }} onClick={() => {
                document.getElementById("PopupBox1").style.display = "block"
                session.set("name", name)
            }}>
                <span style={{ paddingTop: "9px", lineHeight: "26px", paddingBottom: "9px" }}>{name}</span>
                <span style={{ textAlign: "right", width: "250px", padding: "10px 0", lineHeight: "22px", color: "#333" }}>
                    {industryValue}
                    <i style={{position: 'relative', top: '3px'}}>
                        <IconSvg wid='17' hte='17' />
                    </i>
                </span>
            </div>
        )
    }
}

export default {
    RenderOccupation: observer(RenderOccupation)
}
