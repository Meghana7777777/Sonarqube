import { FgWhRequestStatusEnum } from "../../pkms/enum/fg-wh-reqstatus.enum";

export class FgWhLinesResDto {
    fgWhHeaderId: number;
    fgWhLineId: number;
    packListId: number;
    packListNo: string;
    packOrderId: number
    packOrderNo: string;
    floor: string;
    moNo: string;
    barcode:string;
    qty:number;
    status:FgWhRequestStatusEnum;
    constructor(
        fgWhHeaderId: number,
        fgWhLineId: number,
        packListId: number,
        packListNo: string,
        packOrderId: number,
        packOrderNo: string,
        floor: string,
        moNo: string,
        barcode:string,
        qty:number,
        status:FgWhRequestStatusEnum,
    ) {
        this.fgWhHeaderId = fgWhHeaderId;
        this.fgWhLineId = fgWhLineId;
        this.packListId = packListId;
        this.packListNo = packListNo;
        this.packOrderId = packOrderId;
        this.packOrderNo = packOrderNo;
        this.floor = floor;
        this.moNo = moNo;
        this.barcode=barcode;
        this.qty=qty;
        this.status=status;
        
    }
}