import React from 'react'

export default {
    config: [
        {
            path: "/login",
            // @ts-ignore
            component: React.lazy(() => import('../views/login')),
            exact: true
        },
        {
            path: "/native",
            // @ts-ignore
             component: React.lazy(() => import('../views/native')),
            exact: true
        },
        {
            path: "/checkState",
            // @ts-ignore
            component: React.lazy(() => import('../views/checkState')),
            exact: true
        },
        {
            path: "/openFlow",
            component: React.lazy(() => import('../views/openFlow')),
            exact: true
        }
        // 提现
        ,
        {
            path: "/withdraw",
            component: React.lazy(() => import('../views/withdraw')),
            exact: true
        },
        // 提现成功
        {
            path: "/withdrawSuccess",
            component: React.lazy(() => import('../views/withdrawSuccess')),
            exact: true
        },
        // 提现处理中
        {
            path: "/withdrawInWaiting",
            component: React.lazy(() => import('../views/withdrawInWaiting')),
            exact: true
        },
        // 支取
        ,
        {
            path: "/redeem",
            component: React.lazy(() => import('../views/redeem')),
            exact: true
        },
        // 支取成功
        {
            path: "/redeemSuccess",
            component: React.lazy(() => import('../views/redeemSuccess')),
            exact: true
        },
        // 支取处理中
        {
            path: "/redeemWaiting",
            component: React.lazy(() => import('../views/redeemInWaiting')),
            exact: true
        },
        // 充值
        ,
        {
            path: "/recharge",
            component: React.lazy(() => import('../views/recharge')),
            exact: true
        },
        // 交易输入验证码
        {
            path: "/dealSendCode",
            component: React.lazy(() => import('../views/dealInputSmsCode')),
            exact: true
        },
        // 充值成功
        {
            path: "/rechargeSuccess",
            component: React.lazy(() => import('../views/rechargeSuccess')),
            exact: true
        },
        // 充值处理中
        {
            path: "/rechargeWaiting",
            component: React.lazy(() => import('../views/rechargeInWaiting')),
            exact: true
        },
        // 大额转入
        {
            path: "/largeIntoHome",
            component: React.lazy(() => import('../views/largeIntoHome')),
            exact: true
        },
        // 存入
        {
            path: "/buy",
            // @ts-ignore
            component: React.lazy(() => import('../views/buy')),
            exact: true
        },
        // BankDetail
        {
            path: "/buySuccess",
            component: React.lazy(() => import('../views/buySuccess')),
            exact: true
        },
        // 存入结果页
        {
            path: "/buyResults",
            component: React.lazy(() => import('../views/buyInWaiting')),
            exact: true
        },
        //完善开户信息
        {
            path: "/openPerfection",
            component: React.lazy(() => import('../views/openPerfection')),
            exact: true
        },
        // {
        //     path: "/deposit", // 智能存款页
        //     component: React.lazy(() => import('../views/holdPositions')),
        //     exact: true
        // },
        {
            path: "/revenueList", // 已派发收益列表
            component: React.lazy(() => import('../views/revenueList')),
            exact: true
        },
        {
            path: "/tradingDetail", // 智能存款详情页
            component: React.lazy(() => import('../views/tradingDetail')),
            exact: true
        },
        //添加银行卡
        {
            path: "/addNewBank",
            component: React.lazy(() => import('../views/addBankCard')),
            exact: true
        },
        //支持银行
        {
            path: "/bankList",
            component: React.lazy(() => import('../views/bankList')),
            exact: true
        },
        //输入验证码
        {
            path: "/openInputSmsCode",
            component: React.lazy(() => import('../views/openInputSmsCode')),
            exact: true
        },
        //开户成功
        {
            path: "/openSuccess",
            component: React.lazy(() => import('../views/openSuccess')),
            exact: true
        },
        //更新身份证
        {
            path: "/updateIdCard",
            component: React.lazy(() => import('../views/updateIdCard')),
            exact: true
        },
        //银行详情
        {
            path: "/bankDetail",
            component: React.lazy(() => import('../views/bankDetail')),
            exact: true
        },
        //更多服务
        {
            path: "/moreService",
            component: React.lazy(() => import('../views/moreService')),
            exact: true
        },
        //绑定银行卡
        {
            path: "/boundBank",
            component: React.lazy(() => import('../views/boundBank')),
            exact: true
        },
        //更换手机号
        {
            path: "/changePhone",
            component: React.lazy(() => import('../views/changePhone')),
            exact: true
        },

        //更换银行卡发送验证没
        {
            path: "/serviceInputSmsCode",
            component: React.lazy(() => import('../views/serviceInputSmsCode')),
            exact: true
        },
        //更换银行卡发送验证没
        {
            path: "/changeBank",
            component: React.lazy(() => import('../views/changeBank')),
            exact: true
        },
        // 协议
        {
            path: "/agreement",
            component: React.lazy(() => import('../views/agreement')),
            exact: true
        },
        // 持仓页
        {
            path: "/holdProductList",
            component: React.lazy(() => import('../views/holdProductList')),
            exact: true
        },
        // 新版h5跳转对接
        {
            path: "/bankDispatch",
            component: React.lazy(() => import('../views/bankDispatch')),
            exact: true
        },
        // 大额转入指引
        {
            path: "/largeIntoGuide",
            component: React.lazy(() => import('../views/largeIntoGuide')),
            exact: true
        },
        //  人脸识别测试页面
        {
            path: "/faceDiscern",
            component: React.lazy(() => import('../views/faceDiscern')),
            exact: true
        },
        //  视频演示
        {
            path: "/transcribe",
            component: React.lazy(() => import('../views/transcribe')),
            exact: true
        },
        //  风险测评
        {
            path: "/riskAppraisal",
            component: React.lazy(() => import('../views/riskAppraisal')),
            exact: true
        },
        //  风险测评答题页
        {
            path: "/riskQuestions",
            component: React.lazy(() => import('../views/riskQuestions')),
            exact: true
        },
        //  风险测评结果页
        {
            path: "/assessmentLevel",
            component: React.lazy(() => import('../views/assessmentLevel')),
            exact: true
        },
        {
            path: "/openNative",
            component: React.lazy(() => import('../../Common/pages/PgCallbackNative')),
        },
        {
            path: "/hookModule",
            component: React.lazy(() => import('../views/hookModule')),
            exact: true
        },
        {
            path: "/editAddress",
            component: React.lazy(() => import('../views/editpage')),
            exact: true
        },
        {
            path: "/openWaiting",
            component: React.lazy(() => import('../views/openWaiting')),
            exact: true
        },
        {
            path: "/openFail",
            component: React.lazy(() => import('../views/openFail')),
            exact: true
        }
    ]
}


