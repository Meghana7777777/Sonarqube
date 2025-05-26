// import { MoProductStatusEnum } from "../enum";
// import { RawOrderLineRmModel } from "./item-info/raw-order-line-rm.model";
// import { RawOrderOpInfoModel } from "./op-info/raw-order-op-info.model";
// import { RawOrderSubLineInfoModel } from "./raw-order-sub-line-info.model";

// export class RawOrderLineInfoModel {
//     orderLineId: number; // the PK of the order line table
//     orderLineNo: string; // the main ref for the order-line that is unique. it could be anything (Manufacturing order/purchase order)
//     fgColor: string;
//     quantity: number;
//     salOrdLineNo: string;
//     delDate: string;
//     dest: string;
//     exFactory: string;
//     productCode: string; // The user enetered product code string while creatin the pack method
//     prodType: string; // the sub prod type. same value as in order if no sub product // this is null if is original true
//     extSysRefNo: string; // usually the main ref no with the external systems
//     isOriginal: boolean; // This will be true only if the 
//     combKey: string // orderNo + prodType + fg color
//     isRmSkuMapped: boolean;
//     isSizesMapped: boolean;
//     orderSubLines: RawOrderSubLineInfoModel[]; // size wise breakdown
//     rmInfo: RawOrderLineRmModel[];
//     operationInfo: RawOrderOpInfoModel[];
//     sizes: string[];
//     poSerial: number;
//     buyerPo: string;
//     productName: string;
//     plannedCutDate: string;
//     plannedProductionDate : string;
//     plannedDeliveryDate: string;
//     parentId: number;

//     constructor(
//         orderLineId: number,
//         orderLineNo: string,
//         fgColor: string,
//         quantity: number,
//         salOrdLineNo: string,
//         delDate: string,
//         dest: string,
//         exFactory: string,
//         productCode: string,
//         prodType: string,
//         extSysRefNo: string,
//         isOriginal: boolean,
//         combKey: string,
//         isRmSkuMapped: boolean,
//         isSizesMapped: boolean,
//         orderSubLines: RawOrderSubLineInfoModel[],
//         rmInfo: RawOrderLineRmModel[],
//         operationInfo: RawOrderOpInfoModel[],
//         sizes: string[],
//         poSerial: number,
//         buyerPo: string,
//         productName: string,
//         plannedCutDate: string,
//         plannedProductionDate : string,
//         plannedDeliveryDate: string,
//         parentId: number
//     ) {
//         this.orderLineId = orderLineId;
//         this.orderLineNo = orderLineNo;
//         this.fgColor = fgColor;
//         this.quantity = quantity;
//         this.salOrdLineNo = salOrdLineNo;
//         this.delDate = delDate;
//         this.dest = dest;
//         this.exFactory = exFactory;
//         this.productCode = productCode;
//         this.prodType = prodType;
//         this.extSysRefNo = extSysRefNo;
//         this.isOriginal = isOriginal;
//         this.combKey = combKey;
//         this.isRmSkuMapped = isRmSkuMapped;
//         this.isSizesMapped = isSizesMapped;
//         this.orderSubLines = orderSubLines;
//         this.rmInfo = rmInfo;
//         this.operationInfo = operationInfo;
//         this.sizes = sizes;
//         this.poSerial = poSerial;
//         this.buyerPo = buyerPo;
//         this.productName = productName;
//         this.plannedCutDate = plannedCutDate;
//         this.plannedProductionDate = plannedProductionDate;
//         this.plannedDeliveryDate = plannedDeliveryDate;
//         this.parentId = parentId;
//     }
// }


