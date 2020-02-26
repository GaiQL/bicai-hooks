import React from 'react'
import PgLogin from 'Common/pages/PgLogin'

const Login = (Component:any) => {

    return class extends PgLogin {
        render(): any {
            let Config = {
                imitateParams: { // 在公共头加入额外参数，用于开发

                },
                isImitateParams: false, // 是否开启额外参数，仅限开发使用。测试或者生产关闭
                smsCode: '123456',
                proId: "1378902",
                telephone: '18648503889',//'15313928125',
            }
            return <Component {...Config} {...this.props} />
        }
    }
}

export default Login(PgLogin)

// memberID：10000

// 姓名：李娜

// 身份证号：130827199205252628

// 手机号：18515810725
// 银行卡号：6217000130008991332
// 银行名称：建设银行（测试环境只支持建设银行卡）
// 短信验证码：123456（行方测试环境默认）有效时间60s
// 交易密码：121212
