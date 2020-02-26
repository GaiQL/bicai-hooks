import * as Index from "Common/pages/PgInputSmsCode/Hooks"
import StoreBase from "Common/pages/PgInputSmsCode/Hooks/store"
import * as Type from "Common/pages/PgInputSmsCode/Hooks/type"
import {apiBankAll} from 'Common/api/bank'
import {$Bus, BusName} from 'Common/Plugins/index'
import { commonStore } from 'Common/pages/store'
import { INNER_CODE } from "Common/config/params.enum";

const apiBank = new apiBankAll.ApiBankV2()

//  新增重写
const Config:Type.ConfigType ={
}
const Item = {
}
// 新增Handle
const Handle = {}

class Store extends StoreBase {
  catchAlert = (err: { innerCode: string; popMsg: string | JSX.Element | undefined }) => {
    switch (err.innerCode) {
      case INNER_CODE.CancelAndUpdateIdCard:
        commonStore.openAlert('开户失败', err.popMsg, [
          {
            text: '确定',
            onPress: () =>
              commonStore.Hash.history.push('/updateIdCard?openErr=' + err.innerCode)
          }
        ])
        break;
      case INNER_CODE.SubmitAndDoThing:
        commonStore.openAlert('开户失败', err.popMsg, [
          {
            text: '确定',
            onPress: () =>
              commonStore.Hash.history.push('/openPerfection')
          }
        ])
        break;
      case INNER_CODE.goBcFaceDiscern:
        commonStore.openAlert('开户失败', err.popMsg, [
          {
            text: '确定',
            onPress: () =>
              commonStore.Hash.history.push('/faceDiscern?fromPage=open')
          }
        ])
        break;
    }
  }
}

export default Index.default({Config, Item, Handle, Store})
