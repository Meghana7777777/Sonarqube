import { OpGroupModel } from "../../oes";
import { OperationModel } from "../../ums/operation";
import { SewGroupModel } from "./sew-group.model";

export class SewVersionModel {
    id: number; // PK. Not required during create operation
    version: string;
    description: string;
    operations: OperationModel[]; // can get from back end
    opGroups: OpGroupModel[];
    productName: string; // not required in the request
    poSerial: number; // not required in the request

    constructor(id: number,version: string,description: string,operations: OperationModel[],opGroups: OpGroupModel[], productName: string, poSerial: number) {
        this.id = id;
        this.version = version; 
        this.description = description; 
        this.operations = operations;
        this.opGroups = opGroups;
        this.productName = productName;
        this.poSerial = poSerial;
    }
}