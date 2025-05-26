import { CommonRequestAttrs } from "../../common";
import { SewGroupModel } from "../../sps/sew-version/sew-group.model";
import { OperationModel } from "../../ums/operation";

export class StyleProductTypeOpVersionCreation extends CommonRequestAttrs {
    style: string;
    productType: string;
    id: number; // PK. Not required during create operation
    version: string;
    description: string;
    operations: OperationModel[]; // No need to construct this in payload
    opGroups: SewGroupModel[];

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        style: string,
        productType: string,id: number,version: string,description: string,operations: OperationModel[],opGroups: SewGroupModel[]
    ) {
        super(username, unitCode, companyCode, userId);
        this.style = style;
        this.productType = productType;
        this.id = id;
        this.version = version; 
        this.description = description; 
        this.opGroups = opGroups;
        this.operations=operations;
    }
}