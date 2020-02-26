
import { commonStore } from "Common/pages/store"
import { session } from 'Common/utils/store'
class Store {
    complate(path: string) {
        let data: any = commonStore.query();
        let page: any = data && data.page || ''

        if (path == "recharge") {
            commonStore.Hash.history.replace('/boundBank?page=recharge')
        } else {
            let type = session.get('withdrawType')
            if (type == 'boundBank') {
                commonStore.Hash.history.replace("/boundBank?page=" + page);
            } else {
                commonStore.Hash.history.replace("/bankDetail");
            }
        }
    }
}

export default Store
