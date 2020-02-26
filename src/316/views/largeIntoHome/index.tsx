
import React from 'react'
import * as Index from "Common/pages/PgLargeIntoHome/Hooks"
import * as Type from "Common/pages/PgLargeIntoHome/Hooks/type"
import StoreBase from "Common/pages/PgLargeIntoHome/Hooks/store"
// import {action, computed, observable} from "mobx"; // mian

let Config:Type.ConfigType = {
    tiedcardType:1
}

const Item:Type.ItemInterface = {

}
// 新增Handle
const Handle:Type.HandleInterface ={
}
class Store extends StoreBase{
}

export default Index.default({Config,Item,Handle,Store})