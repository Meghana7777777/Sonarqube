import { CommonRequestAttrs } from "../../common";


export class MasterModelDto extends CommonRequestAttrs {
    id: number
    masterName: string;
    masterCode: string;
    masterLabel: string;
    parentId?: number;
    attributes?: number[];
    constructor(username: string, unitCode: string, companyCode: string, userId: number,
        id: number,
        masterName: string,
        masterCode: string,
        masterLabel: string,
        parentId?: number,
        attributes?: number[]

    ) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.masterName = masterName;
        this.masterCode = masterCode;
        this.masterLabel = masterLabel
        this.parentId = parentId;
        this.attributes = attributes


    }
}

