/**
 * 人脸识别。
 */
import React, {FC, useEffect, useState,useRef} from 'react'
import BottomColumn from 'Common/publicCommon/BottomColumn'
import {Headers} from 'Common/publicCommon'
import apiRealName from "Common/api/realname"
import {Images} from "Common/config/index";
import {Toast} from 'antd-mobile'
import "./style.scss"
import {session} from "Common/utils/store";
import {commonStore} from "Common/pages/store"
import {faceRecognitionPage, faceRecognitionStartBtn} from 'Common/Plugins/recordLogInfo'

var u = navigator.userAgent;
export const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
let {openAlert} = commonStore
import {ORG_ID} from "Common/config/index";
import {InitCom} from "./index";

interface IUserInfo {
    userName?:string,
    identNo?:string,
    idName?:string
    idNumber?:string
}
const Render = (): JSX.Element => {
    const {upLoadVideo, Config} = InitCom.get()
    let {isBottomShow} = Config
    let [userName, setUserName] = useState<string>('')
    let [identNo, setIdentNo] = useState<string>('')
    useEffect(() => {
        faceRecognitionPage()
        apiRealName.BcSuccessIdcard({isShowIdPhoto: false}).then((newData:IUserInfo) => {
            // console.log(newData, "返回的数据")
            session.set('faceInfo', newData)
            setUserName(newData.idName || '')
            setIdentNo(newData.idNumber || '')
        })
    }, [])
    return <div className="bc-face">
        <Headers>人脸识别</Headers>
        <FaceDiv
            {...{
                upLoadVideo,
                userName,
                identNo,
            }}
        />
        {isBottomShow ? <BottomColumn type="long"/> : null}
    </div>
}

type upLoadVideoType = (file:any, userInfo:IUserInfo) => any
interface FaceMainProps {
    userName: string
    identNo: string
    btnText?: string
    upLoadVideo: upLoadVideoType
}
const upLoadVideo:upLoadVideoType = (file, {userName, identNo}) => {
    const {checkContrastFailed,checkContrast} = InitCom.get()
    // checkContrast('xxxxx')

    let file1 = file.target.files[0]
    // console.log(file1.size / 1024 / 1024, "多少兆")
    //判断一下视频的大小
    if (file1.size / 1024 / 1024 >= 16) return Toast.info('人脸比对得分阈值过低', 2)
    let reader: any = new FileReader();
    reader.readAsDataURL(file1);//调用自带方法进行转换
    reader.onload = async function () {
        let img: any = this.result;
        console.log(img.split(";base64,")[0], ">>>视频格式")
        console.log(file1, "文件")
        let imgNum = img.split(";base64,");
        let imgBase = imgNum[1];
        try {
            let res = await apiRealName.livingCheck({
                uploadFile: encodeURIComponent(imgBase),//活体视频(BASE64Encoder编码，URLEncoder加密)
                orgId: ORG_ID,//银行orgId
                userName: userName,//用户姓名
                identNo: identNo,//身份证号
                fileName: file1.name//文件名称
            })
            checkContrast(res)
        } catch (e) {
            if (e.code == '10700') {
                openAlert('提示', e.msg, [
                    {
                        text: '重新上传', onPress: () => {
                            upLoadVideo(file, {userName, identNo})
                        }
                    }
                ])
                return
            }
            checkContrastFailed(e)
        }
    }
}
const FaceDiv: FC<FaceMainProps> = ({userName, identNo, btnText = '开始录制', upLoadVideo}): JSX.Element => {
    let canvas1
    let inputEle

    /**
     * 上传身份证
     **/
    return <>
        <div className="top">
            <img src={require('Common/assets/images/headers@2x.png')} alt="" onClick={() => {
                return false
            }}/>
        </div>
        <div className="faceBar">
            <p>请按图示将人脸放入取景框中</p>
        </div>
        <div className="faceContent">
            <p>*请使用<span>前置摄像头</span></p>
            <p>*点击<span>相机录制按钮开始</span>录制</p>
            <p>*录制视频<span>时长{isAndroid ? "3-4秒" : "4-5秒"}</span></p>
            <p>*录制结束后<span>{isAndroid ? "请点击√或完成按钮上传" : "请点击使用视频按钮上传"}</span></p>
        </div>
        <div className="faceConentLook" onClick={() => {
            commonStore.Hash.history.push(`/transcribe?userName=${userName}&identNo=${identNo}`)
        }}>
            录制演示
        </div>
        <label htmlFor="inputVideo1" className="labelVideo">{btnText}</label>
        <input ref={ele => inputEle = ele} id="inputVideo1" type="file" accept="video/*" capture="camera"
               onChange={(e) => {
                   upLoadVideo(e, {userName, identNo})
               }} onClick={() => {
             /* 打点————人脸识别开始录制 */
            try {
                faceRecognitionStartBtn()
            } catch (err) {
            }
        }}/>
        <canvas ref={ref => {
            canvas1 = ref
            let canvas = document.getElementsByTagName('canvas')[0];
            canvas.width = 130;
            canvas.height = 150
        }} id="canvas" className="canvas"/>
    </>
}

export default {
    Render,
    upLoadVideo
}
