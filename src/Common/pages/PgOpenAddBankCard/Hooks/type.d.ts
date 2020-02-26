/**
 * Item类型声明
 */
export interface ItemInterface{

}

/**
 * Handle类型声明
 */
export interface HandleInterface{

}

/**
 * Store类型声明
 */

export interface StoreInterface {

}

/**
 * Config类型声明
 */
export interface ConfigType {
    [propName:string]:any
}

/**
 * Store + Config 组合
 */
interface ExtendInterface{
    Store:StoreInterface
    Config:ConfigType
}

/**
 * 对外导出
 */
export type InitComType = ExtendInterface & HandleInterface & StoreInterface & ItemInterface
