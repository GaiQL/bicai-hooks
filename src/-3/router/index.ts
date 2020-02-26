import React from 'react'

export default {
    config: [
        {
            path: "/login",
            component: React.lazy(() => import('../views/login')),
            exact: true
        },
        //更新身份证
        {
            path: "/updateIdCard",
            component: React.lazy(() => import('../views/updateIdCard')),
            exact: true
        },
        {
            path: "/native",
            component: React.lazy(() => import('../views/native')),
            exact: true
        },
        {
            path: "/bcRealNameModifyAddress",
            component: React.lazy(() => import('../views/bcRealNameModifyAddress')),
        },
        // 人脸识别
        {
            path: "/faceDiscern",
            component: React.lazy(() => import('../views/faceDiscern')),
            exact: true
        },
        // 视频演示
        {
            path: "/transcribe",
            component: React.lazy(() => import('../views/transcribe')),
            exact: true
        },
        //
        {
            path: "/dispatchFromh5",
            component: React.lazy(() => import('../views/dispatchFromh5')),
            exact: true
        }
    ]
}
