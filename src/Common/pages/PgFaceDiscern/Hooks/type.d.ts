import handleObj from './handle'
import Item from './item'
import {ConfigBase} from './index'
import Store from './store'
/**
 * Item类型声明
 */
export type ItemType = Partial<typeof Item>

/**
 * Handle类型声明
 */
export type HandleType  = Partial<typeof handleObj>
/**
 * Store类型声明
 */
const store = new Store()
export type StoreType = Partial<typeof store>

/**
 * Config类型声明
 */
export type ConfigType = Partial<typeof ConfigBase>

/**
 * Store + Config 组合
 */
export interface ExtendInterface{
    Store:StoreType
    Config:ConfigType
}

/**
 * 对外导出
 */
export type InitComType = DeepRequired< ExtendInterface & ItemType & HandleType & StoreType>


