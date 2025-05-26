import { UnitsModel } from "@xpparel/shared-models";
import { CommonRequestAttrs } from "../../common/common-request-attr.model";

export class UnitsCreateRequest extends CommonRequestAttrs {
    units: UnitsModel[];

    constructor(
        userName: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        units: UnitsModel[]
    ) {
        super(userName, unitCode, companyCode, userId);
        this.units = units;
    }
}