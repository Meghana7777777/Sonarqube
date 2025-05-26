import { CommonRequestAttrs } from "../common";

export class UserDropdownReqDto extends CommonRequestAttrs {
    role: string;
    plantCode?: string;
    constructor(
        role: string,
        username?: string,
        unitCode?: string,
        userId?: number,
        companyCode?: string,
        plantCode?: string,

    ) {
        super(username,unitCode,companyCode,userId)
        this.role = role;
        this.plantCode = plantCode;
    }
}