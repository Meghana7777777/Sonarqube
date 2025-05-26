import { CommonRequestAttrs } from "@xpparel/shared-models";

export class ComponentModel extends CommonRequestAttrs{
    id?: number;
    compName: string;
    compDesc: string;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, id: number, compName: string, compDesc: string) {

        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.compName=compName;
        this.compDesc=compDesc;
        
        

    }
}