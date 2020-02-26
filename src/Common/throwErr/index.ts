import {Modal} from "antd-mobile";
import {INNER_CODE} from "Common/config/params.enum";

const alert = Modal.alert;

const errCodeArr:Map<any,any> = new Map([
    [INNER_CODE.SubmitOnly
        ,(e:Record<string,any>,title:string)=>{
        alert(title || '更新失败', e.popMsg, [
            {
                text: '确定',
                onPress: () =>
                    console.log('确定')
            }
        ])
    }]
])
export const throwErr = (e:Record<string,any>,title:string) => {
    errCodeArr.get(e.innerCode)(e,title)
}
