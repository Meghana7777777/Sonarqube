import { CommonRequestAttrs } from "@xpparel/shared-models";

export class InsPhIdRequest extends CommonRequestAttrs {
    phId: string[] = [];
    InspectionTypes?:string[]=[];
    insId?:number;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, phId: string[],InspectionTypes?:string[],insId?:number) {
        super(username, unitCode, companyCode, userId);
        this.phId = phId;
        this.InspectionTypes=InspectionTypes;
        this.insId=insId;

    }
}