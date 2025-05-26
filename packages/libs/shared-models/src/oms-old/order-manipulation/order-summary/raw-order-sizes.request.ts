// import { CommonRequestAttrs } from "../../../common";

// export class RawOrderSizesRequest extends CommonRequestAttrs{
//     orderNo: string;
//     orderId: number;
//     packMethod: number; // this should be ENUM (1Pack, 2 Pack et..)
//     orderPlantStyle: string; // The style number that plant team will refer this value in the other interfaces
//     sizes: string[];

//     constructor(
//         username: string,
//         unitCode: string,
//         companyCode: string,
//         userId: number,
//         orderNo: string,
//         orderId: number,
//         packMethod: number,
//         orderPlantStyle: string,
//         sizes: string[],

//     ) {
//         super(username, unitCode, companyCode, userId);
//         this.orderNo = orderNo;
//         this.orderId = orderId;
//         this.packMethod = packMethod;
//         this.orderPlantStyle = orderPlantStyle;
//         this.sizes = sizes;
//     }
// }