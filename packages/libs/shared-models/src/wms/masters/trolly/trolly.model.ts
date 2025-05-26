import { CommonRequestAttrs } from "../../../common";
import { BinModel } from "../../dashboard";
import { RollBasicInfoModel, RollInfoModel } from "../../packing-list";
export class TrollyModel {
    id: number;
    name: string;
    code: string;
    capacity: string;
    uom:string;
    binId:string;
    isActive: boolean;
    trayIds: string[]; // The PK of the trays
    binInfo: BinModel; // the bin info in which this trolley is currenlty places
    barcode: string;
    
    constructor(id: number, name: string,code: string,capacity: string,
        uom: string,binId:string, isActive: boolean, trayIds: string[], binInfo: BinModel, barcode: string){
        this.id = id;
        this.name=name;
        this.code=code;
        this.capacity=capacity;
        this.uom=uom;
        this.binId=binId;
        this.isActive = isActive;
        this.trayIds = trayIds;
        this.binInfo = binInfo;
        this.barcode = barcode;
    }
}
