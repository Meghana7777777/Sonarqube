import { CommonRequestAttrs } from "../../common";


export class MasterCreateRequest extends CommonRequestAttrs {

    masterCode: string;
    masterLabel: string;
    parentId?: number;
    masterName?: string

    constructor(
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
        masterCode: string,
        masterLabel: string,
        parentId?: number,
        masterName?: string
    ) {
        super(username, unitCode, companyCode, userId);
        this.masterName = masterName
        this.masterCode = masterCode
        this.masterLabel = masterLabel
        if (parentId !== undefined) {
            this.parentId = parentId;
        }
        this.masterName = masterName
    }
}

