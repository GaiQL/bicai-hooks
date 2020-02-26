const request = require('request');
const buildPathJson = require('./buildPath.json');

let cookieData = "";

const user_wby = {
    loginName:'h5_wby',
    passWord:'564C0M+OuOCB/WeL/8CJ2g=='   // 123456 passwordEncryption加密  crypto-js
}
const user_h5Upload = {
    loginName:'h5Upload',
    passWord:'564C0M+OuOCB/WeL/8CJ2g=='
}

const passwordEncryption = ( password ) => {
    var key = CryptoJS.enc.Utf8.parse('qwertyuiop123456');
    var cipher = CryptoJS.AES.encrypt(password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return cipher.ciphertext.toString(CryptoJS.enc.Base64);
}

class requestApi {

    constructor( envTypeInManage ){

        this.envTypeInManage = envTypeInManage;
        // this.newApi = !(envTypeInManage == "prod" || envTypeInManage == "preheat")
        this.newApi = true;
        this.sessionid = "";
    }
    requestAction( params,type ){
        let { envTypeInManage,newApi } = this;
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                    'Cookie' : cookieData,
                    'sessionid': this.sessionid,
                },
                json:true,
                ...params,
                url: buildPathJson[ envTypeInManage ].managementAddress + ( newApi?'/apis':'' ) + params.url
            }, (error, response, body) => {
                // errCode:'1'   && !JSON.parse(body).errCode
                if( error || !response ){ reject( error ) };
                if ( !error && response.statusCode == 200 ) {
                    // body.cookieData = response.headers['set-cookie'];
                    //  && ( typeof body == 'string'?!JSON.parse(body).errCode:true )
                    if( typeof body == 'string' ){ body = JSON.parse(body) }
                    if( body.errCode ){ console.log( params.url + body.errMsg );process.exit(); }
                    if( type == 'login' ){
                        this.sessionid = body.sessionId;
                        response.headers['set-cookie'] && response.headers['set-cookie'].forEach((cookie)=>{ cookieData += `${cookie.split(';')[0]};` })
                    }
                    resolve( body );
                }else if( response.statusCode == 302 ){
                    // 重新登录；
                    console.log( '要重新登录' );
                }else{
                    reject( error );
                }
            })
        })
        .catch((err)=>{ throw err })
    }
    login(){
        let url = '/admin/login/userLogin';
        let { newApi,envTypeInManage } = this;
        let loginData = envTypeInManage == "prod" || envTypeInManage == "preheat"?user_wby:user_h5Upload;
        return newApi
        ?this.requestAction({ url,body:loginData },'login')
        :this.requestAction({ url,formData:loginData },'login')
    }
    list( pageNum,pageLimit ){
        let url = '/admin/edition/query';
        let { newApi } = this;
        return newApi
        ?this.requestAction({ url,body:{ page:pageNum,limit:pageLimit } })
        :this.requestAction({ method:'GET',url,qs:{ page:pageNum,limit:pageLimit } })
    }
    upload( appListContent,postData ){
        let url = appListContent?'/admin/edition/update':'/admin/edition/add';
        let { newApi } = this;
        return newApi
        ?this.requestAction({ url,body:postData })
        :this.requestAction({ url,formData:postData })
    }

}

module.exports = requestApi;
