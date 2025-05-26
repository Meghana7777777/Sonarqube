import { CommonRequestAttrs, DepartmentTypeEnumForMasters } from "@xpparel/shared-models";

export class DepartmentCreateModel extends CommonRequestAttrs {
    id?: number;
    unit: string;
    name: string;
    code: string;
    type: DepartmentTypeEnumForMasters;
    isActive:boolean;
    constructor(username: string, unitCode: string, companyCode: string, userId: number,id: number, name: string, code: string, type: DepartmentTypeEnumForMasters, isActive: boolean) {
        super(username, unitCode, companyCode, userId);
        this.id = id;
        this.unit = unitCode;
        this.name = name;
        this.code = code;
        this.type = type;
        this.isActive = isActive;
        
    }
  }