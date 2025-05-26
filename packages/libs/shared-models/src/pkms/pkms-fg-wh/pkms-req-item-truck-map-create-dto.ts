import { CommonRequestAttrs, ShippingRequestItemLevelEnum } from "../../common";


export class PKMSReqItemTruckMapCreateDto extends CommonRequestAttrs{
    whHeaderId : number;
    refId: number;
    truckNo: string;
    id: any;
    barcode:string;
    constructor(
            username: string,
            unitCode: string,
            companyCode: string,
            userId: number,
            whHeaderId : number, 
            refId: number,
            truckNo: string,
            barcode:string,
        ) {
            super(username, unitCode, companyCode, userId);
            this.whHeaderId = whHeaderId;
            this.refId = refId;
            this.truckNo = truckNo;
            this.barcode =barcode;
            
        }
}