import { observable , runInAction } from "mobx";
import { StoreExtends } from 'Common/Plugins/store.extends';
import { apiBankAll } from 'Common/api/bank';
import { commonStore } from "Common/pages/store"
const apiBank = new apiBankAll.ApiBankV2()

class Store {

    @observable backTopOnoff = false;
    @observable accountInfo:any = {};
    @observable guidPageData:any = {};
    
    initData = async () => {
        this.monitorTopNum();
        let queryData = commonStore.query();
        let guidPageData = await apiBank.getLargeDpositGuidePage();
        this.backTop();
        runInAction(()=>{
            this.accountInfo = queryData;
            this.guidPageData = guidPageData;
        })
    }

    monitorTopNum = () => {
        window.addEventListener('scroll', ()=>{
            runInAction(()=>{
                if( document.body.scrollTop > innerHeight ){
                    this.backTopOnoff = true;
                }else{
                    this.backTopOnoff = false;
                }
            })
        })
    }

    backTop = () => { document.body.scrollTop = 0; }

}

export default Store

