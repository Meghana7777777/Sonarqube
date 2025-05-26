export interface IMoLineInfo {
    moLine: string;
    moNumber: string;
    deliveryDate: string[];
    destination: string[];
    color: string;
    [key: string]: any
}
export interface IProductFgColorInfo {
    productName: string;
    fgColor: string;
    moLineProducts: IMoLineInfo[];
}