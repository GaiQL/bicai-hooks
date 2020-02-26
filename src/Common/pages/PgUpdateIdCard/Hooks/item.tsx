import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite'
import './style.scss'
import { Headers } from 'Common/publicCommon/index'
import { BcButton } from 'Common/publicCommon/index'
import { InputItem, TextareaItem, List, Picker } from 'antd-mobile';
import Tool from 'Common/utils/Tool'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import { ActionSheet } from 'antd-mobile'
import ImagesInput from './ImagesInput'
import IconSvg from './IconSvg'
import { session } from 'Common/utils/store'
import { InitCom } from "./index";

export const Render = () => {
    const { Store, Config } = InitCom.get()

    let { imgToBase, emblemImg, figureImg, submitFn, observeConfirm, isShowFace } = Store
    let { bottomShow, isFlag } = Config

    useEffect(() => {
        Store.initData();
    }, [])

    return <div className='UpdateIdCard'>
        {/* 头部 */}
        <Headers>更新身份证</Headers>
        <div className='UpdateIdCard-img'>
            <p className='UpdateIdCard-tit'>请上传您的中国第二代居民身份证原件</p>
            <p className='UpdateIdCard-upload'>
                <span className='UpdateIdCard-bg'><img src={figureImg} alt="" /></span>
                <span className='UpdateIdCard-camera'>
                    <ImagesInput onChange={(e: { target: { files: any[]; }; }) => {
                        imgToBase(e, 'figure')
                    }} />
                </span>
            </p>
            <p className='UpdateIdCard-tip'>上传人像页照片</p>
            <p className='UpdateIdCard-upload'>
                <span className='UpdateIdCard-bg'><img src={emblemImg} alt="" /></span>
                <span className='UpdateIdCard-camera'>
                    <ImagesInput onChange={(e: { target: { files: any[]; }; }) => {
                        imgToBase(e, 'emblem')
                    }} />
                </span>
            </p>
            <p className='UpdateIdCard-tip'>上传国徽页照片</p>
        </div>
        <div className='UpdateIdCard-info'>
            {/* 姓名 flagName*/}
            {
                <RenderName />
            }
            {/* 身份证号 flagCard*/}
            {
                <RenderCard />
            }
            {/* 民族选择 */}
            {
                <RenderNation />
            }
            {/* 性别选择 */}
            {
                <RenderGender />
            }
            {/* 出生日期 */}
            {
                <RenderBirthday />
            }
            {/* 签发日期 */}
            {
                <RenderPickerValueStart />
            }
            {/* 身份证有效期 */}
            {
                <RenderPickerValueEnd />
            }
            {/* 签发机关 flagCard*/}
            {
                <RenderIssuingAuthority />
            }
            {/* 联系地址 flagCard*/}
            {
                <RenderAddress />
            }
        </div>
        {/* 需不需要人脸认证 isShowFace = 1需要 等于 0 不需要 */}
        {
            isFlag && isShowFace == 1 ? <div className='isNeedFace'>{FaceIdentification()}</div> : null
        }
        <div className='UpdateIdCard-confirm'>
            <BcButton isDisabled={observeConfirm} onClick={submitFn}>更新</BcButton>
        </div>
        {bottomShow ? <BottomColumn type='long' /> : null}
    </div>
}


// 人脸认证
function FaceIdentification() {
    let { isLiveStatus, attestationInfo } =  InitCom.get().Store

    return <div>
        <span>人脸认证</span>
        {
            isLiveStatus != 1 ?
                <p onClick={() => attestationInfo()}>
                    <span className='place-attestation'>请认证</span>
                    <span style={{ position: 'relative', top: '2px' }}><IconSvg /></span>
                </p> :
                <p>
                    <span className='over-attestation'>已认证</span>
                    <span style={{ position: 'relative', top: '2px' }}><IconSvg /></span>
                </p>
        }
    </div>
}


//姓名组件
const RenderName = observer(() => {
    const { realName, changeName, emblemImgBase, figureImgBase } = InitCom.get().Store
    const { flagName } = InitCom.get().Config
    const [userNameShow, setUserNameShow] = useState(false);
    return flagName ? <div>
        <span>姓名</span>
        <span> <InputItem
            value={realName}
            disabled={emblemImgBase == '' || figureImgBase == ''}
            style={{ color: "#666666", opacity: 1 }}
            onFocus={() => setUserNameShow(true)}
            onBlur={() => setUserNameShow(false)}
            onChange={(e) => changeName(e)}
        /></span>
    </div> : null
})

const RenderCard = observer(() => {
    const { realName, userCardId, changeIdCard, emblemImgBase, figureImgBase } = InitCom.get().Store
    const { flagCard } = InitCom.get().Config
    let name = realName ? realName : ''
    let card = userCardId ? userCardId : ''
    const [idCardShow, setIdCardShow] = useState(false);

    return flagCard ? <div>
        <span>身份证号码</span><span>
            <InputItem
                value={card}
                // disabled={emblemImgBase == '' || figureImgBase == ''}
                style={{ color: "#666666", opacity: 1 }}
                onFocus={() => setIdCardShow(true)}
                onBlur={() => setIdCardShow(false)}
                onChange={(e) => changeIdCard(e)}
            />
        </span>
    </div> : null
})


//民族组件
const RenderNation = observer(() => {
    const { nationList, nationVal, changeNation, emblemImgBase, figureImgBase } = InitCom.get().Store
    const { flagNation } = InitCom.get().Config
    return flagNation ? <Picker
        data={nationList}
        value={nationVal}
        disabled={emblemImgBase == '' && figureImgBase == ''}
        cols={1}
        extra=' '
        onChange={(val:any) => changeNation(val)}
    >
        <List.Item arrow="horizontal">民族</List.Item>
    </Picker> : null
})

//性别组件
const RenderGender = observer(() => {
    const { sexList, gender, onChangeSex, emblemImgBase, figureImgBase } = InitCom.get().Store
    const { flagGender } = InitCom.get().Config
    return flagGender ? <Picker
        data={sexList}
        value={gender}
        disabled={emblemImgBase == '' && figureImgBase == ''}
        cols={1}
        extra=' '
        onChange={(val) => onChangeSex(val)}
        onOk={v => {
            console.log(v)
        }}
    >
        <List.Item arrow="horizontal">性别</List.Item>
    </Picker> : null
})


//获取天数
function getDaysInMonth(year: number | undefined, month: string | number) {
    var arr = []
    if (typeof month === "string") {
        month = parseInt(month, 10);
    }  //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
    var temp
    if (typeof year === "number") {
        temp = new Date(year, month, 0);
    }
    // @ts-ignore
    for (var i = 1; i <= temp.getDate(); i++) {
        arr.push({
            value: i,
            label: i < 10 ? "0" + i + '日' : i + '日',
        })
    }
    return arr
}
//获取月份
function getMonths(year: number | undefined) {
    var arr = []
    for (var i = 1; i <= 12; i++) {
        arr.push({
            value: i,
            label: i < 10 ? "0" + i + '月' : i + '月',
            children: getDaysInMonth(year, i)
        })
    }
    return arr
}

//获取年份
function getYear(start?: number, end?: number, isLong?: boolean) {
    if (isLong) {
        var endArr: any = [{
            value: '长期',
            label: '长期',
            children: []
        }]
        // @ts-ignore
        for (var i = end; i >= start; i--) {
            endArr.unshift({
                value: i,
                label: i + "年",
                children: getMonths(i)
            })
        }
        return endArr
    } else {
        var startArr = []
        // @ts-ignore
        for (var i = end; i <= start; i++) {
            startArr.unshift({
                value: i,
                label: i + "年",
                children: getMonths(i)
            })
        }
        return startArr
    }
}


//出生日期
const RenderBirthday = observer(() => {
    const { birthday, changeBirthday, emblemImgBase, figureImgBase } = InitCom.get().Store;
    const { flagBirthday } = InitCom.get().Config;
    const [visibleBrithday, setVisibleBrithday] = useState(false);
    const [birthdayStart, setBirthdayStart] = useState([]);

    useEffect(() => {
        let nowYear = new Date().getFullYear()
        setBirthdayStart(getYear(1950, nowYear + 30, true));
    }, [])

    return flagBirthday ?
        <div>
            <span>
                出生日期
            </span>
            <span>
                <Picker
                    visible={visibleBrithday}
                    data={birthdayStart}
                    value={birthday}
                    format={(val):any => {
                        if (val[0] == '长期') {
                            return val
                        } else {
                            if (val[0]) {
                                return [`${Tool.trimText(val[0].toString())}-${Tool.trimText(val[1] ? val[1].toString():'')}-${Tool.trimText(val[2] ? val[2].toString():'')}`]
                            }
                        }
                    }}
                    disabled={emblemImgBase == '' && figureImgBase == ''}
                    extra=" "
                    onChange={v => changeBirthday(v)}
                    onOk={() => setVisibleBrithday(false)}
                    onDismiss={() => setVisibleBrithday(false)}
                >
                    <List.Item onClick={() => setVisibleBrithday(true)}></List.Item>
                </Picker>
            </span>
        </div>
        : null
})


//签发日期
const RenderPickerValueStart = observer(() => {
    const { pickerValueStart, changeValueStart, emblemImgBase, figureImgBase } = InitCom.get().Store;
    const { flagPickerValueStart } = InitCom.get().Config;
    const [visibleStart, setVisibleStart] = useState(false);
    const [districtStart, setDistrictStart] = useState([]);

    useEffect(() => {
        let nowYear = new Date().getFullYear()
        setDistrictStart(getYear(1950, nowYear + 30, true));
    }, [])

    return flagPickerValueStart ? <div>
        <span>
            签发日期
        </span>
        <span>
            <Picker
                disabled={emblemImgBase == '' && figureImgBase == ''}
                extra=' '
                visible={visibleStart}
                data={districtStart}
                value={pickerValueStart}
                format={(val):any => {
                    if (val[0] == '长期') {
                        return val
                    } else {
                        if (val[0]) {
                            return [`${Tool.trimText(val[0].toString())}-${Tool.trimText(val[1] ? val[1].toString():"")}-${Tool.trimText(val[2]?val[2].toString():'')}`]
                        }
                    }
                }}
                onChange={v => changeValueStart(v)}
                onOk={() => setVisibleStart(false)}
                onDismiss={() => setVisibleStart(false)}
            >
                <List.Item onClick={() => setVisibleStart(false)} />
            </Picker>
        </span>
    </div> : null
})


//身份证有效期
const RenderPickerValueEnd = observer(() => {
    const { pickerValueEnd, changeValueEnd, emblemImgBase, figureImgBase } = InitCom.get().Store;
    const { flagPickerValueEnd } = InitCom.get().Config;
    const [visibleEnd, setVisibleEnd] = useState(false);
    const [districtEnd, setDistrictEnd] = useState([]);

    useEffect(() => {
        let nowYear = new Date().getFullYear()
        setDistrictEnd(getYear(1950, nowYear + 30, true));
    }, [])

    return flagPickerValueEnd ? <div>
        <span>
            身份证有效期
            </span>
        <span>
            <Picker
                disabled={emblemImgBase == '' && figureImgBase == ''}
                extra=' '
                visible={visibleEnd}
                data={districtEnd}
                value={pickerValueEnd}
                format={(val):any => {
                    // console.log(val, '身份证有效期');

                    if (val[0] == '长期') {
                        return val
                    } else {
                        if (val[0]) {
                            return [`${Tool.trimText(val[0].toString())}-${Tool.trimText(val[1] ? val[1].toString():'')}-${Tool.trimText(val[2] ? val[2].toString():'')}`]
                        }
                    }
                }}
                onChange={v => changeValueEnd(v)}
                onOk={() => setVisibleEnd(false)}
                onDismiss={() => setVisibleEnd(false)}
            >
                <List.Item onClick={() => setVisibleEnd(true)}></List.Item>
            </Picker>
        </span>
    </div> : null
})



//签发机关组件
const RenderIssuingAuthority = observer(() => {
    const { signOrg, emblemImgBase, figureImgBase, changeIssuingAuthority } = InitCom.get().Store;
    const { flagAuthority } = InitCom.get().Config;
    const [signOrgShow, setSignOrgShow] = useState(false);

    return flagAuthority ? <div>
        <span>签发机关</span><span>
            <InputItem
                value={signOrg}
                style={{ color: "#666666", opacity: 1 }}
                disabled={emblemImgBase == '' && figureImgBase == ''}
                onFocus={() => setSignOrgShow(true)}
                onBlur={() => setSignOrgShow(false)}
                onChange={(e) => changeIssuingAuthority(e)}
            />
        </span>
    </div> : null
})

//联系地址
const RenderAddress = observer(
    () => {
        const { address, changeAddress, emblemImgBase, figureImgBase } = InitCom.get().Store;
        const { flagAdress } = InitCom.get().Config
        const [flagText, setflagText] = useState(false);
        function comAddRess(len: string) {
            if (len.length <= 13) {
                return len
            } else {
                return flagText ? len : len.slice(0, 10) + "..."
            }
        }
        return flagAdress ?
            <div className='upload-address'>
                <span style={{ paddingTop: "12px" }}>联系地址</span>
                <span style={{ paddingTop: "7px", paddingBottom: "7px" }}>
                    <TextareaItem
                        className="text-area"
                        value={address}
                        style={{ color: "#666666", opacity: 1 }}
                        disabled={emblemImgBase == '' && figureImgBase == ''}
                        placeholder='auto focus in Alipay client'
                        data-seed="logId"
                        autoHeight
                        onClick={() => setflagText(true)}
                        onChange={(e:any) =>
                            changeAddress(e)
                        }
                    />
                </span>
            </div>
            : null
    }
)


export default {
    Render: observer(Render)
}
