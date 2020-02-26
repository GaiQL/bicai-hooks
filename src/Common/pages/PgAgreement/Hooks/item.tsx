import React from 'react'
import './style.scss'
import {imgSrc} from "Common/config/index";

import {Headers} from 'Common/publicCommon/index'
import {observer} from "mobx-react-lite"
// 主渲染函数 Render名字必须存在
export let Render = () => {
    let href = window.location.href
    let url = href.indexOf('url') > -1 ? href.substring(href.indexOf('url') + 4, href.length).replace(/@/g, '?') : ''
    return (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Headers>服务协议</Headers>
            <iframe src={`${url.indexOf('http:') != -1 ? url : imgSrc + '/' + url}`} style={{width:'100%', flex: '1', border:'0'}}></iframe>
        </div>
    )
}


export default {
    Render: observer(Render),
}

