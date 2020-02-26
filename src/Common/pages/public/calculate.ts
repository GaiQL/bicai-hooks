import BigNumber from "bignumber.js"

//解决js运算精度丢失问题  乘法
export const multiplication = ( arg1: { toString: () => any; }, arg2: number ) => {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

// 50000000000000000000000 % 100 = 96 大数模运算
export const Modulo = ( arg1: BigNumber.Value, arg2: BigNumber.Value ) => {
    let number = new BigNumber(arg1);
    let res:any = number.modulo(arg2);
    return res.c[0]
}
