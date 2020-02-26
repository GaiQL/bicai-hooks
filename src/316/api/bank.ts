import {apiClassFactory,fetch} from 'Common/api/bank'
class Api extends apiClassFactory('v2') {
         /**
     *  用户开户第一步（用户及绑卡信息）
     * @param params
     */
    apiOpenAccountSubmit = (params?: string | { [key: string]: any } | undefined) => {
        return fetch.post('/openapi/account/v2/openAccountSubmit', params, { loadingText: '正在与开户行数据进行校验中，请等待3-5秒' })
    }
      /**
     *  更新身份证
     * @param params
     */
    apiUpdateIdCard = (params?: string | { [key: string]: any } | undefined) => {
        return fetch.post('/openapi/comm/v2/apiUpdateIdCard', params, { loadingText: '正在与开户行数据进行校验中，请等待3-5秒' ,hideAlert:"hide"})
    }
}
export const apiBank = new Api()
