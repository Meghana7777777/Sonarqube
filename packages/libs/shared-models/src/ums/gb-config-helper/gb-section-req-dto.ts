import { CommonRequestAttrs } from "../../common";
import { ProcessTypeEnum } from "../../oms";
import { DepartmentTypeEnumForMasters } from "../../sps";

export class GbSectionReqDto extends CommonRequestAttrs {
    departments?: number[];
    sections?: number[];
    departmentType?: DepartmentTypeEnumForMasters;
    processType?: ProcessTypeEnum;
    constructor(username: string, unitCode: string, companyCode: string, userId: number, departments?: number[], sections?: number[], departmentType?: DepartmentTypeEnumForMasters, processType?: ProcessTypeEnum) {
        super(username, unitCode, companyCode, userId);
        this.departments = departments;
        this.sections = sections;
        this.departmentType = departmentType;
        this.processType = processType;
    }
}