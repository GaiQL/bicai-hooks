import { StoreExtends } from 'Common/Plugins/store.extends'
import { Native } from "Common/utils/appBridge"
import {InitCom as PgopenSuccess} from "../PgOpenSuccess/hooks/index"

export class PgCallbackNative extends StoreExtends {
    detailsPage = () => {
        Native.closeWebView()
    }

    openSuccess = () => {
        PgopenSuccess.get().goNext()
    }
}

export default new PgCallbackNative()
