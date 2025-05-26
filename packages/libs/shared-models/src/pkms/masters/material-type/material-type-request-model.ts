import { CommonRequestAttrs } from "../../../common";

export class MaterialTypeRequestModel extends CommonRequestAttrs {
    id: number;
    materialTypeCode: string;
    materialTypeDesc: string;
     constructor(
        materialTypeCode: string,
        materialTypeDesc: string,
        username: string,
        unitCode: string,
        companyCode: string,
        userId: number,
         id?: number,
    ) {
        super(username, unitCode, companyCode, userId)
        this.id = id;
        this.materialTypeCode = materialTypeCode;
        this.materialTypeDesc = materialTypeDesc;
     }
}


 