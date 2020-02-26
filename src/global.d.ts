declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.json'
declare module 'bc-bank-design'
declare module 'rc-form'
declare module 'js-base64'
declare module 'lrz'
declare type successType = (result: Record<string, unknown>) => any;
declare type failedType = (result: Record<string, unknown>) => any;

// 递归转化成非
declare type DeepPartial<T> = {
    [U in keyof T]?: T[U] extends object
        ? DeepPartial<T[U]>
        : T[U]
};

declare type DeepRequired<T> = {
    [U in keyof T]-?: T[U] extends object
        ? (T[U] extends Function ? T[U] : DeepRequired<T[U]>)
        : T[U]
}

// declare type DeepRequired<T> = {
//     [U in keyof T]-?: T[U] extends object
//         ? DeepPartial<T[U]>
//         : T[U]
// };


declare type unknownFnType = (...args: unknown) => unknown
declare type anyFnType = (...args: any) => any

interface extendWindow extends Window {
    onRestart: any,
    appear: any,
    pageAppear: any
}

// declare const window:extendWindow
declare const window: any
declare const document: any


declare interface errorType {
    popMsg?: string
    innerCode?: string
    popType?: string | number
    value?: any,
    msg?: string,
}

declare interface IInitHead {
    channelId,
    deviceId,
    userChannel,
    appFlag,
    systemType,
    version,
    clientId,
    channel,
    token,
    channelType,
    deviceName
}

