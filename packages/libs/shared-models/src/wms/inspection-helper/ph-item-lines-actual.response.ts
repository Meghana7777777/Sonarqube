import { InsUomEnum } from "@xpparel/shared-models";
import { GlobalResponseObject } from "../../common";

export class  PhItemLInesActualResponse extends GlobalResponseObject {
    data?: PhItemLinesActualModel[];
    constructor(status: boolean, errorCode: number, internalMessage: string, data: PhItemLinesActualModel[]) {
        super(status, errorCode, internalMessage);
        this.data = data;
    }

}

export class PhItemLinesActualModel {
   
    phItemsId: number;

    
    phItemLinesId: number;

    
    grnQuantity: number;

    
    noOfJoins: number;

    
    aWidth: number;

    
    fourPointsWidth: number;

    
    fourPointsWidthUom: InsUomEnum;

   
    fourPointsLength: number;

    
    fourPointsLengthUom: InsUomEnum;

    
    aLength: number;

   
    aShade?: string;

    
    aShadeGroup?: string;

    
    aGsm: number;

    
    toleranceFrom: number;

    
    toleranceTo: number;

    
    aWeight: number;

    
    
    remarks?: string;

    
    adjustmentValue: number;

    
    
    
    adjustment?: string;
}
