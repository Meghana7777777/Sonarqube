import { PlLineInfo } from "./pl-line-info.model";


export class PLGenQtyInfoModel {
    poId: number;
    packSerial: number;
    poDate: string;
    qty: number;
    plLines: PlLineInfo[];

    constructor(
        poId: number,
        packSerial: number,
        poDate: string,
        qty: number,
        plLines: PlLineInfo[]
    ) {
        this.poId = poId;
        this.packSerial = packSerial;
        this.poDate = poDate;
        this.qty = qty;
        this.plLines = plLines;
    }
}