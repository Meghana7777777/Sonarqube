import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../../oms";
import { DepartmentTypeEnumForMasters } from "../../sps";

export class GbDepartmentReqDto extends CommonRequestAttrs {
    departments: number[];
    departmentType: DepartmentTypeEnumForMasters;
    processType?: ProcessTypeEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, departments: number[], departmentType: DepartmentTypeEnumForMasters, processType?: ProcessTypeEnum) {
        super(username, unitCode, companyCode, userId);
        this.departments = departments;
        this.departmentType = departmentType;
        this.processType = processType;
    }
}