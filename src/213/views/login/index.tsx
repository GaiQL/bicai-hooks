import React from 'react'
import PgLogin from 'Common/pages/PgLogin'

const Login = (Component:any) => {

    return class extends PgLogin {
        render(): any {
            let Config = {
                imitateParams: { // 在公共头加入额外参数，用于开发
                    "memberId": "11301745",
                    "phoneNum": "15711349873",
                    "loginPhoneNum": "15711349873",
                },
                isImitateParams: false, // 是否开启额外参数，仅限开发使用。测试或者生产关闭
                smsCode: '123456',
                proId: "1100000203",
                telephone: '15711349873',//'15313928125',
            }
            return <Component {...Config} {...this.props}/>
        }
    }
}

export default Login(PgLogin)

// 姓名：王亚东


