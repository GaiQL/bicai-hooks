import React from 'react'
import PgLogin from 'Common/pages/PgLogin'

const Login = (Component:any) => {
    return class extends PgLogin {
        render(): any {
            let Config = {
                imitateParams: { // 在公共头加入额外参数，用于开发
                    // memberId: '1128',
                    memberId: '1128',
                    loginPhoneNum: '',
                },
                // isTempApiOpen:true,
                isTempApiOpen: false, // 是否开启额外参数，仅限开发使用。测试或者生产关闭
                smsCode: '123456',
                proId: "",
                telephone:''
                // telephone:'13718883621'
            }
            return <Component {...Config} {...this.props}/>
        }
    }
}

export default Login(PgLogin)

