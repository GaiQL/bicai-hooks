import handleObj from './handle'
import Item from './item'
import {ConfigBase} from './index'
import Store from './store'
/**
 * Item类型声明
 */
export type ItemInterface = Partial<typeof Item>

/**
 * Handle类型声明
 */
export type HandleInterface  = Partial<typeof handleObj>


/**
 * Store类型声明
 */
const store = new Store()
export type StoreInterface = Partial<typeof store>

/**
 * Config类型声明
 */
export interface ConfigType {
    /**
        @param tiedcardType
        1 - 电子账号可绑定多张银行卡  添加
        2 - 电子账号只能绑定1张银行卡  更换
        3 - 电子账号只能绑定1张银行卡且不可更换银行卡
    */
    tiedcardType:1 | 2 | 3
}

/**
 * Store + Config 组合
 */
export interface ExtendInterface{
    Store:StoreInterface
    Config:ConfigType
}

/**
 * 对外导出
 */
export type InitComType = DeepRequired<ExtendInterface & HandleInterface & StoreInterface & ItemInterface>
