import { observable, runInAction } from "mobx";
import { publicStore, commonStore } from "Common/pages/store"
import { StoreExtends } from 'Common/Plugins/store.extends'
import copy from 'copy-to-clipboard';
import { Toast } from 'antd-mobile';
import Help from 'Common/utils/Tool'

class Store {

    initData = async () => {
        let { apiBandCardFn } = publicStore;
        await apiBandCardFn({bizType:'2',queryType:'0'});
    }

    supBank = () => {
        commonStore.Hash.history.push("/bankList")
    }

    changeCard() {
        Help.StorageAddressBar()
        commonStore.Hash.history.push('/boundBank?page=largeAmountsTransfer')
    }

    goLargeIntoGuide = () => {
        let { bandCardInfo } = publicStore;
        commonStore.Hash.history.push( `/largeIntoGuide?accountNum=${ bandCardInfo.bankElecAccountNum }&orgName=${ bandCardInfo.orgName }` )
    }

    copyAccountNum = ( accountNum?: any ) => {
        let { bandCardInfo } = publicStore;
        let prepareCopyNum = accountNum?accountNum:bandCardInfo.bankElecAccountNum;
        console.log( accountNum,prepareCopyNum )
        if( prepareCopyNum ){
            copy( prepareCopyNum );
            Toast.info('复制成功',1);
        }else{
            Toast.info('没有可复制的内容',1);
        }
    }

}

export default Store

