
// import {observer,inject} from 'mobx-react';
import { useLocalStore, useObserver } from "mobx-react-lite"

/**
 * 初始化页面公共资源，方便每个模块统一调用
 *
 *  * 设置方法：InitCom.set(init)：
 *     init包含：Config、Store实例，Handle和Item扁平化
 *     init = {
 *              Config:{},
 *              Store:new Store(),
 *              ...Handle,
 *              ...Item
 *             }
 * (主要)获取方法：InitCom.get()：组件或者方法调用是通过返回initCom
 *        const {Config,Store,...Handle,...Item} = initCom
 *        文件handle.tx和Item.tsx里的暴露的函数或者组件，直接引入
 *        为了方便引入智能认证编写type.d.ts文件
 * InitComType：ts配置文件，方便引入时提示
 */
export function Init<T>() {
    let Com: T = {} as T;
    return {
        set(argv:T){
            console.log('init')
            Com = argv
        },
        get(): T {
            return Com
        }
    }
}

/**
 *  页面初始化
 * 将InitCom，ConfigBase，ItemBase，HandleBase初始化并挂载到页面主体Main上
 * @param Main 页面Render函数
 * @param InitCom 页面公共资源初始化函数
 * @param ConfigBase 基础页面配置
 * @param ItemBase 公共函数组件对象
 * @param HandleBase 公共方法对象
 * @constructor  返回整体的Main页面函数
 */
export function InitPage({ Main, InitCom, ConfigBase = {}, ItemBase, HandleBase = {} }:any) {
    // @ts-ignore
    return function ({ Config = ConfigBase, Item = ItemBase, Handle = HandleBase, Store}): any {
        Item = { ...ItemBase, ...Item }
        Config = { ...ConfigBase, ...Config }
        Handle = { ...HandleBase, ...Handle }
        // @ts-ignore
        Store = Store ? new Store() : {}
        InitCom.set({ Config, Store, ...Item, ...Handle })
        return Main(Item.Render)
    }
}
