// import { CommonRequestAttrs } from "../../../common"

// export class RawOrderProdTypeSkuMapRequest extends CommonRequestAttrs {
//     productName: string; // the user entered input
//     prodType: string; // the sub prod type. same value as in order if no sub product
//     iCode: string[];
//     subProdCount: number; // the pack count/set count/ if PIECE then 1
//     color: string; // the color of the product

//     constructor(
//         username: string,
//         unitCode: string,
//         companyCode: string,
//         userId: number,
//         productName: string,
//         prodType: string,
//         subProdCount: number,
//         iCode: string[],
//         color?: string

//     ) {
//         super(username, unitCode, companyCode, userId);

//         this.productName = productName;
//         this.prodType = prodType;
//         this.subProdCount = subProdCount;
//         this.iCode = iCode;
//         this.color = color;
//     }
// }