import { observable, action, computed, decorate, runInAction } from "mobx";
import { INNER_CODE } from "Common/config/params.enum";
import { commonStore } from "Common/pages/store"
import { apiBankAll } from 'Common/api/bank'
const apiBank = new apiBankAll.ApiBankV2()
import { perfectOpenInfoBtn } from 'Common/Plugins/recordLogInfo'
import { session } from "Common/utils/store";
import { InitCom } from "./index";
export type nextType = 'openInputSmsCode' | 'openSuccess' | 'faceDiscern'
class Store {
    @observable nextType: nextType = 'openInputSmsCode'// 点击下一步去哪里的配置，因为有些情况该选项需要动态改变。放到store了
    @observable cardExpireDate = ''//页面回显的有效期（只要后面的）
    @observable userCardId = ''//身份证
    //TODO;;;
    @observable dutyVal = '请选择' // 职业
    @observable dutyCode = null // 职业code
    @observable dutyTowVal = '' //二级职业
    @observable industryVal = '请选择' // 行业
    @observable industryCode = null // 行业code

    @observable nationVal = [''] //民族
    @observable sexVal = [''] // 性别
    @observable dutyList = []// 职业列表
    @observable industryList = []// 行业列表
    @observable realName = ''// 姓名
    @observable signOrg = ''// 签发机关
    @observable dutyDefalutSelectStatus = {} //  默认选择职业
    @observable industryDefalutSelectStatus = {} // 默认选择行业
    @observable signAndIssueDate = ''
    @observable address = ''
    @observable result = {}//返回数据
    @observable nationList = []//民族列表
    @observable bankName = '请选择'
    @observable bindCardList = []
    @observable bankCardPhone = ''//银行卡手机号
    @observable bankInfo: any = {}
    @observable dutyCo = ""
    @observable newDutyList = []
    @observable DutyList = []
    @observable alterTitle = '开户失败'
    @observable residentAddress = '' // 居住地址
    @observable autoEnterResidentAddressFlag = false // 居住地址默认填入联系地址
    @observable loginPhoneNum = '' //  TODO登录的手机号
    @observable industryHTML1 = ''//行业的值
    @observable EditAddress= ''//编辑地址
    @observable bankLogoUrl = ''

    //回显接口
    EchoDisplayInitData = async () => {
        const res = await apiBank.apiRegisterBackShow({
            showBase64Flag: "0",
        })
        runInAction(() => {
            this.result = res//返回的数据
            this.address = res.address
            this.addressCheck( this.address)
            this.nationVal = [res.nation || ''] //民族
            this.getAddress(res.address && res.address.substring(0, 12) + '...' || '')//地址
            this.newDutyList = res.dutyList//职业列表
            this.DutyList = res.industryList
            this.getNationData(res.nationList)//民族
            this.loginPhoneNum = res.bankCardPhone
            this.sexVal = [res.sex == "0" ? "男" : "女" || '']//性别
            this.realName = res.realName && ('*' + res.realName.substr(1))//名字
            this.bindCardList = res.bindCardList || []
            this.signAndIssueDate = res.cardExpireDate ? res.cardExpireDate.split('-')[0].replace(/\./g, '-') : ""
            this.cardExpireDate = res.cardExpireDate ? res.cardExpireDate.split('-')[1].replace(/\./g, '-') : "" //页面回显的有效期（只要后面的）
            this.userCardId = res.userCardId && res.userCardId.substring(0, 1) + '****************' + res.userCardId.charAt(res.userCardId.length - 1)
        })
    }
    addressCheck = (adress: any) => {

    }


    //获取新银行卡返回的信息
    getNewBank = (val:any) => {
        console.log(val, "新数据")
        runInAction(() => {
            if (val) {
                this.bankCardPhone = val.bankCardPhone
                session.set('bankInfo', val)
            }
            if (session.get('bankInfo')) {
                let { bankInfo, bankCardPhone } = session.get('bankInfo')//银行卡信息
                this.bankCardPhone = bankCardPhone
                if (bankInfo) {
                    this.bankName = bankInfo.bankName + `(${bankInfo.bankCardNum.substr(-4)})`
                    this.bankInfo = {
                        bankCardNum: bankInfo.bankCardNum,
                        bankCardPhone: bankCardPhone,
                        bankNo: bankInfo.bankNo || "",
                    }
                }
            }
        })
    }

    //行业每一个点击的值
    //TODO;;;;;
    IndustryEventClick = (val: string, code: null) => {
        runInAction(() => {
            this.industryVal = val
            this.industryCode = code
        })
    }
    //职业每一个点击的值
    //TODO;;;;;
    OccupationEventClick = (val: string, code: null) => {
        runInAction(() => {
            this.dutyVal = val
            this.dutyCode = code
        })
    }
    //二级职业每一个点击的值
    //TODO;;;;;
    OccupationTowEventClick = (val: string) => {
        runInAction(() => {
            this.dutyTowVal = val
        })
    }
    //获取性别
    onChangeSex = (val: string[]) => {
        runInAction(() => {
            this.sexVal = val
        })
    }
    getAddress = (val: string) => {
        runInAction(() => {
            this.address = val
        })
    }
    // 点击更新按钮操作。可重写
    nextStep = async () => {
        try {
            perfectOpenInfoBtn()
        } catch (err) {
        }
        this.submit()
    }
    //下一步按钮
    submit = async () => {
        let idcardUploadFlag: String = session.get("idcardUploadFlag") || "0" //工商字段
        let { imageOrderNo }: any = session.get('updateIdCardResult') || {} //获取更新身份证返回信息。
        let { idcardBackPhoto = '', idcardFrontPhoto = '' }: any = session.get("carIdBase64") || {}
        let sex = this.sexVal[0] == '男' ? '0' : (this.sexVal[0] == '0' ? "0" : "1")
        let data: any = this.result as any
        let { Config } = InitCom.get()
        let params = {
            certificateType: 0,//证件类型
            realName: data.realName,   // 姓名
            loginPhoneNum: data.loginPhoneNum || '', // 不是必须。手机号
            userDuty: this.dutyCode, //默认选中职业
            cardExpireDate: data.cardExpireDate, //有效期
            address: data.address, //地址
            residentAddress: session.get('residentAddress') || '', // 居住地址
            nation: data.nation, //民族
            signOrg: data.signOrg,//签发机构
            sex: sex, //性别
            bankCardNum: this.bankInfo.bankCardNum,//银行卡号
            bankCardPhone: this.bankInfo.bankCardPhone,//银行卡预留手机号
            bankNo: this.bankInfo.bankNo, // 行号
            bankName: this.bankName.split('(')[0],//银行名称
            userCardId: data.userCardId,// 身份证号
            openBank: this.bankName.split('(')[0],//银行名称
            birthday: data.birthday || '',// 生日
            industry: this.industryCode,//TODO>>行业的code值
            imageOrderNo: imageOrderNo || '', // 更新身份证，更新完回传，没有传空就行。还有就是，如果其他银行需要改字段，让中台统一改字段就可以。
            transcoding: '1',
            idcardBackPhoto: Config.ifUploadIDCardImgBase64 ? idcardBackPhoto : "",//身份证反面
            idcardFrontPhoto: Config.ifUploadIDCardImgBase64 ? idcardFrontPhoto : "",//身份证前面
            signStartDate: data.signStartDate || this.signAndIssueDate,// 签发日期
            idcardUploadFlag: idcardUploadFlag,//工商银行判断 更新没更新 身份证
            ePassword: '' // 广州农商银行需要字段
        }
        try {
            const res = await apiBank.apiOpenAccountSubmit(params)
            session.remove('residentAddress')
            session.set('openSuccessData', res)
            this.nextStepConfirm()
        } catch (e) {
            console.log(e, "err")

            session.remove('residentAddress')
            //TODO;;;;;
            this.catchFn(e)
        }

    }
    // 某些情况 比如活体完毕、更新身份证完毕后 需要动态改变 nextType 值
    changeNextType(nextType: nextType) {
        runInAction(() => {
            this.nextType = nextType
        })
    }

    changeAutoEnterResidentAddress = () => {
        runInAction(() => {
            this.autoEnterResidentAddressFlag = !this.autoEnterResidentAddressFlag
            if (this.autoEnterResidentAddressFlag) {
                this.residentAddress = this.address
                session.set('residentAddress', this.residentAddress)
            } else {
                this.residentAddress = ''
                session.remove('residentAddress')

            }
        })
    }
    getLiveAddress = (val: string) => {
        runInAction(() => {
            this.residentAddress = val
            if (val != this.address) {
                this.autoEnterResidentAddressFlag = false
            }
        })
    }
    catchFn = (e: { innerCode: any; popMsg: string | JSX.Element | undefined; }) => {
        switch (e.innerCode) {
            case INNER_CODE.SubmitAndDoThing:
                commonStore.openAlert('开户失败', e.popMsg, [
                    { text: '确定', onPress: () => console.log('确定') },
                ])
                break;
            case INNER_CODE.ModifyOpenInfo:
                commonStore.openAlert('开户失败', e.popMsg, [
                    {
                        text: '修改开户信息', onPress: () => {
                            commonStore.Hash.history.replace('/openFlow')
                        }
                    },
                ])
                break;
            case INNER_CODE.CancelAndUpdateIdCard:
                commonStore.openAlert(this.alterTitle, e.popMsg, [
                    { text: '取消', onPress: () => console.log('取消'), style: { color: "#999999" } },
                    {
                        text: '更新身份证', onPress: () => {
                            commonStore.Hash.history.push('/updateIdCard?openErr=' + INNER_CODE.CancelAndUpdateIdCard)
                        }
                    },
                ])
                break;
        }
    }

    getNationData = (nationList: { map: (arg0: (item: any) => { label: any; value: any; id: any; }) => never[]; }) => {
        //
        runInAction(() => {
            this.nationList = nationList.map(item => {
                return {
                    label: item.nation,
                    value: item.nation,
                    id: item.id
                }
            })
        })
    }
    // 获取职业或者行业
    getSelectItem = (modalType: string, ...agur: any[]) => {
        let { name, code } = agur[0]
        let val = agur[1]
        runInAction(() => {
            if (modalType == 'dutyFlag') {
                this.dutyDefalutSelectStatus = val
                this.dutyVal = val[name]
                this.dutyCode = val[code]
            }
            if (modalType == 'industryFlag') {
                this.industryDefalutSelectStatus = val
                this.industryVal = val[name]
                this.industryCode = val[code]
            }
        })
    }
    isDisabled = (IProf: any) => {
        return IProf ? (this.dutyVal == '请选择' || this.bankName == '请选择') : (this.bankName == '请添加')
    }
    //获取民族
    onChangeNation = (val: string[]) => {
        runInAction(() => {
            this.nationVal = val
        })
    }
    //获取选中的银行卡
    getBank = (val: { bankCardPhone: string; bankName: string; bankCardNum: string; bankNo: any; bankLogoUrl: string}) => {
        runInAction(() => {
            this.bankCardPhone = val.bankCardPhone
            session.set("bankCardNum", val.bankCardNum)
            this.bankName = val.bankName + `(${val.bankCardNum.substr(-4)})`
            this.bankLogoUrl = val.bankLogoUrl
            this.bankInfo = {
                bankCardNum: val.bankCardNum,
                bankCardPhone: val.bankCardPhone,
                bankNo: val.bankNo,
            }
        })
    }
    //点击下一步选择
    nextStepConfirm = async () => {
        if (this.nextType == 'openInputSmsCode') {
            // 需要验证码的
            //TODO111111
            let bankCardPhone = this.bankCardPhone ? this.bankCardPhone : session.get('bankInfo').bankCardPhone
            let loginPhoneNum = this.loginPhoneNum
            commonStore.Hash.history.push(`/openInputSmsCode?bankCardPhone=${bankCardPhone}&loginPhoneNum=${loginPhoneNum}`)
        }
        if (this.nextType == 'openSuccess') {
            // 不需要验证码的
            commonStore.Hash.history.push('/openSuccess')
        }
        //跳转活体也页面
        if (this.nextType == 'faceDiscern') {
            commonStore.Hash.history.push('/faceDiscern')
        }
    }


}

export default Store

