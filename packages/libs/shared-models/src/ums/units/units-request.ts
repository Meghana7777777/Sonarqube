import { CommonRequestAttrs } from "../../common";
import { UnitsModel } from "./units-model";

export class UnitsRequest extends CommonRequestAttrs{
    units: UnitsModel
  
    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        units: UnitsModel
    ) {
        super(userName, unitCode, companyCode, userId);
        this.units = units;
    }






}