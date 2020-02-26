
import {StoreExtends} from 'Common/Plugins/store.extends'



class Deposit extends StoreExtends{
    getHoldInfo = async (data: any) => {
        return await this.apiBank.apiQryHoldInfo(data)
    }
    getMyInvestOver = async (data: any) => {
        return await this.apiBank.getMyInvestOver(data)
    }
    apiQryEleTransDetailFn = async (data: any) => {
        return this.apiBank.apiQryEleTransDetail(data)
    }
    apiIsShelvesFn = async (data: any) => {
        return this.apiBank.apiIsShelves(data)
    }
    idCardStatusFn = async () => {
        return this.apiBank.idCardStatus()
    }
    apiRedemptionValidFn = async (data: any) => {
        return this.apiBank.apiRedemptionValid(data)
    }
}
export default Deposit
