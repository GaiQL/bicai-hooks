import Item from './item'
import Store from './store'
import { ConfigBase } from './index'

export type ItemInterface = Partial<typeof Item>

const store = new Store()
export type StoreInterface = Partial<typeof store>

export type ConfigType = Partial<typeof ConfigBase>

export interface ExtendInterface {
    Store: StoreInterface
    Config: ConfigType
}

export type InitComType = DeepRequired<ExtendInterface & StoreInterface & ItemInterface>
