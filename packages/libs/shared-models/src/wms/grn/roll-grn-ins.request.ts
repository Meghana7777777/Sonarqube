import { CommonRequestAttrs } from "../../common";
import { GrnRollInfoModel } from "./grn-roll-info.model";


export class RollGrnAndInsRequest extends CommonRequestAttrs {
    id: number;
    barcode: string;
    rollNotFound: boolean;
    actualQuantity: number;
    pickForInspection: boolean;
    packingListId: number; // THIS IS THE PACKING LIST ID WHICH GRN IS CURRENTLY HAPPENING
    
    measuredWidth: number;
    measuredWeight: number;

    /**
     * 
     * @param username 
     * @param unitCode 
     * @param companyCode 
     * @param userId 
     * @param id 
     * @param barcode 
     * @param rollNotFound 
     * @param actualQuantity 
     * @param pickForInspection 
     * @param packingListId 
     * @param measuredWidth 
     * @param measuredWeight 
    */
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, barcode: string, rollNotFound: boolean, actualQuantity: number, pickForInspection: boolean, packingListId: number, measuredWidth: number, measuredWeight: number) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.barcode = barcode;
        this.rollNotFound = rollNotFound;
        this.actualQuantity = actualQuantity;
        this.pickForInspection = pickForInspection;
        this.packingListId = packingListId;
        this.measuredWidth = measuredWidth;
        this.measuredWeight = measuredWeight;
    }
}